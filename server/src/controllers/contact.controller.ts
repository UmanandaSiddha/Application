import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Contact from "../models/messages/contact.model.js";
import { NextFunction, Request, Response } from "express";

export const createContact = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, name, message, report } = req.body;
    if (!email || !name || !message) return next(new ErrorHandler("All fields are required", 404));

    const contact = await Contact.create({
        email,
        name,
        message,
        report: report !== undefined ? Boolean(report) : undefined
    });

    res.status(200).json({
        success: true,
        contact
    });
});

