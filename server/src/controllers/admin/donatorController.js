import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import Donator from "../../models/donatorModel.js";
import ErrorHandler from "../../utils/errorHandler.js";
import ApiFeatures from "../../utils/services/apiFeatures.js";

export const getAllDonators = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 20;
    const count = await Donator.countDocuments();

    const apiFeatures = new ApiFeatures(Donator.find().sort({ $natural: -1 }), req.query).search().filter();

    let filteredDonators = await apiFeatures.query;
    let filteredDonatorsCount = filteredDonators.length;

    apiFeatures.pagination(resultPerPage);
    filteredDonators = await apiFeatures.query.clone();

    return res.status(200).json({
        success: true,
        count,
        resultPerPage,
        filteredDonatorsCount,
        donators: filteredDonators,
    });
});

export const getSingleDonator = catchAsyncErrors(async (req, res, next) => {
    const donator = await Donator.findById(req.params.id).populate("activeDonation", "planId status currentEnd");;
    if (!donator) {
        return next(new ErrorHandler(`No Donator By Id ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        donator,
    });
});