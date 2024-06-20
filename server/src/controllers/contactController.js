import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Contact from "../models/messages/contactModel.js";

export const createContact = catchAsyncErrors(async (req, res, next) => {

    const { email, name, message } = req.body;

    if (!email || !name || !message) {
        return next(new ErrorHandler("All fields are required", 404));
    }

    const contact = await Contact.create({
        email,
        name,
        message,
        report: Boolean(req.body?.report)
    });

    res.status(200).json({
        success: true,
        contact
    });
});

