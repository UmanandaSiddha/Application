import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import crypto from "crypto";
import User from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
import { instance } from "../server.js";
import sendEmail from "../utils/sendEmail.js";
import { CLIENT_URL } from "../server.js";

export const checkoutPayment = catchAsyncErrors(async (req, res, next) => {

    const options = {
        amount: Number(req.body.amount) * 100, 
        currency: "INR",
        receipt: "order_rcptid_11"
    };

    const order = await instance.orders.create(options);
    if (!order) {
        return next(new ErrorHandler("Order Failed", 400));
    }

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        order,
    });
    
});

export const verifyPayment = catchAsyncErrors(async (req, res, next) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const toBe = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSigntaure = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(toBe.toString())
        .digest("hex")

    if ( !(expectedSigntaure === razorpay_signature) ) {
        return next(new ErrorHandler("Payment Not Verified", 400));
    }

    const user = await User.findById(req.user.id);

    const startDate = Date.now();
    const endDate = Date.now() + Number(req.body.validity) * 60 * 1000;

    user.currentPlan = {
        planName: req.body.planName,
        planPrice: req.body.amount,
        planValidity: req.body.validity,
        startDate,
        endDate,
    };
    await user.save();

    await Payment.create({
        amount: req.body.amount,
        plan: req.body.planName,
        paymentDate: new Date(startDate),
        paymentValidity: new Date(endDate),
        razorpayOrderId: razorpay_order_id, 
        razorpayPaymentId: razorpay_payment_id, 
        razorpaySignature: razorpay_signature, 
        user: req.user.id
    });

    const message = `Subscription successful \n\n Plan Name: ${req.body.planName} \n\n Plan Price: ${req.body.amount} \n\n Plan Valid till: ${new Date(endDate).toLocaleString()}`

    await sendEmail ({
        email: user.email,
        subject: `Account Subscription`,
        message,
    });

    res.status(200).json({
        success: true,
        message: "Payment Verified",
        user
    });
});

export const getPayments = catchAsyncErrors(async (req, res, next) => {
    const payments = await Payment.find({ user: req.user.id });
    res.status(201).json({
        success: true,
        payments,
    });
});