import prisma from "../utils/client.js";
import { inputProductValidation } from "../validations/product.validation.js";

export const getAllProduct = async (req, res, next) => {
  try {
    const data = await prisma.product.findMany();
    if (!data) {
      return res.status(404).json({
        error: "data not found",
        message: "field",
        data: null,
      });
    }
    res.status(200).json({
      error: null,
      message: "success",
      data,
    });
  } catch (error) {
    next(
      new Error(
        "Error in src/controllers/product.controller.js:getAllProduct - " +
          error.message
      )
    );
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!data) {
      return res.status(404).json({
        error: "data not found",
        message: "field",
        data: null,
      });
    }
    res.status(200).json({
      error: null,
      message: "success",
      data,
    });
  } catch (error) {
    next(
      new Error(
        "Error in src/controllers/product.controller.js:getProductById - " +
          error.message
      )
    );
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { error, value } = inputProductValidation(req.body);
    console.log(error);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        message: "field",
        data: null,
      });
    }
    const data = await prisma.product.create({
      data: {
        ...value,
      },
    });
    return res.status(201).json({
      error: null,
      message: "success",
      data,
    });
  } catch (error) {
    next(
      new Error(
        "Error in src/controllers/product.controller.js:createProduct - " +
          error.message
      )
    );
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = inputProductValidation(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        message: "field",
        data: null,
      });
    }
    const data = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        ...value,
      },
    });
    res.status(200).json({
      error: null,
      message: "success",
      data,
    });
  } catch (error) {
    next(
      new Error(
        "Error in src/controllers/product.controller.js:updateProduct - " +
          error.message
      )
    );
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({
      error: null,
      message: "success",
      data,
    });
  } catch (error) {
    next(
      new Error(
        "Error in src/controllers/product.controller.js:deleteProduct - " +
          error.message
      )
    );
  }
};
