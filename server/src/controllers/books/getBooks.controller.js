import pool from "../../database/db.js";
import logger from "../../utils/logger.js";

export const getBooks = async (req, res) => {
    const client = await pool.connect();
    try {
        let { page = 1, limit = 12, search = "", genre, sort = "newest" } = req.query;

        page = Number(page) || 1;
        limit = Number(limit) || 12;
        const offset = (page - 1) * limit;

        const values = [];
        let whereClauses = [];
        let idx = 1;

        if (search) {
            whereClauses.push(
                `(b.title  ILIKE $${idx} OR b.subtitle ILIKE $${idx} OR b.description ILIKE $${idx})`
            );
            values.push(`%${search}%`);
            idx++;
        }
        if (genre) {
            whereClauses.push(`b.genre == $${idx}`);
            values.push(genre);
            idx++;
        }

        const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND")}` : "";


        // Sorting
        let orderBy = "b.id DESC";
        
        if (sort === "price_asc") orderBy = "min_price ASC NULL LAST";
        if (sort === "price_desc") orderBy = "min_price DESC NULLS LAST";
        if (sort === "title_asc") orderBy = "b.title ASC";

        const dataQuery = `
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
            LEFT JION book_formats f ON f.book_id = b.id 
            ${whereSQL}
            GROUP BY b.id
            ORDER BY ${orderBy}
            LIMIT $${idx} OFFSET $${idx + 1}
        `;

        values.push(limit, offset);

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM books b
            ${whereSQL} 
        `;

        const [dataResult, countResult] = await Promise.all([
            client.query(dataQuery, values),
            client.query(countQuery, values.slice(0, idx - 1))
        ]);

        const total = Number(countResult.rows[0].total);
        const totalPages = Math.ceil(total / limit);

        return res.status(200).json(
            {
                page,
                limit,
                total,
                totalPages,
                books: dataResult.rows
            }
        );
    } catch (err) {
        logger.error("Error while fetching books: ", err);
        return res.status(500).json({ message: "Error while fetching books: ", error: err.message});
    }finally{
        client.release();
    }
};
