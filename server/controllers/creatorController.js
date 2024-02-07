import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Creator from "../models/creatorModel.js";
import User from "../models/userModel.js";

export const createCreatorVCard = catchAsyncErrors( async (req, res, next) => {
    
    const personalx = await Creator.findOne({ user: req.user.id });
    if (personalx) {
        return next(new ErrorHandler("VCard Already Created"), 400);
    }

    const creator = await Creator.create(req.body);
    
    res.status(201).json({
        success: true,
        creator,
    });
});

export const updateCreatorVCard = catchAsyncErrors( async (req, res, next) => {

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

export const getCreatorVCard = catchAsyncErrors( async (req, res, next) => {
    const creator = await Creator.findOne({ user: req.user.id });
    if (creator) {
        const user = await User.findById(creator.user);
        if ( user.currentPlan.endDate < Date.now() ) {
            return next(new ErrorHandler("Subscription Expired", 400));
        }
    }

    res.status(201).json({
        success: true,
        creator,
    });
});

export const getGeneralVCard = catchAsyncErrors( async (req, res, next) => {
    const creator = await Creator.findById(req.params.id);
    if (creator) {
        const user = await User.findById(creator.user);
        if ( user.currentPlan.endDate < Date.now() ) {
            return next(new ErrorHandler("Subscription Expired", 400));
        }
    }

    res.status(201).json({
        success: true,
        creator,
    });
});

