import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import crypto from "crypto";
import { instance } from "../server.js";
import short from "short-uuid";
import Donator from "../models/donatorModel.js";
import Transaction, { transactionEnum } from "../models/payment/transactionModel.js";
import sendDonatorToken from "../utils/tokens/donatorToken.js";
import Subscription, { subscriptionEnum } from "../models/payment/subscriptionModel.js";
import Plan, { planEnum } from "../models/payment/planModel.js";
import { addDonationToQueue } from "../utils/queue/donationQueue.js";
import logger from "../config/logger.js";
import { addEmailToQueue } from "../utils/queue/emailQueue.js";
import { handleDonation } from "../common/payment.js";
import ApiFeatures from "../utils/services/apiFeatures.js";

export const sendDonatorOTP = catchAsyncErrors(async (req, res, next) => {
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

    const message = `Email verification OTP fro donation ( valid for 15 minutes ) :- \n\n ${otp} \n\n Please ignore if you didn't requested this email.`;

    try {
        await addEmailToQueue({
            email: donator.email,
            subject: `Email Veification`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${donator.email} successfully`,
        });
    } catch (error) {
        donator.oneTimePassword = undefined;
        donator.oneTimeExpire = undefined;

        await donator.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

export const loginDonator = catchAsyncErrors(async (req, res, next) => {
    const { otp, email } = req.body;
    if (!email || !otp) {
        return next(new ErrorHandler("Please enter Email and And Otp", 400));
    }

    const oneTimePassword = crypto
        .createHash("sha256")
        .update(otp.toString())
        .digest("hex");

    const donator = await Donator.findOne({
        email,
        oneTimePassword,
        oneTimeExpire: { $gt: Date.now() },
    });
    if (!donator) {
        return next(new ErrorHandler("Email Veification OTP has Expired", 400));
    }

    donator.oneTimePassword = undefined;
    donator.oneTimeExpire = undefined;

    await donator.save();

    sendDonatorToken(donator, 200, res);
});

export const getDonator = catchAsyncErrors(async (req, res, next) => {
    const donator = await Donator.findById(req.donator._id).populate("activeDonation", "planId status currentEnd");

    res.status(200).json({
        success: true,
        donator,
    });
});

export const createDonatorDetails = catchAsyncErrors(async (req, res, next) => {
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

    if (req.body.pan !== null) {
        updateData.pan = req.body.pan;
    }

    const donator = await Donator.findByIdAndUpdate(
        req.donator.id,
        updateData,
        { new: true, runValidators: true, useFindAndModify: false }
    )

    res.status(200).json({
        success: true,
        donator,
    });
});

export const updatePanDetail = catchAsyncErrors(async (req, res, next) => {
    if (!req.body.pan) {
        return next(new ErrorHandler("Pan is required", 400));
    }

    const donator = await Donator.findById(req.donator.id);
    if (donator.pan) {
        return next(new ErrorHandler("Pan is already there", 500));
    }

    const updatedDonator = await Donator.findByIdAndUpdate(
        req.donator.id,
        { pan: req.body.pan },
        { new: true, runValidators: true, useFindAndModify: false }
    )

    res.status(200).json({
        success: true,
        updatedDonator,
    });
});

export const createDonationPlan = catchAsyncErrors(async (req, res, next) => {
    const { amount, period } = req.body;
    if (!amount || !period) {
        return next(new ErrorHandler("All fields are required", 404));
    };
    
    const razorPlan = await instance.plans.create({
        period,
        interval: 1,
        item: {
            name: req.donator.id,
            amount: Number(amount) * 100,
            currency: "INR",
            description: `Donation Plan for ${req.donator.id}`,
        },
    });   
    if (!razorPlan) {
        return next(new ErrorHandler("Failed to create plan from backend", 404));
    }

    const plan = await Plan.create({
        name: req.donator.id,
        amount: Number(amount),
        description: `Donation Plan for ${req.donator.id}`,
        cards: 0,
        planType: planEnum.DONATOR,
        period,
        interval: 1,
        razorPlanId: razorPlan.id,
    });

    res.status(200).json({
        success: true,
        plan
    });
});

export const createSubscription = catchAsyncErrors(async (req, res, next) => {
    const donator = await Donator.findById(req.donator.id);
    if (donator?.activeDonation) {
        const existingSubscription = await Subscription.findById(donator.activeDonation);
        if (existingSubscription) {
            if (existingSubscription.status === "just_created") {
                await Subscription.findByIdAndDelete(donator.activeDonation);
            } else if (
                !["completed", "cancelled"].includes(existingSubscription.status) ||
                (existingSubscription.status === "cancelled" && existingSubscription.currentEnd > Date.now())
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
        subscriptionType: subscriptionEnum.DONATOR,
        donator: req.donator.id,
    });

    await Donator.findByIdAndUpdate(req.donator.id,
        { activeDonation: subscription._id },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        subscriptions_id: razorSubscription.id,
    });
});

export const createDonation = catchAsyncErrors(async (req, res, next) => {
    const { amount, currency} = req.body;
    if (!amount || !currency) {
        return next(new ErrorHandler("All fields are required", 404));
    };

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
        transactionFor: subscriptionEnum.DONATOR,
        transactionType: transactionEnum.ONETIME,
        currency: req.body.currency,
        donator: req.donator.id,
    });

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        order,
    });
});

export const capturePayment = async (req, res, next) => {
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

export const verifyPayment = catchAsyncErrors(async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const toBe = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSigntaure = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
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

export const getDonatorSubscription = catchAsyncErrors(async (req, res, next) => {
    const donator = await Donator.findById(req.donator.id);

    let subscription;
    if (donator?.activeDonation) {
        subscription = await Subscription.findById(donator.activeDonation).populate("planId", "_id name amount");;
    }

    res.status(200).json({
        success: true,
        subscription
    });
});

export const getDonatorTransaction = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 20;
    const count = await Transaction.countDocuments();

    const apiFeatures = new ApiFeatures(Transaction.find({ donator: req.donator.id }).select("createdAt end paymentMethod razorpayPaymentId amount status").sort({ $natural: -1 }), req.query).filter();
    let filteredTransaction = await apiFeatures.query;
    let filteredTransactionCount = filteredTransaction.length;

    apiFeatures.pagination(resultPerPage);
    filteredTransaction = await apiFeatures.query.clone();

    return res.status(200).json({
        success: true,
        count,
        resultPerPage,
        filteredTransaction,
        filteredTransactionCount
    });
});

export const getParticularDonatorTransaction = catchAsyncErrors(async (req, res, next) => {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction.transactionFor !== subscriptionEnum.DONATOR) {
        return next(new ErrorHandler("Transaction not found", 403));
    }

    res.status(200).json({
        success: true,
        transaction,
    });
});

export const logoutDonator = catchAsyncErrors(async (req, res, next) => {
    res.cookie("donator_auth", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    })
});