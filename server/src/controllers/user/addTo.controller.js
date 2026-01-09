import logger from "../../utils/logger.js";
import pool from "../../database/db.js";

async function addToCart (req, res) {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const { formatId, quantity = 1 } = req.body;

        if(!formatId) {
            logger.error("addToCart failed: formatId missing in request body");
            return res.status(400).json({
                success: false,
                message: "Unable to add item to cart. Please try again"
            });
        };

        const formatCheck = await client.query(
            `SELECT id FROM book_formats WHERE id = $1`,
            [formatId]
        )

        if (formatCheck.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Book format not found"
            });
        }

        const query = `
            INSERT INTO cart_items (user_id, format_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, format_id)
            DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
            RETURNING quantity;
        `;


        const values = [userId, formatId, quantity];

        await client.query(query, values);

        return res.status(200).json({
            success: true,
            message: "Book Added to your Cart"
        });
    } catch (err) {
        logger.error("Something went wrong while adding book to cart", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }finally {
        client.release();
    }
}


async function addToFavorites (req, res) {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const { bookId } = req.body;
        
        if (!bookId) {
            logger.error("addToFavorites failed: bookId missing in request body");
            return res.status(400).json({
                success: false,
                message: "Unable to add item to favorites. Please try again"
            })
        };

        const query = `
            UPDATE users
            SET favorites = CASE
                WHEN favorites @> jsonb_build_array($1::uuid)
                THEN favorites - $1::text
                ELSE favorites || jsonb_build_array($1::uuid)
            END
            WHERE id = $2
            RETURNING favorites;
        `;

        const values = [bookId, userId];

        const result = await client.query(query, values);

        if (result.rowCount === 0) {
            logger.error(`addToFavorites failed: user not found (userId=${userId}`);
            return res.status(401).json({
                success: false,
                message: "Your session has expired. Please log in again."
            });
        };

        return res.status(200).json({
            success: true,
            message: "Book Added to Your Favorites"
        })
    } catch (err) {
        logger.error("Something went wrong while adding book to favorites", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }finally{
        client.release()
    }
}

export {
    addToCart,
    addToFavorites
}