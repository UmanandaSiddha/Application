import mongoose from "mongoose";

const treeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter Tree Name"],
        },
        scientificName: String,
        family: String,
        origin: String,
        habitat: String,
        description: String,
        height: String,
        leafType: String,
        flowerColor: String,
        uses: String,
        careInstructions: String,
        specialFeatures: String,
        caretakerMobileNumber: String,
        additionalNotes: String,
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