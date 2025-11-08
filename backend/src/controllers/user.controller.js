import prisma from "../utils/client.js";
import {
  generateAccessToken,
  generateRefreshToken,
  parseJWT,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { inputUserValidation } from "../validations/user.validation.js";

/**
 * Create new user
 */
export const createUser = async (req, res, next) => {
  try {
    const { error, value } = inputUserValidation(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
        data: null,
      });
    }

    const user = await prisma.user.create({ data: value });

    return res.status(201).json({
      error: false,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(new Error(`Error in user.controller:createUser - ${error.message}`));
  }
};

/**
 * Generate access & refresh token by UUID
 */
export const getAccessToken = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { uuid: id },
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
        data: null,
      });
    }

    const safeUser = { ...user, uuid: "xxxxxxxxxxxxx" };
    const accessToken = generateAccessToken(safeUser);
    const refreshToken = generateRefreshToken(safeUser);

    return res.status(200).json({
      error: false,
      message: "Tokens generated successfully",
      data: {
        user: safeUser,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(new Error(`Error in user.controller:getAccessToken - ${error.message}`));
  }
};

/**
 * Verify refresh token and generate new tokens
 */
export const getRefreshToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        error: true,
        message: "No token provided",
        data: null,
      });
    }

    const token = authHeader.split(" ")[1];
    const isValid = verifyRefreshToken(token);
    if (!isValid) {
      return res.status(401).json({
        error: true,
        message: "Invalid refresh token",
        data: null,
      });
    }

    const payload = parseJWT(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
        data: null,
      });
    }

    const safeUser = { ...user, uuid: "xxxxxxxxxxxxx" };
    const accessToken = generateAccessToken(safeUser);
    const refreshToken = generateRefreshToken(safeUser);

    return res.status(200).json({
      error: false,
      message: "Tokens refreshed successfully",
      data: {
        user: safeUser,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(new Error(`Error in user.controller:getRefreshToken - ${error.message}`));
  }
};
