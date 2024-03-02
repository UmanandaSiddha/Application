import mongoose from "mongoose";
import validator from "validator";
import bycrpt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const accountEnum = {
    EMAIL: "email",
    GOOGLE: "google",
    HYBRID: "hybrid"
};

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter your Name"],
            maxLength: [30, "Name cannot exceed 30 characters"],
            minLength: [4, "Name should have more than 4 characters"],
        },
        email: {
            type: String,
            required: [true, "Please Enter your Email"],
            unique: true,
            validate: [validator.isEmail, "Please enter a valid Email"],
        },
        image: String,
        password: {
            type: String,
            required: [true, "Please Enter your Password"],
            minLength: [8, "Password should have more than 8 characters"],
            default: "GooglePassword",
            select: false,
        },
        googleId: {
            type: String,
            required: true,
            default: "GoogleID",
            unique: true,
        },
        accountType: {
            type: String,
            required: true,
            enum: Object.values(accountEnum),
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false,
        },
        currentPlan: {
            planName: {
                type: String,
                default: "Plan Name"
            },
            planPrice: {
                type: Number,
                default: 0
            },
            planValidity: {
                type: Number,
                default: 0
            },
            startDate: {
                type: Number,
                default: 0
            },
            endDate: {
                type: Number,
                default: 0
            },
            orderId: {
                type: String,
                default: ""
            },
            planStatus: {
                type: String,
                default: "pending"
            }
        },
        role:{
            type: String,
            default: "user",
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true
    }
)

// Password Hash
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bycrpt.hash(this.password, 10);
});

// JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bycrpt.compare(enteredPassword, this.password);
}

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

const User = mongoose.model("User", userSchema);
export default User;