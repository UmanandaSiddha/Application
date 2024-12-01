import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter Animal Name"],
        },
        scientificName: String,
        habitat: String,
        geographicalRange: String,
        physicalDescription: String,
        diet: String,
        lifespan: String,
        behavior: String,
        conservationStatus: String,
        ownerName: String,
        location: String,
        caretakerMobileNumber: String,
        additionalNotes: String,
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