import mongoose from "mongoose";

export const methodEnum = {
    CARD: "card",
    UPI: "upi",
    WALLET: "wallet",
    NETBANKING: "netbanking"
}

const transactionSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: [true, "Enter Plan Amount"]
        },
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        },
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
        paymentMethod: {
            methodType: {
                type: String,
                enum: Object.values(methodEnum),
            },
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

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;