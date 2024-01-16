import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import crypto from "crypto";
import User from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
import { instance } from "../server.js";
import sendEmail from "../utils/sendEmail.js";

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
        order,
        razInfo: {
            amount: req.body.amount,
            planName: req.body.planName,
            validity: req.body.validity
        }
    });
    
});

export const verifyPayment = catchAsyncErrors(async (req, res, next) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const toBe = razorpay_order_id + "|" + razorpay_payment_id;

    const user = await User.findById(req.user.id);

    const startDate = Date.now();
    const endDate = Date.now() + Number(req.params.validity) * 60 * 1000;

    user.currentPlan = {
        planName: req.params.planName,
        planPrice: req.params.amount,
        planValidity: req.params.validity,
        startDate,
        endDate,
    };
    await user.save();

    await Payment.create({
        amount: req.params.amount,
        plan: req.params.planName,
        paymentDate: new Date(startDate),
        paymentValidity: new Date(endDate),
        razorpayOrderId: razorpay_order_id, 
        razorpayPaymentId: razorpay_payment_id, 
        razorpaySignature: razorpay_signature, 
        user: req.user.id
    });

    const message = `Subscription successful \n\n Plan Name: ${req.params.planName} \n\n Plan Price: ${req.params.amount} \n\n Plan Valid till: ${new Date(endDate).toLocaleString()}`

    await sendEmail ({
        email: user.email,
        subject: `Account Subscription`,
        message,
    });

    const expectedSigntaure = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(toBe.toString())
        .digest("hex")

    if ( !(expectedSigntaure === razorpay_signature) ) {
        return next(new ErrorHandler("Payment Not Verified", 400));
    }

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
});

export const getPayments = catchAsyncErrors(async (req, res, next) => {
    const payments = await Payment.find({ user: req.user.id });
    res.status(201).json({
        success: true,
        payments,
    });
})