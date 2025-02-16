import express from "express";
import qs from "qs";
import axios from "axios";
import User, { accountEnum, roleEnum } from "../models/userModel.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import { CLIENT_URL } from "../server.js";

const router = express.Router();

const getGoogleAuthToken = async (code) => {

    const url = "https://oauth2.googleapis.com/token";

    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URL,
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
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

const getGoogleUser = async (id_token, access_token) => {

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
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

router.route("/api/google/oauth").get(catchAsyncErrors(async (req, res) => {
    const code = req.query.code;

    const { id_token, access_token } = await getGoogleAuthToken(code);
    // const user = jwt.decode(id_token);
    // console.log(user.email);
    const googleUser = await getGoogleUser(id_token, access_token);

    const user = await User.findOne({ email: googleUser.email });

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,            
        sameSite: 'strict',       
    };

    if (user) {
        if (user.googleId === googleUser.id) {
            const token = user.getJWTToken();
            res.status(200).cookie("user_token", token, options);
        } else {
            user.googleId = googleUser.id;
            user.accountType = accountEnum.HYBRID;
            if (user.image.length === 0) {
                user.image = googleUser.picture;
            }
            await user.save();
            const token = user.getJWTToken();
            res.status(200).cookie("user_token", token, options);
        }
    } else {
        const newUser = await User.create({
            name: googleUser.name,
            email: googleUser.email,
            image: googleUser.picture,
            googleId: googleUser.id,
            accountType: accountEnum.GOOGLE,
            role: googleUser.email === process.env.ADMIN_EMAIL ? roleEnum.ADMIN : roleEnum.USER,
            isVerified: googleUser.verified_email,
        });

        const token = newUser.getJWTToken();
        res.status(200).cookie("user_token", token, options);
    }

    res.redirect(CLIENT_URL);
}));

export default router;