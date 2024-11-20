import ErrorHandler from "../../utils/errorHandler.js";
import sendToken from "../../utils/tokens/jwtToken.js";
import Tree from "../../models/cards/treeModel.js";
import Medical from "../../models/cards/medicalModel.js";
import Creator from "../../models/cards/creatorModel.js";
import Animal from "../../models/cards/animalModel.js";
import Personal from "../../models/cards/personalModel.js";
import { addEmailToQueue } from "../../utils/queue/emailQueue.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import User, { freeEnum, roleEnum } from "../../models/userModel.js";
import ApiFeatures from "../../utils/services/apiFeatures.js";

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
                    message: `${process.env.CLIENT_URL}/unblock?user=${user._id}`,
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

    try {
        await addEmailToQueue({
            email: user.email,
            subject: `Admin Login Email`,
            message: `Welcome ${user.name}`,
        });
    } catch (error) {
        console.log(error.message);
    }

    sendToken(user, 200, res);
});

export const freeAccess = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    if (user.freePlan.status) {
        return next(new ErrorHandler(`User with Id: ${req.params.id} already has free access`, 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
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

export const revokeFreeAccess = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    if (!user.freePlan.status) {
        return next(new ErrorHandler(`User with Id: ${req.params.id} does not have free access`, 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            freePlan: {
                status: false,
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

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 3;
    const count = await User.countDocuments();

    const apiFeatures = new ApiFeatures(User.find().sort({ $natural: -1 }), req.query).search().filter();

    // let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

    // if (category) {
    //     link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
    // }

    let filteredUsers = await apiFeatures.query;
    let filteredUsersCount = filteredUsers.length;

    apiFeatures.pagination(resultPerPage);
    filteredUsers = await apiFeatures.query.clone();

    return res.status(200).json({
        success: true,
        count,
        resultPerPage,
        users: filteredUsers,
        filteredUsersCount
    });
});

export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate("activePlan", "planId status currentEnd");
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

export const updateRole = catchAsyncErrors(async (req, res, next) => {

    if (req.user.id === req.params.id) {
        return next(new ErrorHandler(`You cannot update your own role`, 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    await User.findByIdAndUpdate(
        req.params.id, 
        { role: req.body.role }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: `User Role Updated`,
    });
});

export const updateCard = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    await User.findByIdAndUpdate(
        req.params.id, 
        { "cards.total": req.body.total }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: `User Cards Updated`,
    });
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {

    if (req.user.id === req.params.id) {
        return next(new ErrorHandler(`You cannot deactivate your account`, 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    if (user.isDeactivated) {
        return next(new ErrorHandler(`User with Id: ${req.params.id} is already deactivated`, 400));
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

export const blockUser = catchAsyncErrors(async (req, res, next) => {
    if (req.user.id === req.params.id) {
        return next(new ErrorHandler(`You cannot block your account`, 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    if (user.isBlocked) {
        return next(new ErrorHandler(`User with Id: ${req.params.id} is already blocked`, 400));
    }

    user.isBlocked = true;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User Blocked successfully`,
    });
});

export const unBlockUser = catchAsyncErrors(async (req, res, next) => {
    if (req.user.id === req.params.id) {
        return next(new ErrorHandler(`You cannot unblock your account`, 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    if (!user.isBlocked) {
        return next(new ErrorHandler(`User with Id: ${req.params.id} is already unblocked`, 400));
    }

    user.isBlocked = false;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User UnBlocked successfully`,
    });
});

export const reActivateUser = catchAsyncErrors(async (req, res, next) => {
    if (req.user.id === req.params.id) {
        return next(new ErrorHandler(`You cannot reactivate your account`, 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    if (!user.isDeactivated) {
        return next(new ErrorHandler(`User with Id: ${req.params.id} is already active`, 400));
    }

    user.isDeactivated = false;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User Reactivated successfully`,
    });
});