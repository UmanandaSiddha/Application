import { handleSubscription, handleTransaction } from "../common/payment.js";
import logger from "../config/logger.js";
import Subscription from "../models/payment/subscriptionModel.js";
import Transaction from "../models/payment/transactionModel.js";
import User from "../models/userModel.js";

const subscriptionwebhook = async (event, payload) => {
    const subscription = await Subscription.findOne({ razorSubscriptionId: payload.subscription?.entity?.id });
    logger.info(`testing webhhok ${subscription?._id}`);
    if (!subscription) {
        console.log("Invalid Subscription, Wrong database");
        logger.error("Invalid Subscription, Wrong database");
    } else {
        logger.info("got subscription");
        await handleSubscription(payload.subscription?.entity, subscription);
    
        const user = await User.findOne({ activePlan: subscription._id });
        
        switch (event) {
            case "subscription.charged":
                const { method, card, bank, wallet, vpa, acquirer_data } = payload.payment?.entity;
                await Subscription.findOneAndUpdate(
                    { razorSubscriptionId: payload.subscription?.entity?.id },
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
                const checkPayment = await Transaction.findOne({ razorpayPaymentId: payload.payment?.entity?.id });
                if (!checkPayment) {
                    await handleTransaction(payload.payment?.entity, payload.subscription?.entity, subscription);
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
}

export default subscriptionwebhook;