import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import User, { freeEnum } from "../models/userModel.js";
import Subscription from "../models/payment/subscriptionModel.js";

export const isAuthenticatedUser = catchAsyncErrors( async (req, res, next) => {
    const {user_token} = req.cookies;

    if (!user_token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decodedToken = jwt.verify(user_token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken.id);
    next();
});

export const isUserVerified = catchAsyncErrors( async (req, res, next) => {
    if (!req.user.isVerified) {
        return next(new ErrorHandler("Please verify your email to access this resource", 401));
    }
    next();
});

export const isUserPaid = catchAsyncErrors( async (req, res, next) => {
    if (req.user.role !== "admin") {

        if (req.user.role !== "org" && !req.user?.freePlan?.status && !req.user?.activePlan && req.user?.cards?.total <= 10 && (req.user?.cards?.total > req.user?.cards?.created)) {
            return next();
        }    

        const { type, end, status } = req.user?.freePlan;
        if (status) {
            if (type === freeEnum.CUSTOM || end > Date.now()) {
                return next();
            }
        }

        if (!req.user.activePlan) {
            return next(new ErrorHandler("You don't have any Subscription", 400));
        }
    
        const subscription = await Subscription.findById(req.user.activePlan);
    
        if (!subscription || !["active", "pending", "created"].includes(subscription.status) || (subscription.status === "cancelled" && subscription.currentEnd <= Date.now())) {
            return next(new ErrorHandler("Subscription Expired Recharge", 400));
        }
    }
    
    next();
});

export const checkCancellation = catchAsyncErrors( async (req, res, next) => {

    const updateUserCards = async () => {
        if (req.user.cards.total !== 0) {
            await User.findByIdAndUpdate(
                req.user.id,
                { "cards.total": 0 },
                { new: true, runValidators: true, useFindAndModify: false }
            );
        }
    };

    const { type, end, status } = req.user?.freePlan;
    if (status) {
        if (type === freeEnum.PLAN && end <= Date.now()) {
            await updateUserCards();
        }
    }

    if (req.user?.activePlan) {
        const subscription = await Subscription.findById(req.user?.activePlan);
        if (subscription && subscription.status === "cancelled" && subscription.currentEnd <= Date.now()) {
            await updateUserCards();
        }
    }

    next();
});

export const authorizeRoles = ( ...roles ) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    }
};

export const checkDeactivated = catchAsyncErrors( async (req, res, next) => {
    if (req.user.isDeactivated) {
        return next(new ErrorHandler(`Your account is deactivated, contact the site to reactivate`, 401));
    }
    next();
});