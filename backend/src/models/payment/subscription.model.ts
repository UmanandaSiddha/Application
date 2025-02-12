import mongoose, { Document, Schema } from "mongoose";

export const SubscriptionEnum = {
    USER: "USER",
    DONATOR: "DONATOR"
}

export interface ISubscription extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    planId:  mongoose.Schema.Types.ObjectId;
    razorSubscriptionId?: string;
    start: Date;
    end: Date;
    currentStart: Date;
    currentEnd: Date;
    nextBilling: Date;
    totalCount: number;
    paidCount: number;
    remainingCount: number;
    shortUrl?: string;
    status: string;
    subscriptionType: (typeof SubscriptionEnum)[keyof typeof SubscriptionEnum];
    paymentMethod?: {
        methodType?: string,
        cardInfo?: {
            cardType?: string,
            issuer?: string,
            last4?: string,
            name?: string,
            network?: string,
        },
        bankInfo?: string,
        walletInfo?: string,
        upiInfo?: string,
        data?: any
    },
    donator?: mongoose.Schema.Types.ObjectId;
    user?: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const SubscriptionSchema: Schema<ISubscription> = new mongoose.Schema(
    {
        planId: {
            type: mongoose.Schema.ObjectId,
            ref: "Plan",
            required: true,
        },
        razorSubscriptionId: String,
        start: {
            type: Date,
            required: true,
            default: new Date(),
        },
        end: {
            type: Date,
            required: true,
            default: new Date(),
        },
        currentStart: {
            type: Date,
            required: true,
            default: new Date(),
        },
        currentEnd: {
            type: Date,
            required: true,
            default: new Date(),
        },
        nextBilling: {
            type: Date,
            required: true,
            default: new Date(),
        },
        totalCount: {
            type: Number,
            required: true,
            default: 0
        },
        paidCount: {
            type: Number,
            required: true,
            default: 0
        },
        remainingCount: {
            type: Number,
            required: true,
            default: 0
        },
        shortUrl: String,
        status: {
            type: String,
            required: true
        },
        subscriptionType: {
            type: String,
            required: true,
            enum: Object.values(SubscriptionEnum),
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

const Subscription = mongoose.model("Subscription", SubscriptionSchema);
export default Subscription;