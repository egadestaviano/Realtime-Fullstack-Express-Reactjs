import { Router } from "express";
import {
  createUser,
  getAcessToken,
  getRefreshToken,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/users", createUser);
userRouter.get("/users/:id", getAcessToken);
userRouter.get("/refresh", getRefreshToken);

export default userRouter;
