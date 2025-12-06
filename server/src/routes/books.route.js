import { Router } from "express";
import { addBook, getBookById, getBooks, getHomeBooks } from "../controllers/index.js";
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
bookRouter.get("/home", getHomeBooks);
bookRouter.get("/", getBooks);
bookRouter.get("/:id", getBookById);
export default bookRouter