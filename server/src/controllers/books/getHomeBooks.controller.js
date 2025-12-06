import logger from "../../utils/logger.js";
import pool from "../../database/db.js";


export const getHomeBooks = async (req, res) => {
	const client = await pool.connect();
    try {
        const latestQuery = `
            SELECT
                b.id,
                b.title,
                b.subtitle,
                b.genre,
                b.images,
                b.authors,
                b.publication_date,
                MIN(f.price) AS min_price
            FROM books b
            LEFT JOIN book_formats f ON f.book_id = b.id
            GROUP BY b.id
            ORDER BY b.id DESC
            LIMIT 12
        `;

        const featuredQuery = `
            SELECT
                b.id,
                b.title,
                b.subtitle,
                b.genre,
                b.images,
                b.authors,
                b.publication_date,
                MIN(f.price) AS min_price
            FROM book b
            LEFT JOIN book_formats f ON f.book_id = b.id
            GROUP BY b.id
            ORDER BY RANDOM()
            LIMIT 8
        `;

        const [latestResult, featuredResult] = await Promise.all([
            client.query(latestQuery),
            client.query(featuredQuery)
        ]);

        return res.status(200).json({
            latest: latestResult.rows,
            featured: featuredResult.rows
        });
    } catch (err) {
        logger.error("Error while fetching featured and latest books: ", err);
        return res.status(500).json({ message: "Error fetching while home books", error: err.message })
    } finally {
        client.release();
    }
};

export default getHomeBooks;