import { Router} from "express";
import { register, login, logout, refreshAccessToken } from '../controllers/index.js'

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refreshAccessToken);
authRouter.post("/logout", logout);

export default authRouter;