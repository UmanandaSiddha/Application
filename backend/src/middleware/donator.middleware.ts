import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Donator, { IDonator } from "../models/accounts/donator.model.js";

export interface DonatorRequest extends Request {
    donator?: IDonator;
}

export const isAuthenticatedDonator = catchAsyncErrors( async (req: DonatorRequest, res: Response, next: NextFunction) => {
    const donatorToken = req.cookies["donator_auth"] as string | undefined;

    if (!donatorToken) {
        throw new ErrorHandler("Unauthorized access", StatusCodes.FORBIDDEN);
    }

    const decoded = jwt.verify(donatorToken!, process.env.DONATOR_TOKEN_SECRET!) as JwtPayload & { id: string };
    const donator = await Donator.findById(decoded.id);
    if (!donator) {
        throw new ErrorHandler("Donator not found", StatusCodes.NOT_FOUND)
    }

    req.donator = donator;
    next();
});