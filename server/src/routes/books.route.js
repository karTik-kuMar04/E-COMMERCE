import { Router } from "express";
import { addBook } from "../controllers/books/addBook.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const bookRouter = Router();

bookRouter.post(
    "/add",
    upload.fields([
        { name: "cover", maxCount: 1},
        { name: "back", maxCount: 1},
        { name: "interior", maxCount: 3}
    ]),
    addBook
)

export default bookRouter