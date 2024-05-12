import Subscription from "../models/subscriptionModel.js";
import Transaction from "../models/transactionModel.js";
import Donation from "../models/donationModel.js";

export const handleDonation = async (paymentData) => {
    const { order_id, status, id, method, card, bank, wallet, vpa, acquirer_data,
        error_code, error_description, error_source, error_step, error_reason } = paymentData;

    await Donation.findOneAndUpdate(
        { razorpayOrderId: order_id },
        {
            status,
            razorpayPaymentId: id,
            error: {
                error_code: error_code !== null ? error_code : undefined,
                error_description: error_description !== null ? error_description : undefined,
                error_source: error_source !== null ? error_source : undefined,
                error_step: error_step !== null ? error_step : undefined,
                error_reason: error_reason !== null ? error_reason : undefined
            },
            paymentMethod: {
                methodType: method,
                cardInfo: {
                    cardType: card?.type,
                    issuer: card?.issuer,
                    last4: card?.last4,
                    name: card?.name,
                    network: card?.network,
                },
                bankInfo: bank !== null ? bank : undefined,
                walletInfo: wallet !== null ? wallet : undefined,
                upiInfo: vpa !== null ? vpa : undefined,
                data: acquirer_data !== null ? acquirer_data : undefined,
            }
        },
        { new: true, runValidators: true, useFindAndModify: false }
    );
}

export const handleTransaction = async (payamentData, subscriptionData, userId) => {
    const { amount, order_id, status, id, method, card, bank, wallet, vpa, acquirer_data } = payamentData;
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
            bankInfo: bank !== null ? bank : undefined,
            walletInfo: wallet !== null ? wallet : undefined,
            upiInfo: vpa !== null ? vpa : undefined,
            data: acquirer_data !== null ? acquirer_data : undefined,
        },
    });
};

export const handleSubscription = async (subscriptionData, payamentData, subscription) => {

    const { id, start_at, end_at, charge_at, total_count, paid_count, remaining_count, status, current_start, current_end } = subscriptionData;
    const { method, card, bank, wallet, vpa, acquirer_data } = payamentData;

    await Subscription.findOneAndUpdate(
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
            status: (!["completed", "cancelled"].includes(subscription.status)) && status,
            paymentMethod: {
                methodType: method,
                cardInfo: {
                    cardType: card?.type,
                    issuer: card?.issuer,
                    last4: card?.last4,
                    name: card?.name,
                    network: card?.network,
                },
                bankInfo: bank !== null ? bank : undefined,
                walletInfo: wallet !== null ? wallet : undefined,
                upiInfo: vpa !== null ? vpa : undefined,
                data: acquirer_data !== null ? acquirer_data : undefined,
            },
        },
        { new: true, runValidators: true, useFindAndModify: false }
    )
};