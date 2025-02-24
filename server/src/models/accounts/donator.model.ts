import mongoose, { Schema } from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export interface IDonator extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    firstName?: string;
    lastName?: string;
    email: string;
    phoneNumber?: string;
    address?: {
        street: string,
        city: string,
        state: string,
        postalCode: string,
        country: string,
    }
    customerId: string;
    latestDonation?: mongoose.Schema.Types.ObjectId;
    oneTimePassword?: string;
    oneTimeExpire?: Date;

    generateJWTToken(): string;
    getOneTimePassword(): string;
}

const DonatorSchema: Schema<IDonator> = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            match: [/.+\@.+\..+/, 'Please enter a valid email address']
        },
        phoneNumber: String,
        address: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },
        customerId: String,
        latestDonation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscription",
        },
        oneTimePassword: String,
        oneTimeExpire: Date,
    },
    {
        timestamps: true
    }
);

DonatorSchema.methods.generateJWTToken = function (this: IDonator) {
    const token = jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET as string, 
        { expiresIn: process.env.JWT_EXPIRE as string }
    );
    return token;
};

DonatorSchema.methods.getOneTimePassword = function (this: IDonator) {
    const otp = Math.floor(100000 + Math.random() * 900000);

    this.oneTimePassword = crypto
        .createHash("sha256")
        .update(otp.toString())
        .digest("hex");

    this.oneTimeExpire = new Date(Date.now() + 15 * 60 * 1000);

    return otp.toString();
};

const Donator = mongoose.model("Donator", DonatorSchema);
export default Donator;