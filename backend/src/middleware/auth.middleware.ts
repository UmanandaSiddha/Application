import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser, UserRoleEnum } from "../models/accounts/user.model.js";
import { StatusCodes } from "http-status-codes";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import Subscription from "../models/payment/subscription.model.js";

export interface UserRequest extends Request {
    user?: IUser;
}

export const isAuthenticatedUser = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies["user_token"] as string | undefined;
    if (!token) {
        throw new ErrorHandler("Unauthorized access", StatusCodes.FORBIDDEN);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { id: string };
    const user = await User.findById(decoded.id);
    if (!user) {
        throw new ErrorHandler("User not found", StatusCodes.NOT_FOUND)
    }
    if (user.account.isBlocked) {
        throw new ErrorHandler("Your account has been blocked", StatusCodes.FORBIDDEN);
    }

    req.user = user;
    next();
});

export const isUserVerified = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.user?.account.isVerified) {
        return next(new ErrorHandler("Please verify your email to access this resource", StatusCodes.UNAUTHORIZED));
    }
    next();
});

export const hasAccess = catchAsyncErrors( async (req: UserRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user?.profile.role === UserRoleEnum.ADMIN) {
        return next();
    }
    if (user?.access.freeAccess) {
        return next();
    }
    if (!user?.access?.cards || !user?.access?.cards?.total) {
        return next(new ErrorHandler("User access data is incomplete", 400));
    }
    const { created, total } = user.access.cards;
    const { initial, extra } = total;
    if (created < initial) {
        return next();
    }
    if (created >= initial + extra) {
        return next(new ErrorHandler("Cards limit exceeded", 401));
    }
    if (!user?.access.latestSubscription) {
        return next(new ErrorHandler("You don't have any subscription", 400));
    }
    const subscription = await Subscription.findById(user.access.latestSubscription);
    if (!subscription) {
        return next(new ErrorHandler("Subscription not found", 400));
    }
    const isActiveSubscription = ["active", "pending", "created"].includes(subscription.status);
    const isCancelledSubscription = subscription.status === "cancelled" && subscription.currentEnd <= new Date();
    if (!isActiveSubscription || isCancelledSubscription) {
        return next(new ErrorHandler("Subscription expired, please recharge", 400));
    }
    next();
});

// export const checkCancellation = catchAsyncErrors( async (req: UserRequest, res: Response, next: NextFunction) => {
//     const updateUserCards = async () => {
//         if (req.user?.access.cards.total.extra !== 0) {
//             await User.findByIdAndUpdate(
//                 req.user?._id,
//                 { "cards.total.extra": 0 },
//                 { new: true, runValidators: true, useFindAndModify: false }
//             );
//         }
//     };

//     const status = req.user?.access.freePlan;
//     if (status) {
//         await updateUserCards();
//     }

//     if (req.user?.access.latestSubsciption) {
//         const subscription = await Subscription.findById(req.user?.access.latestSubsciption);
//         if (subscription && subscription.status === "cancelled" && subscription.currentEnd <= new Date(Date.now())) {
//             await updateUserCards();
//         }
//     }
//     next();
// });

export const authorizeRoles = (...roles: string[]) => {
    return (req: UserRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.profile.role)) {
            return next(new ErrorHandler(`Role: ${req.user?.profile.role} is not allowed to access this resource`, StatusCodes.UNAUTHORIZED));
        }
        next();
    };
};

export const checkDeactivated = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction) => {
    if (req.user?.account.isDeactivated) {
        return next(new ErrorHandler(`Your account is deactivated, contact the site to reactivate`, 401));
    }
    next();
});