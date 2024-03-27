import mongoose from "mongoose";

const creatorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter your Name"],
        },
        links: [Object],
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

const Creator = mongoose.model("Creator", creatorSchema);
export default Creator;