import pool from "../database/db.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/uploadToCloudinary.js";
import logger from '../utils/logger.js'

const addBook = async (req, res) => {
    const client = await pool.connect();

    const uploadedPublicIds = [];
    try {
        
        const {
            title, subtitle, description, publisher, publication_date, isbn10, isbn13,
            genre, edition, series, author_bio, authors, tags, awards, formats
        } = req.body;

        const files = req.files;

        const images = { cover: null, back: null, interior: [] };

        if (files.cover) {
            const coverUpload = await uploadToCloudinary(files.cover[0].buffer, "E-commerce/books");
            
            if (!coverUpload.secure_url) throw new Error("Failed to upload cover image");

            images.cover = coverUpload.secure_url;
            uploadedPublicIds.push(coverUpload.public_id);
        }

        if (files.back) {
            const backUpload = await uploadToCloudinary(files.back[0].buffer, "E-commerce/books");
            
            if (!backUpload.secure_url) throw new Error("Failed to upload back image");
            
            images.back = backUpload.secure_url;
            uploadedPublicIds.push(backUpload.public_id)
        }

        if (files.interior) {
            for (const img of files.interior) {
                const uploaded = await uploadToCloudinary(img.buffer, "E-commerce/books/interior");
                if (!uploaded.secure_url) {
                    throw new Error("Failed to upload interior image");
                }

                images.interior.push(uploaded.secure_url);
                uploadedPublicIds.push(uploaded.public_id)
            }
        }


        const parsedFormat = typeof formats === 'string' ? JSON.parse(formats) : formats;

        await client.query("BEGIN");

        const insertQuery = `
            INSERT INTO books (title, subtitle, description, publisher, publication_date,
            isbn10, isbn13, genre, edition, series, author_bio, images, authors, tags, awards)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING id
        `;

        const parsedAuthors = typeof authors === 'string' ? JSON.parse(authors) : authors;
        const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
        const parsedAwards = typeof awards === 'string' ? JSON.parse(awards) : awards;

        
        const bookValues = [
            title, subtitle, description, publisher, publication_date,
            isbn10, isbn13, genre, edition, series, author_bio,
            images, parsedAuthors, parsedTags, parsedAwards
        ];

        const bookResult = await client.query(insertQuery, bookValues);
        const bookId = bookResult.rows[0].id;

        const insertFormatQuery = `
            INSERT INTO book_formats (
                book_id, format, sku, price,
                list_price, stock, page_count, is_digital
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;


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
        logger.error("Error while adding book in DB: ", err);

        if (uploadedPublicIds.length > 0) {
            try {
                for (const id of uploadedPublicIds) {
                    await deleteFromCloudinary(id);
                }
            } catch (cleanupErr) {
                logger.error("Error happened while cleaning clodinary images", cleanupErr)
            }
        }

        res.status(500).json({ message: "Error while Adding book", error: err.message });
    }finally{
        client.release();
    }
}

export {
    addBook
}