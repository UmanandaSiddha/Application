import express, { CookieOptions } from "express";
import qs, { ParsedQs } from "qs";
import axios from "axios";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import User, { UserAccountEnum, UserRoleEnum } from "../models/accounts/user.model.js";
import { CLIENT_URL } from "../index.js";

const router = express.Router();

const getGoogleAuthToken = async (code: string | ParsedQs | string[] | ParsedQs[]) => {
    const url = "https://oauth2.googleapis.com/token";

    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: process.env.REDIRECT_URL as string,
        grant_type: "authorization_code",
    };

    try {
        const res = await axios.post(
            url,
            qs.stringify(values),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        return res.data;
    } catch (error: any) {
        console.error("AUth Token: ", error.message);
        throw new Error(error.message);
    }
}

const getGoogleUser = async (id_token: string, access_token: string) => {
    try {
        const res = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        );
        return res.data;
    } catch (error: any) {
        console.error("Google User: ", error.message);
        throw new Error(error.message);
    }
}

router.route("/api/google/oauth").get(catchAsyncErrors(async (req, res) => {
    const { code } = req.query;
    if (!code) {
        throw new ErrorHandler("No code provided", 400);
    }

    const { id_token, access_token } = await getGoogleAuthToken(code);
    const googleUser = await getGoogleUser(id_token, access_token);

    if (!googleUser.email) {
        throw new ErrorHandler("Google authentication failed: No email received", 400);
    }

    const options: CookieOptions = {
        expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRE as string) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,            
        sameSite: 'strict',       
    };

    let user = await User.findOne({ "profile.email": googleUser.email });

    if (user) {
        if (user.profile.googleId !== googleUser.id) {
            user.profile.googleId = googleUser.id;
            user.account.accountType = [...new Set([...user.account.accountType, UserAccountEnum.GOOGLE])];
            if (!user.profile.profilePicture || user.profile.profilePicture.length === 0) {
                user.profile.profilePicture = googleUser.picture;
            }
            await user.save();
        }
    } else {
        // Fixing the missing firstName, lastName issue
        const fullName = googleUser.name?.split(" ") || ["", ""];
        const firstName = fullName[0] || "Unknown";
        const lastName = fullName.slice(1).join(" ") || "Unknown";

        user = await User.create({
            profile: {
                firstName,
                lastName,
                email: googleUser.email,
                profilePicture: googleUser.picture || "",
                googleId: googleUser.id,
                role: googleUser.email === process.env.ADMIN_EMAIL ? UserRoleEnum.ADMIN : UserRoleEnum.USER,
            },
            account: {
                accountType: [UserAccountEnum.GOOGLE],
                isVerified: googleUser.verified_email || false,
            }
        });
    }

    const token = user.generateJWTToken();
    res.cookie("user_token", token, options);

    return res.redirect(CLIENT_URL);
}));

export default router;