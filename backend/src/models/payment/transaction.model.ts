import mongoose, { Schema } from "mongoose";
import { SubscriptionEnum } from "./subscription.model.js";

export const TransactionEnum = {
    RECURRING: "RECURRING",
    ONETIME: "ONETIME"
}

export interface ITransaction extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    amount: number;
    start: Date;
    end: Date;
    status: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    error: any;
    transactionFor: (typeof SubscriptionEnum)[keyof typeof SubscriptionEnum];
    transactionType: (typeof TransactionEnum)[keyof typeof TransactionEnum];
    currency: string;
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

const TransactionSchema: Schema<ITransaction> = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: [true, "Enter Plan Amount"]
        },
        start: Date,
        end: Date,
        status: {
            type: String,
            required: true
        },
        razorpayOrderId: {
            type: String,
            required: true
        },
        razorpayPaymentId: {
            type: String,
            required: true
        },
        error: Object,
        transactionFor: {
            type: String,
            required: true,
            enum: Object.values(SubscriptionEnum),
        },
        transactionType: {
            type: String,
            required: true,
            enum: Object.values(TransactionEnum),
        },
        currency: {
            type: String,
            required: true,
            default: "INR"
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

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;