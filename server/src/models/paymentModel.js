import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true
        },
        plan: {
            type: String,
            required: true
        },
        paymentDate: {
            type: Date,
            required: true
        },
        paymentValidity:  {
            type: Date,
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
        paymentStatus: {
            type: String,
            default: "pending"
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

export default mongoose.model("Payment", paymentSchema);