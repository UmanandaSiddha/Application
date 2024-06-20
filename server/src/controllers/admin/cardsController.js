import ErrorHandler from "../../utils/errorHandler.js";
import sendToken from "../../utils/tokens/jwtToken.js";
import Tree from "../../models/cards/treeModel.js";
import Medical from "../../models/cards/medicalModel.js";
import Creator from "../../models/cards/creatorModel.js";
import Animal from "../../models/cards/animalModel.js";
import Personal from "../../models/cards/personalModel.js";
import { addEmailToQueue } from "../../utils/queue/emailQueue.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import User, { accountEnum, freeEnum, roleEnum } from "../../models/userModel.js";

export const getAllCards = catchAsyncErrors(async (req, res, next) => {
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

    const treesWithType = trees.map(item => ({ ...item._doc, type: 'botany' }));
    const personalsWithType = personals.map(item => ({ ...item._doc, type: 'individual' }));
    const medicalsWithType = medicals.map(item => ({ ...item._doc, type: 'medical' }));
    const creatorsWithType = creators.map(item => ({ ...item._doc, type: 'creator' }));
    const animalsWithType = animals.map(item => ({ ...item._doc, type: 'animal' }));

    const cards = [
        ...treesWithType,
        ...personalsWithType,
        ...medicalsWithType,
        ...creatorsWithType,
        ...animalsWithType
    ];

    const count = treeCount + personalCount + medicalCount + creatorCount + animalCount;

    res.status(200).json({
        success: true,
        count,
        cards,
    });
});

export const getSingleTreeCard = catchAsyncErrors(async (req, res, next) => {
    const tree = await Tree.findById(req.params.id)
    if (!tree) {
        return next(new ErrorHandler("Card Not Found", 404));
    }

    res.status(200).json({
        success: true,
        tree
    });
});
