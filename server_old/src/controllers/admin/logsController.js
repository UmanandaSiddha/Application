import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";
import ErrorHandler from "../../utils/errorHandler.js";
import fs from "fs";

export const getInfoLogs = catchAsyncErrors( async (req, res, next) => {
    const data = await fs.promises.readFile("./logger/logs.log", 'utf8');
    if (!data) {
        return next(new ErrorHandler("Logs File is empty", 404));
    }

    let logs = [];

    const logLines = data.split('\n');
    logLines.forEach((line, index) => {
        if (line.trim() !== '') {
            const logParts = line.match(/(.*?)\s\[(.*?)\]\s(.*?):\s(.*)/);
            
            if (logParts && logParts.length === 5) {
                const [_, timestamp, tag, level, description] = logParts;

                logs.push({
                    id: index + 1,
                    data: {
                        timestamp,
                        tag,
                        level,
                        description
                    }
                });
            }
        }
    });

    res.status(200).json({
        status:'success',
        data: logs,
    });
});

export const getErrorLogs = catchAsyncErrors( async (req, res, next) => {
    const data = await fs.promises.readFile("./logger/error.log", 'utf8');
    if (!data) {
        return next(new ErrorHandler("Error File is empty", 404));
    }

    let logs = [];

    const logLines = data.split('\n');
    logLines.forEach((line, index) => {
        if (line.trim() !== '') {
            const logParts = line.match(/(.*?)\s\[(.*?)\]\s(.*?):\s(.*)/);
            
            if (logParts && logParts.length === 5) {
                const [_, timestamp, tag, level, description] = logParts;

                logs.push({
                    id: index + 1,
                    data: {
                        timestamp,
                        tag,
                        level,
                        description
                    }
                });
            }
        }
    });

    res.status(200).json({
        status:'success',
        data: logs,
    });
});

export const deleteInfoLogs = catchAsyncErrors( async (req, res, next) => {
    const data = await fs.promises.readFile("./logger/logs.log", 'utf8');
    if (!data) {
        return next(new ErrorHandler("Nothing to delete here", 404));
    }

    await fs.promises.truncate('./logger/logs.log', 0);

    res.status(200).json({
        status:'success',
        message: 'Logs deleted successfully'
    });
});

export const deleteErrorLogs = catchAsyncErrors( async (req, res, next) => {
    const data = await fs.promises.readFile("./logger/error.log", 'utf8');
    if (!data) {
        return next(new ErrorHandler("Nothing to delete here", 404));
    }

    await fs.promises.truncate('./logger/error.log', 0);

    res.status(200).json({
        status:'success',
        message: 'Errors deleted successfully'
    });
});