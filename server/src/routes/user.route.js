import { authMiddleware } from "../middlewares/auth.middleware.js";
import { Router } from "express";

export const userRouter = Router()

userRouter.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: 'welcome to your profile',
        user: req.user
    })
} )