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
            if (search.length < 3) {
                // Short input → prefix match
                whereClauses.push(`
                (
                    b.title ILIKE $${idx}
                    OR b.subtitle ILIKE $${idx}
                    OR b.authors::text ILIKE $${idx}
                )
                `);
                values.push(`${search}%`);
            } else {
                // 3+ chars → fuzzy search
                whereClauses.push(`
                (
                    similarity(b.title, $${idx}) > 0.15
                    OR similarity(b.subtitle, $${idx}) > 0.15
                    OR similarity(b.authors::text, $${idx}) > 0.15
                )
                `);
                values.push(search);
            }
            idx++;
        }

        if (genre) {
            whereClauses.push(`b.genre = $${idx}`);
            values.push(genre);
            idx++;
        }

        const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";


        // Sorting
        let orderBy = search
            ?   `similarity(b.title, $1) DESC`
            :   `b.id DESC`
        ;




        if (sort === "title_asc") orderBy = "b.title ASC";
        if (sort === "title_asc") orderBy = "b.title ASC";

        const dataQuery = `
            SELECT
                b.id,
                b.title,
                b.subtitle,
                b.description,
                b.genre,
                b.images,
                b.authors,
                b.publication_date,
                (b.publication_date >= NOW() - INTERVAL '30 days') AS is_new,
                json_agg(
                    json_build_object(
                    'formatId', f.id,
                    'format', f.format,
                    'price', f.price,
                    'stock', f.stock
                    )
                    ORDER BY f.price ASC
                ) AS formats
            FROM books b
            JOIN book_formats f ON f.book_id = b.id
            ${whereSQL}
            GROUP BY b.id
            ORDER BY ${orderBy}
            LIMIT $${idx} OFFSET $${idx + 1};

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
