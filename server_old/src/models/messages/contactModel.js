import mongoose from "mongoose";
import validator from "validator";

const contactSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Please Enter your Email"],
            validate: [validator.isEmail, "Please enter a valid Email"],
        },
        name: {
            type: String,
            required: [true, "Please Enter your Name"],
        },
        message: {
            type: String,
            required: [true, "Please Enter Message"],
        },
        report: {
            type: Boolean,
            required: true,
            default: false
        },
        attended: {
            type: Boolean,
            required: true,
            default: false
        },
    },
    {
        timestamps: true
    }
)

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;