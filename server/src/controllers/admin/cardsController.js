import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import ApiFeatures from "../../utils/services/apiFeatures.js";
import { selectModelByType } from "../cardsController.js";
import User from "../../models/userModel.js";
import Animal from "../../models/cards/animalModel.js";
import Tree from "../../models/cards/treeModel.js";
import Personal from "../../models/cards/personalModel.js";
import Creator from "../../models/cards/creatorModel.js";
import Medical from "../../models/cards/medicalModel.js";

export const getAllCards = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);
    if (!Model) {
        return next(new ErrorHandler(`Model not found for type: ${req.query.type}`, 400));
    }

    const resultPerPage = 20;
    const count = await Model.countDocuments();

    const apiFeatures = new ApiFeatures(Model.find().populate("user", "email").sort({ $natural: -1 }), req.query).pagination(resultPerPage);
    const cards = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        cards
    });
});

export const getCardStats = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const botanical = await Tree.countDocuments({ user: user._id });
    const individual = await Personal.countDocuments({ user: user._id });
    const creator = await Creator.countDocuments({ user: user._id });
    const medical = await Medical.countDocuments({ user: user._id });
    const animal = await Animal.countDocuments({ user: user._id });

    res.status(200).json({
        success: true,
        count: {
            botanical,
            individual,
            creator,
            medical,
            animal,
        }
    });
});

export const getUserCards = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);
    if (!Model) {
        return next(new ErrorHandler(`Model not found for type: ${req.query.type}`, 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const resultPerPage = 20;
    const count = await Model.countDocuments({ user: user._id });

    const apiFeatures = new ApiFeatures(Model.find({ user: user._id }).populate("user", "email").sort({ $natural: -1 }), req.query).pagination(resultPerPage);
    const cards = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        cards
    });
});

export const getSingleCard = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);
    if (!Model) {
        return next(new ErrorHandler(`Model not found for type: ${req.query.type}`, 400));
    }

    const card = await Model.findById(req.params.id).populate("user", "email");
    if (!card) {
        return next(new ErrorHandler("Card Not Found", 404));
    }

    res.status(200).json({
        success: true,
        card
    });
});

export const deleteCard = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);
    if (!Model) {
        return next(new ErrorHandler(`Model not found for type: ${req.query.type}`, 400));
    }

    const card = await Model.findById(req.params.id)
    if (!card) {
        return next(new ErrorHandler("Card Not Found", 404));
    }
    
    const user = await User.findById(card.user);
    
    await Model.findByIdAndDelete(req.params.id);
    user.cards.created--;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Successfully deleted card"
    });
});
