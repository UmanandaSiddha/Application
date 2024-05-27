import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import { instance } from "../server.js";
import Plan from "../models/payment/planModel.js";
import crypto from "crypto";
import Subscription, { subscriptionEnum } from "../models/payment/subscriptionModel.js";
import Transaction from "../models/payment/transactionModel.js";
import User, { roleEnum } from "../models/userModel.js";
import logger from "../config/logger.js";
import { handleSubscription, handleTransaction } from "../common/payment.js";

export const createSubscription = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    if (user.role === roleEnum.ADMIN) {
        return next(new ErrorHandler("Admin don't need to buy Plans", 403));
    }

    if (user.freePlan.status) {
        return next(new ErrorHandler("You already have active Plan", 403));
    }

    if (user?.activePlan) {
        const subscription = await Subscription.findById(user?.activePlan);
        if (!["completed", "cancelled"].includes(subscription.status) || (subscription.status === "cancelled" && subscription.currentEnd > Date.now())) {
            return next(new ErrorHandler("You already have active Plan", 403));
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
        status: subscriptions.status,
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

    const updatedUser  = await User.findByIdAndUpdate(
        req.user.id, 
        { 
            freePlan: {
                status: true,
                type: freeEnum.CUSTOM
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

    if (expectedSigntaure === razorpay_signature) {
        if (["active", "created"].includes(subscription.status) && payment.status === "captured") {
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
    const secret = "12345678";

    const expectedSigntaure = crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(req.body))
        .digest("hex")

    const { event, payload } = req.body;

    try {
        if (expectedSigntaure === req.headers['x-razorpay-signature']) {
            const subscription = await Subscription.findOne({ razorSubscriptionId: payload.subscription.entity.id });
            if (!subscription) {
                console.log("Invalid Subscription, Wrong database");
            }
            await handleSubscription(payload.subscription.entity, subscription);

            const user = await User.findOne({ activePlan: subscription._id });
            switch (event) {
                case "subscription.charged":
                    const { method, card, bank, wallet, vpa, acquirer_data } = payload.payment?.entity;
                    await Subscription.findOneAndUpdate(
                        { razorSubscriptionId: payload.subscription.entity.id },
                        {
                            paymentMethod: {
                                methodType: method,
                                cardInfo: card ? {
                                    cardType: card?.type,
                                    issuer: card?.issuer,
                                    last4: card?.last4,
                                    name: card?.name,
                                    network: card?.network,
                                } : undefined,
                                bankInfo: bank || undefined,
                                walletInfo: wallet || undefined,
                                upiInfo: vpa || undefined,
                                data: acquirer_data || undefined,
                            },
                        },
                        { new: true, runValidators: true, useFindAndModify: false }
                    )
                    const checkPayment = await Transaction.findOne({ razorpayPaymentId: payload.payment.entity.id });
                    if (!checkPayment) {
                        await handleTransaction(payload.payment.entity, payload.subscription.entity, subscription);
                    }
                    break;
                case "subscription.completed":
                    if (user.cards.total !== 0) {
                        await User.findOneAndUpdate(
                            { activePlan: subscription._id },
                            { "cards.total": 0 },
                            { new: true, runValidators: true, useFindAndModify: false }
                        );
                    }
                    break;
                case "subscription.cancelled":
                    if (user.cards.total !== 0 && subscription.currentEnd <= Date.now()) {
                        await User.findOneAndUpdate(
                            { activePlan: subscription._id },
                            { "cards.total": 0 },
                            { new: true, runValidators: true, useFindAndModify: false }
                        );
                    }
                    break;
                default:
                    console.log(event);
                    break;
            }
        }
    } catch (error) {
        logger.error(error.message);
    }

    res.status(200).send('OK');
};

export const cancelSubscription = catchAsyncErrors(async (req, res, next) => {
    await instance.subscriptions.cancel(req.body.subscriptionId);

    const subscription = await Subscription.findById(req.body.subscriptionId);

    if (subscription.currentEnd <= Date.now()) {
        await User.findByIdAndUpdate(req.user.id,
            { "cards.total": 0 },
            { new: true, runValidators: true, useFindAndModify: false }
        );
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

