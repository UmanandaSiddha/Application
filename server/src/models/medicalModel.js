import mongoose from "mongoose";

const medicalSchema = new mongoose.Schema(
    {
        personalInfo: {
            name: String,
            birth: Date,
            gender: String,
            address: {
                street: String,
                city: String,
                state: String,
                postalCode: Number,
            },
            phone: Number,
            email: String,
            emergency: {
                name: String,
                relation: String,
                phone: Number,
            }
        },
        healthHistory: {
            allergy: String,
            chronic: String,
        },
        currentMedication: String,
        previousSurgeries: String,
        healthHabits: {
            smoker: String,
            alcohol: String,
            exercise: String,
            diet: String,
            mentalCondition: String,
            vaccinationHistory: String,
        },
        insuranceInfo: {
            provider: String,
            policyNumber: Number,
            grpNumber: Number
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

export default mongoose.model("Medical", medicalSchema);