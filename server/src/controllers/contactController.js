import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Contact from "../models/messages/contactModel.js";

export const getContact = catchAsyncErrors(async (req, res, next) => {
    const contacts = await Contact.find();
    const count = await Contact.countDocuments();

    res.status(200).json({
        success: true,
        contacts,
        count
    });
});

export const getReport = catchAsyncErrors(async (req, res, next) => {
    const reports = await Contact.find({ report: true });
    const count = await Contact.countDocuments({ report: true });

    res.status(200).json({
        success: true,
        reports,
        count
    });
});

export const getAttendedContact = catchAsyncErrors(async (req, res, next) => {
    const contacts = await Contact.find({ attended: true });
    const count = await Contact.countDocuments({ attended: true });

    res.status(200).json({
        success: true,
        contacts,
        count
    });
});

export const getSingleContact = catchAsyncErrors(async (req, res, next) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        next(new ErrorHandler("Contact not founf", 404));
    }

    res.status(200).json({
        success: true,
        contact
    });
});

export const createContact = catchAsyncErrors(async (req, res, next) => {
    const contact = await Contact.create({
        email: req.body.email,
        name: req.body.name,
        message: req.body.message,
        report: Boolean(req.body.report)
    });

    res.status(200).json({
        success: true,
        contact
    });
});

export const deleteContact = catchAsyncErrors(async (req, res, next) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        next(new ErrorHandler("Contact not founf", 404));
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "deltedf"
    });
});

export const switchattendedContact = catchAsyncErrors(async (req, res, next) => {

    const contact = await Contact.findById(req.params.id);

    await Contact.findByIdAndUpdate(
        req.params.id, 
        { attended: !contact.attended }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: "done"
    });
});