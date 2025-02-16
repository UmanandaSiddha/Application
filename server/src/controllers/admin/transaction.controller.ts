import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import Transaction from "../../models/payment/transaction.model.js";
import ErrorHandler from "../../utils/errorHandler.js";
import ApiFeatures from "../../utils/services/api.features.js";
import User from "../../models/accounts/user.model.js";
import mongoose from "mongoose";
import Donator from "../../models/accounts/donator.model.js";

export const getAllTransactions = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const resultPerPage = 20;
    const count = await Transaction.countDocuments();

    const apiFeatures = new ApiFeatures(Transaction.find().sort({ $natural: -1 }), req.query).filter();
    let filteredTransactions = await apiFeatures.getQuery();
    let filteredTransactionsCount = filteredTransactions.length;

    apiFeatures.pagination(resultPerPage);
    filteredTransactions = await apiFeatures.getQuery().clone();

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        transactions: filteredTransactions,
        filteredTransactionsCount
    });
});

export const getUserTransactions = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler(`No User By Id ${id}`, 404));
    }

    const resultPerPage = 20;
    const count = await Transaction.countDocuments({ user: id });

    const apiFeatures = new ApiFeatures(Transaction.find({ user: id }).sort({ $natural: -1 }), req.query).filter();
    let filteredTransactions = await apiFeatures.getQuery();
    let filteredTransactionsCount = filteredTransactions.length;

    apiFeatures.pagination(resultPerPage);
    filteredTransactions = await apiFeatures.getQuery().clone();

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        transactions: filteredTransactions,
        filteredTransactionsCount
    });
});

export const getDonatorTransactions = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const donator = await Donator.findById(id);
    if (!donator) {
        return next(new ErrorHandler(`No User By Id ${id}`, 404));
    }

    const resultPerPage = 20;
    const count = await Transaction.countDocuments({ donator: id });

    const apiFeatures = new ApiFeatures(Transaction.find({ donator: id }).sort({ $natural: -1 }), req.query).filter();
    let filteredTransactions = await apiFeatures.getQuery();
    let filteredTransactionsCount = filteredTransactions.length;

    apiFeatures.pagination(resultPerPage);
    filteredTransactions = await apiFeatures.getQuery().clone();

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        transactions: filteredTransactions,
        filteredTransactionsCount
    });
});

export const getParticularTransaction = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const transaction = await Transaction.findById(id);
    if (!transaction) {
        return next(new ErrorHandler(`No Transaction By Id ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        transaction,
    });
});

export const updateTransaction = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const transaction = await Transaction.findById(id);
    if (!transaction) {
        return next(new ErrorHandler(`No Transaction By Id ${id}`, 404));
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

export const deleteTransaction = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const transaction = await Transaction.findById(id);
    if (!transaction) {
        return next(new ErrorHandler(`No Transaction By Id ${id}`, 404));
    }

    await Transaction.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Transaction deleted successfully",
    });
});