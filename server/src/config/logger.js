import winston, { format } from "winston";
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        label({ label: 'right meow!' }),
        timestamp(),
        myFormat
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: './src/logger/error.log', level: 'error' }),
        new winston.transports.File({ filename: './src/logger/logs.log' }),
    ],
});

// logger.info("i m testing info");
// logger.error("i m testing error");

export default logger;