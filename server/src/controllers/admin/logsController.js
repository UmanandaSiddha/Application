import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import ErrorHandler from "../../utils/errorHandler.js";
import fs from "fs";

export const getInfoLogs = catchAsyncErrors( async (req, res, next) => {
    const data = await fs.promises.readFile("./src/logger/logs.log", 'utf8');

    if (!data) {
        return next(new ErrorHandler("Logs File is empty", 404));
    }

    // const logLines = data.split('\n');
    // logLines.forEach((line, index) => {
    //     console.log(`Log Line ${index + 1}: ${line}`);
    // });

    res.status(200).json({
        status:'success',
        data,
    });
});

export const getErrorLogs = catchAsyncErrors( async (req, res, next) => {
    const data = await fs.promises.readFile("./src/logger/error.log", 'utf8');

    if (!data) {
        return next(new ErrorHandler("Error File is empty", 404));
    }

    res.status(200).json({
        status:'success',
        data,
    });
});

export const deleteInfoLogs = catchAsyncErrors( async (req, res, next) => {

    const data = await fs.promises.readFile("./src/logger/logs.log", 'utf8');

    if (!data) {
        return next(new ErrorHandler("Nothing to delete here", 404));
    }

    await fs.promises.truncate('./src/logger/logs.log', 0);

    res.status(200).json({
        status:'success',
        message: 'Logs deleted successfully'
    });
});

export const deleteErrorLogs = catchAsyncErrors( async (req, res, next) => {

    const data = await fs.promises.readFile("./src/logger/error.log", 'utf8');

    if (!data) {
        return next(new ErrorHandler("Nothing to delete here", 404));
    }

    await fs.promises.truncate('./src/logger/error.log', 0);

    res.status(200).json({
        status:'success',
        message: 'Errors deleted successfully'
    });
});