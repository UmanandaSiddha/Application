import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import Donator from "../../models/accounts/donator.model.js";
import ErrorHandler from "../../utils/errorHandler.js";
import { NextFunction, Request, Response } from "express";
import ApiFeatures from "../../utils/services/api.features.js";
import mongoose from "mongoose";

export const getAllDonators = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const resultPerPage = 20;
    const count = await Donator.countDocuments();

    const apiFeatures = new ApiFeatures(Donator.find().sort({ $natural: -1 }), req.query).search().filter();

    let filteredDonators = await apiFeatures.getQuery();
    let filteredDonatorsCount = filteredDonators.length;

    apiFeatures.pagination(resultPerPage);
    filteredDonators = await apiFeatures.getQuery().clone();

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        filteredDonatorsCount,
        donators: filteredDonators,
    });
});

export const getSingleDonator = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const donator = await Donator.findById(id).populate("latestDonation", "planId status currentEnd");;
    if (!donator) {
        return next(new ErrorHandler(`No Donator By Id ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        donator,
    });
});