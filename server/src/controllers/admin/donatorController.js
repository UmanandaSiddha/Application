import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import Donator from "../../models/donatorModel.js";
import ErrorHandler from "../../utils/errorHandler.js";
import ApiFeatures from "../../utils/services/apiFeatures.js";

export const getAllDonators = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 10;
    const count = await Donator.countDocuments();

    const apiFeatures = new ApiFeatures(Donator.find().sort({ $natural: -1 }), req.query).search().filter();

    // let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

    // if (category) {
    //     link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
    // }

    let filteredDonators = await apiFeatures.query;
    let filteredDonatorsCount = filteredDonators.length;

    apiFeatures.pagination(resultPerPage);
    filteredDonators = await apiFeatures.query.clone();

    return res.status(200).json({
        success: true,
        count,
        resultPerPage,
        filteredDonators,
        filteredDonatorsCount
    });
});

export const getSingleDonator = catchAsyncErrors(async (req, res, next) => {
    const donator = await Donator.findById(req.params.id);
    if (!donator) {
        return next(new ErrorHandler(`No Donator By Id ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        donator,
    });
});