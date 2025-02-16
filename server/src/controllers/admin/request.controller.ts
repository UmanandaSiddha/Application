import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import User from "../../models/accounts/user.model.js";
import CustomRequest, { AcceptedEnum } from "../../models/messages/custom.request.model.js";
import { CLIENT_URL, instance } from "../../index.js";
import { NextFunction, Request, Response } from "express";
import Plan, { PlanEnum } from "../../models/payment/plan.model.js";
import { EMAIL_REPLY_CUSTOM_PLAN } from "../../constants/template.js";
import sendMail from "../../utils/services/send.mail.js";
import mongoose from "mongoose";
import ApiFeatures from "../../utils/services/api.features.js";

export const createCustomPlan = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { period, interval, userId, amount, cards } = req.body;
    if (!period || !interval || !amount || !cards || !userId) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${userId}`, 404));
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const customRequest = await CustomRequest.findById(id);
    if (!customRequest) {
        return next(new ErrorHandler(`Custom Request does not exist with Id: ${id}`, 404));
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
        planType: PlanEnum.CUSTOM,
        period,
        interval: Number(interval),
        razorPlanId: razorPlan.id,
    });

    try {
        const options= {
            templateId: EMAIL_REPLY_CUSTOM_PLAN,
            recieverEmail: user.profile.email,
            dynamicData: {
                status: "Accepted",
                link: `${CLIENT_URL}/view-custom?id=${plan._id}&user=${user._id}`,
            }
        }
        await sendMail(options);
    } catch (error: any) {
        console.log(error.message);
    }

    const newRequest = await CustomRequest.findByIdAndUpdate(
        req.params.id, 
        { attended: true, accepted: AcceptedEnum.ACCEPTED, reason: plan._id }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        request: newRequest,
    });
});

export const getAllCustomRequests = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const resultPerPage = 20;
    const count = await CustomRequest.countDocuments();

    const apiFeatures = new ApiFeatures(CustomRequest.find().sort({ $natural: -1 }), req.query).filter();
    let filteredRequests = await apiFeatures.getQuery();
    let filteredRequestsCount = filteredRequests.length;

    apiFeatures.pagination(resultPerPage);
    filteredRequests = await apiFeatures.getQuery().clone();

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        requests: filteredRequests,
        filteredRequestsCount
    });
});

export const getParticularRequest = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const request = await CustomRequest.findById(id).populate("user", "name email");
    if (!request) {
        return next(new ErrorHandler("Request not found", 404));
    }

    res.status(200).json({
        success: true,
        request,
    });
});

export const deleteRequest = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const request = await CustomRequest.findById(id);
    if (!request) {
        return next(new ErrorHandler("Request not found", 404));
    }

    await CustomRequest.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Request deleted successfully"
    });
});

export const attendCustomRequests = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const request = await CustomRequest.findById(id);
    if (!request) {
        return next(new ErrorHandler("Request not found", 404));
    }

    const { status, reason } = req.body;
    if (!status || !reason) {
        return next(new ErrorHandler("Status and reason are required", 400));
    }

    if (!Object.values(AcceptedEnum).includes(status)) {
        return next(new ErrorHandler("Invalid Status", 400));
    }

    const newRequest = await CustomRequest.findByIdAndUpdate(
        id, 
        { attended: true, accepted: status, reason }, 
        { new: true, runValidators: true, useFindAndModify: false }
    ).populate("user", "name email");

    res.status(200).json({
        success: true,
        request: newRequest,
        message: `Request successfully attended`
    });
});

export const rejectCustomPlan = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId, reason } = req.body;
    if (!userId || !reason) {
        return next(new ErrorHandler("All fields are required", 404));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${userId}`, 404));
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const customRequest = await CustomRequest.findById(id);
    if (!customRequest) {
        return next(new ErrorHandler(`Custom Request does not exist with Id: ${id}`, 404));
    }
    if (customRequest.accepted === AcceptedEnum.ACCEPTED) {
        return next(new ErrorHandler("Custom Request already accepted cannot be rejected", 400));
    }

    try {
        const options= {
            templateId: EMAIL_REPLY_CUSTOM_PLAN,
            recieverEmail: user.profile.email,
            dynamicData: {
                status: "Rejected",
                reason: reason
            }
        }
        await sendMail(options);
    } catch (error: any) {
        console.log(error.message);
    }

    const newRequest = await CustomRequest.findByIdAndUpdate(
        req.params.id, 
        { attended: true, accepted: AcceptedEnum.REJECTED, reason }, 
        { new: true, runValidators: true, useFindAndModify: false }
    ).populate("user", "name email");

    res.status(200).json({
        success: true,
        request: newRequest,
        message: "Request rejected successfully"
    });
});
