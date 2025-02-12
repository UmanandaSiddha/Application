
import mongoose, { Document, Schema } from "mongoose";

export const PeriodEnum = {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
} as const;

export const PlanEnum = {
    USER: "USER",
    ORGANIZATION: "ORGANIZATION",
    FREE: "FREE",
    CUSTOM: "CUSTOM",
    DONATOR: "DONATOR",
} as const;

interface IPLan extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    amount: number;
    cards: number;
    description: string;
    planType: (typeof PlanEnum)[keyof typeof PlanEnum];
    visible: boolean;
    period: (typeof PeriodEnum)[keyof typeof PeriodEnum];
    interval: number;
    razorPlanId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PlanSchema: Schema<IPLan> = new mongoose.Schema(
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
            enum: Object.values(PlanEnum),
        },
        visible: {
            type: Boolean,
            default: true
        },
        period: {
            type: String,
            required: true,
            enum: Object.values(PeriodEnum),
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

const Plan = mongoose.model("Plan", PlanSchema);
export default Plan;