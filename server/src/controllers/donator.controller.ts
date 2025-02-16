import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import crypto from "crypto";
import short from "short-uuid";
import logger from "../config/logger.js";
import Donator from "../models/accounts/donator.model.js";
import { NextFunction, Request, Response } from "express";
import { EMAIL_OTP_VERIFICATION } from "../constants/template.js";
import sendMail from "../utils/services/send.mail.js";
import sendDonatorToken from "../utils/tokens/donator.token.js";
import { DonatorRequest } from "../middleware/donator.middleware.js";
import { instance } from "../index.js";
import Plan, { PlanEnum } from "../models/payment/plan.model.js";
import Subscription, { SubscriptionEnum } from "../models/payment/subscription.model.js";
import Transaction, { TransactionEnum } from "../models/payment/transaction.model.js";
import { addDonationToQueue } from "../utils/queue/donation.queue.js";
import { handleDonation } from "../utils/payment.js";
import ApiFeatures from "../utils/services/api.features.js";
import mongoose from "mongoose";

export const sendDonatorOTP = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;
    if (!email) {
        return next(new ErrorHandler("Please enter Email", 400));
    }
    let donator = await Donator.findOne({ email });
    if (!donator) {
        donator = await Donator.create({ email })
    }

    const otp = donator.getOneTimePassword();
    await donator.save({ validateBeforeSave: false });

    try {
        const options= {
            templateId: EMAIL_OTP_VERIFICATION,
            recieverEmail: donator.email,
            dynamicData: {
                otp: otp,
            }
        }
        await sendMail(options);

        res.status(200).json({
            success: true,
            message: `Email sent to ${donator.email} successfully`,
        });
    } catch (error: any) {
        donator.oneTimePassword = undefined;
        donator.oneTimeExpire = undefined;
        await donator.save({ validateBeforeSave: false });
        console.log(error);

        return next(new ErrorHandler(error.message, 500));
    }
});

export const loginDonator = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { otp, email } = req.body;
    if (!email || !otp) return next(new ErrorHandler("Please enter Email and And Otp", 400));

    const oneTimePassword = crypto
        .createHash("sha256")
        .update(otp.toString())
        .digest("hex");

    const donator = await Donator.findOne({
        email,
        oneTimePassword,
        oneTimeExpire: { $gt: Date.now() },
    });
    if (!donator) return next(new ErrorHandler("Email Veification OTP has Expired", 400));

    donator.oneTimePassword = undefined;
    donator.oneTimeExpire = undefined;
    await donator.save();

    sendDonatorToken(donator, 200, res);
});

export const getDonator = catchAsyncErrors(async (req: DonatorRequest, res: Response, next: NextFunction): Promise<void> => {
    const donator = await Donator.findById(req.donator?._id).populate("latestDonation", "planId status currentEnd");

    res.status(200).json({
        success: true,
        donator,
    });
});

export const createDonatorDetails = catchAsyncErrors(async (req: DonatorRequest, res: Response, next: NextFunction): Promise<void> => {
    const { name, phone, street, city, state, postalCode, country } = req.body;
    if (!name || !phone || !street || !city || !state || !postalCode || !country) {
        return next(new ErrorHandler("Please enter all the required fields", 400));
    }

    const updateData = {
        name,
        phone,
        address: {
            street,
            city,
            state,
            postalCode,
            country,
        },
    };

    const donator = await Donator.findByIdAndUpdate(
        req.donator?._id,
        updateData,
        { new: true, runValidators: true, useFindAndModify: false }
    )

    res.status(200).json({
        success: true,
        donator,
    });
});

export const createDonationPlan = catchAsyncErrors(async (req: DonatorRequest, res: Response, next: NextFunction): Promise<void> => {
    const { amount, period } = req.body;
    if (!amount || !period) {
        return next(new ErrorHandler("All fields are required", 404));
    };

    const donator = await Donator.findById(req.donator?._id);
    if (!donator) {
        return next(new ErrorHandler("Donator not found", 404));
    }
    
    const razorPlan = await instance.plans.create({
        period,
        interval: 1,
        item: {
            name: donator._id.toString(),
            amount: Number(amount) * 100,
            currency: "INR",
            description: `Donation Plan for ${donator._id}`,
        },
    });   
    if (!razorPlan) {
        return next(new ErrorHandler("Failed to create plan from backend", 404));
    }

    const plan = await Plan.create({
        name: donator._id,
        amount: Number(amount),
        description: `Donation Plan for ${donator._id}`,
        cards: 0,
        planType: PlanEnum.DONATOR,
        period,
        interval: 1,
        razorPlanId: razorPlan.id,
    });

    res.status(200).json({
        success: true,
        plan
    });
});

export const createSubscription = catchAsyncErrors(async (req: DonatorRequest, res: Response, next: NextFunction): Promise<void> => {
    const donator = await Donator.findById(req.donator?._id);
    if (!donator) {
        return next(new ErrorHandler("Donator not found", 404));
    }
    if (donator.latestDonation) {
        const existingSubscription = await Subscription.findById(donator.latestDonation);
        if (existingSubscription) {
            if (existingSubscription.status === "just_created") {
                await Subscription.findByIdAndDelete(donator.latestDonation);
            } else if (
                !["completed", "cancelled"].includes(existingSubscription.status) ||
                (existingSubscription.status === "cancelled" && existingSubscription.currentEnd > new Date(Date.now()))
            ) {
                return next(new ErrorHandler("You already have an active recurring Donation", 403));
            }
        }
    }

    const plan = await Plan.findOne({ razorPlanId: req.body.id });
    if (!plan) {
        return next(new ErrorHandler("Invalid Plan", 404));
    }

    const razorSubscription = await instance.subscriptions.create({
        plan_id: req.body.id,
        total_count: 12,
        quantity: 1,
        customer_notify: 0,
    });
    if (!razorSubscription) {
        return next(new ErrorHandler("Failed to create subscription", 404));
    }

    const subscription = await Subscription.create({
        planId: plan._id,
        razorSubscriptionId: razorSubscription.id,
        shortUrl: razorSubscription.short_url,
        status: "just_created",
        subscriptionType: SubscriptionEnum.DONATOR,
        donator: donator._id,
    });

    await Donator.findByIdAndUpdate(donator._id,
        { activeDonation: subscription._id },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        subscriptions_id: razorSubscription.id,
    });
});

export const createDonation = catchAsyncErrors(async (req: DonatorRequest, res: Response, next: NextFunction): Promise<void> => {
    const { amount, currency} = req.body;
    if (!amount || !currency) {
        return next(new ErrorHandler("All fields are required", 404));
    };

    const donator = await Donator.findById(req.donator?._id);
    if (!donator) {
        return next(new ErrorHandler("Donator not found", 404));
    }

    const order = await instance.orders.create({
        amount: Number(amount) * 100,
        currency: currency,
        receipt: `receipt_${short.generate()}`
    });
    if (!order) {
        return next(new ErrorHandler("Order Failed", 400));
    }

    await Transaction.create({
        amount: amount,
        status: "just_created",
        razorpayOrderId: order.id,
        razorpayPaymentId: "pending",
        transactionFor: SubscriptionEnum.DONATOR,
        transactionType: TransactionEnum.ONETIME,
        currency: req.body.currency,
        donator: donator._id,
    });

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        order,
    });
});

export const capturePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const webhookPayload = {
        header: req.headers['x-razorpay-signature'],
        dataPay: req.body
    }
    
    try {
        await addDonationToQueue(webhookPayload);
    } catch (error) {
        logger.error("Failed to put Subscription in Queue");
    }

    res.status(200).send('OK');
};

export const verifyPayment = catchAsyncErrors(async (req: DonatorRequest, res: Response, next: NextFunction): Promise<void> => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const toBe = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSigntaure = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
        .update(toBe.toString())
        .digest("hex")

    const payment = await instance.payments.fetch(razorpay_payment_id);
    if (!payment) {
        return next(new ErrorHandler("Payment Not Found", 404));
    }

    if (expectedSigntaure === razorpay_signature) {
        if (payment.status === "captured") {
            const donation = await Transaction.findOne({ razorpayOrderId: payment.order_id });
            if (donation) {
                await handleDonation(payment);
            }
        }
    } else {
        return next(new ErrorHandler("Payment Not Verified", 403));
    }

    res.status(200).json({
        success: true,
        paymentStatus: payment.status
    });
});

export const getDonatorSubscription = catchAsyncErrors(async (req: DonatorRequest, res: Response, next: NextFunction): Promise<void> => {
    const donator = await Donator.findById(req.donator?._id);
    if (!donator) {
        return next(new ErrorHandler("Donator not found", 404));
    }

    let subscription;
    if (donator.latestDonation) {
        subscription = await Subscription.findById(donator.latestDonation).populate("planId", "name amount");;
    }

    res.status(200).json({
        success: true,
        subscription
    });
});

export const getDonatorTransaction = catchAsyncErrors(async (req: DonatorRequest, res: Response, next: NextFunction): Promise<void> => {
    const resultPerPage = 20;
    const count = await Transaction.countDocuments();

    const donator = await Donator.findById(req.donator?._id);
    if (!donator) {
        return next(new ErrorHandler("Donator not found", 404));
    }

    const apiFeatures = new ApiFeatures(Transaction.find({ donator: donator._id }).sort({ $natural: -1 }), req.query).filter();
    let filteredTransaction = await apiFeatures.getQuery();
    let filteredTransactionCount = filteredTransaction.length;

    apiFeatures.pagination(resultPerPage);
    filteredTransaction = await apiFeatures.getQuery().clone();

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        transactions: filteredTransaction,
        filteredTransactionCount
    });
});

export const getParticularDonatorTransaction = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const transaction = await Transaction.findById(id);
    if (!transaction) {
        return next(new ErrorHandler("Transaction not found", 404));
    }
    if (transaction.transactionFor !== SubscriptionEnum.DONATOR) {
        return next(new ErrorHandler("Transaction not found", 403));
    }

    res.status(200).json({
        success: true,
        transaction,
    });
});

export const logoutDonator = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.cookie("donator_auth", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    })
});