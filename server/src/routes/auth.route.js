import { Router} from "express";
import { register, login } from '../controllers/auth.controller.js'
import { refreshAccessToken } from "../controllers/token.controller.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login)
authRouter.post("/refresh", refreshAccessToken);