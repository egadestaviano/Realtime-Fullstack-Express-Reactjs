import prisma from "../utils/client.js";
import {
  generateAcessToken,
  generateRefreshToken,
  parseJWT,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { inputUserValidation } from "../validations/user.validation.js";

export const createUser = async (req, res, next) => {
  try {
    const { error, value } = inputUserValidation(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        message: "failed",
        data: null,
      });
    }
    const user = await prisma.user.create({
      data: {
        ...value,
      },
    });
    return res.status(201).json({
      error: null,
      message: "success",
      data: user,
    });
  } catch (error) {
    next(
      new Error(
        "Error in src/controllers/user.controller.js:createUser - " +
          error.message
      )
    );
  }
};

export const getAcessToken = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        uuid: id,
      },
    });
    if (!user) {
      return res.status(400).json({
        error: "user not found",
        message: "failed",
        data: null,
      });
    }
    // generate acess token
    user.uuid = "xxxxxxxxxxxxx";
    const acessToken = generateAcessToken(user);
    const refreshToken = generateRefreshToken(user);
    return res.status(200).json({
      error: null,
      message: "success",
      data: user,
      acessToken,
      refreshToken,
    });
  } catch (error) {
    next(
      new Error(
        "Error in src/controllers/user.controller.js:getAcessToken - " +
          error.message
      )
    );
  }
};

export const getRefreshToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        errors: "Invalid token",
        message: "No token provided",
        data: null,
      });
    }
    const verify = verifyRefreshToken(token);
    if (!verify) {
      return res.status(401).json({
        errors: "Invalid token",
        message: "Provided token is not valid",
        data: null,
      });
    }
    let data = parseJWT(token);
    const user = await prisma.user.findUnique({
      where: {
        id: data.id,
      },
    });
    if (!user) {
      return res.status(400).json({
        error: "user not found",
        message: "failed",
        data: null,
      });
    }
    user.uuid = "xxxxxxxxxxxxx";
    const acessToken = generateAcessToken(user);
    const refreshToken = generateRefreshToken(user);
    return res.status(200).json({
      error: null,
      message: "success",
      data: user,
      acessToken,
      refreshToken,
    });
  } catch (error) {
    next(
      new Error(
        "Error in src/controllers/user.controller.js:getRefreshToken - " +
          error.message
      )
    );
  }
};
