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
import fs from "fs";
import sharp from "sharp";
import { SERVER_URL } from "../server.js";
import Animal from "../models/cards/animalModel.js";
import { addEmailToQueue } from "../utils/queue/emailQueue.js";
import logger from "../config/logger.js";

// User Registration
export const registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please enter Name, Email and Password", 400));
    }

    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        image: "",
        password: req.body.password,
        accountType: accountEnum.EMAIL,
    });

    if (!user) {
        return next(new ErrorHandler("Error Registering User, Try Again Later", 500));
    }

    if (req.query.type === roleEnum.ORG) {
        user.role = roleEnum.ORG;
        const { street, city, state, postalCode, country, website, phone } = req.body;

        if (!street || !city || !state || !postalCode || !country || !website || !phone) {
            return next(new ErrorHandler("All fields are required", 400));
        }

        user.orgDetails = {
            address: {
                street,
                city,
                state,
                postalCode,
                country,
            },
            website,
            phone,
        }
        await user.save();
    }

    if (req.body.image) {
        const img = req.body.image;
        const data = img.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(data, 'base64');

        try {
            const resizedImageBuffer = await sharp(buffer)
                .resize({ width: 300 })
                .jpeg({ quality: 50 })
                .toBuffer();

            await fs.promises.writeFile(`./public/avatars/${user._id}.jpg`, resizedImageBuffer);
            console.log('Data has been written to the file');

            user.image = `${SERVER_URL}/avatars/${user._id}.jpg`;
            await user.save();
        } catch (err) {
            console.error('Error processing or writing the image:', err.message);
            logger.error('Error processing or writing the image:', err.message);
        }
    }

    const otp = user.getOneTimePassword();
    console.log("Verification OTP:", otp)

    await user.save({ validateBeforeSave: false });

    const message = `Email verification OTP ( valid for 15 minutes ) :- \n\n ${otp} \n\n Please ignore if you didn't requested this email.`;

    try {
        await addEmailToQueue({
            email: user.email,
            subject: `Email Veification`,
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
    console.log("Verification OTP:", otp)

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

    const uss = await user.save();

    let message;
    if (uss) {
        message = "Account Verified Successfully!!"
    } else {
        message = "Account Verification Failed, Please try again later."
    }

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
        return next(new ErrorHandler(`Your account is deactivated, contact the site to reactivate`, 401));
    }

    if (user.isBlocked || (user.loginAttempt?.count >= 5)) {
        if (!user.isBlocked) {
            user.isBlocked = true;
            try {
                await addEmailToQueue({
                    email: user.email,
                    subject: `Suspious Activity`,
                    message: `This email will contain link by which they can unblock themselves`,
                });
            } catch (error) {
                console.log(error.message);
            }
        }
        user.loginAttempt.count++;
        user.loginAttempt.time = Date.now();
        await user.save();
        return next(new ErrorHandler("Access Denied", 500));
    }

    if (user.loginAttempt?.count < 5 && user.loginAttempt?.count !== 0 && (user.loginAttempt?.time + 60 * 1000) > Date.now()) {
        user.loginAttempt.count = 0;
        user.loginAttempt.time = undefined;
        await user.save();
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        await User.findOneAndUpdate(
            { email },
            {
                loginAttempt: {
                    count: user.loginAttempt.count + 1,
                    time: Date.now(),
                },
            },
            { new: true, runValidators: true, useFindAndModify: false }
        );
        return next(new ErrorHandler("Invalid Credentials", 401));
    }

    sendToken(user, 200, res);
});

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
    res.cookie("token", null, {
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
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        _id: req.body.user,
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is Invalid or has Expired", 400));
    }

    console.log(req.body)

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

export const setPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    if (user.accountType !== accountEnum.GOOGLE) {
        return next(new ErrorHandler("Password Already Saved", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password Does Not Match", 400));
    }

    user.password = req.body.newPassword;
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

// Update User Password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});

// Update User Profile
export const updateProfile = catchAsyncErrors(async (req, res, next) => {

    const userx = await User.findById(req.user.id);

    if (req.body.image) {
        if ((userx.image.length > 0) && (fs.existsSync(`./public/avatars/${userx._id}.jpg`))) {
            fs.unlinkSync(`./public/avatars/${userx._id}.jpg`);
        }
        const img = req.body.image;
        const data = img.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(data, 'base64');

        try {
            const resizedImageBuffer = await sharp(buffer)
                .resize({ width: 300 })
                .jpeg({ quality: 50 })
                .toBuffer();

            await fs.promises.writeFile(`./public/avatars/${userx._id}.jpg`, resizedImageBuffer);
            console.log('Data has been written to the file');

            userx.image = `${SERVER_URL}/avatars/${userx._id}.jpg`;
            await userx.save();
        } catch (err) {
            console.error('Error processing or writing the image:', err.message);
            logger.error('Error processing or writing the image:', err.message);
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, { name: req.body.name }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});

// Delete Account
export const deleteAccount = catchAsyncErrors(async (req, res, next) => {

    await Tree.deleteMany({ user: req.user.id });
    await Personal.deleteMany({ user: req.user.id });
    await Medical.deleteMany({ user: req.user.id });
    await Creator.deleteMany({ user: req.user.id });
    await Animal.deleteMany({ user: req.user.id });

    const user = await User.findById(req.user.id);

    user.isDeactivated = true;
    await user.save();

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Account Deleted",
    });
});
