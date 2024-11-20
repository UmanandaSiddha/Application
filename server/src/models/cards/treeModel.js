import mongoose from "mongoose";

const treeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter Tree Name"],
        },
        scientificName: String,
        treeType: String,
        location: String,
        description: String,
        features: String,
        maintenance: String,
        benefits: String,
        funFact: String,
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

const Tree = mongoose.model("Tree", treeSchema);
export default Tree;