import authMiddleware from "../middlewares/auth.middleware.js";
import { Router } from "express";
import logger from "../utils/logger.js";

const userRouter = Router()

userRouter.get("/profile", authMiddleware, (req, res) => {


  return res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    },
    
  });
});

export default userRouter;