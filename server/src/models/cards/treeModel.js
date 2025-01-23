import mongoose from "mongoose";

const treeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter Tree Name"],
        },
        scientificName: {
            type: String,
            default: ""
        },
        family: {
            type: String,
            default: ""
        },
        origin: {
            type: String,
            default: ""
        },
        habitat: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        height: {
            type: String,
            default: ""
        },
        leafType: {
            type: String,
            default: ""
        },
        flowerColor: {
            type: String,
            default: ""
        },
        uses: {
            type: String,
            default: ""
        },
        careInstructions: {
            type: String,
            default: ""
        },
        specialFeatures: {
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

const Tree = mongoose.model("Tree", treeSchema);
export default Tree;