import mongoose from "mongoose";

const medicalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter Patient Name"],
        },
        dateOfBirth: {
            type: String,
            default: ""
        },
        gender: {
            type: String,
            default: ""
        },
        street: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        },
        postalCode: {
            type: Number,
            default: 0
        },
        phone: {
            type: String,
            default: ""
        },
        email: {
            type: String,
            default: ""
        },
        emergencyName: {
            type: String,
            default: ""
        },
        emergencyRelation: {
            type: String,
            default: ""
        },
        emergencyPhone: {
            type: String,
            default: ""
        },
        allergyHistory: {
            type: String,
            default: ""
        },
        chronicHistory: {
            type: String,
            default: ""
        },
        currentMedication: {
            type: String,
            default: ""
        },
        previousSurgeries: {
            type: String,
            default: ""
        },
        smoker: {
            type: String,
            default: ""
        },
        alcohol: {
            type: String,
            default: ""
        },
        exercise: {
            type: String,
            default: ""
        },
        blood: {
            type: String,
            default: ""
        },
        height: {
            type: Number,
            default: 0
        },
        weight: {
            type: Number,
            default: 0
        },
        age: {
            type: Number,
            default: 0
        },
        allergyHistory_Other: {
            type: String,
            default: ""
        },
        chronicHistory_Other: {
            type: String,
            default: ""
        },
        diet_Other: {
            type: String,
            default: ""
        },
        exercise_Other: {
            type: String,
            default: ""
        },
        diet: {
            type: String,
            default: ""
        },
        mentalCondition: {
            type: String,
            default: ""
        },
        vaccinationHistory: {
            type: String,
            default: ""
        },
        insuranceProvider: {
            type: String,
            default: ""
        },
        insurancePolicyNumber: {
            type: Number,
            default: 0
        },
        insuranceGrpNumber: {
            type: Number,
            default: 0
        },
        shortCode: {
            type: String,
            required: true,
            unique: true,
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

const Medical = mongoose.model("Medical", medicalSchema);
export default Medical;