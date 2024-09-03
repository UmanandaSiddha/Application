import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import ApiFeatures from "../../utils/services/apiFeatures.js";
import { selectModelByType } from "../cardsController.js";
import User from "../../models/userModel.js";

export const getAllCards = catchAsyncErrors(async (req, res, next) => {

    const Model = selectModelByType(req.query.type);
    if (!Model) {
        return next(new ErrorHandler(`Model not found for type: ${req.query.type}`, 400));
    }

    const resultPerPage = 5;
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

export const getSingleTreeCard = catchAsyncErrors(async (req, res, next) => {
    const Model = selectModelByType(req.query.type);
    if (!Model) {
        return next(new ErrorHandler(`Model not found for type: ${req.query.type}`, 400));
    }

    const card = await Model.findById(req.params.id)
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
        card
    });
});
