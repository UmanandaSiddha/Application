import Tree from "../models/cards/treeModel.js";
import Personal from "../models/cards/personalModel.js";
import Medical from "../models/cards/medicalModel.js";
import Creator from "../models/cards/creatorModel.js";
import Animal from "../models/cards/animalModel.js";
import User, { freeEnum } from "../models/userModel.js";
import Subscription from "../models/payment/subscriptionModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ApiFeatures from "../utils/services/apiFeatures.js";
import ShortUrl from "../models/cards/shortUrlModel.js";

// Select model based on card type
export const selectModelByType = (type) => {
    switch (type) {
        case 'botanical':
            return Tree;
        case 'individual':
            return Personal;
        case 'medical':
            return Medical;
        case 'creator':
            return Creator;
        case 'animal':
            return Animal;
        default:
            throw new ErrorHandler("Invalid schema type", 400);
    }
};

// Fetch Card Id and Card type from short Url
export const getCardIdByShortCode = catchAsyncErrors(async (req, res, next) => {
    const shortCode = req.params.id;
    const shortUrl = await ShortUrl.findOne({ shortCode });
    if (!shortUrl) {
        return next(new ErrorHandler("Short URL not found", 404));
    }

    res.status(201).json({
        success: true,
        cardId: shortUrl.cardId,
        cardType: shortUrl.cardType
    });
});

// Create Card
export const createCard = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);
    if (!Model) {
        return next(new ErrorHandler(`Model not found for type: ${req.query.type}`, 400));
    }

    const user = await User.findById(req.user.id);
    if (user.freePlan.type === freeEnum.PLAN && user.cards.total <= user.cards.created) {
        return next(new ErrorHandler(`You have reached your total card limit.`, 403));
    }

    let shortId = `sh${Date.now().toString(36)}`;

    let exists = await ShortUrl.findOne({ shortCode: shortId });
    while (exists) {
        shortId = `sh${Date.now().toString(36)}`;
        exists = await ShortUrl.findOne({ shortCode: shortId });
    }

    const vCard = await Model.create({
        ...req.body,
        shortCode: shortId
    });

    await ShortUrl.create({
        shortCode: shortId,
        cardType: req.query.type,
        cardId: vCard._id,
    });

    user.cards.created++;
    await user.save();

    res.status(201).json({
        success: true,
        vCard,
    });
});

// Update Card
export const updateCard = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);
    if (!Model) {
        return next(new ErrorHandler(`Model not found for type: ${req.query.type}`, 400));
    }

    const vCard = await Model.findById(req.params.id);
    if (!vCard) {
        return next(new ErrorHandler(`VCard does not exist with Id: ${req.params.id}`, 404));
    }
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    if (!vCard.user.equals(user._id)) {
        return next(new ErrorHandler("Unauthorized to update this vCard", 401));
    }
    if (user.freePlan.type === freeEnum.PLAN && user.cards.total <= user.cards.created) {
        return next(new ErrorHandler(`You have reached your total card limit.`, 403));
    }

    const updatedVCard = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true, useFindAndModify: false }
    );
    if (!updatedVCard) {
        return next(new ErrorHandler(`Update Failed`), 404);
    }

    res.status(200).json({
        success: true,
        updatedVCard,
    });
});

// Delete Card
export const deleteCard = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);
    if (!Model) {
        return next(new ErrorHandler(`Model not found for type: ${req.query.type}`, 400));
    }

    const vCard = await Model.findById(req.params.id);
    if (!vCard) {
        return next(new ErrorHandler(`VCard does not exist with Id: ${req.params.id}`, 404));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    if (!vCard.user.equals(user._id)) {
        return next(new ErrorHandler("Unauthorized to delete this vCard", 401));
    }
    
    const shortUrl = await ShortUrl.findOne({ shortCode: vCard.shortCode });
    if (shortUrl) {
        await ShortUrl.deleteOne({ shortCode: vCard.shortCode });
    }

    await Model.findByIdAndDelete(req.params.id);

    user.cards.created--;
    await user.save();

    res.status(200).json({
        success: true,
        message: `VCard deleted`,
    });
});

// Fetch User Cards
export const getUserCards = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);
    if (!Model) {
        return next(new ErrorHandler(`Model not found for type: ${req.query.type}`, 400));
    }

    const resultPerPage = 20;
    const count = await Model.countDocuments({ user: req.user.id });

    const apiFeatures = new ApiFeatures(Model.find({ user: req.user.id }).select("name shortCode createdAt").sort({ $natural: -1 }), req.query).searchCard();

    let filteredCards = await apiFeatures.query;
    let filteredCardsCount = filteredCards.length;
    
    apiFeatures.pagination(resultPerPage);
    filteredCards = await apiFeatures.query.clone();

    return res.status(200).json({
        success: true,
        count,
        resultPerPage,
        vCards: filteredCards,
        filteredCardsCount
    });
});

// Get Display Card
export const getDisplayCard = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);
    if (!Model) {
        return next(new ErrorHandler(`Model not found for type: ${req.query.type}`, 400));
    }

    const vCard = await Model.findById(req.params.id);
    if (!vCard) {
        return next(new ErrorHandler("VCard Not Found", 404));
    }
    const user = await User.findById(vCard.user);

    if (
        (!user?.freePlan?.status || user?.freePlan?.status === false) &&
        !user?.activePlan && 
        user?.cards?.total !== undefined && user?.cards?.created !== undefined &&
        user?.cards?.total === 10 &&
        user?.cards?.total > user?.cards?.created
    ) {
        return res.status(200).json({
            success: true,
            vCard,
        });
    }

    if (user?.freePlan?.status && user.role !== "admin") {
        const { type, end } = user.freePlan;
        if (type === freeEnum.PLAN && end > Date.now()) {
            return next(new ErrorHandler("VCard Not Found", 404));
        }
    }

    const subscription = await Subscription.findById(user?.activePlan);
    if (user.role !== "admin" && (!subscription || !["active", "pending"].includes(subscription?.status) || (subscription?.status === "cancelled" && subscription?.currentEnd < Date.now()))) {
        return next(new ErrorHandler("VCard Not Found", 404));
    }

    res.status(200).json({
        success: true,
        vCard,
    });
});

// Get General User Card
export const getGeneralCard = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);
    if (!Model) {
        return next(new ErrorHandler(`Model not found for type: ${req.query.type}`, 400));
    }

    const vCard = await Model.findById(req.params.id);
    if (!vCard) {
        return next(new ErrorHandler("VCard Not Found", 400));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    if (!vCard.user.equals(user._id)) {
        return next(new ErrorHandler("Unauthorized to fetch this vCard", 401));
    }

    res.status(200).json({
        success: true,
        vCard,
    });
});