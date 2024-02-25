import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Medical from "../models/medicalModel.js";
import User from "../models/userModel.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const createMedicalVCard = catchAsyncErrors( async (req, res, next) => {
    const medical = await Medical.create(req.body);
    
    res.status(201).json({
        success: true,
        medical,
    });
});

export const updateMedicalVCard = catchAsyncErrors( async (req, res, next) => {

    const medicalx = await Medical.findById(req.params.id);
    if (!medicalx) {
        return next(new ErrorHandler(`Medical does not exist with Id: ${req.params.id}`, 404));
    }

    const medical = await Medical.findByIdAndUpdate(req.params.id, req.body, {
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

    const medical = await Medical.findById(req.params.id);
    if (!medical) {
        return next(new ErrorHandler(`Medical does not exist with Id: ${req.params.id}`, 404));
    }

    await Medical.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,  
        message: "Medical Card Deleted"
    });
});

export const getMedicalVCard = catchAsyncErrors( async (req, res, next) => {
    const medical = await Medical.findById(req.params.id);
    if (!medical) {
        return next(new ErrorHandler("Medical Not Found", 400));
    }

    res.status(201).json({
        success: true,
        medical,
    });
});

export const getMedicalUserVCard = catchAsyncErrors( async (req, res, next) => {
    const resultPerPage = 5;
    const medicalCount = await Medical.countDocuments({ user: req.user.id });

    const apiFeatures = new ApiFeatures(Medical.find({ user: req.user.id }).sort({ $natural: -1 }), req.query).pagination(resultPerPage);
    const medical = await apiFeatures.query;

    res.status(201).json({
        success: true,
        count: medicalCount,
        medical,
    });
});

export const getGeneralVCard = catchAsyncErrors( async (req, res, next) => {
    const medical = await Medical.findById(req.params.id);
    if (!medical) {
        return next(new ErrorHandler("Medical Not Found", 400));
    }

    const user = await User.findById(medical.user);
    if ( user.currentPlan.endDate < Date.now() ) {
        return next(new ErrorHandler("Subscription Expired", 400));
    }

    res.status(201).json({
        success: true,
        medical,
    });
});

