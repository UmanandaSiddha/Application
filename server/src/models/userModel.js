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

export const roleEnum = {
    USER: "user",
    ADMIN: "admin",
    ORG: "org"
}

export const freeEnum = {
    PLAN: "plan",
    CUSTOM: "custom"
}

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
        },
        accountType: {
            type: String,
            required: true,
            enum: Object.values(accountEnum),
        },
        role: {
            type: String,
            required: true,
            enum: Object.values(roleEnum),
            default: roleEnum.USER,
        },
        isDeactivated : {
            type: Boolean,
            default: false
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        loginAttempt: {
            count: {
                type: Number,
                default: 0
            },
            time: Date,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        freePlan: {
            status: {
                type: Boolean,
                required: true,
                default: false
            },
            start: Date,
            end: Date,
            type: {
                type: String,
                enum: Object.values(freeEnum),
            }
        },
        activePlan: {
            type: mongoose.Schema.ObjectId,
            ref: "Subscription",
        },
        cards: {
            total: {
                type: Number,
                required: true,
                default: 0
            },
            created: {
                type: Number,
                required: true,
                default: 0
            }
        },
        billingAddress: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },
        phone: String,
        orgDetails: {
            website: String,
            address: {
                street: String,
                city: String,
                state: String,
                postalCode: String,
                country: String,
            },
            phone: String,
        },
        oneTimePassword: String,
        oneTimeExpire: Date,
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true
    }
)

// Password Hash
userSchema.pre("save", async function (next) {
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

// Generating One Time Password
userSchema.methods.getOneTimePassword = function ()  {
    const otp = Math.floor(100000 + Math.random() * 900000);

    this.oneTimePassword = crypto
        .createHash("sha256")
        .update(otp.toString())
        .digest("hex");
    
    this.oneTimeExpire = Date.now() + 15 * 60 * 1000;

    return otp.toString(); 
};

const User = mongoose.model("User", userSchema);
export default User;