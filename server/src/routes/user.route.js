import authMiddleware from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { addToCart, addToFavorites } from "../controllers/index.js";

const userRouter = Router()

userRouter.get("/profile", authMiddleware, (req, res) => {


  return res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      createdAt: req.user.created_at
    },
    
  });
});

userRouter.post("/cart", authMiddleware, addToCart);
userRouter.post("/favorites", authMiddleware, addToFavorites);


export default userRouter;