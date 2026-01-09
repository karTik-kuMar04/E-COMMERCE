import authMiddleware from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { 
  addToCart,
  addToFavorites,
  getCart,
  getFavorites,
  removeFromCart,
  updateQuantityInCart,
  removeFromFavorite,
  checkoutCart,
  checkoutSingleBook
} from "../controllers/index.js";

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

// Cart Route's
userRouter.post("/cart", authMiddleware, addToCart);
userRouter.get("/cart", authMiddleware, getCart);
userRouter.delete("/cart/:formatId", authMiddleware, removeFromCart);
userRouter.patch("/cart", authMiddleware, updateQuantityInCart)

// Favorites Route's
userRouter.post("/favorites", authMiddleware, addToFavorites);
userRouter.get("/favorites", authMiddleware, getFavorites)
userRouter.delete("/favorites", authMiddleware, removeFromFavorite)


// Checkout route's
userRouter.post("/checkout/cart", authMiddleware, checkoutCart);
userRouter.post("/checkout/book", authMiddleware, checkoutSingleBook);

export default userRouter;