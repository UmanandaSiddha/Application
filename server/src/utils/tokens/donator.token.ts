import { CookieOptions, Response } from "express";
import { IDonator } from "../../models/accounts/donator.model.js";

const sendDonatorToken = (donator: IDonator, statusCode: number, res: Response) => {
    const donator_auth = donator.generateJWTToken();

    const options: CookieOptions = {
        expires: new Date(
            Date.now() + parseInt(process.env.COOKIE_EXPIRE as string) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true,            
        sameSite: 'strict',       
    };

    res.status(statusCode).cookie("donator_auth", donator_auth, options).json({
        success: true,
        donator,
        donator_auth,
    });
};

export default sendDonatorToken;