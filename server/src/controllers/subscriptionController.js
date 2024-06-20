import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import { instance } from "../server.js";
import Plan, { periodEnum } from "../models/payment/planModel.js";
import crypto from "crypto";
import Subscription, { subscriptionEnum } from "../models/payment/subscriptionModel.js";
import Transaction from "../models/payment/transactionModel.js";
import User, { roleEnum } from "../models/userModel.js";
import logger from "../config/logger.js";
import { handleSubscription, handleTransaction } from "../common/payment.js";
import { addSubscriptionToQueue } from "../utils/queue/subscriptionQueue.js";

export const createSubscription = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    if (user.role === roleEnum.ADMIN) {
        return next(new ErrorHandler("Admin don't need to buy Plans", 403));
    }

    if (user?.freePlan?.status) {
        return next(new ErrorHandler("You already have active Plan 1", 403));
    }

    if (user?.activePlan) {
        const subscription = await Subscription.findById(user?.activePlan);
        if (subscription) {
            if (subscription?.status === "just_created") {
                await Subscription.findByIdAndDelete(user?.activePlan);
            } else if (!["completed", "cancelled"].includes(subscription?.status) || (subscription?.status === "cancelled" && subscription?.currentEnd > Date.now())) {
                return next(new ErrorHandler("You already have active Plan 2", 403));
            }
        }
    }

    const subscriptions = await instance.subscriptions.create({
        plan_id: req.body.id,
        total_count: 12,
        quantity: 1,
        customer_notify: 0,
    });

    const plan = await Plan.findOne({ razorPlanId: req.body.id });

    const subscription = await Subscription.create({
        planId: plan._id,
        razorSubscriptionId: subscriptions.id,
        start: 0,
        end: 0,
        currentStart: 0,
        currentEnd: 0,
        nextBilling: 0,
        totalCount: 0,
        paidCount: 0,
        remainingCount: 0,
        shortUrl: subscriptions.short_url,
        status: "just_created",
        subscriptionType: subscriptionEnum.USER,
        user: req.user.id,
    });

    await User.findByIdAndUpdate(req.user.id,
        { activePlan: subscription._id, "cards.total": plan.cards },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        subscriptions_id: subscriptions.id,
    });
});

export const createFreeSubscription = catchAsyncErrors(async (req, res, next) => {
    const plan = Plan.findById(req.params.id);
    if (!plan.visible) {
        return next(new ErrorHandler("Plan not available", 404));
    }

    let endDate;
    switch (periodEnum) {
        case periodEnum.DAILY:
            endDate = 1
            break;
        case periodEnum.WEEKLY:
            endDate = 7
            break;
        case periodEnum.MONTHLY:
            endDate = 30
            break;
        case periodEnum.YEARLY:
            endDate = 365
            break;
        default:
            endDate = 1
            break;
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            freePlan: {
                status: true,
                type: freeEnum.CUSTOM,
                start: new Date(Date.now()),
                end: new Date(Date.now() + (plan.interval * endDate * 24 * 60 * 60 * 1000)),
            },
            cards: {
                total: plan.cards
            }
        },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    if (!updatedUser) {
        return next(new ErrorHandler(`Failed to update user with Id: ${req.params.id}`, 500));
    }

    res.status(200).json({
        success: true,
        user: updatedUser,
    });
});

export const captureSubscription = catchAsyncErrors(async (req, res, next) => {
    const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = req.body;
    const toBe = razorpay_payment_id + "|" + razorpay_subscription_id;

    const expectedSigntaure = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(toBe.toString())
        .digest("hex")

    const payment = await instance.payments.fetch(razorpay_payment_id);
    const subscription = await instance.subscriptions.fetch(razorpay_subscription_id);
    console.log(subscription);
    console.log(payment);

    if (expectedSigntaure === razorpay_signature) {
        if (["active", "created", "authenticated", "activated"].includes(subscription.status) && ["authorized", "captured", "created"].includes(payment.status)) {
            const subscriptionx = await Subscription.findOne({ razorSubscriptionId: subscription.id });

            await handleSubscription(subscription, subscriptionx);

            const checkPayment = await Transaction.findOne({ razorpayPaymentId: payment.id });
            if (!checkPayment) {
                await handleTransaction(payment, subscription, subscriptionx);
            }
        }
    } else {
        return next(new ErrorHandler("Payment Not Verified", 403));
    }

    res.status(200).json({
        success: true,
        subscriptionStatus: subscription.status,
        paymentStatus: payment.status,
    });
});

export const verifySubscription = async (req, res) => {

    const webhookPayload = {
        header: req.headers['x-razorpay-signature'],
        dataSub: req.body
    }

    try {
        await addSubscriptionToQueue(webhookPayload);
    } catch (error) {
        logger.error("Failed to put Subscription in Queue");
    }

    res.status(200).send('OK');
};

export const cancelSubscription = catchAsyncErrors(async (req, res, next) => {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
        return next(new ErrorHandler("No Subscription is found", 404));
    }

    if (["completed", "cancelled"].includes(subscription.status)) {
        return next(new ErrorHandler("This subscription cannot be cancelled", 403));
    }

    try {
        await instance.subscriptions.cancel(subscription.razorSubscriptionId);
        if (subscription.currentEnd <= Date.now()) {
            await User.findByIdAndUpdate(req.user.id,
                { "cards.total": 0 },
                { new: true, runValidators: true, useFindAndModify: false }
            );
        }
    } catch (error) {
        logger.error("Couldn't cancel Subscription");
    }

    res.status(200).json({
        success: true,
        message: "Subscription Cancelled"
    });
});

export const getLatestSubscription = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);
    const subscription = await Subscription.findById(user.activePlan).populate("planId", "_id name amount");

    res.status(200).json({
        success: true,
        subscription,
    });
});

export const getUserTransactions = catchAsyncErrors(async (req, res, next) => {
    const transactions = await Transaction.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        transactions,
    });
});

export const getParticularTransaction = catchAsyncErrors(async (req, res, next) => {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
        return next(new ErrorHandler(`No Transaction By Id ${req.params.id}`, 404));
    }

    if (transaction.transactionFor !== subscriptionEnum.USER) {
        return next(new ErrorHandler("Transaction not found", 403));
    }

    res.status(200).json({
        success: true,
        transaction,
    });
});

