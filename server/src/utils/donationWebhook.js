import { handleDonation } from "../common/payment.js";
import Transaction from "../models/payment/transactionModel.js";

const donationWebhook = async (data) => {
    const donation = await Transaction.findOne({ razorpayOrderId: data.order_id });
    if (donation) {
        await handleDonation(data);
    }
}

export default donationWebhook;