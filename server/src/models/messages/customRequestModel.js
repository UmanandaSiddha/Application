import mongoose from "mongoose";
import validator from "validator";
import { periodEnum } from "../payment/planModel.js";

export const acceptedEnum = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
}

const customRequestSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Please Enter your Email"],
            validate: [validator.isEmail, "Please enter a valid Email"],
        },
        attended: {
            type: Boolean,
            required: true,
            default: false
        },
        accepted: {
            type: String,
            enum: Object.values(acceptedEnum),
        },
        reason: String,
        cards: {
            type: Number,
            required: true
        },
        comment: String,
        period: {
            type: String,
            required: true,
            enum: Object.values(periodEnum),
        },
        interval: {
            type: Number,
            required: [true, "Enter Plan Interval"]
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

const CustomRequest = mongoose.model("CustomRequest", customRequestSchema);
export default CustomRequest;