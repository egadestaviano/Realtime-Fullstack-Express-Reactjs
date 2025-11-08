import winston from "winston";
import "winston-daily-rotate-file";

// Custom format untuk log yang lebih ringan
const customFormat = winston.format.printf(({ level, message, timestamp, label }) => {
  return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;
});

// Transport untuk file dengan rotasi harian
const fileTransport = new winston.transports.DailyRotateFile({
  filename: "./logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "5m", // Meningkatkan ukuran maksimal
  maxFiles: "7d", // Menyimpan log selama 7 hari saja
  level: process.env.NODE_ENV === "production" ? "error" : "info",
  handleExceptions: true,
  handleRejections: true,
});

// Transport untuk console dengan format yang lebih sederhana
const consoleTransport = new winston.transports.Console({
  level: process.env.NODE_ENV === "production" ? "error" : "debug",
  handleExceptions: true,
  handleRejections: true,
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple()
  ),
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "error" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.label({ label: "APP" }),
    winston.format.errors({ stack: true }),
    customFormat
  ),
  transports: [consoleTransport, fileTransport],
  exitOnError: false,
});

// Graceful shutdown untuk logger
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  logger.close(() => {
    process.exit(0);
  });
});
