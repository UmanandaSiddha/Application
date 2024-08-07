import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import Transaction from "../../models/payment/transactionModel.js";
import User from "../../models/userModel.js";
import ErrorHandler from "../../utils/errorHandler.js";
import ApiFeatures from "../../utils/services/apiFeatures.js";

export const getAllTransactions = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 5;
    const count = await Transaction.countDocuments();

    const apiFeatures = new ApiFeatures(Transaction.find().sort({ $natural: -1 }), req.query).filter();
    let filteredTransactions = await apiFeatures.query;
    let filteredTransactionsCount = filteredTransactions.length;

    apiFeatures.pagination(resultPerPage);
    filteredTransactions = await apiFeatures.query.clone();

    return res.status(200).json({
        success: true,
        count,
        resultPerPage,
        filteredTransactions,
        filteredTransactionsCount
    });
});

export const getUserTransactions = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`No User By Id ${req.params.id}`, 404));
    }

    const resultPerPage = 5;
    const count = await Transaction.countDocuments({ user: req.params.id });

    const apiFeatures = new ApiFeatures(Transaction.find({ user: req.params.id }).sort({ $natural: -1 }), req.query).filter();
    let filteredTransactions = await apiFeatures.query;
    let filteredTransactionsCount = filteredTransactions.length;

    apiFeatures.pagination(resultPerPage);
    filteredTransactions = await apiFeatures.query.clone();

    return res.status(200).json({
        success: true,
        count,
        resultPerPage,
        filteredTransactions,
        filteredTransactionsCount
    });
});

export const getParticularTransaction = catchAsyncErrors(async (req, res, next) => {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
        return next(new ErrorHandler(`No Transaction By Id ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        transaction,
    });
});