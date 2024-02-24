import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Personal from "../models/personalModel.js";
import User from "../models/userModel.js";

export const createPersonalVCard = catchAsyncErrors( async (req, res, next) => {

    const personalx = await Personal.findOne({ user: req.user.id });
    if (personalx) {
        return next(new ErrorHandler("VCard Already Created"), 400);
    }

    const personal = await Personal.create(req.body);

    res.status(201).json({
        success: true,
        personal,
    });
});

export const updatePersonalVCard = catchAsyncErrors( async (req, res, next) => {

    const personal = await Personal.findOneAndUpdate({ user: req.user.id }, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (!personal) {
        return next(new ErrorHandler(`Update Failed`), 404);
    }

    res.status(200).json({
        success: true,  
        personal,
    });
});

export const deletePersonalVCard = catchAsyncErrors( async (req, res, next) => {

    await Personal.findOneAndDelete({ user: req.user.id });

    res.status(200).json({
        success: true,  
        message: "Personal Card Deleted"
    });
});


export const getPersonalVCard = catchAsyncErrors( async (req, res, next) => {
    const personal = await Personal.findOne({ user: req.user.id });
    
    res.status(201).json({
        success: true,
        personal,
    });
});

export const getGeneralVCard = catchAsyncErrors( async (req, res, next) => {
    const personal = await Personal.findById(req.params.id);
    if (personal) {
        const user = await User.findById(personal.user);
        if ( user.currentPlan.endDate < Date.now() ) {
            return next(new ErrorHandler("Subscription Expired", 400));
        }
    }

    res.status(201).json({
        success: true,
        personal,
    });
});

