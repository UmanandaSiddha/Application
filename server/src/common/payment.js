// import app from "../app.js";
import Subscription from "../models/payment/subscriptionModel.js";
import Transaction, { transactionEnum } from "../models/payment/transactionModel.js";
import { redis } from "../server.js";
import { io } from "../ws.js";

export const handleDonation = async (paymentData) => {
    const { order_id, status, id, method, card, bank, wallet, vpa, acquirer_data,
        error_code, error_description, error_source, error_step, error_reason } = paymentData;

    await Transaction.findOneAndUpdate(
        { razorpayOrderId: order_id },
        {
            status,
            razorpayPaymentId: id,
            error: {
                error_code: error_code || undefined,
                error_description: error_description || undefined,
                error_source: error_source || undefined,
                error_step: error_step || undefined,
                error_reason: error_reason || undefined
            },
            paymentMethod: {
                methodType: method,
                cardInfo: card ? {
                    cardType: card.type,
                    issuer: card.issuer,
                    last4: card.last4,
                    name: card.name,
                    network: card.network,
                } : undefined,
                bankInfo: bank || undefined,
                walletInfo: wallet || undefined,
                upiInfo: vpa || undefined,
                data: acquirer_data || undefined,
            }
        },
        { new: true, runValidators: true, useFindAndModify: false }
    );
}

export const handleTransaction = async (paymentData, subscriptionData, subscription) => {
    const { amount, order_id, status, id, method, card, bank, wallet, vpa, acquirer_data, error_code, error_description, error_source, error_step, error_reason } = paymentData;
    const { current_end, current_start } = subscriptionData;

    await Transaction.create({
        transactionFor: subscription.subscriptionType,
        transactionType: transactionEnum.RECURRING,
        donator: subscription.donator || undefined,
        user: subscription.user || undefined,
        amount: Number(amount / 100),
        start: current_start * 1000,
        end: current_end * 1000,
        status: status,
        razorpayOrderId: order_id,
        razorpayPaymentId: id,
        error: {
            error_code: error_code || undefined,
            error_description: error_description || undefined,
            error_source: error_source || undefined,
            error_step: error_step || undefined,
            error_reason: error_reason || undefined
        },
        paymentMethod: {
            methodType: method,
            cardInfo: card ? {
                cardType: card.type,
                issuer: card.issuer,
                last4: card.last4,
                name: card.name,
                network: card.network,
            } : undefined,
            bankInfo: bank || undefined,
            walletInfo: wallet || undefined,
            upiInfo: vpa || undefined,
            data: acquirer_data || undefined,
        },
    });
};

export const handleSubscription = async (subscriptionData, subscription, reqHandle) => {
    const { id, start_at, end_at, charge_at, total_count, paid_count, remaining_count, status, current_start, current_end } = subscriptionData;
    const sub = await Subscription.findOneAndUpdate(
        { razorSubscriptionId: id },
        {
            start: start_at * 1000,
            end: end_at * 1000,
            nextBilling: charge_at * 1000,
            currentStart: current_start * 1000,
            currentEnd: current_end * 1000,
            totalCount: total_count,
            paidCount: paid_count,
            remainingCount: remaining_count,
            status: ["completed", "cancelled"].includes(subscription?.status) ? subscription?.status : status,
        },
        { new: true, runValidators: true, useFindAndModify: false }
    )

    if (sub.user) {
        const socketId = await redis.hget("userSockets", sub.user);
        if (socketId) {
            // const ioInstance = app.get("io");
            io.to(socketId).emit("payment_Socket", "some message");
        }
    }
};