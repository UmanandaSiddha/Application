import Tree from "../models/treeModel.js";
import Personal from "../models/personalModel.js";
import Medical from "../models/medicalModel.js";
import Creator from "../models/creatorModel.js";
import Animal from "../models/animalModel.js";
import User from "../models/userModel.js";
import Subscription from "../models/subscriptionModel.js";

import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ApiFeatures from "../utils/apiFeatures.js";

// Function to select model based on type
const selectModelByType = (type) => {
    switch (type) {
        case 'tree':
            return Tree;
        case 'personal':
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

export const createCard = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);

    const user = await User.findById(req.user.id);

    if (user.cards.total <= user.cards.created) {
        return next(new ErrorHandler(`You have reached your total card limit.`, 403));
    }

    const vCard = await Model.create(req.body);
    user.cards.created++;
    await user.save();

    res.status(201).json({
        success: true,
        vCard,
    });
});

export const updateCard = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);
    const vCard = await Model.findById(req.params.id);

    if (!vCard) {
        return next(new ErrorHandler(`VCard does not exist with Id: ${req.params.id}`, 404));
    }

    const user = await User.findById(req.user.id);

    if (user.cards.total <= user.cards.created) {
        return next(new ErrorHandler(`You have reached your total card limit.`, 403));
    }

    const updatedVCard = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });

    if (!updatedVCard) {
        return next(new ErrorHandler(`Update Failed`), 404);
    }

    res.status(200).json({
        success: true,
        updatedVCard,
    });
});

export const deleteCard = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);
    const vCard = await Model.findById(req.params.id);
    if (!vCard) {
        return next(new ErrorHandler(`VCard does not exist with Id: ${req.params.id}`, 404));
    }

    const user = await User.findById(req.user.id);
    
    await Model.findByIdAndDelete(req.params.id);
    user.cards.created--;
    await user.save();

    res.status(200).json({
        success: true,
        message: `VCard deleted`,
    });
});

export const getUserCards = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);

    const resultPerPage = 5;
    const vCardCount = await Model.countDocuments({ user: req.user.id });

    const apiFeatures = new ApiFeatures(Model.find({ user: req.user.id }).sort({ $natural: -1 }), req.query).pagination(resultPerPage);
    const vCards = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: vCardCount,
        vCards,
    });
});

export const getDisplayCard = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);

    const vCard = await Model.findById(req.params.id);
    if (!vCard) {
        return next(new ErrorHandler("VCard Not Found", 404));
    }

    const user = await User.findById(vCard.user);
    const subscription = await Subscription.findById(user.activePlan);
    if (!["active", "pending"].includes(subscription.status) || (subscription.status === "cancelled" && subscription.currentEnd > Date.now())) {
        return next(new ErrorHandler("VCard Not Found", 404));
    }

    res.status(200).json({
        success: true,
        vCard,
    });
});

export const getGeneralCard = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);

    const vCard = await Model.findById(req.params.id);
    if (!vCard) {
        return next(new ErrorHandler("VCard Not Found", 400));
    }

    res.status(200).json({
        success: true,
        vCard,
    });
});
