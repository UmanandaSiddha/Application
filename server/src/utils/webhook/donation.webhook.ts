import logger from "../../config/logger.js";
import crypto from "crypto";
import Transaction from "../../models/payment/transaction.model.js";
import { handleDonation } from "../payment.js";

const donationWebhook = async (webhookData: any): Promise<void> => {
    const { header, dataPay } = webhookData;
    const expectedSigntaure = crypto
        .createHmac("sha256", process.env.DONATION_WEBHOOK as string)
        .update(JSON.stringify(dataPay))
        .digest("hex")

    try {
        if (expectedSigntaure === header) {
            const donation = await Transaction.findOne({ razorpayOrderId: dataPay.payload.payment.entity.order_id });
            if (donation) {
                await handleDonation(dataPay.payload.payment.entity);
            }
        }
    } catch (error: any) {
        logger.error(error.message);
    }
}

export default donationWebhook;