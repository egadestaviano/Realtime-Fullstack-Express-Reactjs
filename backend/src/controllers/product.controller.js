import prisma from "../utils/client.js";
import { inputProductValidation } from "../validations/product.validation.js";

/**
 * Get all products
 */
export const getAllProduct = async (req, res, next) => {
  try {
    const data = await prisma.product.findMany();

    if (data.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No products found",
        data: [],
      });
    }

    return res.status(200).json({
      error: false,
      message: "Products retrieved successfully",
      data,
    });
  } catch (error) {
    next(new Error(`Error in product.controller:getAllProduct - ${error.message}`));
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: true,
        message: "Invalid product ID",
        data: null,
      });
    }

    const data = await prisma.product.findUnique({ where: { id } });

    if (!data) {
      return res.status(404).json({
        error: true,
        message: "Product not found",
        data: null,
      });
    }

    return res.status(200).json({
      error: false,
      message: "Product retrieved successfully",
      data,
    });
  } catch (error) {
    next(new Error(`Error in product.controller:getProductById - ${error.message}`));
  }
};

/**
 * Create new product
 */
export const createProduct = async (req, res, next) => {
  try {
    const { error, value } = inputProductValidation(req.body);

    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
        data: null,
      });
    }

    const data = await prisma.product.create({ data: value });

    return res.status(201).json({
      error: false,
      message: "Product created successfully",
      data,
    });
  } catch (error) {
    next(new Error(`Error in product.controller:createProduct - ${error.message}`));
  }
};

/**
 * Update existing product
 */
export const updateProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: true,
        message: "Invalid product ID",
        data: null,
      });
    }

    const { error, value } = inputProductValidation(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
        data: null,
      });
    }

    const data = await prisma.product.update({
      where: { id },
      data: value,
    });

    return res.status(200).json({
      error: false,
      message: "Product updated successfully",
      data,
    });
  } catch (error) {
    next(new Error(`Error in product.controller:updateProduct - ${error.message}`));
  }
};

/**
 * Delete product by ID
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        error: true,
        message: "Invalid product ID",
        data: null,
      });
    }

    const data = await prisma.product.delete({ where: { id } });

    return res.status(200).json({
      error: false,
      message: "Product deleted successfully",
      data,
    });
  } catch (error) {
    next(new Error(`Error in product.controller:deleteProduct - ${error.message}`));
  }
};
