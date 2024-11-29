import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import { CLIENT_URL, instance } from "../../server.js";
import Plan, { planEnum } from "../../models/payment/planModel.js";
import CustomRequest, { acceptedEnum } from "../../models/messages/customRequestModel.js";
import User from "../../models/userModel.js";
import ApiFeatures from "../../utils/services/apiFeatures.js";
import { EMAIL_REPLY_CUSTOM_PLAN } from "../../constants/index.js";
import sendMail from "../../utils/services/sendMail.js";

export const createCustomPlan = catchAsyncErrors(async (req, res, next) => {
    const { period, interval, userId, amount, cards } = req.body;
    if (!period || !interval || !amount || !cards || !userId) {
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
        const options= {
            templateId: EMAIL_REPLY_CUSTOM_PLAN,
            recieverEmail: user.email,
            dynamicData: {
                status: "Accepted",
                link: `${CLIENT_URL}/view-custom?id=${plan._id}&user=${user._id}`,
            }
        }
        await sendMail(options);
    } catch (error) {
        console.log(error.message);
    }

    const newRequest = await CustomRequest.findByIdAndUpdate(
        req.params.id, 
        { attended: true, accepted: acceptedEnum.ACCEPTED, reason: plan._id }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        request: newRequest,
    });
});

export const getAllCustomRequests = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 20;
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
    const request = await CustomRequest.findById(req.params.id).populate("user", "name email");
    if (!request) {
        return next(new ErrorHandler("Request not found", 404));
    }

    res.status(200).json({
        success: true,
        request,
    });
});

export const deleteRequest = catchAsyncErrors(async (req, res, next) => {
    const request = await CustomRequest.findById(req.params.id);
    if (!request) {
        return next(new ErrorHandler("Request not found", 404));
    }

    await CustomRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Request deleted successfully"
    });
});

export const attendCustomRequests = catchAsyncErrors(async (req, res, next) => {
    const request = await CustomRequest.findById(req.params.id);
    if (!request) {
        return next(new ErrorHandler("Request not found", 404));
    }

    const { status, reason } = req.body;
    if (!status || !reason) {
        return next(new ErrorHandler("Status and reason are required", 400));
    }

    if (!Object.values(acceptedEnum).includes(status)) {
        return next(new ErrorHandler("Invalid Status", 400));
    }

    const newRequest = await CustomRequest.findByIdAndUpdate(
        req.params.id, 
        { attended: true, accepted: status, reason }, 
        { new: true, runValidators: true, useFindAndModify: false }
    ).populate("user", "name email");

    res.status(200).json({
        success: true,
        request: newRequest,
        message: `Request successfully attended`
    });
});

export const rejectCustomPlan = catchAsyncErrors(async (req, res, next) => {
    const { userId, reason } = req.body;
    if (!userId || !reason) {
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
    if (customRequest.accepted === acceptedEnum.ACCEPTED) {
        return next(new ErrorHandler("Custom Request already accepted cannot be rejected", 400));
    }

    try {
        const options= {
            templateId: EMAIL_REPLY_CUSTOM_PLAN,
            recieverEmail: user.email,
            dynamicData: {
                status: "Rejected",
                reason: reason
            }
        }
        await sendMail(options);
    } catch (error) {
        console.log(error.message);
    }

    const newRequest = await CustomRequest.findByIdAndUpdate(
        req.params.id, 
        { attended: true, accepted: acceptedEnum.REJECTED, reason }, 
        { new: true, runValidators: true, useFindAndModify: false }
    ).populate("user", "name email");

    res.status(200).json({
        success: true,
        request: newRequest,
        message: "Request rejected successfully"
    });
});
