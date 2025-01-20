import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";

export interface UserRequest extends Request {
    user?: IUser;
}

export const isAuthenticatedUser = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const accessToken = req.cookies["_session"] as string | undefined;

    if (!accessToken) {
        throw new ErrorHandler("Unauthorized access", StatusCodes.FORBIDDEN);
    }

    const decoded = jwt.verify(accessToken!, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload & { id: string };
    const user = await User.findById(decoded.id);
    if (!user) {
        throw new ErrorHandler("User not found", StatusCodes.NOT_FOUND)
    }
    if (user.isBlocked) {
        throw new ErrorHandler("Your account has been blocked", StatusCodes.FORBIDDEN);
    }

    req.user = user;
    next();
});

export const isUserVerified = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isVerified) {
        return next(new ErrorHandler("Please verify your email to access this resource", StatusCodes.UNAUTHORIZED));
    }
    next();
});

export const authorizeRoles = (...roles: string[]) => {
    return (req: UserRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to access this resource`, StatusCodes.UNAUTHORIZED));
        }
        next();
    };
};