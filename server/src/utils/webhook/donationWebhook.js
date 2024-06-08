import { handleDonation } from "../../common/payment.js";
import logger from "../../config/logger.js";
import Transaction from "../../models/payment/transactionModel.js";
import crypto from "crypto";

const donationWebhook = async (webhookData) => {

    const expectedSigntaure = crypto
        .createHmac("sha256", process.env.DONATION_WEBHOOK)
        .update(JSON.stringify(webhookData))
        .digest("hex")

    try {
        if (expectedSigntaure === req.headers['x-razorpay-signature']) {
            const donation = await Transaction.findOne({ razorpayOrderId: webhookData.payload.payment.entity.order_id });
            if (donation) {
                await handleDonation(webhookData.payload.payment.entity);
            }
        }
    } catch (error) {
        logger.error(error.message);
    }
}

export default donationWebhook;