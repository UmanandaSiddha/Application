import ErrorHandler from "../../utils/errorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import Contact from "../../models/messages/contactModel.js";
import ApiFeatures from "../../utils/services/apiFeatures.js";

export const getAllContacts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 5;
    const count = await Contact.countDocuments();

    const apiFeatures = new ApiFeatures(Contact.find().sort({ $natural: -1 }), req.query).filter();
    let filteredContacts = await apiFeatures.query;
    let filteredContactsCount = filteredContacts.length;

    apiFeatures.pagination(resultPerPage);
    filteredContacts = await apiFeatures.query.clone();

    return res.status(200).json({
        success: true,
        count,
        resultPerPage,
        contacts: filteredContacts,
        filteredContactsCount
    });
});

export const getSingleContact = catchAsyncErrors(async (req, res, next) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        next(new ErrorHandler("Contact not found", 404));
    }

    res.status(200).json({
        success: true,
        contact
    });
});

export const deleteContact = catchAsyncErrors(async (req, res, next) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        next(new ErrorHandler("Contact not found", 404));
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Contact deleted successfully"
    });
});

export const switchAttendedContact = catchAsyncErrors(async (req, res, next) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        next(new ErrorHandler("Contact not found", 404));
    }

    const newContact = await Contact.findByIdAndUpdate(
        req.params.id, 
        { attended: !contact.attended }, 
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        contact: newContact,
        message: "Contact attended switched successfully"
    });
});