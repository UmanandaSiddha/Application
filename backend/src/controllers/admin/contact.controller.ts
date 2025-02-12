import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import { NextFunction, Request, Response } from "express";
import ApiFeatures from "../../utils/services/api.features.js";
import Contact from "../../models/messages/contact.model.js";
import mongoose from "mongoose";

export const getAllContacts = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const resultPerPage = 20;
    const count = await Contact.countDocuments();

    const apiFeatures = new ApiFeatures(Contact.find().sort({ $natural: -1 }), req.query).filter();
    let filteredContacts = await apiFeatures.getQuery();
    let filteredContactsCount = filteredContacts.length;

    apiFeatures.pagination(resultPerPage);
    filteredContacts = await apiFeatures.getQuery().clone();

    res.status(200).json({
        success: true,
        count,
        resultPerPage,
        contacts: filteredContacts,
        filteredContactsCount
    });
});

export const getSingleContact = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const contact = await Contact.findById(id);
    if (!contact) {
        next(new ErrorHandler("Contact not found", 404));
    }

    res.status(200).json({
        success: true,
        contact
    });
});

export const deleteContact = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const contact = await Contact.findById(id);
    if (!contact) {
        next(new ErrorHandler("Contact not found", 404));
    }

    await Contact.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Contact deleted successfully"
    });
});

export const switchAttendedContact = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid ID format", 400));
    }
    const contact = await Contact.findById(id);
    if (!contact) {
        return next(new ErrorHandler("Contact not found", 404));
    }

    const newContact = await Contact.findByIdAndUpdate(
        id, 
        { attended: !contact.attended }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        contact: newContact,
        message: "Contact attended switched successfully"
    });
});