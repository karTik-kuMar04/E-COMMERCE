import { Router} from "express";
import { register, login, logout } from '../controllers/auth.controller.js'
import { refreshAccessToken } from "../controllers/token.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refreshAccessToken);
authRouter.post("/logout", logout);