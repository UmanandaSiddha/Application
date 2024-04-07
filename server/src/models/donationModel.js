import mongoose from "mongoose";

export const statusEnum = {
    CREATED: "created",
    SUCCESS: "success",
    FAILED: "failed"
}

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
        status: {
            required: true,
            enum: Object.values(statusEnum),
            default: statusEnum.CREATED,
        },
        razorpayOrderId: {
            type: String,
            required: true
        }, 
        razorpayPaymentId: {
            type: String,
            required: true,
            default: "processing"
        }, 
    },
    {
        timestamps: true
    }
)

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;