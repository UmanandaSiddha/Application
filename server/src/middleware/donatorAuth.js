import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import Donator from "../models/donatorModel.js";

export const isAuthenticatedDonator = catchAsyncErrors( async (req, res, next) => {
    const {donator_auth} = req.cookies;

    if (!donator_auth) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decodedToken = jwt.verify(donator_auth, process.env.JWT_SECRET);
    req.donator = await Donator.findById(decodedToken.id);
    next();
});
