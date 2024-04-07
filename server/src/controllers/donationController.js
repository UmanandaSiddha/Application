import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import crypto from "crypto";
import User from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
import { instance } from "../server.js";
import short from "short-uuid";
import Donation, { statusEnum } from "../models/donationModel.js";

export const checkoutPayment = catchAsyncErrors(async (req, res, next) => {

    const options = {
        amount: Number(req.body.amount) * 100,
        currency: "INR",
        receipt: `receipt_${short.generate()}`
    };

    const order = await instance.orders.create(options);
    if (!order) {
        return next(new ErrorHandler("Order Failed", 400));
    }

    await Donation.create({
        amount: req.body.amount,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        status: statusEnum.CREATED,
        razorpayOrderId: order.id, 
    });

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        order,
    });
});

export const webhookVerify = async (req, res, next) => {

    const secret = "12345678";

    const expectedSigntaure = crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(req.body))
        .digest("hex")
        
    const donation = await Donation.findOne({ razorpayOrderId: req.body.payload.payment.entity.order_id });

    try { 
        if (expectedSigntaure === req.headers['x-razorpay-signature']) {
            donation.razorpayPaymentId = req.body.payload.payment.entity.id;
            donation.status = statusEnum.SUCCESS;
            await donation.save();
        } else {
            donation.razorpayPaymentId = "pending";
            donation.status = statusEnum.FAILED;
            await donation.save();
        }
    } catch (error) {
        console.log(error.message);
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

    const donation = await Donation.findOne({ razorpayOrderId: razorpay_order_id });

    if (expectedSigntaure === razorpay_signature) {
        donation.razorpayPaymentId = req.body.payload.payment.entity.id;
        donation.status = statusEnum.SUCCESS;
        await donation.save();
    } else {
        donation.razorpayPaymentId = "pending";
        donation.status = statusEnum.FAILED;
        await donation.save();
    }

    res.status(200).json({
        success: true,
        paymentStatus: donation.status
    });
});

export const getPayments = catchAsyncErrors(async (req, res, next) => {
    const payments = await Payment.find({ user: req.user.id });
    res.status(201).json({
        success: true,
        payments,
    });
});