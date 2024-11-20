import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter Animal Name"],
        },
        species: String,
        age: Number,
        gender: String,
        color: String,
        location: String,
        owner: String,
        phone: String,
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

const Animal = mongoose.model("Animal", animalSchema);
export default Animal;