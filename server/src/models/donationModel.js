import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: [true, "Enter Plan Amount"]
        },
        name: {
            type: String,
            required: [true, "Enter Donator Name"]
        },
        email: {
            type: String,
            required: [true, "Enter Donator Email"]
        },
        phone: {
            type: Number,
            required: [true, "Enter Donator Phone"]
        },
        address: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            required: true
        },
        pan: {
            type: Number,
            required: [true, "Enter Pan Number"]
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
            required: true,
            default: "paymentId"
        }, 
        error: Object,
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
    },
    {
        timestamps: true
    }
)

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;