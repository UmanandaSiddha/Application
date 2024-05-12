import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import crypto from "crypto";
import { instance } from "../server.js";
import short from "short-uuid";
import Donation from "../models/donationModel.js";
import User from "../models/userModel.js";
import logger from "../config/logger.js";
import { handleDonation } from "../common/payment.js";

export const checkoutPayment = catchAsyncErrors(async (req, res, next) => {

    const options = {
        amount: Number(req.body.amount) * 100,
        currency: req.body.currency,
        receipt: `receipt_${short.generate()}`
    };

    const order = await instance.orders.create(options);
    if (!order) {
        return next(new ErrorHandler("Order Failed", 400));
    }

    const donator = await Donation.create({
        amount: req.body.amount,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        currency: req.body.currency,
        pan: req.body.pan,
        status: "created",
        razorpayOrderId: order.id,
    });

    const user = User.findOne({ email: donator.email });
    if (user) {
        await User.findOneAndUpdate(
            { email: donator.email },
            { donator: true },
            { new: true, runValidators: true, useFindAndModify: false }
        )
    }

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        donator,
        order,
    });
});

export const capturePayment = async (req, res, next) => {

    const secret = "12345678";

    const expectedSigntaure = crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(req.body))
        .digest("hex")

    try {
        if (expectedSigntaure === req.headers['x-razorpay-signature']) {
            const donation = await Donation.findOne({ razorpayOrderId: req.body.payload.payment.entity.order_id });
            if (donation) {
                await handleDonation(req.body.payload.payment.entity);
            }
        }
    } catch (error) {
        console.log(error.message);
        logger.error(error.message);
    }

    res.status(200).send('OK');
};

export const verifyPayment = catchAsyncErrors(async (req, res, next) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const toBe = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSigntaure = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(toBe.toString())
        .digest("hex")

    const payment = await instance.payments.fetch(razorpay_payment_id);

    if (expectedSigntaure === razorpay_signature) {
        const donation = await Donation.findOne({ razorpayOrderId: payment.order_id });
        if (donation) {
            await handleDonation(payment);
        }
    } else {
        return next(new ErrorHandler("Payment Not Verified", 403));
    }

    res.status(200).json({
        success: true,
        paymentStatus: payment.status
    });
});
