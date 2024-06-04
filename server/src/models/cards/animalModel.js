import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
    {
        name: String,
        species: String,
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

const Animal = mongoose.model("Animal", animalSchema);
export default Animal;