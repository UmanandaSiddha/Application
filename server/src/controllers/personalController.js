import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Personal from "../models/personalModel.js";
import User from "../models/userModel.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const createPersonalVCard = catchAsyncErrors( async (req, res, next) => {
    const personal = await Personal.create(req.body);

    res.status(201).json({
        success: true,
        personal,
    });
});

export const updatePersonalVCard = catchAsyncErrors( async (req, res, next) => {

    const personalx = await Personal.findById(req.params.id);
    if (!personalx) {
        return next(new ErrorHandler(`Personal does not exist with Id: ${req.params.id}`, 404));
    }

    const personal = await Personal.findByIdAndUpdate(req.params.id, req.body, {
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

    const personal = await Personal.findById(req.params.id);
    if (!personal) {
        return next(new ErrorHandler(`Personal does not exist with Id: ${req.params.id}`, 404));
    }

    await Personal.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: `Personal deleted`,
    });
});


export const getPersonalVCard = catchAsyncErrors( async (req, res, next) => {

    const personal = await Personal.findById(req.params.id);
    if (!personal) {
        return next(new ErrorHandler("Personal Not Found", 400));
    }

    res.status(201).json({
        success: true,
        personal,
    });
});

export const getPersonalUserVCard = catchAsyncErrors( async (req, res, next) => {
    const resultPerPage = 5;
    const personalCount = await Personal.countDocuments({ user: req.user.id });

    const apiFeatures = new ApiFeatures(Personal.find({ user: req.user.id }).sort({ $natural: -1 }), req.query).pagination(resultPerPage);
    const personal = await apiFeatures.query;

    res.status(201).json({
        success: true,
        count: personalCount,
        personal,
    });
});

export const getGeneralVCard = catchAsyncErrors( async (req, res, next) => {

    const personal = await Personal.findById(req.params.id);
    if (!personal) {
        return next(new ErrorHandler("Personal Not Found", 400));
    }

    const user = await User.findById(personal.user);
    if ( user.currentPlan.endDate < Date.now() ) {
        return next(new ErrorHandler("Subscription Expired", 400));
    }

    res.status(201).json({
        success: true,
        personal,
    });
});

