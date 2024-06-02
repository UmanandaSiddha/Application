import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import crypto from "crypto";
import { instance } from "../server.js";
import short from "short-uuid";
import Donator from "../models/donatorModel.js";
import Transaction, { transactionEnum, transactionForEnum } from "../models/payment/transactionModel.js";
import sendDonatorToken from "../utils/donatorToken.js";
import Subscription, { subscriptionEnum } from "../models/payment/subscriptionModel.js";
import Plan from "../models/payment/planModel.js";
import { addDonationToQueue } from "../utils/queue/donationQueue.js";

export const sendDonatorOTP = catchAsyncErrors(async (req, res, next) => {
    const donator = await Donator.findOne({ email: req.body.email });

    if (!donator) {
        donator = await Donator.create({
            name: "donatorname",
            email: req.body.email,
            phone: 0,
            address: "address",
            pan: 0,
        })
    }

    const otp = donator.getOneTimePassword();

    await donator.save({ validateBeforeSave: false });

    const message = `Email verification OTP fro donation ( valid for 15 minutes ) :- \n\n ${otp} \n\n Please ignore if you didn't requested this email.`;

    try {
        await addEmailToQueue({
            email: donator.email,
            subject: `Email Veification`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${donator.email} successfully`,
        });
    } catch (error) {
        donator.oneTimePassword = undefined;
        donator.oneTimeExpire = undefined;

        await donator.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

export const loginDonator = catchAsyncErrors(async (req, res, next) => {
    const { otp, email } = req.body;

    const oneTimePassword = crypto
        .createHash("sha256")
        .update(otp.toString())
        .digest("hex");

    const donator = await Donator.findOne({
        email,
        oneTimePassword,
        oneTimeExpire: { $gt: Date.now() },
    });

    if (!donator) {
        return next(new ErrorHandler("Email Veification OTP has Expired", 400));
    }

    donator.oneTimePassword = undefined;
    donator.oneTimeExpire = undefined;

    await donator.save();

    sendDonatorToken(donator, 200, res);
});

export const getDonator = catchAsyncErrors(async (req, res, next) => {
    const donator = await Donator.findById(req.donator._id).populate("activeDonation", "status currentEnd");

    res.status(200).json({
        success: true,
        donator,
    });
});

export const createDonatorDetails = catchAsyncErrors(async (req, res, next) => {

    const donator = await Donator.findByIdAndUpdate(
        req.donator.id,
        {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            pan: req.body.pan,
        },
        { new: true, runValidators: true, useFindAndModify: false }
    )

    res.status(200).json({
        success: true,
        donator,
    });
});

export const createSubscription = catchAsyncErrors(async (req, res, next) => {
    const donator = await Donator.findById(req.donator.id);

    if (donator?.activeDonation) {
        const subscription = await Subscription.findById(donator?.activeDonation);
        if (!["completed", "cancelled"].includes(subscription.status) || (subscription.status === "cancelled" && subscription.currentEnd > Date.now())) {
            return next(new ErrorHandler("You already have active Donation", 403));
        }
    }

    const subscriptions = await instance.subscriptions.create({
        plan_id: req.body.id,
        total_count: 12,
        quantity: 1,
        customer_notify: 0,
    });

    const plan = await Plan.findOne({ razorPlanId: req.body.id });

    const subscription = await Subscription.create({
        planId: plan._id,
        razorSubscriptionId: subscriptions.id,
        start: 0,
        end: 0,
        currentStart: 0,
        currentEnd: 0,
        nextBilling: 0,
        totalCount: 0,
        paidCount: 0,
        remainingCount: 0,
        shortUrl: subscriptions.short_url,
        status: subscriptions.status,
        subscriptionType: subscriptionEnum.DONATOR,
        user: req.user.id,
    });

    await Donator.findByIdAndUpdate(
        req.user.id,
        { activeDonation: subscription._id },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        subscriptions_id: subscriptions.id,
    });
});

export const createDonation = catchAsyncErrors(async (req, res, next) => {
    const options = {
        amount: Number(req.body.amount) * 100,
        currency: req.body.currency,
        receipt: `receipt_${short.generate()}`
    };

    const order = await instance.orders.create(options);
    if (!order) {
        return next(new ErrorHandler("Order Failed", 400));
    }

    const donation = await Transaction.create({
        amount: req.body.amount,
        status: "created",
        razorpayOrderId: order.id,
        transactionFor: transactionForEnum.DONATOR,
        transactionType: transactionEnum.ONETIME,
        currency: req.body.currency,
        donator: req.donator.id,
    });

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        donation,
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
            await addDonationToQueue(req.body.payload.payment.entity)
        }
    } catch (error) {
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
        const donation = await Transaction.findOne({ razorpayOrderId: payment.order_id });
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

export const getDonatorSubscription = catchAsyncErrors(async (req, res, next) => {
    const donator = await Donator.findById(req.donator.id);

    let subscription;
    if (donator?.activeDonation) {
        subscription = await Subscription.findById(donator?.activeDonation).populate("planId", "_id name amount");;
    }

    res.status(200).json({
        success: true,
        subscription
    });
});

export const getDonatorTransaction = catchAsyncErrors(async (req, res, next) => {
    const transactions = await Transaction.find({ donator: req.donator.id });

    res.status(200).json({
        success: true,
        transactions,
    });
});

export const logoutDonator = catchAsyncErrors(async (req, res, next) => {
    res.cookie("donator_auth", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    })
});