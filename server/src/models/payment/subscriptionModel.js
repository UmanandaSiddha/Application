import mongoose from "mongoose";

export const subscriptionEnum = {
    USER: "user",
    DONATOR: "donator"
}

const subscriptionSchema = new mongoose.Schema(
    {
        planId: {
            type: mongoose.Schema.ObjectId,
            ref: "Plan",
            required: true,
        },
        razorSubscriptionId: {
            type: String,
            required: true
        },
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        },
        currentStart: {
            type: Date,
            required: true
        },
        currentEnd: {
            type: Date,
            required: true
        },
        nextBilling: {
            type: Date,
            required: true
        },
        totalCount: {
            type: Number,
            required: true
        },
        paidCount: {
            type: Number,
            required: true
        },
        remainingCount: {
            type: Number,
            required: true
        },
        shortUrl: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        subscriptionType: {
            type: String,
            required: true,
            enum: Object.values(subscriptionEnum),
        },
        paymentMethod: {
            methodType: String,
            cardInfo: {
                cardType: String,
                issuer: String,
                last4: String,
                name: String,
                network: String,
            },
            bankInfo: String,
            walletInfo: String,
            upiInfo: String,
            data: Object
        },
        donator: {
            type: mongoose.Schema.ObjectId,
            ref: "Donator",
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true
    }
)

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;