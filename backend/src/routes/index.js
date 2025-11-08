import { Router } from "express";
import productRouter from "./product.route.js";
import { errorHandling, notFound } from "../controllers/error.controller.js";
import userRouter from "./user.router.js";

const app = Router();

app.use("/api", productRouter);
app.use("/api", userRouter);

app.use("*", errorHandling);
app.use("*", notFound);

export default app;
