import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import Transaction from "../../models/payment/transactionModel.js";
import ErrorHandler from "../../utils/errorHandler.js";

export const getAllTransactions = catchAsyncErrors(async (req, res, next) => {
    const transactions = await Transaction.find();

    res.status(200).json({
        success: true,
        transactions,
    });
});

export const getUserTransactions = catchAsyncErrors(async (req, res, next) => {
    const transactions = await Transaction.find({ user: req.params.id });

    res.status(200).json({
        success: true,
        transactions,
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