import mongoose from "mongoose";
import { subscriptionEnum } from "./subscriptionModel.js";

export const transactionEnum = {
    RECURRING: "recurring",
    ONETIME: "onetime"
}

const transactionSchema = new mongoose.Schema(
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
            enum: Object.values(subscriptionEnum),
        },
        transactionType: {
            type: String,
            required: true,
            enum: Object.values(transactionEnum),
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

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;