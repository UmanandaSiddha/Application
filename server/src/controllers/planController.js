import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Plan, { planEnum } from "../models/payment/planModel.js";
import CustomRequest, { acceptedEnum } from "../models/messages/customRequestModel.js";
import { EMAIL_REQUEST_CUSTOM_PLAN } from "../constants/index.js";
import sendMail from "../utils/services/sendMail.js";

export const requestCustomPlan = catchAsyncErrors(async (req, res, next) => {
    const { email, cards, amount, comment, period, interval } = req.body;
    if (!email || !cards || !amount || !comment || !period || !interval) {
        return next(new ErrorHandler("All fields are required", 404));
    }

    const newRequest = await CustomRequest.create({
        email,
        cards: Number(cards),
        amount: Number(amount),
        accepted: acceptedEnum.PENDING,
        comment,
        period,
        interval: Number(interval),
        user: req.user.id,
    });

    try {
        const options= {
            templateId: EMAIL_REQUEST_CUSTOM_PLAN,
            recieverEmail: process.env.ADMIN_EMAIL,
            dynamicData: {
                email: email,
                cards: cards,
                amount: amount,
                comment: comment,
                period: period,
                interval: interval,
                link: `https://admin.voolata.com/requests/details?id=${newRequest._id}`
            }
        }
        await sendMail(options);
    } catch (error) {
        console.log(error.message);
    }

    res.status(200).json({
        success: true,
        newRequest
    });
});

export const getCustomPlan = catchAsyncErrors(async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
        return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    }
    if (plan.planType !== planEnum.CUSTOM) {
        return next(new ErrorHandler(`Plan ${req.params.id} is not a Custom Plan`, 403));
    }
    if (plan.name !== req.query.user) {
        return next(new ErrorHandler(`Plan mismatch`, 403));
    }
    
    res.status(200).json({
        success: true,
        plan
    });
});

export const getAllPlans = catchAsyncErrors( async (req, res, next) => {
    const plans = await Plan.find({ visible: true, planType: { $ne: planEnum.CUSTOM }});

    res.status(200).json({
        success: true,
        plans
    });
});

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