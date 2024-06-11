import { handleDonation } from "../../common/payment.js";
import logger from "../../config/logger.js";
import Transaction from "../../models/payment/transactionModel.js";
import crypto from "crypto";

const donationWebhook = async (webhookData) => {

    const { header, dataPay } = webhookData;

    const expectedSigntaure = crypto
        .createHmac("sha256", process.env.DONATION_WEBHOOK)
        .update(JSON.stringify(dataPay))
        .digest("hex")

    try {
        if (expectedSigntaure === header) {
            const donation = await Transaction.findOne({ razorpayOrderId: dataPay.payload.payment.entity.order_id });
            if (donation) {
                await handleDonation(dataPay.payload.payment.entity);
            }
        }
    } catch (error) {
        logger.error(error.message);
    }
}

export default donationWebhook;