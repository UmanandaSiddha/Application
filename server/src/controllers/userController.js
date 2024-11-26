import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User, { accountEnum, roleEnum } from "../models/userModel.js";
import sendToken from "../utils/tokens/jwtToken.js";
import crypto from "crypto";
import { CLIENT_URL } from "../server.js";
import Tree from "../models/cards/treeModel.js";
import Personal from "../models/cards/personalModel.js";
import Medical from "../models/cards/medicalModel.js";
import Creator from "../models/cards/creatorModel.js";
import Animal from "../models/cards/animalModel.js";
// import { addEmailToQueue } from "../utils/queue/emailQueue.js";
import { getGravatarUrl } from "../common/gravtar.js";

// User Registration
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, street, city, state, postalCode, country, website, phone } = req.body;
    if (!name || !email || !password) {
        return next(new ErrorHandler("Please enter Name, Email and Password", 400));
    }
    if (req.query.type === roleEnum.ORG && (!street || !city || !state || !postalCode || !country || !website || !phone)) {
        return next(new ErrorHandler("All organization fields are required", 400));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorHandler("Email already exists", 409));
    }

    const size = 200;
    const gravatarUrl = getGravatarUrl(email, size);

    const userPayload = {
        name,
        email,
        image: gravatarUrl,
        password,
        role: email === process.env.ADMIN_EMAIL ? roleEnum.ADMIN : roleEnum.USER,
        accountType: accountEnum.EMAIL,
    };

    if (req.query.type === roleEnum.ORG) {
        userPayload.role = roleEnum.ORG;
        userPayload.phone = phone;
        const address = { street, city, state, postalCode, country };
        userPayload.billingAddress = address;
        userPayload.orgDetails = {
            address,
            website,
            phone,
        };
    }

    const user = await User.create(userPayload);
    if (!user) {
        return next(new ErrorHandler("Error Registering User, Try Again Later", 500));
    }

    const otp = user.getOneTimePassword();
    await user.save({ validateBeforeSave: false });

    const message = `Email verification OTP (valid for 15 minutes):\n\n${otp}\n\nPlease ignore if you didn't request this email.`;

    try {
        await addEmailToQueue({
            email: user.email,
            subject: `Email Verification`,
            message,
        });
    } catch (error) {
        user.oneTimePassword = undefined;
        user.oneTimeExpire = undefined;
        await user.save({ validateBeforeSave: false });
    }

    sendToken(user, 201, res);
});

// Request Verification
export const requestVerification = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    const otp = user.getOneTimePassword();

    await user.save({ validateBeforeSave: false });

    const message = `Email verification OTP ( valid for 15 minutes ) :- \n\n ${otp} \n\n Please ignore if you didn't requested this email.`;

    try {
        await addEmailToQueue({
            email: user.email,
            subject: `Email Veification`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.oneTimePassword = undefined;
        user.oneTimeExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

// Verify User
export const verifyUser = catchAsyncErrors(async (req, res, next) => {
    const { otp } = req.body;
    if (!otp) {
        return next(new ErrorHandler("Please enter OTP", 400));
    }

    const oneTimePassword = crypto
        .createHash("sha256")
        .update(otp.toString())
        .digest("hex");

    const user = await User.findOne({
        _id: req.user.id,
        oneTimePassword,
        oneTimeExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new ErrorHandler("Email Veification OTP has Expired", 400));
    }

    user.isVerified = true;
    user.oneTimePassword = undefined;
    user.oneTimeExpire = undefined;

    const savedUser = await user.save();

    const message = savedUser
        ? "Account Verified Successfully!!"
        : "Account Verification Failed, Please try again later.";

    try {
        await addEmailToQueue({
            email: user.email,
            subject: `Account Verification Update`,
            message,
        });
    } catch (error) {
        console.log(error.message);
    }

    sendToken(user, 200, res);
});

// User Login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email and Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Credentials", 401));
    }
    if (user.isDeactivated) {
        return next(new ErrorHandler("Your account is deactivated, contact support to reactivate", 401));
    }
    if (user.isBlocked || (user.loginAttempt?.count >= 5)) {
        user.loginAttempt.count = (user.loginAttempt?.count || 0) + 1;
        user.loginAttempt.time = Date.now();
        if (!user.isBlocked) {
            user.isBlocked = true;
            try {
                await addEmailToQueue({
                    email: user.email,
                    subject: "Suspicious Activity",
                    message: "Your account has been blocked due to suspicious activity. Please click the link below to unblock your account.",
                });
            } catch (error) {
                console.log(`Error sending email: ${error.message}`);
            }
        }
        await user.save();
        return next(new ErrorHandler("Access Denied. Your account is blocked.", 403));
    }

    if (user.loginAttempt?.count > 0 && (user.loginAttempt.time + 60 * 1000) <= Date.now()) {
        user.loginAttempt.count = 0;
        user.loginAttempt.time = undefined;
        await user.save();
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        user.loginAttempt.count = (user.loginAttempt?.count || 0) + 1;
        user.loginAttempt.time = Date.now();
        await user.save();
        return next(new ErrorHandler("Invalid Credentials", 401));
    }

    user.loginAttempt.count = 0;
    user.loginAttempt.time = undefined;
    await user.save();

    sendToken(user, 200, res);
});

// Get Block User
export const fetchBlocked = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user.isBlocked) {
        return next(new ErrorHandler("User is not Blocked", 401));
    }

    res.status(200).json({
        success: true,
        data: user.loginAttempt,
    });
});

//Unblock User
export const unblockUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not Found", 404));
    }
    if (req.body.isMe) {
        user.isBlocked = false;
        user.loginAttempt.count = 0;
        user.loginAttempt.time = undefined;
        await user.save();
    }

    sendToken(user, 200, res);
});

// User Logout
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("user_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

// Forgot Password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not Found", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${CLIENT_URL}/reset?token=${resetToken}&user=${user._id}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n Please ignore if you didn't requested this email.`;

    try {
        await addEmailToQueue({
            email: user.email,
            subject: `Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.params;
    if (!token) {
        return next(new ErrorHandler("Broken Link", 500));
    }

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        _id: req.body.user,
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is Invalid or has Expired", 400));
    }

    const { newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword) {
        return next(new ErrorHandler("All fields are required", 404));
    }
    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

export const setPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    if (user.accountType !== accountEnum.HYBRID) {
        return next(new ErrorHandler("Account is aready hybrid", 400));
    }
    if (user.accountType !== accountEnum.GOOGLE) {
        return next(new ErrorHandler("Password Already Saved", 400));
    }

    const { newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword) {
        return next(new ErrorHandler("All fields are required", 404));
    }
    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = newPassword;
    user.accountType = accountEnum.HYBRID;

    await user.save();

    sendToken(user, 200, res);
});

// Get User Details
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate("activePlan", "planId status currentEnd");

    res.status(200).json({
        success: true,
        user,
    });
});

export const updateBillingInfo = catchAsyncErrors(async (req, res, next) => {
    const { phone, street, state, city, postalCode, country } = req.body;

    const user = await User.findById(req.user.id);

    const updateBillingAddress = { ...user.billingAddress };
    if (street) updateBillingAddress.street = street;
    if (state) updateBillingAddress.state = state;
    if (city) updateBillingAddress.city = city;
    if (postalCode) updateBillingAddress.postalCode = postalCode;
    if (country) updateBillingAddress.country = country;

    const newUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            phone: phone ? phone : user.phone,
            billingAddress: updateBillingAddress
        },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        user: newUser,
    });
});

// Update User Password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
        return next(new ErrorHandler("All fields are required", 404));
    }
    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }
    const isPasswordMatched = await user.comparePassword(oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Password is incorrect", 400));
    }

    user.password = newPassword;

    await user.save();

    sendToken(user, 200, res);
});

// Update User Profile
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const userExists = await User.findById(req.user.id);

    const { name, phone } = req.body;

    const updateUser = {};
    name ? updateUser.name = name : userExists.name;
    phone ? updateUser.phone = phone : userExists.phone;

    const user = await User.findByIdAndUpdate(
        req.user.id,
        updateUser,
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        user,
    });
});

// Update Organization Details
export const updateOrganisationDetails = catchAsyncErrors(async (req, res, next) => {
    const { phone, website, address } = req.body;

    const user = await User.findById(req.user.id);

    const updateOrganisation = { ...user.orgDetails };
    if (phone) updateOrganisation.phone = phone;
    if (website) updateOrganisation.website = website;
    if (address.street) updateOrganisation.address.street = address.street;
    if (address.state) updateOrganisation.address.state = address.state;
    if (address.city) updateOrganisation.address.city = address.city;
    if (address.postalCode) updateOrganisation.address.postalCode = address.postalCode;
    if (address.country) updateOrganisation.address.country = address.country;

    const newUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            orgDetails: updateOrganisation
        },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        user: newUser,
    });
});

// Delete Account
export const deleteAccount = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);
    if (user.isDeactivated) {
        return next(new ErrorHandler(`You are already deactivated`, 400));
    }

    await Tree.deleteMany({ user: req.user.id });
    await Personal.deleteMany({ user: req.user.id });
    await Medical.deleteMany({ user: req.user.id });
    await Creator.deleteMany({ user: req.user.id });
    await Animal.deleteMany({ user: req.user.id });

    user.isDeactivated = true;
    await user.save();

    res.cookie("user_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Account Deleted",
    });
});
