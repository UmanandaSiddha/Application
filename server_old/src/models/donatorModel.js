import mongoose from "mongoose";
import crypto from "crypto";
import validator from "validator";
import jwt from "jsonwebtoken";

const donatorSchema = new mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            required: [true, "Enter Donator Email"],
            unique: true,
            validate: [validator.isEmail, "Please enter a valid Email"],
        },
        phone: String,
        address: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },
        pan: String,
        customerId: String,
        activeDonation: {
            type: mongoose.Schema.ObjectId,
            ref: "Subscription",
        },
        oneTimePassword: String,
        oneTimeExpire: Date,
    },
    {
        timestamps: true
    }
);

// JWT Token
donatorSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Generating One Time Password
donatorSchema.methods.getOneTimePassword = function ()  {
    const otp = Math.floor(100000 + Math.random() * 900000);

    this.oneTimePassword = crypto
        .createHash("sha256")
        .update(otp.toString())
        .digest("hex");
    
    this.oneTimeExpire = Date.now() + 15 * 60 * 1000;

    return otp.toString(); 
};

const Donator = mongoose.model("Donator", donatorSchema);
export default Donator;