import mongoose from "mongoose";

export const periodEnum = {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
};

const planSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Enter Plan Name"]
        },
        amount: {
            type: Number,
            required: [true, "Enter Plan Amount"]
        },
        vcards: {
            type: Number,
            required: [true, "Enter VCards Allowed"]
        },
        description: {
            type: String,
            required: [true, "Enter Plan Description"]
        },
        period: {
            type: String,
            required: true,
            enum: Object.values(periodEnum),
        },
        interval: {
            type: Number,
            required: [true, "Enter Plan Interval"]
        },
        razorPlanId: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

const Plan = mongoose.model("Plan", planSchema);
export default Plan;