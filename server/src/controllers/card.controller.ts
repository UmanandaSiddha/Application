import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User, { UserRoleEnum } from "../models/accounts/user.model.js";
import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../middleware/auth.middleware.js";
import Card, { CardEnum } from "../models/card/card.model.js";
import mongoose from "mongoose";
import ApiFeatures from "../utils/services/api.features.js";
import Subscription from "../models/payment/subscription.model.js";

// Create Card
export const createCard = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req;
    if (!user) return next(new ErrorHandler("User not found", 404));
    const totalCards = user.access.cards.total.extra + user.access.cards.total.initial;
    if (user.profile.role !== UserRoleEnum.ADMIN && !user.access.freeAccess && totalCards <= user.access.cards.created) return next(new ErrorHandler(`You have reached your total card limit.`, 403))

    let shortId = `sh${Date.now().toString(36)}`;
    let exists = await Card.findOne({ shortCode: shortId });
    while (exists) {
        shortId = `sh${Date.now().toString(36)}`;
        exists = await Card.findOne({ shortCode: shortId });
    }

    const { type } = req.query;
    if (!type) return next(new ErrorHandler("Card type is required", 400));
    if (!Object.values(CardEnum).includes(type as any)) return next(new ErrorHandler("Invalid card type", 400));

    const card = await Card.create({
        type,
        data: req.body,
        shortCode: shortId,
        userId: user._id
    });

    user.access.cards.created++;
    await user.save();

    res.status(201).json({
        success: true,
        card,
    });
});

// Batch Create Cards
export const createBatchCards = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req;
    if (!user) return next(new ErrorHandler("User not found", 404));

    const { names, name, quantity } = req.body;
    if ((!Array.isArray(names) && !name) || (!names && (!quantity || quantity <= 0))) {
        return next(new ErrorHandler('Invalid request: Provide an array of names or a single name with quantity.', 400));
    }

    const totalRequested = Array.isArray(names) ? names.length : quantity;
    const totalCards = user.access.cards.total.extra + user.access.cards.total.initial;

    if (user.profile.role !== UserRoleEnum.ADMIN && !user.access.freeAccess && totalCards < user.access.cards.created + totalRequested) {
        return next(new ErrorHandler(`You have reached your total card limit.`, 403));
    }

    const batchCards = [];
    const { type } = req.query;
    
    if (!type) return next(new ErrorHandler("Card type is required", 400));
    if (!Object.values(CardEnum).includes(type as any)) return next(new ErrorHandler("Invalid card type", 400));

    const cardNames = Array.isArray(names) ? names : Array(quantity).fill(name);

    for (const cardName of cardNames) {
        let shortId = `sh${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
        let exists = await Card.findOne({ shortCode: shortId });

        while (exists) {
            shortId = `sh${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
            exists = await Card.findOne({ shortCode: shortId });
        }

        batchCards.push({
            type,
            data: { name: cardName },
            shortCode: shortId,
            userId: user?._id,
        });
    }

    const createdCards = await Card.insertMany(batchCards);
    user.access.cards.created += totalRequested;
    await user.save();

    res.status(201).json({
        success: true,
        card: createdCards,
    });
});

// Update Card
export const updateCard = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorHandler("Invalid ID format", 400));
    const card = await Card.findById(id);
    if (!card) return next(new ErrorHandler(`Card does not exist with Id: ${id}`, 404));

    const { user } = req;
    if (!user) return next(new ErrorHandler("User not found", 404));
    if (card.userId.toString() !== user._id.toString()) return next(new ErrorHandler("Unauthorized to update this vCard", 401));
    const totalCards = user.access.cards.total.extra + user.access.cards.total.initial;
    if (!user.access.freeAccess && totalCards <= user.access.cards.created) return next(new ErrorHandler(`You have reached your total card limit.`, 403));

    const updatedCard = await Card.findByIdAndUpdate(
        id,
        { data: req.body },
        { new: true, runValidators: true, useFindAndModify: false }
    );
    if (!updatedCard) return next(new ErrorHandler(`Update Failed`, 404));

    res.status(200).json({
        success: true,
        card: updatedCard,
    });
});

// Delete Card
export const deleteCard = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorHandler("Invalid ID format", 400));
    const card = await Card.findById(id);
    if (!card) return next(new ErrorHandler(`Card does not exist with Id: ${id}`, 404));

    const { user } = req;
    if (!user) return next(new ErrorHandler("User not found", 404));
    if (card.userId.toString() !== user._id.toString()) return next(new ErrorHandler("Unauthorized to delete this vCard", 401));

    await Card.findByIdAndDelete(id);

    user.access.cards.created--;
    await user.save();

    res.status(200).json({
        success: true,
        message: `Card deleted`,
    });
});

// Fetch User Cards
export const getUserCards = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const resultPerPage = 20;
    const filter: any = { userId: req.user?._id };

    if (req.query.type !== "ALL") {
        filter.type = req.query.type;
    }

    const count = await Card.countDocuments(filter);

    const apiFeatures = new ApiFeatures(
        Card.find(filter).select("data.name type shortCode createdAt").sort({ $natural: -1 }),
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

// Get Display Card
export const getDisplayCard = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const card = await Card.findOne({ shortCode: req.params.id });
    if (!card) return next(new ErrorHandler("Card Not Found", 404));
    const user = await User.findById(card.userId);
    if (!user) return next(new ErrorHandler("User not found", 404));

    if (!user.access.freeAccess &&
        !user.access.latestSubscription && 
        user.access.cards?.total.extra !== undefined && user.access.cards?.created !== undefined &&
        // user.access.cards?.total.extra === user.access.cards.total.initial &&
        (user.access.cards?.total.initial + user.access.cards?.total.extra) > user.access.cards?.created
    ) {
        res.status(200).json({
            success: true,
            card,
        });
    }

    if (!user.access.freeAccess && user.profile.role !== UserRoleEnum.ADMIN) return next(new ErrorHandler("Card Not Found", 404));

    const subscription = await Subscription.findById(user.access.latestSubscription);
    if (user.profile.role !== UserRoleEnum.ADMIN && (!subscription || !["active", "pending"].includes(subscription?.status) || (subscription?.status === "cancelled" && subscription?.currentEnd < new Date(Date.now())))) {
        return next(new ErrorHandler("Card Not Found", 404));
    }

    res.status(200).json({
        success: true,
        card,
    });
});

// Get General User Card
export const getGeneralCard = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const card = await Card.findById(id);
    if (!card) return next(new ErrorHandler("Card Not Found", 400));

    const { user } = req;
    if (!user) return next(new ErrorHandler("User not found", 404));
    if (card.userId.toString() !== user._id.toString())  return next(new ErrorHandler("Unauthorized to fetch this vCard", 401));

    res.status(200).json({
        success: true,
        card,
    });
});