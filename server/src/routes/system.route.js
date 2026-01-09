import { Router } from "express";
import { reportBug } from "../controllers/index.js";

const systemRouter = Router();

systemRouter.post("/report-bug", reportBug);

export default systemRouter;