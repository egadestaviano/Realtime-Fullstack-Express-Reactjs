import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";
import { autenticate } from "../controllers/error.controller.js";

const productRouter = Router();

productRouter.get("/products", autenticate, getAllProduct);
productRouter.get("/products/:id", autenticate, getProductById);
productRouter.post("/products", autenticate, createProduct);
productRouter.put("/products/:id", autenticate, updateProduct);
productRouter.delete("/products/:id", autenticate, deleteProduct);

export default productRouter;
