import { authMiddleware } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const userRouter = Router()

userRouter.get("/profile", authMiddleware, (req, res) => {
  if (!req.user) return res.status(204).send();
  res.status(200).json({ user: req.user });
});

export default userRouter;