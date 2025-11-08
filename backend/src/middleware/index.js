import express from "express";
import "../utils/winston.js";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import app from "../routes/index.js";

const appMiddleware = express();

// Security middleware
appMiddleware.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Compression middleware
appMiddleware.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
appMiddleware.use('/api/', limiter);

// CORS configuration
appMiddleware.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
appMiddleware.use(express.json({ limit: '10mb' }));
appMiddleware.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
appMiddleware.use(app);

export default appMiddleware;
