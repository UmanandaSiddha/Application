import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import crypto from "crypto";
import Payment from "../models/paymentModel.js";
import { instance } from "../server.js";
import short from "short-uuid";
import Donation from "../models/donationModel.js";

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
        address: req.body.address,
        pan: req.body.pan,
        status: "created",
        razorpayOrderId: order.id, 
    });

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        order,
    });
});

export const capturePayment = async (req, res, next) => {

    const secret = "12345678";

    const expectedSigntaure = crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(req.body))
        .digest("hex")
        
    const { order_id, status, id, method, card, bank, wallet, vpa, acquirer_data } = req.body.payload.payment.entity;
    
    try { 
        if (expectedSigntaure === req.headers['x-razorpay-signature']) {
            await Donation.findOneAndUpdate(
                { razorpayOrderId: order_id }, 
                {
                    status,
                    razorpayPaymentId: id,
                    paymentMethod: {
                        methodType: method,
                        cardInfo: {
                            cardType: card?.type,
                            issuer: card?.issuer,
                            last4: card?.last4,
                            name: card?.name,
                            network: card?.network,
                        },
                        bankInfo: bank,
                        walletInfo: wallet,
                        upiInfo: vpa,
                        data: acquirer_data,
                    }
                },
                { new: true, runValidators: true, useFindAndModify: false }
            );
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

    const payment = await instance.payments.fetch(razorpay_payment_id);
    const { order_id, status, id, method, card, bank, wallet, vpa, acquirer_data } = payment;

    if (expectedSigntaure === razorpay_signature) {
        await Donation.findOneAndUpdate(
            { razorpayOrderId: order_id }, 
            {
                status,
                razorpayPaymentId: id,
                paymentMethod: {
                    methodType: method,
                    cardInfo: {
                        cardType: card?.type,
                        issuer: card?.issuer,
                        last4: card?.last4,
                        name: card?.name,
                        network: card?.network,
                    },
                    bankInfo: bank,
                    walletInfo: wallet,
                    upiInfo: vpa,
                    data: acquirer_data,
                }
            },
            { new: true, runValidators: true, useFindAndModify: false }
        );
    } else {
        return next(new ErrorHandler("Payment Not Verified", 403));
    }

    res.status(200).json({
        success: true,
        paymentStatus: payment.status
    });
});

export const getPayments = catchAsyncErrors(async (req, res, next) => {
    const payments = await Payment.find({ user: req.user.id });
    res.status(201).json({
        success: true,
        payments,
    });
});