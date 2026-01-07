import logger from "../../utils/logger.js";
import pool from "../../database/db.js";

async function addToCart (req, res) {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const { bookId } = req.body;

        if(!bookId) {
            logger.error("addToCart failed: bookId missing in request body");
            return res.status(400).json({
                success: false,
                message: "Unable to add item to cart. Please try again"
            });
        };

        const query = `
            UPDATE users
            SET cart = (
                SELECT jsonb_agg(DISTINCT value)
                FROM jsonb_array_elements(
                    COALESCE(cart, '[]'::jsonb) || jsonb_build_array($1::uuid)
                )
            )
            WHERE id = $2
            RETURNING cart;
        `;

        const values = [bookId, userId];

        const result = await client.query(query, values);

        if (result.rowCount === 0){
            logger.error(`addToCart failed: user not found (userId=${userId})`);
            return res.status(401).json({
                success: false,
                message: "Your session has expired. Please log in again."
            });
        }

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
            SET favorites = (
                SELECT jsonb_agg(DISTINCT value)
                FROM jsonb_array_elements(
                    COALESCE(favorites, '[]'::jsonb) || jsonb_build_array($1::uuid)
                )
            )
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