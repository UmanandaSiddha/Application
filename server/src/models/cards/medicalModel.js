import mongoose from "mongoose";

const medicalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter Patient Name"],
        },
        dateOfBirth: String,
        gender: String,
        street: String,
        city: String,
        state: String,
        postalCode: Number,
        phone: String,
        email: String,
        emergencyName: String,
        emergencyRelation: String,
        emergencyPhone: String,
        allergyHistory: String,
        chronicHistory: String,
        currentMedication: String,
        previousSurgeries: String,
        smoker: String,
        alcohol: String,
        exercise: String,
        diet: String,
        mentalCondition: String,
        vaccinationHistory: String,
        insuranceProvider: String,
        insurancePolicyNumber: Number,
        insuranceGrpNumber: Number,
        shortCode : {
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