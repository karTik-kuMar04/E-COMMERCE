import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const loggerFormat = printf(({ level, message, timestamp, ...meta }) => {
    const rest = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${timestamp} [${level}] ${message} ${rest}`;
})

const logger = winston.createLogger({
    level: "info",
    format: combine(
        colorize({ level: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        loggerFormat
    ),
    transports: [
        new winston.transports.Console()
    ],
})

export default logger