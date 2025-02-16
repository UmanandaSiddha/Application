import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import { NextFunction, Request, Response } from "express";
import User, { UserRoleEnum } from "../../models/accounts/user.model.js";
import { EMAIL_ACCOUNT_BLOCKED } from "../../constants/template.js";
import { CLIENT_URL } from "../../index.js";
import sendMail from "../../utils/services/send.mail.js";
import sendToken from "../../utils/tokens/user.token.js";
import mongoose from "mongoose";
import ApiFeatures from "../../utils/services/api.features.js";
import { UserRequest } from "../../middleware/auth.middleware.js";
import Card from "../../models/card/card.model.js";

export const adminLogin = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email and Password", 400));
    }

    const user = await User.findOne({ profile: { email } }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Credentials", 401));
    }
    if (user.profile.role !== UserRoleEnum.ADMIN) {
        return next(new ErrorHandler("Only Admins are allowed", 401));
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

export const freeAccess = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${id}`, 404));
    }
    if (user.access.freeAccess) {
        return next(new ErrorHandler(`User with Id: ${req.params.id} already has free access`, 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { "access.freeAccess": true },
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

export const revokeFreeAccess = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${id}`, 404));
    }

    if (!user.access.freeAccess) {
        return next(new ErrorHandler(`User with Id: ${id} does not have free access`, 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            access: { freeAccess: false }
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

export const getAllUsers = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const resultPerPage = 20;
    const count = await User.countDocuments();

    const apiFeatures = new ApiFeatures(User.find().select("name email image role accountType").sort({ $natural: -1 }), req.query).search().filter();

    let filteredUsers = await apiFeatures.getQuery();
    let filteredUsersCount = filteredUsers.length;

    apiFeatures.pagination(resultPerPage);
    filteredUsers = await apiFeatures.getQuery().clone();

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        users: filteredUsers,
        filteredUsersCount
    });
});

export const getSingleUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const user = await User.findById(id).populate("access.latestSubscription", "planId status currentEnd");
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

export const updateRole = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const adminId = req.user?._id;
    if (!adminId) {
        return next(new ErrorHandler(`Admin Id not found`, 404));
    }
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    if (adminId.toString() === id) {
        return next(new ErrorHandler(`You cannot update your own role`, 400));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${id}`, 404));
    }

    await User.findByIdAndUpdate(
        id,
        { "profile.role": req.body.role },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: `User Role Updated`,
    });
});

export const updateCard = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${id}`, 404));
    }

    await User.findByIdAndUpdate(
        id,
        { "access.cards.total.extra": req.body.total },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: `User Cards Updated`,
    });
});

export const deleteUser = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const adminId = req.user?._id;
    if (!adminId) {
        return next(new ErrorHandler(`Admin Id not found`, 404));
    }
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    if (adminId.toString() === id) {
        return next(new ErrorHandler(`You cannot deactivate your account`, 400));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${id}`, 404));
    }
    if (user.account.isDeactivated) {
        return next(new ErrorHandler(`User with Id: ${id} is already deactivated`, 400));
    }

    await Card.deleteMany({ userId: id });

    user.account.isDeactivated = true;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User deleted`,
    });
});

export const blockUser = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const adminId = req.user?._id;
    if (!adminId) {
        return next(new ErrorHandler(`Admin Id not found`, 404));
    }
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    if (adminId.toString() === id) {
        return next(new ErrorHandler(`You cannot block your account`, 400));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${id}`, 404));
    }
    if (user.account.isBlocked) {
        return next(new ErrorHandler(`User with Id: ${id} is already blocked`, 400));
    }

    user.account.isBlocked = true;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User Blocked successfully`,
    });
});

export const unBlockUser = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const adminId = req.user?._id;
    if (!adminId) {
        return next(new ErrorHandler(`Admin Id not found`, 404));
    }
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    if (adminId.toString() === id) {
        return next(new ErrorHandler(`You cannot unblock your account`, 400));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${id}`, 404));
    }
    if (!user.account.isBlocked) {
        return next(new ErrorHandler(`User with Id: ${id} is already unblocked`, 400));
    }

    user.account.isBlocked = false;
    if (user.account.loginAttempt) {
        user.account.loginAttempt.count = 0;
    }
    await user.save();

    res.status(200).json({
        success: true,
        message: `User UnBlocked successfully`,
    });
});

export const reActivateUser = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const adminId = req.user?._id;
    if (!adminId) {
        return next(new ErrorHandler(`Admin Id not found`, 404));
    }
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    if (adminId.toString() === id) {
        return next(new ErrorHandler(`You cannot reactivate your account`, 400));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${id}`, 404));
    }
    if (!user.account.isDeactivated) {
        return next(new ErrorHandler(`User with Id: ${id} is already active`, 400));
    }

    user.account.isDeactivated = false;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User Reactivated successfully`,
    });
});