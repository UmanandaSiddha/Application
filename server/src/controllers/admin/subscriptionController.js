import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import Subscription from "../../models/payment/subscriptionModel.js";
import User from "../../models/userModel.js";
import ErrorHandler from "../../utils/errorHandler.js";

export const getUserLatestSubscription = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    const subscription = await Subscription.findById(user.activePlan).populate("planId", "_id name amount");
    if (!subscription) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        subscription,
    });
});

export const getUserSubscriptions = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    const subscriptions = await Subscription.find({ user: user._id });

    res.status(200).json({
        success: true,
        subscriptions,
    });
});

export const getParticularSubscription = catchAsyncErrors(async (req, res, next) => {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
        return next(new ErrorHandler(`Subscription does not exist with Id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        subscription,
    });
});

export const updateSubscription = catchAsyncErrors(async (req, res, next) => {

});

export const deleteSubscription = catchAsyncErrors(async (req, res, next) => {

});

export const getDonatorLatestSubscription = catchAsyncErrors(async (req, res, next) => {

});

export const getDonatorSubscriptions = catchAsyncErrors(async (req, res, next) => {

});