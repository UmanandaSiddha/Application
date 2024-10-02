import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema(
    {
        cardType: {
            type: String,
            required: true,
        },
        cardId: {
            type: String,
            required: true,
        },
        shortCode: {
            type: String,
            required: true,
            unique: true,
        }
    },
    {
        timestamps: true
    }
)

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);
export default ShortUrl;