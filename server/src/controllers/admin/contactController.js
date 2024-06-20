import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import Contact from "../../models/messages/contactModel.js";

export const getAllContacts = catchAsyncErrors(async (req, res, next) => {
    const contacts = await Contact.find({ report: false });
    const count = await Contact.countDocuments({ report: false });

    res.status(200).json({
        success: true,
        contacts,
        count
    });
});

export const getAllReports = catchAsyncErrors(async (req, res, next) => {
    const reports = await Contact.find({ report: true });
    const count = await Contact.countDocuments({ report: true });

    res.status(200).json({
        success: true,
        reports,
        count
    });
});

export const getAttendedContact = catchAsyncErrors(async (req, res, next) => {
    const contacts = await Contact.find({ attended: true, report: false });
    const count = await Contact.countDocuments({ attended: true, report: false });

    res.status(200).json({
        success: true,
        contacts,
        count
    });
});

export const getUnAttendedContact = catchAsyncErrors(async (req, res, next) => {
    const contacts = await Contact.find({ attended: false, report: false });
    const count = await Contact.countDocuments({ attended: false, report: false });

    res.status(200).json({
        success: true,
        contacts,
        count
    });
});

export const getAttendedReport = catchAsyncErrors(async (req, res, next) => {
    const reports = await Contact.find({ attended: true, report: true });
    const count = await Contact.countDocuments({ attended: true, report: true });

    res.status(200).json({
        success: true,
        reports,
        count
    });
});

export const getUnAttendedReport = catchAsyncErrors(async (req, res, next) => {
    const reports = await Contact.find({ attended: false, report: true });
    const count = await Contact.countDocuments({ attended: false, report: true });

    res.status(200).json({
        success: true,
        reports,
        count
    });
});

export const getSingleContact = catchAsyncErrors(async (req, res, next) => {
    const contact = await Contact.findOne({ _id: req.params.id, report: false });

    if (!contact) {
        next(new ErrorHandler("Contact not found", 404));
    }

    res.status(200).json({
        success: true,
        contact
    });
});

export const getSingleReport = catchAsyncErrors(async (req, res, next) => {
    const report = await Contact.findOne({ _id: req.params.id, report: true });

    if (!report) {
        next(new ErrorHandler("Report not found", 404));
    }

    res.status(200).json({
        success: true,
        report
    });
});

export const deleteContact = catchAsyncErrors(async (req, res, next) => {
    const contact = await Contact.findOne({ _id: req.params.id, report: false });
    if (!contact) {
        next(new ErrorHandler("Contact not found", 404));
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Contact deleted successfully"
    });
});

export const deleteReport = catchAsyncErrors(async (req, res, next) => {
    const report = await Contact.findOne({ _id: req.params.id, report: true });
    if (!report) {
        next(new ErrorHandler("Report not found", 404));
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Report deleted successfully"
    });
});

export const switchAttendedContact = catchAsyncErrors(async (req, res, next) => {

    const contact = await Contact.findOne({ _id: req.params.id, report: false });
    if (!contact) {
        next(new ErrorHandler("Contact not found", 404));
    }

    await Contact.findByIdAndUpdate(
        req.params.id, 
        { attended: !contact.attended }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: "Contact attended switched successfully"
    });
});

export const switchAttendedReport = catchAsyncErrors(async (req, res, next) => {

    const report = await Contact.findOne({ _id: req.params.id, report: true });
    if (!report) {
        next(new ErrorHandler("Report not found", 404));
    }

    await Contact.findByIdAndUpdate(
        req.params.id, 
        { attended: !report.attended }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: "Report attended switched successfully"
    });
});