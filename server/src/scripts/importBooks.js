import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import { addBook } from "../controllers/books/addBook.controller.js";
import logger from "../utils/logger.js";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to books.json
const booksPath = path.join(__dirname, "../models/books.json");

// Load JSON file manually
const books = JSON.parse(fs.readFileSync(booksPath, "utf-8"));


const run = async () => {
    logger.info("Strating bulk import ...");

    let success = 0;
    let faliure = 0;

    for (let i = 0; i < books.length; i ++) 
    {
        const book = books[i];

        const req = {
            body: {
                title: book.title,
                subtitle: book.subtitle,
                description: book.description,
                publisher: book.publisher,
                publication_date: book.publication_date,
                isbn10: book.isbn10,
                isbn13: book.isbn13,
                genre: book.genre,
                edition: book.edition,
                series: book.series,
                author_bio: book.author_bio,
                authors: book.authors,
                tags: book.tags,
                awards: book.awards,
                formats: book.formats,
                images: book.images
            },
            files: {}
        };


        const res = {
            status: function(code) {
                this.statusCode = code;
                return this
            },
            json: function (data) {
                if (this.statusCode == 201) {
                    logger.info(`${i + 1}/${books.length} added: ${book.title}`);
                    success ++
                } else {
                    logger.info(`${i + 1}/${books.length} failed: ${book.title}`);
                    faliure ++
                }
            }
        }
        await addBook(req, res);
    }

    logger.info("\n import completed")
    logger.info(`Successfully added: ${success}`)
    logger.info(`Failed to add: ${faliure}`)
}

run();