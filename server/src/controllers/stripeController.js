import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import { CLIENT_URL } from "../server.js";
import { stripe } from "../server.js";

export const createPayment = catchAsyncErrors(async (req, res, next) => {
    const { amount } = req.body;

    if (!amount) return next(new ErrorHandler("Please enter amount", 400));

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "inr",
    });

    return res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
});