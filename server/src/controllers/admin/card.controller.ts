import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import ApiFeatures from "../../utils/services/api.features.js";
import Card from "../../models/card/card.model.js";
import { NextFunction, Request, Response } from "express";
import User from "../../models/accounts/user.model.js";
import mongoose from "mongoose";

export const getAllCards = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const resultPerPage = 20;
    const filter: any = {};
    
    if (req.query.type !== "ALL") {
        filter.type = req.query.type;
    }

    const count = await Card.countDocuments(filter);

    const apiFeatures = new ApiFeatures(
        Card.find(filter).select("data.name type shortCode createdAt").populate("userId", "profile.email").sort({ $natural: -1 }),
        req.query
    ).searchCard();

    let filteredCards = await apiFeatures.getQuery();
    let filteredCardsCount = filteredCards.length;

    apiFeatures.pagination(resultPerPage);
    filteredCards = await apiFeatures.getQuery().clone();

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        cards: filteredCards,
        filteredCardsCount
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

    const botanicalCard = await Card.countDocuments({ userId: user.id, type: "BOTANICAL" });
    const animalCard = await Card.countDocuments({ userId: user.id, type: "ANIMAL" });
    const creatorCard = await Card.countDocuments({ userId: user.id, type: "CREATOR" });
    const individualCard = await Card.countDocuments({ userId: user.id, type: "INDIVIDUAL" });
    const medicalCard = await Card.countDocuments({ userId: user.id, type: "MEDICAL" });

    res.status(200).json({
        success: true,
        count: {
            botanical: botanicalCard,
            individual: individualCard,
            creator: creatorCard,
            medical: medicalCard,
            animal: animalCard
        }
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
    const filter: any = { userId: user._id };
    
    if (req.query.type !== "ALL") {
        filter.type = req.query.type;
    }

    const count = await Card.countDocuments(filter);

    const apiFeatures = new ApiFeatures(
        Card.find(filter).select("data.name userId type shortCode createdAt").populate("userId", "profile.email").sort({ $natural: -1 }),
        req.query
    ).searchCard();

    let filteredCards = await apiFeatures.getQuery();
    let filteredCardsCount = filteredCards.length;

    apiFeatures.pagination(resultPerPage);
    filteredCards = await apiFeatures.getQuery().clone();

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        cards: filteredCards,
        filteredCardsCount
    });
});

export const getSingleCard = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const card = await Card.findById(id).populate("userId", "profile.email");
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
