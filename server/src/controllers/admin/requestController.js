import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import { CLIENT_URL, instance } from "../../server.js";
import Plan, { planEnum } from "../../models/payment/planModel.js";
import CustomRequest from "../../models/messages/customRequestModel.js";
import User from "../../models/userModel.js";
import { addEmailToQueue } from "../../utils/queue/emailQueue.js";
import ApiFeatures from "../../utils/services/apiFeatures.js";

export const createCustomPlan = catchAsyncErrors(async (req, res, next) => {
    const { period, interval, userId, amount, cards } = req.body;
    if (!period || !interval || amount || cards || userId) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${userId}`, 404));
    }

    const customRequest = await CustomRequest.findById(req.params.id);
    if (!customRequest) {
        return next(new ErrorHandler(`Custom Request does not exist with Id: ${req.params.id}`, 404));
    }

    const razorPlan = await instance.plans.create({
        period,
        interval,
        item: {
            name: userId,
            amount: Number(amount) * 100,
            currency: "INR",
            description: `Custom Plan for ${userId}`
        },
    });
    if (!razorPlan) {
        return next(new ErrorHandler("Failed to create plan", 500));
    }

    const plan = await Plan.create({
        name: userId,
        amount: Number(amount),
        description: `Custom Plan for ${userId}`,
        cards: Number(cards),
        planType: planEnum.CUSTOM,
        period,
        interval: Number(interval),
        razorPlanId: razorPlan.id,
    });

    try {
        await addEmailToQueue({
            email: user.email,
            subject: `Custom Plan Request Accepted`,
            message: `http://${CLIENT_URL}/custom-plan?id=${plan._id}&user=${user._id}`,
        });
    } catch (error) {
        console.log(error.message);
    }

    await CustomRequest.findByIdAndUpdate(
        req.params.id, 
        { attended: true, "status.accepted": true }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        plan
    });
});

export const getAllCustomRequests = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 5;
    const count = await CustomRequest.countDocuments();

    const apiFeatures = new ApiFeatures(CustomRequest.find().sort({ $natural: -1 }), req.query).filter();
    let filteredRequests = await apiFeatures.query;
    let filteredRequestsCount = filteredRequests.length;

    apiFeatures.pagination(resultPerPage);
    filteredRequests = await apiFeatures.query.clone();

    return res.status(200).json({
        success: true,
        count,
        resultPerPage,
        requests: filteredRequests,
        filteredRequestsCount
    });
});

export const getParticularRequest = catchAsyncErrors(async (req, res, next) => {
    const request = await CustomRequest.findById(req.params.id);
    if (!request) {
        return next(new ErrorHandler("Request not found", 404));
    }

    res.status(200).json({
        success: true,
        request,
    });
});

export const attendCustomRequests = catchAsyncErrors(async (req, res, next) => {
    const request = await CustomRequest.findById(req.params.id);
    if (!request) {
        return next(new ErrorHandler("Request not found", 404));
    }

    const { status, reason } = req.body;
    if (!status ||!reason) {
        return next(new ErrorHandler("Status and reason are required", 400));
    }

    await CustomRequest.findByIdAndUpdate(
        req.params.id, 
        { attended: true, "status.accepted": Boolean(status), "status.reason": reason }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: `Request successfully attended`
    });
});

export const rejectCustomPlan = catchAsyncErrors(async (req, res, next) => {
    const { cards, amount, period, interval, userId, reason } = req.body;
    if (!cards || !amount || !period || !interval || !userId || !reason) {
        return next(new ErrorHandler("All fields are required", 404));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${userId}`, 404));
    }

    const customRequest = await CustomRequest.findById(req.params.id);
    if (!customRequest) {
        return next(new ErrorHandler(`Custom Request does not exist with Id: ${req.params.id}`, 404));
    }

    const data = {
        cards,
        amount,
        period,
        interval
    }
    
    try {
        await addEmailToQueue({
            email: user.email,
            subject: `Custom Plan Request Rejected`,
            message: `Requested Custom Plan is rejected for ${JSON.stringify(data)}. Reason - ${reason}`,
        });
    } catch (error) {
        console.log(error.message);
    }

    await CustomRequest.findByIdAndUpdate(
        req.params.id, 
        { attended: true, "status.accepted": false, "status.reason": reason }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: `Email Sent for Rejection`
    });
});
