import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
    {
        species: String,
        name: String,
        age: Number,
        gender: String,
        color: String,
        location: String,
        owner: String,
        phone: Number,
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

export default mongoose.model("Animal", animalSchema);