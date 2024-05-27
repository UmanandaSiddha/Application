import mongoose from "mongoose";

export const periodEnum = {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
};

export const planEnum = {
    USER: "user",
    ORG: "org",
    FREE: "free",
    CUSTOM: "custom"
}

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
        cards: {
            type: Number,
            required: [true, "Enter Cards Allowed"]
        },
        description: {
            type: String,
            required: [true, "Enter Plan Description"]
        },
        planType: {
            type: String,
            required: true,
            enum: Object.values(planEnum),
        },
        visible: {
            type: Boolean,
            default: true
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
        }
    },
    {
        timestamps: true
    }
)

const Plan = mongoose.model("Plan", planSchema);
export default Plan;