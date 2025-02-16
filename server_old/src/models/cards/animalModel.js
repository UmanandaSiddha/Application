import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter Animal Name"],
        },
        scientificName: {
            type: String,
            default: ""
        },
        habitat: {
            type: String,
            default: ""
        },
        geographicalRange: {
            type: String,
            default: ""
        },
        physicalDescription: {
            type: String,
            default: ""
        },
        diet: {
            type: String,
            default: ""
        },
        lifespan: {
            type: String,
            default: ""
        },
        behavior: {
            type: String,
            default: ""
        },
        conservationStatus: {
            type: String,
            default: ""
        },
        ownerName: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            default: ""
        },
        caretakerMobileNumber: {
            type: String,
            default: ""
        },
        additionalNotes: {
            type: String,
            default: ""
        },
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