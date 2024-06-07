import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/tokens/jwtToken.js";
import Tree from "../models/cards/treeModel.js";
import Medical from "../models/cards/medicalModel.js";
import Creator from "../models/cards/creatorModel.js";
import Animal from "../models/cards/animalModel.js";
import Personal from "../models/cards/personalModel.js";
import { addEmailToQueue } from "../utils/queue/emailQueue.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User, { accountEnum, freeEnum, roleEnum } from "../models/userModel.js";

export const adminLogin = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email and Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Credentials", 401));
    }

    if (user.role !== roleEnum.ADMIN) {
        return next(new ErrorHandler("Only Admins are allowed", 401));
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

    if (user.loginAttempt?.count < 5 && user.loginAttempt?.count !== 0 && (user.loginAttempt?.time + 60*1000) > Date.now()) {
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

    try {
        await addEmailToQueue({
            email: user.email,
            subject:  `Admin Login Email`,
            message: `Welcome ${user.name}`,
        });
    } catch (error) {
        console.log(error.message);
    }

    sendToken(user, 200, res);
});

// Get user account types
export const getUserAccount = catchAsyncErrors(async (req, res, next) => {

    const emailCount = await User.countDocuments({ accountType: accountEnum.EMAIL });
    const googlecount = await User.countDocuments({ accountType: accountEnum.GOOGLE });
    const hybridCount = await User.countDocuments({ accountType: accountEnum.HYBRID });

    res.status(200).json({
        success: true,
        count: {
            emailCount,
            googlecount,
            hybridCount
        },
    });
});

// Give Free Access
export const freeAccess = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    const updatedUser  = await User.findByIdAndUpdate(
        req.params.id, 
        { 
            freePlan: {
                status: true,
                type: freeEnum.CUSTOM
            }
        }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    if (!updatedUser) {
        return next(new ErrorHandler(`Failed to update user with Id: ${req.params.id}`, 500));
    }

    res.status(200).json({
        success: true,
        user: updatedUser,
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
    const user = await User.findById(req.params.id).populate("activePlan", "status currentEnd");

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
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
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
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
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    await User.findByIdAndUpdate(req.params.id, { "cards.total": req.body.total }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: `User Cards Updated`,
    });
});

export const getTreeCards = catchAsyncErrors(async (req, res, next) => {
    const trees = await Tree.find().populate("user", "email");
    const count = await Tree.countDocuments();
    // if (!trees) {
    //     return next(new ErrorHandler("Cards Not Found", 404));
    // }

    res.status(200).json({
        success: true,
        count,
        trees
    });
});

export const getSingleTreeCard = catchAsyncErrors(async (req, res, next) => {
    const tree = await Tree.findById(req.params.id)
    if (!tree) {
        return next(new ErrorHandler("Card Not Found", 404));
    }

    res.status(200).json({
        success: true,
        tree
    });
});

// Delete User -- Admin
export const deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    await Tree.deleteMany({ user: req.params.id });
    await Personal.deleteMany({ user: req.params.id });
    await Medical.deleteMany({ user: req.params.id });
    await Creator.deleteMany({ user: req.params.id });
    await Animal.deleteMany({ user: req.params.id });

    user.isDeactivated = true;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User deleted`,
    });
});