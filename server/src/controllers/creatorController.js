import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Creator from "../models/creatorModel.js";
import User from "../models/userModel.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const createCreatorVCard = catchAsyncErrors( async (req, res, next) => {
    const creator = await Creator.create(req.body);
    
    res.status(201).json({
        success: true,
        creator,
    });
});

export const updateCreatorVCard = catchAsyncErrors( async (req, res, next) => {

    const creatorx = await Creator.findById(req.params.id);
    if (!creatorx) {
        return next(new ErrorHandler(`Creator does not exist with Id: ${req.params.id}`, 404));
    }

    const creator = await Creator.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (!creator) {
        return next(new ErrorHandler(`Update Failed`), 404);
    }

    res.status(200).json({
        success: true,
        creator,
    });
});

export const deleteCreatorVCard = catchAsyncErrors( async (req, res, next) => {
    const creator = await Creator.findById(req.params.id);
    if (!creator) {
        return next(new ErrorHandler(`Creator does not exist with Id: ${req.params.id}`, 404));
    }

    await Creator.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: `Creator deleted`,
    });
});

export const getCreatorVCard = catchAsyncErrors( async (req, res, next) => {
    
    const creator = await Creator.findById(req.params.id);
    if (!creator) {
        return next(new ErrorHandler("Creator Not Found", 400));
    }

    res.status(201).json({
        success: true,
        creator,
    });
});

export const getCreatorUserVCard = catchAsyncErrors( async (req, res, next) => {
    const resultPerPage = 5;
    const creatorCount = await Creator.countDocuments({ user: req.user.id });

    const apiFeatures = new ApiFeatures(Creator.find({ user: req.user.id }).sort({ $natural: -1 }), req.query).pagination(resultPerPage);
    const creator = await apiFeatures.query;

    res.status(201).json({
        success: true,
        count: creatorCount,
        creator,
    });
});

export const getGeneralVCard = catchAsyncErrors( async (req, res, next) => {
    const creator = await Creator.findById(req.params.id);
    if (!creator) {
        return next(new ErrorHandler("Creator Not Found", 400));
    }

    const user = await User.findById(creator.user);
    if ( user.currentPlan.endDate < Date.now() ) {
        return next(new ErrorHandler("Subscription Expired", 400));
    }

    res.status(201).json({
        success: true,
        creator,
    });
});

