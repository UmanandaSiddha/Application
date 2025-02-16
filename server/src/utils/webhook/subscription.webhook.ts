import logger from "../../config/logger.js";
import crypto from "crypto";
import Subscription from "../../models/payment/subscription.model.js";
import { handleSubscription, handleTransaction } from "../payment.js";
import User from "../../models/accounts/user.model.js";
import Transaction from "../../models/payment/transaction.model.js";

const subscriptionwebhook = async (webhookData: any): Promise<void> => {
    const { header, dataSub } = webhookData;
    const { event, payload } = dataSub;
    const expectedSigntaure = crypto
        .createHmac("sha256", process.env.SUBSCRIPTION_WEBHOOK as string)
        .update(JSON.stringify(dataSub))
        .digest("hex")

    try {
        if (expectedSigntaure === header) {
            const subscription = await Subscription.findOne({ razorSubscriptionId: payload.subscription?.entity?.id });
            if (!subscription) {
                console.log("Invalid Subscription, Wrong database");
                logger.error("Invalid Subscription, Wrong database");
            } else {
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
                        // disable short url and next billing
                        // extra should not be zero but substracted from the plan cards
                        if (user?.access.cards.total.extra !== 0) {
                            await User.findOneAndUpdate(
                                { "access.latestSubscription": subscription._id },
                                { "access.cards.total.extra": 0 },
                                { new: true, runValidators: true, useFindAndModify: false }
                            );
                        }
                        break;
                    case "subscription.cancelled":
                        // disable short url and next billing
                        // extra should not be zero but substracted from the plan cards
                        if (user?.access.cards.total.extra !== 0 && subscription.currentEnd <= new Date(Date.now())) {
                            await User.findOneAndUpdate(
                                { "access.latestSubscription": subscription._id },
                                { "access.cards.total.extra": 0 },
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
    } catch (error: any) {
        logger.error(error.message);
    }
}

export default subscriptionwebhook;