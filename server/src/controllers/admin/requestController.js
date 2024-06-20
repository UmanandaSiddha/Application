import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import { CLIENT_URL, instance } from "../../server.js";
import Plan, { planEnum } from "../../models/payment/planModel.js";
import CustomRequest from "../../models/messages/customRequestModel.js";
import User from "../../models/userModel.js";
import { addEmailToQueue } from "../../utils/queue/emailQueue.js";

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
