import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import Donator from "../../models/donatorModel.js";
import Subscription from "../../models/payment/subscriptionModel.js";
import User from "../../models/userModel.js";
import ErrorHandler from "../../utils/errorHandler.js";
import ApiFeatures from "../../utils/services/apiFeatures.js";

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

    const resultPerPage = 5;
    const count = await Subscription.countDocuments({ user: user._id });

    const apiFeatures = new ApiFeatures(Subscription.find({ user: user._id }).sort({ $natural: -1 }), req.query).filter();
    let filteredSubscriptions = await apiFeatures.query;
    let filteredSubscriptionsCount = filteredSubscriptions.length;

    apiFeatures.pagination(resultPerPage);
    filteredSubscriptions = await apiFeatures.query.clone();

    return res.status(200).json({
        success: true,
        count,
        resultPerPage,
        subscriptions: filteredSubscriptions,
        filteredSubscriptionsCount
    });
});

export const getAllUserSubscriptions = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 5;
    const count = await Subscription.countDocuments();

    const apiFeatures = new ApiFeatures(Subscription.find().sort({ $natural: -1 }), req.query).filter();
    let filteredSubscriptions = await apiFeatures.query;
    let filteredSubscriptionsCount = filteredSubscriptions.length;

    apiFeatures.pagination(resultPerPage);
    filteredSubscriptions = await apiFeatures.query.clone();

    return res.status(200).json({
        success: true,
        count,
        resultPerPage,
        subscriptions: filteredSubscriptions,
        filteredSubscriptionsCount
    });
});

export const getParticularSubscription = catchAsyncErrors(async (req, res, next) => {
    const subscription = await Subscription.findById(req.params.id).populate("planId", "_id name amount");
    if (!subscription) {
        return next(new ErrorHandler(`Subscription does not exist with Id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        subscription,
    });
});

export const updateSubscription = catchAsyncErrors(async (req, res, next) => {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
        return next(new ErrorHandler(`Subscription does not exist with Id: ${req.params.id}`, 404));
    }

    const { status } = req.body;
    if (!status) {
        return next(new ErrorHandler("Please provide the status", 400));
    }
    if (status === subscription.status) {
        return next(new ErrorHandler("Status cannot be the same as the current status", 400));
    }

    const updatedSubscription = await Subscription.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        subscription: updatedSubscription,
        message: "Subscription status updated successfully",
    });
});

export const deleteSubscription = catchAsyncErrors(async (req, res, next) => {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
        return next(new ErrorHandler(`Subscription does not exist with Id: ${req.params.id}`, 404));
    }

    await Subscription.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Subscription deleted successfully",
    });
});

export const getDonatorLatestSubscription = catchAsyncErrors(async (req, res, next) => {
    const donator = await Donator.findById(req.params.id);
    if (!donator) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    const subscription = await Subscription.findById(donator.activeDonation).populate("planId", "_id name amount");
    if (!subscription) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        subscription,
    });
});

export const getDonatorSubscriptions = catchAsyncErrors(async (req, res, next) => {
    const donator = await Donator.findById(req.params.id);
    if (!donator) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }

    const resultPerPage = 5;
    const count = await Subscription.countDocuments({ donator: donator._id });

    const apiFeatures = new ApiFeatures(Subscription.find({ donator: donator._id }).sort({ $natural: -1 }), req.query).filter();
    let filteredSubscriptions = await apiFeatures.query;
    let filteredSubscriptionsCount = filteredSubscriptions.length;

    apiFeatures.pagination(resultPerPage);
    filteredSubscriptions = await apiFeatures.query.clone();

    return res.status(200).json({
        success: true,
        count,
        resultPerPage,
        subscriptions: filteredSubscriptions,
        filteredSubscriptionsCount
    });
});