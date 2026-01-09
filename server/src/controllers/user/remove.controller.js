import logger from "../../utils/logger.js";
import pool from "../../database/db.js";

async function removeFromCart (req, res) {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const { formatId } = req.params;
        
        if (!formatId){
            logger.error("Didn't get format id");
            return res.status(400).json({
                success: false,
                message: "Request failed. Try again!"
            });
        };

        const result = await client.query(
            `
                DELETE FROM cart_items
                WHERE user_id = $1 AND format_id =$2
            `, [userId, formatId]
        );

        return res.status(200).json({
            success: true,
            message: "Items removed from cart"
        })
    } catch (err) {
        logger.error("Failed to remove item from cart: ", err);
        return res.status(500).json({success: false, message: "Failed to remove item from cart. Please try again later!"})
    }finally {
        client.release();
    }
}

async function removeFromFavorite (req, res) {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const { bookId } = req.body;

        if (!bookId){
            logger.error("Didn't get bookId from req");
            return res.status(401).json({
                success: false,
                message: "Request failed. Try again later"
            });
        };

        const result = await client.query(
            `
                UPDATE users
                SET favorites = favorites - $2::text
                WHERE id = $1
                RETURNING favorites
            `, [userId, bookId]
        )

        if (result.rowCount === 0) {
            return res.status(401).json({
                success: false,
                message: "Please login again"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Book removed from your favorites",
            favorites: result.rows[0].favorites
        });
    } catch (err) {
        logger.error("error occured while deleting book from favorites: ", err);
        return res.status(500).json({
            success: false,
            message: "Can't remove book from favorites. try again later!"
        })
    } finally{
        client.release()
    }
}

export {
    removeFromCart,
    removeFromFavorite
}