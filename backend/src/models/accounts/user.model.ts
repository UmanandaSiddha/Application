import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const UserRoleEnum = {
    USER: "USER",
    ADMIN: "ADMIN",
    ORGANIZATION: "ORGANIZATION"
} as const;

export const UserAccountEnum = {
    EMAIL: "EMAIL",
    GOOGLE: "GOOGLE",
} as const;

export interface IBillingInfo extends Document {
    phoneNumber?: string;
    address: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    }
}

export interface IUser extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    profile: {
        firstName: string;
        lastName: string;
        email: string;
        profilePicture?: string;
        password?: string;
        role: typeof UserRoleEnum[keyof typeof UserRoleEnum];
        googleId?: string;
        customerId?: string;
    }
    account: {
        accountType: Array<typeof UserAccountEnum[keyof typeof UserAccountEnum]>;
        isBlocked: boolean;
        isVerified: boolean;
        isDeactivated: boolean;
        deactivateReason?: string;
        deactivateTime?: Date;
        loginAttempt?: {
            count: number;
            lastLogin: Date;
        }
    }
    access: {
        billingInfo?: IBillingInfo;
        latestSubscription?: mongoose.Schema.Types.ObjectId;
        freeAccess: boolean;
        cards: {
            total: {
                initial: number;
                extra: number;
            }
            created: number;
        }
    }
    organization?: {
        website: string;
        organizationBilling: IBillingInfo;
    }
    oneTimePassword?: string;
    oneTimeExpire?: Date;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    createdAt: Date;
    updatedAt: Date;

    generateJWTToken(): string;
    comparePassword(enteredPassword: string): Promise<boolean>;
    getResetPasswordToken(): string;
    getOneTimePassword(): string;
}

const BillingInfoSchema: Schema<IBillingInfo> = new mongoose.Schema(
    {
        phoneNumber: String,
        address: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        }
    },
    {
        _id: false
    }
)

const UserSchema: Schema<IUser> = new mongoose.Schema(
    {
        profile: {
            firstName: {
                type: String,
                required: true
            },
            lastName: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
                unique: true,
                index: true,
                match: [/.+\@.+\..+/, 'Please enter a valid email address']
            },
            password: {
                type: String,
                required: [true, "Please Enter your Password"],
                minLength: [8, "Password should have more than 8 characters"],
                default: "GooglePassword",
                select: false
            },
            profilePicture: {
                type: String,
                default: ''
            },
            role: {
                type: String,
                enum: Object.values(UserRoleEnum),
                default: UserRoleEnum.USER,
            },
            googleId: String,
            customerId: String,
        },
        account: {
            accountType: {
                type: [{
                    type: String,
                    enum: Object.values(UserAccountEnum),
                }],
                default: [UserAccountEnum.EMAIL],
            },
            isBlocked: {
                type: Boolean,
                default: false
            },
            isVerified: {
                type: Boolean,
                default: false
            },
            isDeactivated: {
                type: Boolean,
                default: false
            },
            deactivateReason: String,
            deactivateTime: Date,
            loginAttempt: {
                count: {
                    type: Number,
                    default: 0,
                },
                lastLogin: {
                    type: Date,
                    default: Date.now
                },
            },
        },
        access: {
            billingInfo: BillingInfoSchema,
            latestSubscription: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Subscription',
            },
            freeAccess: {
                type: Boolean,
                required: true,
                default: false
            },
            cards: {
                total: {
                    initial: {
                        type: Number,
                        required: true,
                        default: 10
                    },
                    extra: {
                        type: Number,
                        required: true,
                        default: 0
                    }
                },
                created: {
                    type: Number,
                    required: true,
                    default: 0
                }
            },
        },
        organization: {
            website: String,
            organizationBilling: BillingInfoSchema,
        },
        oneTimePassword: String,
        oneTimeExpire: Date,
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true,
    }
);

// Password Hash
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("profile.password")) {
        return next();
    }
    if (this.profile.password) {
        this.profile.password = await bcrypt.hash(this.profile.password, 10);
    }
    next();
});

// Access Token
UserSchema.methods.generateJWTToken = function (this: IUser) {
    const token = jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRE as string }
    );
    return token;
};

// Compare Password
UserSchema.methods.comparePassword = async function (this: IUser, enteredPassword: string): Promise<boolean> {
    if (!this.profile.password) return false;
    return await bcrypt.compare(enteredPassword, this.profile.password);
};

// Generating Password Reset Token
UserSchema.methods.getResetPasswordToken = function (this: IUser) {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

    return resetToken;
};

// Generating One Time Password
UserSchema.methods.getOneTimePassword = function (this: IUser) {
    const otp = Math.floor(100000 + Math.random() * 900000);

    this.oneTimePassword = crypto
        .createHash("sha256")
        .update(otp.toString())
        .digest("hex");

    this.oneTimeExpire = new Date(Date.now() + 15 * 60 * 1000);

    return otp.toString();
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;