import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import ApiFeatures from "../../utils/services/api.features.js";
import Card from "../../models/card/card.model.js";
import { NextFunction, Request, Response } from "express";
import User from "../../models/accounts/user.model.js";
import mongoose from "mongoose";

export const getAllCards = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const resultPerPage = 20;
    const count = await Card.countDocuments();

    const apiFeatures = new ApiFeatures(Card.find().populate("userId", "email").sort({ $natural: -1 }), req.query).pagination(resultPerPage);
    const cards = await apiFeatures.getQuery();

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        cards
    });
});

export const getCardStats = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const card = await Card.countDocuments({ userId: user.id });

    res.status(200).json({
        success: true,
        count: card
    });
});

export const getUserCards = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const resultPerPage = 20;
    const count = await Card.countDocuments({ userId: user._id });

    const apiFeatures = new ApiFeatures(Card.find({ userId: user._id }).populate("userId", "email").sort({ $natural: -1 }), req.query).pagination(resultPerPage);
    const cards = await apiFeatures.getQuery();

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        cards
    });
});

export const getSingleCard = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const card = await Card.findById(id).populate("userId", "email");
    if (!card) {
        return next(new ErrorHandler("Card Not Found", 404));
    }

    res.status(200).json({
        success: true,
        card
    });
});

export const deleteCard = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const card = await Card.findById(id)
    if (!card) {
        return next(new ErrorHandler("Card Not Found", 404));
    }
    
    const user = await User.findById(card.userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    
    await Card.findByIdAndDelete(id);
    user.access.cards.created--;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Successfully deleted card"
    });
});
