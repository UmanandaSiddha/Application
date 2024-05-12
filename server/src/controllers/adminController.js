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
import Animal from "../models/animalModel.js";
import fs from "fs";
import sharp from "sharp";
import { SERVER_URL } from "../server.js";
import { emailQueue } from "../utils/emailQueue.js";

// Get all Users - Only Admin
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    const userCount = await User.countDocuments();

    res.status(200).json({
        success: true,
        count: userCount,
        users,
    });
});

// Get User Details - Only Admin
export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`), 404);
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// Update User Role -- Admin
export const updateRole = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`), 404);
    }

    await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: `User Role Updated`,
    })
});

// Update User Cards -- Admin
export const updateCard = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`), 404);
    }

    await User.findByIdAndUpdate(req.params.id, { "cards.total": req.body.total }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: `User Cards Updated`,
    })
});

// Delete User -- Admin
export const deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`), 404);
    }

    await Tree.deleteMany({ user: req.params.id });
    await Personal.deleteMany({ user: req.params.id });
    await Medical.deleteMany({ user: req.params.id });
    await Creator.deleteMany({ user: req.params.id });
    await Animal.deleteMany({ user: req.params.id });

    user.isDeactivated = true;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User deleted`,
    });
});