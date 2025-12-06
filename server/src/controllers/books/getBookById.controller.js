import logger from "../../utils/logger.js";
import pool from "../../database/db.js";

export const getBookById = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                b.*,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', f.id,
                            'format', f.format,
                            'sku', f.sku,
                            'price', f.price,
                            'list_price', f.list_price,
                            'stock', f.stock,
                            'page_count', f.page_count,
                            'is_digital', f.is_digital
                        )
                    ) FILTER (WHERE f.id IS NOT NULL),
                    '[]'
                ) AS formats
            FROM books b
            LEFT JOIN book_formats f ON f.book_id = b.id
            WHERE b.id = $1
            GROUP BY b.id
        `;

        const result = await client.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Book not found"});
        };

        return res.status(200).json(result.rows[0]);
    } catch (err) {
        logger.error("Error while fetching book by id: ", err);
        return res.status(500).json({ message: "Error fetching book", error: err.message});
    }finally{
        client.release();
    }
}