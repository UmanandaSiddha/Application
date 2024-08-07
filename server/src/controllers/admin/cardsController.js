import ErrorHandler from "../../utils/errorHandler.js";
import Tree from "../../models/cards/treeModel.js";
import Medical from "../../models/cards/medicalModel.js";
import Creator from "../../models/cards/creatorModel.js";
import Animal from "../../models/cards/animalModel.js";
import Personal from "../../models/cards/personalModel.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import ApiFeatures from "../../utils/services/apiFeatures.js";
import { selectModelByType } from "../cardsController.js";
import User from "../../models/userModel.js";

export const getAllCards = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 10;

    const trees = await Tree.find().populate("user", "email");
    const personals = await Personal.find().populate("user", "email");
    const medicals = await Medical.find().populate("user", "email");
    const creators = await Creator.find().populate("user", "email");
    const animals = await Animal.find().populate("user", "email");

    const treeCount = await Tree.countDocuments();
    const personalCount = await Personal.countDocuments();
    const medicalCount = await Medical.countDocuments();
    const creatorCount = await Creator.countDocuments();
    const animalCount = await Animal.countDocuments();

    const treesWithType = trees.map(item => ({ ...item._doc, type: 'botanical' }));
    const personalsWithType = personals.map(item => ({ ...item._doc, type: 'individual' }));
    const medicalsWithType = medicals.map(item => ({ ...item._doc, type: 'medical' }));
    const creatorsWithType = creators.map(item => ({ ...item._doc, type: 'creator' }));
    const animalsWithType = animals.map(item => ({ ...item._doc, type: 'animal' }));

    const allCards = [
        ...treesWithType,
        ...personalsWithType,
        ...medicalsWithType,
        ...creatorsWithType,
        ...animalsWithType
    ];

    const count = treeCount + personalCount + medicalCount + creatorCount + animalCount;

    const apiFeatures = new ApiFeatures(allCards, req.query).filter();
    let filteredCards = await apiFeatures.query;
    let filteredCardsCount = filteredCards.length;

    apiFeatures.pagination(resultPerPage);
    filteredCards = await apiFeatures.query.clone();

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        filteredCards,
        filteredCardsCount
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
