import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import { instance } from "../server.js";
import Plan from "../models/planModel.js";
import crypto from "crypto";
import Subscription from "../models/subscriptionModel.js";
import Transaction from "../models/transactionModel.js";
import User, { roleEnum } from "../models/userModel.js";
import logger from "../config/logger.js";

export const createSubscription = catchAsyncErrors(async (req, res, next) => {
    
    const user = await User.findById(req.user.id);

    if (user.role === roleEnum.ADMIN) {
        return next(new ErrorHandler("Admin don't need to buy Plans", 403));
    }

    if (!user.customerId) {
        const customer = await instance.customers.create({
            name: user.name,
            email: user.email,
            fail_existing: 0,
        });
        await User.findByIdAndUpdate(req.user.id, { customerId: customer.id }, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
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
        nextBilling: 0,
        totalCount: 0,
        paidCount: 0,
        remainingCount: 0,
        shortUrl: subscriptions.short_url,
        status: "created",
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
        customer_id: user.customerId,
    });
});

export const cancelSubscription = catchAsyncErrors( async (req, res, next) => {
    await instance.subscriptions.cancel(req.body.subscriptionId);

    await User.findByIdAndUpdate(req.user.id, 
        { "cards.total": 0 },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: "Subscription Cancelled"
    });
});

const handleTransaction = async (payamentData, subscriptionData, userId) => {
    const { amount, order_id, status, id, method, card, bank, wallet, vpa, acquirer_data  } = payamentData;
    const { current_end, current_start } = subscriptionData;

    await Transaction.create({
        amount: Number(amount / 100),
        start: current_start * 1000,
        end: current_end * 1000,
        status: status,
        user: userId,
        razorpayOrderId: order_id,
        razorpayPaymentId: id,
        paymentMethod: {
            methodType: method,
            cardInfo: {
                cardType: card?.type,
                issuer: card?.issuer,
                last4: card?.last4,
                name: card?.name,
                network: card?.network,
            },
            bankInfo: bank,
            walletInfo: wallet,
            upiInfo: vpa,
            data: acquirer_data,
        },
    });
};

export const captureSubscription = catchAsyncErrors( async (req, res, next) => {
    const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = req.body;
    const toBe = razorpay_payment_id + "|" + razorpay_subscription_id;

    const expectedSigntaure = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(toBe.toString())
        .digest("hex")

    const payment = await instance.payments.fetch(razorpay_payment_id);
    const subscription = await instance.subscriptions.fetch(razorpay_subscription_id);
    
    if (expectedSigntaure === razorpay_signature) {
        if (subscription.status === "active" && payment.status === "captured") {
            const subscriptionx = await Subscription.findOne({ razorSubscriptionId: subscription.id });

            subscriptionx.start = subscription.start_at * 1000;
            subscriptionx.end = subscription.end_at * 1000;
            subscriptionx.nextBilling = subscription.charge_at * 1000;
            subscriptionx.totalCount = subscription.total_count;
            subscriptionx.paidCount = subscription.paid_count;
            subscriptionx.remainingCount = subscription.remaining_count;
            subscriptionx.status = subscription.status;
            await subscriptionx.save();

            const checkPayment = await Transaction.findOne({ razorpayPaymentId: payment.id });
            if (!checkPayment) {
                await handleTransaction(payment, subscription, subscriptionx.user);
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
            const { id, start_at, end_at, charge_at, total_count, paid_count, remaining_count, status } = payload.subscription.entity;

            const subscription = await Subscription.findOne({ razorSubscriptionId: id });

            if (!subscription) {
                console.log("Invalid Subscription, Wrong database");
            }

            subscription.start = start_at * 1000;
            subscription.end = end_at * 1000;
            subscription.nextBilling = charge_at * 1000;
            subscription.totalCount = total_count;
            subscription.paidCount = paid_count;
            subscription.remainingCount = remaining_count;
            if (subscription.status !== "completed") {
                subscription.status = status;
            }
            await subscription.save();

            switch (event) {
                case "subscription.charged":
                    const checkPayment = await Transaction.findOne({ razorpayPaymentId: payload.payment.entity.id });
                    if (!checkPayment) {
                        await handleTransaction(payload.payment.entity, payload.subscription.entity, subscription.user);
                    }
                    break;
                case "subscription.completed":
                case "subscription.cancelled":
                    const user = await User.findOne({ activePlan: subscription._id });
                    if (user.cards.total !== 0 ) {
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
        console.log(error.message);
        logger.error(error.message);
    }

    res.status(200).send('OK');
};

export const getLatestSubscription = catchAsyncErrors( async (req, res, next) => {

    const user = await User.findById(req.user.id);
    const subscription = await Subscription.findById(user.activePlan).populate("planId", "name amount");

    res.status(200).json({
        success: true,
        subscription,
    });
});

export const getUserTransactions = catchAsyncErrors( async (req, res, next) => {
    const transactions = await Transaction.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        transactions,
    });
});

