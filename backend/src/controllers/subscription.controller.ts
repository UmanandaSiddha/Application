import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import crypto from "crypto";
import logger from "../config/logger.js";
import Subscription, { SubscriptionEnum } from "../models/payment/subscription.model.js";
import User, { UserRoleEnum } from "../models/accounts/user.model.js";
import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../middleware/auth.middleware.js";
import Plan, { PeriodEnum, PlanEnum } from "../models/payment/plan.model.js";
import { instance } from "../index.js";
import { handleSubscription, handleTransaction } from "../utils/payment.js";
import Transaction from "../models/payment/transaction.model.js";
import { addSubscriptionToQueue } from "../utils/queue/subscription.queue.js";
import ApiFeatures from "../utils/services/api.features.js";

const hasActivePlan = async (activePlanId: mongoose.Schema.Types.ObjectId) => {
    const subscription = await Subscription.findById(activePlanId);
    if (!subscription) return false;
    if (subscription.status === "just_created") {
        await Subscription.findByIdAndDelete(activePlanId);
        return false;
    }
    return !["completed", "cancelled"].includes(subscription.status) ||
        (subscription.status === "cancelled" && subscription.currentEnd > new Date(Date.now()));
};

export const createSubscription = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req;
    if (!user) return next(new ErrorHandler("User not found", 404));
    if (user.profile.role === UserRoleEnum.ADMIN) return next(new ErrorHandler("Admin don't need to buy Plans", 403));
    if (user.access.freeAccess || (user.access.latestSubscription && await hasActivePlan(user.access.latestSubscription))) {
        return next(new ErrorHandler("You already have active Plan", 403));
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorHandler("Invalid ID format", 400));
    // const plan = await Plan.findOne({ razorPlanId: req.body.id, visible: true });
    const plan = await Plan.findById(id);
    if (!plan || !plan.visible) return next(new ErrorHandler("No Plan By Id or Plan not available", 404));

    let subscriptions;
    if (plan.planType !== PlanEnum.FREE) {
        if (!plan.razorPlanId) return next(new ErrorHandler("No Razorpay Plan ID", 400));
        subscriptions = await instance.subscriptions.create({
            plan_id: plan.razorPlanId,
            total_count: 12,
            quantity: 1,
            customer_notify: 0,
        });
    }
    if (!subscriptions) {
        return next(new ErrorHandler("Razorpay Failed", 403));
    }
    //TODO: for free start and end should be defined
    const subscription = await Subscription.create({
        planId: plan._id,
        razorSubscriptionId: subscriptions.id,
        shortUrl: subscriptions.short_url,
        status: plan.planType !== PlanEnum.FREE ? "just_created" : "free_subscription",
        subscriptionType: plan.planType !== PlanEnum.FREE ? SubscriptionEnum.USER : SubscriptionEnum.FREE,
        user: user._id,
    });

    await User.findByIdAndUpdate(user._id,
        { "access.latestSubscription": subscription._id, "access.cards.total.extra": plan.cards },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        subscriptions_id: subscriptions.id,
    });
});

export const captureSubscription = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = req.body;
    const toBe = razorpay_payment_id + "|" + razorpay_subscription_id;

    const expectedSigntaure = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
        .update(toBe.toString())
        .digest("hex")

    const payment = await instance.payments.fetch(razorpay_payment_id);
    const subscription = await instance.subscriptions.fetch(razorpay_subscription_id);

    if (expectedSigntaure === razorpay_signature) {
        if (subscription.status === "active" && payment.status === "captured") {
            const subscriptionx = await Subscription.findOne({ razorSubscriptionId: subscription.id });

            await handleSubscription(subscription, subscriptionx!);

            const checkPayment = await Transaction.findOne({ razorpayPaymentId: payment.id });
            if (!checkPayment) {
                await handleTransaction(payment, subscription, subscriptionx!);
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

export const verifySubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const upgradeSubscription = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req;
    if (!user) return next(new ErrorHandler("User not found", 404));
    if (user.profile.role === UserRoleEnum.ADMIN) return next(new ErrorHandler("Admin don't need to upgrade Plans", 403));
    if (user.access.freeAccess) return next(new ErrorHandler("User already has free access", 403));
    if (!user.access.latestSubscription) return next(new ErrorHandler("User doesnt have a plan to upgrade to", 403));

    const { id, type } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorHandler("Invalid ID format", 400));
    const plan = await Plan.findById(id);
    if (!plan || !plan.visible || plan.planType === PlanEnum.FREE) return next(new ErrorHandler("No Plan By Id or Plan not available", 404));

    if (!["UPGRADE", "DOWNGRADE"].includes(type.toUpperCase())) return next(new ErrorHandler("Invalid Type format. Use 'UPGRADE' or 'DOWNGRADE'", 400));

    const subscription = await Subscription.findById(user.access.latestSubscription);
    if (!subscription || subscription.subscriptionType === SubscriptionEnum.FREE) return next(new ErrorHandler("No Subscription is found", 404));

    const { total, created } = user.access.cards;
    const { initial, extra } = total;
    if (type === "DOWNGRADE") {
        if (extra < plan.cards) return next(new ErrorHandler("Cannot downgrade: Plan has more cards than required", 403));
        if ((created - initial) > plan.cards) {
            return next(new ErrorHandler(`Delete ${created - initial - plan.cards} extra cards before downgrading`, 403));
        }
    }
    if (type === "UPGRADE" && plan.cards <= extra) {
        return next(new ErrorHandler("New plan must allow more cards than current plan", 403));
    }

    const newSubscription = await instance.subscriptions.update(subscription._id.toString(), {
        plan_id: plan._id.toString(),
        quantity: 1,
        remaining_count: subscription.remainingCount,
        schedule_change_at: "now",
        customer_notify: 0,
    });

    res.status(200).json({
        success: true,
        message: "Successfully updated subscription",
        subscription: newSubscription
    });
});

export const cancelSubscription = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req;
    if (!user) return next(new ErrorHandler("User not found", 404));
    if (!user.access.latestSubscription) return next(new ErrorHandler("User is not subscribed", 404));

    const subscription = await Subscription.findById(user.access.latestSubscription);
    if (!subscription) return next(new ErrorHandler("No Subscription is found", 404));
    if (["completed", "cancelled"].includes(subscription.status)) {
        return next(new ErrorHandler("This subscription cannot be cancelled", 403));
    }

    const cancelSubscription = await instance.subscriptions.cancel(subscription.razorSubscriptionId!);
    if (!cancelSubscription) return next(new ErrorHandler("Failed to cancel subscription", 403));
    if (subscription.currentEnd <= new Date(Date.now())) {
        await User.findByIdAndUpdate(user._id,
            { "access.cards.total.extra": 0 },
            { new: true, runValidators: true, useFindAndModify: false }
        );
    }

    res.status(200).json({
        success: true,
        message: "Subscription Cancelled"
    });
});

export const getLatestSubscription = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req;
    if (!user) return next(new ErrorHandler("User not found", 404));
    if (!user.access.latestSubscription) return next(new ErrorHandler("User is not subscribed", 404));

    const subscription = await Subscription.findById(user.access.latestSubscription).populate("planId", "_id name amount");
    if (!subscription) return next(new ErrorHandler("No Subscription is found", 404));

    res.status(200).json({
        success: true,
        subscription,
    });
});

export const getUserTransactions = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const resultPerPage = 20;
    const count = await Transaction.countDocuments();

    const { user } = req;
    if (!user) return next(new ErrorHandler("User not found", 404));

    const apiFeatures = new ApiFeatures(Transaction.find({ user: user._id }).sort({ $natural: -1 }), req.query).filter();
    let filteredTransaction = await apiFeatures.getQuery();
    let filteredTransactionCount = filteredTransaction.length;

    apiFeatures.pagination(resultPerPage);
    filteredTransaction = await apiFeatures.getQuery().clone();

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        filteredTransaction,
        filteredTransactionCount
    });
});

export const getParticularTransaction = catchAsyncErrors(async (req: UserRequest, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorHandler("Invalid ID format", 400));

    const transaction = await Transaction.findById(id);
    if (!transaction) return next(new ErrorHandler(`No Transaction By Id ${id}`, 404));
    if (transaction.transactionFor !== SubscriptionEnum.USER) return next(new ErrorHandler("Transaction not found", 403));

    res.status(200).json({
        success: true,
        transaction,
    });
});

