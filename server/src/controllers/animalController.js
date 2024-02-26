import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Animal from "../models/animalModel.js";
import ApiFeatures from "../utils/apiFeatures.js";
import User from "../models/userModel.js";

export const createAnimalVCard = catchAsyncErrors(async (req, res, next) => {

    const animal = await Animal.create(req.body);

    res.status(201).json({
        success: true,
        animal, 
    });
});

export const updateAnimalVCard = catchAsyncErrors(async (req, res, next) => {

    const animalx = await Animal.findById(req.params.id);
    if (!animalx) {
        return next(new ErrorHandler(`Animal does not exist with Id: ${req.params.id}`, 404));
    }

    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (!animal) {
        return next(new ErrorHandler(`Update Failed`), 404);
    }

    res.status(200).json({
        success: true,
        animal,
    });
});

export const deleteAnimalVCard = catchAsyncErrors(async (req, res, next) => {

    const animal = await Animal.findById(req.params.id);
    if (!animal) {
        return next(new ErrorHandler(`Animal does not exist with Id: ${req.params.id}`, 404));
    }

    await Animal.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: `Animal deleted`,
    });
});

export const getUserVcards = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 5;
    const animalCount = await Animal.countDocuments({ user: req.user.id });

    const apiFeatures = new ApiFeatures(Animal.find({ user: req.user.id }).sort({ $natural: -1 }), req.query).pagination(resultPerPage);
    const animal = await apiFeatures.query;

    res.status(201).json({
        success: true,
        count: animalCount,
        animal,
    });
});

export const getAnimalVCard = catchAsyncErrors(async (req, res, next) => {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
        return next(new ErrorHandler("Animal Not Found", 400));
    }

    res.status(201).json({
        success: true,
        animal,
    });
});

export const getGeneralVCard = catchAsyncErrors(async (req, res, next) => {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
        return next(new ErrorHandler("Animal Not Found", 400));
    }

    const user = await User.findById(animal.user);
    if ( user.currentPlan.endDate < Date.now() ) {
        return next(new ErrorHandler("Subscription Expired", 400));
    }

    res.status(201).json({
        success: true,
        animal,
    });
});