import pool from "../database/db.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import logger from '../utils/logger.js'

const addBook = async () => {
    const client = await pool.connect();
    try {
        
        const {
            title, subtitle, description, publisher, publication_date, isbn10, isbn13,
            genre, edition, series, author_bio, authors, tags, awards, formats
        } = req.body;

        const files = req.files;

        const coverUpload = files.cover ? await uploadToCloudinary(files.cover[0].buffer, "books") : null;
        const backUpload = files.back ? await uploadToCloudinary(files.back[0].buffer, "books") : null;

        const interiorUploads = [];
        if (files.interior) {
            for (const img of files.interior) {
                const uploaded = await uploadToCloudinary(img.buffer, "books/interior");
                interiorUploads.push(uploaded.secure_url)
            }
        }

        const images = {
            cover: coverUpload?.secure_url || null,
            back: backUpload?.secure_url || null,
            interior: interiorUploads
        }

        const parsedFormat = typeof formats === 'string' ? JSON.parse(formats) : formats;

        await client.query("BEGIN");

        const insertQuery = `
            INSERT INTO books (title, subtitle, description, publisher, publication_date,
            isbn10, isbn13, genre, edition, series, author_bio, images, authors, tags, awards)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING id
        `;
        
        const bookValues = [
            title, subtitle, description, publisher, publication_date,
            isbn10, isbn13, genre, edition, series, author_bio,
            images, authors, tags, awards
        ];

        const bookResult = await client.query(insertQuery, bookValues);
        const bookId = bookResult.rows[0].id;

        const insertFormatQuery = client.query(
            `INSERT INTO book_format (book_id, format, sku, price,
            list_price, stock, page_count, is_digital)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `
        );

        for (const f of parsedFormat) {
            await client.query(
                insertFormatQuery, [
                    bookId,
                    f.format,
                    f.sku,
                    f.price,
                    f.list_price,
                    f.stock,
                    f.page_count,
                    f.is_digital
                ]
            );
        };
        await client.query("COMMIT");
        
        return res.status(201).json({ message: "Book Added Successfully", book_id: bookId });
    } catch (err) {
        await client.query("ROLLBACK");
        logger.error("Error while adding in DB: ", err);
        res.status(500).json({ message: "Error Adding book", error: err.message });
    }finally{
        client.release();
    }
}

export {
    addBook
}