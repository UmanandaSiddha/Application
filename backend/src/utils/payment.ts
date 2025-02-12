import { Payments } from "razorpay/dist/types/payments.js";
import Subscription, { ISubscription } from "../models/payment/subscription.model.js";
import Transaction, { TransactionEnum } from "../models/payment/transaction.model.js";
import { Subscriptions } from "razorpay/dist/types/subscriptions.js";

export const handleDonation = async (paymentData: Payments.RazorpayPayment): Promise<void> => {
    const {
        order_id, status, id, method, card, bank, wallet, vpa, acquirer_data,
        error_code, error_description, error_source, error_step, error_reason
    } = paymentData;

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
};

export const handleTransaction = async (
    paymentData: Payments.RazorpayPayment,
    subscriptionData: Subscriptions.RazorpaySubscription,
    subscription: ISubscription
): Promise<void> => {
    const {
        amount, order_id, status, id, method, card, bank, wallet, vpa, acquirer_data,
        error_code, error_description, error_source, error_step, error_reason
    } = paymentData;
    const { current_end, current_start } = subscriptionData;

    await Transaction.create({
        transactionFor: subscription.subscriptionType,
        transactionType: TransactionEnum.RECURRING,
        donator: subscription.donator || undefined,
        user: subscription.user || undefined,
        amount: typeof amount === "string" ? parseInt(amount, 10) / 100 : (amount ?? 0) / 100, // ✅ Fixed Type Error
        start: (current_start ?? 0) * 1000,
        end: (current_end ?? 0) * 1000,
        status,
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

export const handleSubscription = async (
    subscriptionData: Subscriptions.RazorpaySubscription,
    subscription: ISubscription
): Promise<void> => {
    const {
        id, start_at, end_at, charge_at, total_count, paid_count, remaining_count, status,
        current_start, current_end
    } = subscriptionData;

    await Subscription.findOneAndUpdate(
        { razorSubscriptionId: id },
        {
            start: start_at * 1000,
            end: end_at * 1000,
            nextBilling: charge_at * 1000,
            currentStart: (current_start ?? 0) * 1000,
            currentEnd: (current_end ?? 0) * 1000,
            totalCount: total_count,
            paidCount: paid_count,
            remainingCount: remaining_count,
            status: ["completed", "cancelled"].includes(subscription?.status || '') ? subscription?.status : status,
        },
        { new: true, runValidators: true, useFindAndModify: false }
    );
};