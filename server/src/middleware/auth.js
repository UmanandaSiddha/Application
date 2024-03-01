import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuthenticatedUser = catchAsyncErrors( async (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
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
    if ( req.user?.currentPlan?.endDate < Date.now() && req.user?.currentPlan.planStatus === "succeeded" ) {
        return next(new ErrorHandler("Subscription Expired Recharge", 400));
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