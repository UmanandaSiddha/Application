import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import CustomRequest, { AcceptedEnum } from "../models/messages/custom.request.model.js";
import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../middleware/auth.middleware.js";
import { EMAIL_REQUEST_CUSTOM_PLAN } from "../constants/template.js";
import sendMail from "../utils/services/send.mail.js";
import Plan, { PlanEnum } from "../models/payment/plan.model.js";

export const requestCustomPlan = catchAsyncErrors(async  (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { email, cards, comment, period, interval } = req.body;
    if (!email || !cards || !comment || !period || !interval) return next(new ErrorHandler("All fields are required", 404));

    const newRequest = await CustomRequest.create({
        email,
        cards: Number(cards),
        accepted: AcceptedEnum.PENDING,
        comment,
        period,
        interval: Number(interval),
        user: req.user?._id,
    });

    try {
        const options = {
            templateId: EMAIL_REQUEST_CUSTOM_PLAN,
            recieverEmail: process.env.ADMIN_EMAIL as string,
            dynamicData: {
                email: email,
                cards: cards,
                comment: comment,
                period: period,
                interval: interval,
                link: `https://admin.voolata.com/requests/details?id=${newRequest._id}`
            }
        }
        await sendMail(options);
    } catch (error: any) {
        console.log(error.message);
    }

    res.status(200).json({
        success: true,
        newRequest
    });
});

export const getCustomPlan = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    if (plan.planType !== PlanEnum.CUSTOM) return next(new ErrorHandler(`Plan ${req.params.id} is not a Custom Plan`, 403));
    if (plan.name !== req.query.user) return next(new ErrorHandler(`Plan mismatch`, 403));
    
    res.status(200).json({
        success: true,
        plan
    });
});

export const getAllPlans = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const plans = await Plan.find({ visible: true, planType: { $ne: PlanEnum.CUSTOM }});

    res.status(200).json({
        success: true,
        plans
    });
});

export const getPlan = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    if (plan.planType === PlanEnum.CUSTOM) return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));

    res.status(200).json({
        success: true,
        plan
    });
});