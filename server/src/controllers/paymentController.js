import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import crypto from "crypto";
import User from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
import { instance } from "../server.js";
import sendEmail from "../utils/sendEmail.js";
import { CLIENT_URL } from "../server.js";
import fs from 'fs';

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

    const user = await User.findById(req.user.id);

    const startDate = Date.now();
    const endDate = Date.now() + Number(req.body.validity) * 24 * 60 * 60 * 1000;

    user.currentPlan = {
        planStatus: "processing",
        planName: req.body.planName,
        planPrice: req.body.amount,
        planValidity: req.body.validity,
        startDate,
        endDate,
        orderId: order.id,
    };
    await user.save();

    await Payment.create({
        amount: req.body.amount,
        plan: req.body.planName,
        paymentDate: new Date(startDate),
        paymentValidity: new Date(endDate),
        razorpayOrderId: order.id,
        razorpayPaymentId: "processing",
        user: req.user.id
    });

    // const customer = await instance.customers.create({
    //     name: req.user.name,
    //     contact: 9123456780,
    //     email: req.user.email,
    //     fail_existing: 0,
    // });
    // if (!customer) {
    //     return next(new ErrorHandler("Customer Failed", 400));
    // }

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        order,
        // customer_id: customer.id
    });

});

export const testVerify = catchAsyncErrors(async (req, res, next) => {

    const secret = "12345678";

    const expectedSigntaure = crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(req.body))
        .digest("hex")
        
    if (expectedSigntaure === req.headers['x-razorpay-signature']) {

        await User.findOneAndUpdate({ "currentPlan.orderId": req.body.payload.payment.entity.order_id }, {
            "currentPlan.planStatus": "succeeded",
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        const payment = await Payment.findOne({ razorpayOrderId: req.body.payload.payment.entity.order_id });
        
        payment.razorpayPaymentId = req.body.payload.payment.entity.id;
        payment.paymentStatus = "succeeded";
        await payment.save();
    }

    res.json({ status: "ok" })
});

export const verifyPayment = catchAsyncErrors(async (req, res, next) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const toBe = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSigntaure = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(toBe.toString())
        .digest("hex")

    if (!(expectedSigntaure === razorpay_signature)) {
        return next(new ErrorHandler("Payment Not Verified", 400));
    }

    await User.findByIdAndUpdate(req.user.id, {
        "currentPlan.planStatus": "verifying",
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    const payment = await Payment.findOne({ razorpayOrderId: req.user.currentPlan.orderId });
    payment.paymentStatus = "verifying";
    await payment.save();

    console.log("verified")

    res.status(200).json({
        success: true,
        message: "Payment Verified",
    });
});

export const getPayments = catchAsyncErrors(async (req, res, next) => {
    const payments = await Payment.find({ user: req.user.id });
    res.status(201).json({
        success: true,
        payments,
    });
});