import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import sendToken from "../utils/tokens/user.token.js";
import crypto from "crypto";
import { EMAIL_ACCOUNT_BLOCKED, EMAIL_ACCOUNT_CREATED, EMAIL_ACCOUNT_DEACTIVATED, EMAIL_OTP_VERIFICATION, EMAIL_RESET_PASSWORD } from "../constants/template.js";
import sendMail from "../utils/services/send.mail.js";
import mongoose from "mongoose";
import User, { UserAccountEnum, UserRoleEnum } from "../models/accounts/user.model.js";
import { NextFunction, Request, Response } from "express";
import { getGravatarUrl } from "../utils/gravtar.js";
import { UserRequest } from "../middleware/auth.middleware.js";
import { CLIENT_URL } from "../index.js";
import Card from "../models/card/card.model.js";

// User Registration
export const registerUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { firstName, lastName, email, password, street, city, state, postalCode, country, website, phone } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return next(new ErrorHandler("Please enter Name, Email and Password", 400));
    }
    if (req.query.type === UserRoleEnum.ORGANIZATION && (!street || !city || !state || !postalCode || !country || !website || !phone)) {
        return next(new ErrorHandler("All organization fields are required", 400));
    }

    const userExists = await User.findOne({ "profile.email": email });
    if (userExists) {
        return next(new ErrorHandler("Email already exists", 409));
    }

    const size = 200;
    const gravatarUrl = getGravatarUrl(email, size);

    const userPayload: any = {
        profile: {
            firstName,
            lastName,
            email,
            profilePicture: gravatarUrl,
            password,
            role: email === process.env.ADMIN_EMAIL ? UserRoleEnum.ADMIN : UserRoleEnum.USER,
        },
        account: {
            accountType: [UserAccountEnum.EMAIL],
        }
    };

    const address = {street, city, state, postalCode, country };

    if (req.query.type === UserRoleEnum.ORGANIZATION) {
        userPayload.profile.role = UserRoleEnum.ORGANIZATION;
        userPayload.access.billingInfo = {
            address,
            phoneNumber: phone,
        }
        userPayload.organization = {
            website,
            organizationBilling: {
                address,
                phoneNumber: phone,
            }
        };
    }

    const user = await User.create(userPayload);
    if (!user) {
        return next(new ErrorHandler("Error Registering User, Try Again Later", 500));
    }

    const otp = user.getOneTimePassword();
    await user.save({ validateBeforeSave: false });

    try {
        const options= {
            templateId: EMAIL_OTP_VERIFICATION,
            recieverEmail: user.profile.email,
            dynamicData: {
                otp: otp,
            }
        }
        await sendMail(options);
    } catch (error) {
        user.oneTimePassword = undefined;
        user.oneTimeExpire = undefined;
        await user.save({ validateBeforeSave: false });
    }

    sendToken(user, 201, res);
});

// Request Verification
export const requestVerification = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req;
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    // const user = await User.findById(req.user?._id);
    // if (!user) {
    //     return next(new ErrorHandler("User not found", 404));
    // }
    if (user.account.isVerified) {
        return next(new ErrorHandler("User is already verified", 400));
    }

    const otp = user.getOneTimePassword();
    await user.save({ validateBeforeSave: false });

    try {
        const options= {
            templateId: EMAIL_OTP_VERIFICATION,
            recieverEmail: user.profile.email,
            dynamicData: {
                otp: otp,
            }
        }
        await sendMail(options);

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.profile.email} successfully`,
        });
    } catch (error: any) {
        user.oneTimePassword = undefined;
        user.oneTimeExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

// Verify User
export const verifyUser = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { otp } = req.body;
    if (!otp) {
        return next(new ErrorHandler("Please enter OTP", 400));
    }
    const { user } = req;
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const oneTimePassword = crypto
        .createHash("sha256")
        .update(otp.toString())
        .digest("hex");

    const otpUser = await User.findOne({
        _id: user._id,
        oneTimePassword,
        oneTimeExpire: { $gt: Date.now() },
    });
    if (!otpUser) {
        return next(new ErrorHandler("Email Veification OTP has Expired", 400));
    }

    otpUser.account.isVerified = true;
    otpUser.oneTimePassword = undefined;
    otpUser.oneTimeExpire = undefined;
    await otpUser.save();
    
    try {
        const options= {
            templateId: EMAIL_ACCOUNT_CREATED,
            recieverEmail: otpUser.profile.email,
            dynamicData: {
                name: `${otpUser.profile.firstName} ${otpUser.profile.lastName}`,
            }
        }
        await sendMail(options);
    } catch (error: any) {
        console.log(error.message);
    }

    sendToken(otpUser, 200, res);
});

// User Login
export const loginUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email and Password", 400));
    }

    const user = await User.findOne({ "profile.email": email }).select("+profile.password");
    if (!user) {
        return next(new ErrorHandler("Invalid Credentials", 401));
    }
    if (user.account.isDeactivated) {
        return next(new ErrorHandler("Your account is deactivated, contact support to reactivate", 401));
    }

    const loginAttempt = user.account.loginAttempt || { count: 0, lastLogin: undefined };

    if (user.account.isBlocked || loginAttempt.count >= 5) {
        loginAttempt.count += 1;
        loginAttempt.lastLogin = new Date();

        if (!user.account.isBlocked) {
            user.account.isBlocked = true;
            try {
                const options = {
                    templateId: EMAIL_ACCOUNT_BLOCKED,
                    recieverEmail: user.profile.email,
                    dynamicData: {
                        lastLogin: loginAttempt.lastLogin.toLocaleDateString(),
                        count: loginAttempt.count,
                        link: `${CLIENT_URL}/unblock/${user.id}`
                    }
                };
                await sendMail(options);
            } catch (error: unknown) {
                console.error(`Error sending email: ${(error as Error).message}`);
            }
        }

        await user.save();
        return next(new ErrorHandler("Access Denied. Your account is blocked.", 403));
    }

    const lastLoginTime = loginAttempt.lastLogin?.getTime() ?? 0;
    if (loginAttempt.count > 0 && lastLoginTime + 60 * 1000 <= Date.now()) {
        loginAttempt.count = 0;
        loginAttempt.lastLogin = undefined;
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        loginAttempt.count += 1;
        loginAttempt.lastLogin = new Date();
        await user.save();
        return next(new ErrorHandler("Invalid Credentials", 401));
    }

    loginAttempt.count = 0;
    loginAttempt.lastLogin = undefined;
    await user.save();

    sendToken(user, 200, res);
});

// Get Block User
export const fetchBlocked = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }

    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("User not Found", 404));
    }
    if (!user.account.isBlocked) {
        return next(new ErrorHandler("User is not Blocked", 401));
    }

    res.status(200).json({
        success: true,
        data: user.account.loginAttempt,
    });
});

//Unblock User
export const unblockUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("User not Found", 404));
    }
    user.account.isBlocked = false;
    const loginAttempt = user.account.loginAttempt || { count: 0, lastLogin: undefined };
    loginAttempt.count = 0;
    loginAttempt.lastLogin = undefined;
    await user.save();
    
    sendToken(user, 200, res);
});

// User Logout
export const logoutUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.cookie("user_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully",
    });
});

// Forgot Password
export const forgotPassword = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findOne({ profile: { email: req.body.email } });
    if (!user) {
        return next(new ErrorHandler("User not Found", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    try {
        const options= {
            templateId: EMAIL_RESET_PASSWORD,
            recieverEmail: user.profile.email,
            dynamicData: {
                link: `${CLIENT_URL}/reset/${resetToken}/${user._id}`
            }
        }
        await sendMail(options);

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.profile.email} successfully`,
        });
    } catch (error: any) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password
export const resetPassword = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    user.profile.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
});

export const setPassword = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findById(req.user?._id).select("+password");
    if (!user) {
        return next(new ErrorHandler("User not Found", 404));
    }
    if (!user.account.accountType.includes(UserAccountEnum.GOOGLE)) {
        return next(new ErrorHandler("Password Already Saved", 400));
    }

    const { newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword) {
        return next(new ErrorHandler("All fields are required", 404));
    }
    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.profile.password = newPassword;
    user.account.accountType = [...user.account.accountType, UserAccountEnum.EMAIL];

    await user.save();

    sendToken(user, 200, res);
});

// Get User Details
export const getUserDetails = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findById(req.user?._id)
        .populate("access.latestSubscription", "planId status currentEnd")
        .lean();

    res.status(200).json({
        success: true,
        user,
    });
});

export const updateBillingInfo = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { phone, street, state, city, postalCode, country } = req.body;

    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const updateBillingAddress = { ...user.access.billingInfo };
    if (phone) updateBillingAddress.phoneNumber = phone;
    if (street && updateBillingAddress.address) updateBillingAddress.address.street = street;
    if (state && updateBillingAddress.address) updateBillingAddress.address.state = state;
    if (city && updateBillingAddress.address) updateBillingAddress.address.city = city;
    if (postalCode && updateBillingAddress.address) updateBillingAddress.address.postalCode = postalCode;
    if (country && updateBillingAddress.address) updateBillingAddress.address.country = country;

    const newUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            access: {
                billingInfo: updateBillingAddress,
            }
        },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        user: newUser,
    });
});

// Update User Password
export const updatePassword = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findById(req.user?._id).select("+password");
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

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

    user.profile.password = newPassword;
    await user.save();

    sendToken(user, 200, res);
});

// Update User Profile
export const updateProfile = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const userExists = await User.findById(req.user?._id);
    if (!userExists) {
        return next(new ErrorHandler("User not found", 404));
    }

    const { firstName, lastName, phone } = req.body;
    const updateUser: any = {};
    firstName ? updateUser.profile.firstName = firstName : userExists.profile.firstName;
    lastName ? updateUser.profile.lastName = lastName : userExists.profile.lastName;
    phone ? updateUser.access.billingInfo.phoneNumber = phone : userExists.access.billingInfo?.phoneNumber;

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        updateUser,
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        user,
    });
});

// Update Organization Details
export const updateOrganisationDetails = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { phone, website, address } = req.body;

    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const updateOrganisation = { ...user.organization };
    if (phone && updateOrganisation.organizationBilling) updateOrganisation.organizationBilling.phoneNumber = phone;
    if (website && updateOrganisation.organizationBilling) updateOrganisation.website = website;
    if (address.street && updateOrganisation.organizationBilling) updateOrganisation.organizationBilling.address.street = address.street;
    if (address.state && updateOrganisation.organizationBilling) updateOrganisation.organizationBilling.address.state = address.state;
    if (address.city && updateOrganisation.organizationBilling) updateOrganisation.organizationBilling.address.city = address.city;
    if (address.postalCode && updateOrganisation.organizationBilling) updateOrganisation.organizationBilling.address.postalCode = address.postalCode;
    if (address.country && updateOrganisation.organizationBilling) updateOrganisation.organizationBilling.address.country = address.country;

    const newUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            organization: updateOrganisation
        },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        user: newUser,
    });
});

// Delete Account
export const deleteAccount = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    if (user.account.isDeactivated) {
        return next(new ErrorHandler(`You are already deactivated`, 400));
    }

    await Card.deleteMany({ userId: user._id });
    user.account.isDeactivated = true;
    await user.save();

    try {
        const options= {
            templateId: EMAIL_ACCOUNT_DEACTIVATED,
            recieverEmail: user.profile.email,
            dynamicData: {
                name: `${user.profile.firstName} ${user.profile.lastName}`,
            }
        }
        await sendMail(options);
    } catch (error) {
        console.log(error);
    }

    res.cookie("user_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Account Deleted",
    });
});
