import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import { CLIENT_URL, instance } from "../server.js";
import Plan, { planEnum } from "../models/payment/planModel.js";
import CustomRequest from "../models/messages/customRequestModel.js";
import User from "../models/userModel.js";
import { addEmailToQueue } from "../utils/queue/emailQueue.js";

// admin
export const createPlan = catchAsyncErrors(async (req, res, next) => {
    const razorPlan = await instance.plans.create({
        period: req.body.period,
        interval: req.body.interval,
        item: {
            name: req.body.name,
            amount: Number(req.body.amount) * 100,
            currency: "INR",
            description: req.body.description
        },
    });

    if (!razorPlan) {
        return next(new ErrorHandler("Failed to create plan", 500));
    }

    const plan = await Plan.create({
        name: req.body.name,
        amount: Number(req.body.amount),
        description: req.body.description,
        cards: Number(req.body.cards),
        planType: req.body.planType,
        period: req.body.period,
        interval: Number(req.body.interval),
        razorPlanId: razorPlan.id,
    });

    res.status(200).json({
        success: true,
        plan
    });
});

// Admin
export const createFreePlan = catchAsyncErrors(async (req, res, next) => {
    const plan = await Plan.create({
        name: req.body.name,
        amount: 0,
        description: req.body.description,
        cards: Number(req.body.cards),
        planType: planEnum.FREE,
        visible: false,
        period: req.body.period,
        interval: Number(req.body.interval),
    });

    res.status(200).json({
        success: true,
        plan
    });
});

// Admin
export const updateFreePlan = catchAsyncErrors(async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
        return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    }

    await Plan.findByIdAndUpdate(
        req.params.id, 
        { 
            name: req.body.name,
            description: req.body.description,
            cards: Number(req.body.cards),
            period: req.body.period,
            interval: Number(req.body.interval),
        }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: `Free Plan Updated`,
    });
});

// Admin
export const switchFreePlanVisibility = catchAsyncErrors(async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
        return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    }

    await Plan.findByIdAndUpdate(
        req.params.id, 
        { visible: !plan.visible }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: `Free Plan Updated`,
    });
});

// user
export const requestCustomPlan = catchAsyncErrors(async (req, res, next) => {
    const newRequest = await CustomRequest.create({
        email: req.body.email,
        cards: Number(req.body.cards),
        amount: Number(req.body.amount),
        comment: req.body.comment,
        period: req.body.period,
        interval: Number(req.body.interval),
        user: req.user.id,
    });

    const message = `Request for ${newRequest}`;

    try {
        await addEmailToQueue({
            email: process.env.ADMIN_EMAIL,
            subject: `New Custom Plan Request`,
            message,
        });
    } catch (error) {
        console.log(error.message);
    }

    res.status(200).json({
        success: true,
        newRequest
    });
});

// Admin
export const createCustomPlan = catchAsyncErrors(async (req, res, next) => {
    const razorPlan = await instance.plans.create({
        period: req.body.period,
        interval: req.body.interval,
        item: {
            name: req.body.user,
            amount: Number(req.body.amount) * 100,
            currency: "INR",
            description: `Custom Plan for ${req.body.user}`
        },
    });

    if (!razorPlan) {
        return next(new ErrorHandler("Failed to create plan", 500));
    }

    const plan = await Plan.create({
        name: req.body.user,
        amount: Number(req.body.amount),
        description: `Custom Plan for ${req.body.user}`,
        cards: Number(req.body.cards),
        planType: planEnum.CUSTOM,
        period: req.body.period,
        interval: Number(req.body.interval),
        razorPlanId: razorPlan.id,
    });

    const user = await User.findById(req.body.user);

    try {
        await addEmailToQueue({
            email: user.email,
            subject: req.params.id? `Custom Plan Request Accepted` : `Custom Plan For ${req.body.user}`,
            message: `http://${CLIENT_URL}/custom-plan?id=${plan._id}&user=${user._id}`,
        });
    } catch (error) {
        console.log(error.message);
    }

    if (req.params.id) {
        await CustomRequest.findByIdAndUpdate(
            req.params.id, 
            { attended: true, "status.accepted": true }, 
            { new: true, runValidators: true, useFindAndModify: false }
        );
    }

    res.status(200).json({
        success: true,
        plan
    });
});

// admin
export const attendCustomRequests = catchAsyncErrors(async (rqe, res, next) => {
    await CustomRequest.findByIdAndUpdate(
        req.params.id, 
        { attended: true, "status.accepted": Boolean(req.body.status), "status.reason": req.body.reason }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: `Request successfully attended`
    });
});

// admin
export const rejectCustomPlan = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.body.user);

    const data = {
        card: req.body.cards,
        amount: req.body.amount,
        period: req.body.period,
        interval: req.body.interval
    }
    
    try {
        await addEmailToQueue({
            email: user.email,
            subject: `Custom Plan Request Rejected`,
            message: `Requested Custom Plan is rejected for ${data}. Reason - ${req.body.reason}`,
        });
    } catch (error) {
        console.log(error.message);
    }

    await CustomRequest.findByIdAndUpdate(
        req.params.id, 
        { attended: true, "status.accepted": false, "status.reason": req.body.reason }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: `Email Sent for Rejection`
    });
});

// user
export const getCustomPlan = catchAsyncErrors(async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
        return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    }

    if (plan.planType !== planEnum.CUSTOM) {
        return next(new ErrorHandler(`Plan ${req.params.id} is not a Custom Plan`, 403));
    }

    if (plan.name !== req.params.user) {
        return next(new ErrorHandler(`Plan mismatch`, 403));
    }
    
    res.status(200).json({
        success: true,
        plan
    });
});

export const deletePlan = catchAsyncErrors( async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
        return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    };

    await Plan.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: `Plan deleted`,
    });
});

// user
export const getAllPlans = catchAsyncErrors( async (req, res, next) => {
    const plans = await Plan.find({ visible: true, planType: { $ne: planEnum.CUSTOM }});
    const planCount = await Plan.countDocuments({ visible: true, planType: { $ne: planEnum.CUSTOM }});

    res.status(200).json({
        success: true,
        count: planCount,
        plans
    });
});

// user
export const getPlan = catchAsyncErrors( async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
        return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    };

    if (plan.planType === planEnum.CUSTOM) {
        return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        plan
    });
});