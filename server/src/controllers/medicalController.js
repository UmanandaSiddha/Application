import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Medical from "../models/medicalModel.js";
import User from "../models/userModel.js";

export const createMedicalVCard = catchAsyncErrors( async (req, res, next) => {

    const personalx = await Medical.findOne({ user: req.user.id });
    if (personalx) {
        return next(new ErrorHandler("VCard Already Created"), 400);
    }

    const medical = await Medical.create(req.body);
    
    res.status(201).json({
        success: true,
        medical,
    });
});

export const updateMedicalVCard = catchAsyncErrors( async (req, res, next) => {

    const medical = await Medical.findByIdAndUpdate({ user: req.user.id }, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (!medical) {
        return next(new ErrorHandler(`Update Failed`), 404);
    }

    res.status(200).json({
        success: true,  
        medical,
    });
});

export const deleteMedicalVCard = catchAsyncErrors( async (req, res, next) => {

    await Medical.findOneAndDelete({ user: req.user.id });

    res.status(200).json({
        success: true,  
        message: "Medical Card Deleted"
    });
});

export const getMedicalVCard = catchAsyncErrors( async (req, res, next) => {
    const medical = await Medical.findOne({ user: req.user.id });

    res.status(201).json({
        success: true,
        medical,
    });
});

export const getGeneralVCard = catchAsyncErrors( async (req, res, next) => {
    const medical = await Medical.findById(req.params.id);
    if (medical) {
        const user = await User.findById(medical.user);
        if ( user.currentPlan.endDate < Date.now() ) {
            return next(new ErrorHandler("Subscription Expired", 400));
        }
    }

    res.status(201).json({
        success: true,
        medical,
    });
});

