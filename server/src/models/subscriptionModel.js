import mongoose from "mongoose";

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
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true
    }
)

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;