import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User, { accountEnum, roleEnum } from "../models/userModel.js";
import sendToken from "../utils/jwtToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { CLIENT_URL } from "../server.js";
import Tree from "../models/treeModel.js";
import Personal from "../models/personalModel.js";
import Medical from "../models/medicalModel.js";
import Creator from "../models/creatorModel.js";
import fs from "fs";
import sharp from "sharp";
import { SERVER_URL } from "../server.js";

// User Registration
export const registerUser = catchAsyncErrors(async (req, res, next) => {

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
        user.orgDetails = {
            address: req.body.address,
            website: req.body.website,
            phone: req.body.phone
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
        }
    }

    const otp = user.getOneTimePassword();

    await user.save({ validateBeforeSave: false });

    const message = `Email verification OTP ( valid for 15 minutes ) :- \n\n ${otp} \n\n Please ignore if you didn't requested this email.`;

    try {
        await sendEmail({
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

    await user.save({ validateBeforeSave: false });

    const message = `Email verification OTP ( valid for 15 minutes ) :- \n\n ${otp} \n\n Please ignore if you didn't requested this email.`;

    try {
        await sendEmail({
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
    const {otp} = req.body;

    const oneTimePassword = crypto
        .createHash("sha256")
        .update(otp.toString())
        .digest("hex");

    const user = await User.findOne({
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

    await sendEmail({
        email: user.email,
        subject: `Account Verification Update`,
        message,
    });

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

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Credentials", 401));
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
    })
});

// Forgot Password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not Found", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${CLIENT_URL}/reset?token=${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n Please ignore if you didn't requested this email.`;

    try {
        await sendEmail({
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
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is Invalid or has Expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.password;
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

    const user = await User.findById(req.user.id);

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
        
            await fs.promises.writeFile(`./public/avatars/${user._id}.jpg`, resizedImageBuffer);
            console.log('Data has been written to the file');
        
            user.image = `${SERVER_URL}/avatars/${user._id}.jpg`;
            await user.save();
        } catch (err) {
            console.error('Error processing or writing the image:', err.message);
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

// Get all Users - Only Admin
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    const userCount = await User.countDocuments();

    res.status(200).json({
        success: true,
        count: userCount,
        users,
    });
});

// Get User Details - Only Admin
export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`), 404);
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// Update User Role -- Admin
export const updateRole = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`), 404);
    }

    await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: `User Role Updated`,
    })
});

// Update User Cards -- Admin
export const updateCard = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`), 404);
    }

    await User.findByIdAndUpdate(req.params.id, { "cards.total": req.body.total }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: `User Cards Updated`,
    })
});

// Delete Account
export const deleteAccount = catchAsyncErrors(async (req, res, next) => {

    const tree = await Tree.find({ user: req.user.id });
    if (tree) {
        for (let i = 0; i < tree.length; i++) {
            await Tree.findOneAndDelete({ user: req.user.id });
        }
    }

    const personal = await Personal.findOne({ user: req.user.id });
    if (personal) {
        await Personal.findOneAndDelete({ user: req.user.id });
    }

    const medical = await Medical.findOne({ user: req.user.id });
    if (medical) {
        await Medical.findOneAndDelete({ user: req.user.id });
    }

    const creator = await Creator.findOne({ user: req.user.id });
    if (creator) {
        await Creator.findOneAndDelete({ user: req.user.id });
    }

    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
        success: true,
        message: `Account deleted`,
    });
});

// Delete User -- Admin
export const deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`), 404);
    }

    const tree = await Tree.find({ user: req.params.id });
    if (tree) {
        for (let i = 0; i < tree.length; i++) {
            await Tree.findOneAndDelete({ user: req.params.id });
        }
    }

    const personal = await Personal.findOne({ user: req.params.id });
    if (personal) {
        await Personal.findOneAndDelete({ user: req.params.id });
    }

    const medical = await Medical.findOne({ user: req.params.id });
    if (medical) {
        await Medical.findOneAndDelete({ user: req.params.id });
    }

    const creator = await Creator.findOne({ user: req.params.id });
    if (creator) {
        await Creator.findOneAndDelete({ user: req.params.id });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: `User deleted`,
    });
});
