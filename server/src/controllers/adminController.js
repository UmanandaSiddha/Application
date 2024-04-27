import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User, { accountEnum, roleEnum } from "../models/userModel.js";
import sendToken from "../utils/jwtToken.js";
import crypto from "crypto";
import { CLIENT_URL, redis } from "../server.js";
import Tree from "../models/treeModel.js";
import Personal from "../models/personalModel.js";
import Medical from "../models/medicalModel.js";
import Creator from "../models/creatorModel.js";
import fs from "fs";
import sharp from "sharp";
import { SERVER_URL } from "../server.js";
import Animal from "../models/animalModel.js";
import { emailQueue } from "../utils/emailQueue.js";

export const checkEmailQueue = catchAsyncErrors(async (req, res) => {
    const result = await redis.xlen("bull:email-queue:events");

    res.status(200).json({
        success: true,
        result,
    });
});

export const deleteEmailQueue = catchAsyncErrors(async (req, res) => {
    const result = await redis.xlen("bull:email-queue:events");
    if (result > 0) {
        await redis.del("bull:email-queue:events");
    }
    
    res.status(200).json({
        success: true,
        message: "Email Queue stream deleted"
    });
});