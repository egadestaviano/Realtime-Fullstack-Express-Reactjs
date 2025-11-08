import { verifyAccessToken } from "../utils/jwt.js";
import { logger } from "../utils/winston.js";

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  const message = err.message?.split(" - ")[1] || "Unexpected error";
  logger.error(err);

  return res.status(500).json({
    error: true,
    message,
    data: null,
  });
};

/**
 * 404 Not Found handler
 */
export const notFound = (req, res) => {
  return res.status(404).json({
    error: true,
    message: "Resource not found",
    data: null,
  });
};

/**
 * JWT authentication middleware
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: true,
      message: "No token provided",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];
  const user = verifyAccessToken(token);

  if (!user) {
    return res.status(401).json({
      error: true,
      message: "Invalid token",
      data: null,
    });
  }

  req.user = user;
  next();
};
