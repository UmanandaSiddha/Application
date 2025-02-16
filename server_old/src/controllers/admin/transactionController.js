import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import Donator from "../../models/donatorModel.js";
import Transaction from "../../models/payment/transactionModel.js";
import User from "../../models/userModel.js";
import ErrorHandler from "../../utils/errorHandler.js";
import ApiFeatures from "../../utils/services/apiFeatures.js";

export const getAllTransactions = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 20;
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
        transactions: filteredTransactions,
        filteredTransactionsCount
    });
});

export const getUserTransactions = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`No User By Id ${req.params.id}`, 404));
    }

    const resultPerPage = 20;
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
        transactions: filteredTransactions,
        filteredTransactionsCount
    });
});

export const getDonatorTransactions = catchAsyncErrors(async (req, res, next) => {
    const donator = await Donator.findById(req.params.id);
    if (!donator) {
        return next(new ErrorHandler(`No User By Id ${req.params.id}`, 404));
    }

    const resultPerPage = 20;
    const count = await Transaction.countDocuments({ donator: req.params.id });

    const apiFeatures = new ApiFeatures(Transaction.find({ donator: req.params.id }).sort({ $natural: -1 }), req.query).filter();
    let filteredTransactions = await apiFeatures.query;
    let filteredTransactionsCount = filteredTransactions.length;

    apiFeatures.pagination(resultPerPage);
    filteredTransactions = await apiFeatures.query.clone();

    return res.status(200).json({
        success: true,
        count,
        resultPerPage,
        transactions: filteredTransactions,
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

export const updateTransaction = catchAsyncErrors(async (req, res, next) => {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
        return next(new ErrorHandler(`No Transaction By Id ${req.params.id}`, 404));
    }

    const { status } = req.body;
    if (!status) {
        return next(new ErrorHandler("Please provide the status", 400));
    }
    if (status === transaction.status) {
        return next(new ErrorHandler("Status cannot be the same as the current status", 400));
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        transaction: updatedTransaction,
        message: "Subscription status updated successfully",
    });
});

export const deleteTransaction = catchAsyncErrors(async (req, res, next) => {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
        return next(new ErrorHandler(`No Transaction By Id ${req.params.id}`, 404));
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Transaction deleted successfully",
    });
});