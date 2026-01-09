import logger from "../../utils/logger.js";
import pool from "../../database/db.js";


async function updateQuantityInCart (req, res) {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const { format_id, quantity } = req.body;

        if (!format_id || typeof quantity !== "number") {
            logger.error("didn't get format id. failed to update item quantity");
            return res.status(400).json({
                success: false,
                message: "Request failed try again Later"
            });
        };

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "quantity must be at least 1"
            });
        };

        await client.query(`BEGIN`);

        const stockResult = await client.query(
            `
                SELECT stock
                FROM book_formats
                WHERE id = $1
                FOR UPDATE
            `, [format_id]
        )

        if (stockResult.rowCount === 0) {
            await client.query(`ROLLBACK`);
            return res.status(404).json({
                success: false,
                message: 'Book Format not found'
            });
        };

        const avilableStock = stockResult.rows[0].stock;

        if (quantity > avilableStock) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: `only ${avilableStock} is available in stock`
            });
        };

        const updateResult = await client.query(
            `
                UPDATE cart_items
                SET quantity = $1
                WHERE user_id = $2 AND format_id = $3
                RETURNING quantity
            `, [quantity, userId, format_id]
        );

        if (updateResult.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        };

        await client.query("COMMIT");

        return res.status(200).json({
            success: true,
            message: "cart updated",
            quantity: updateResult.rows[0].quantity
        });
    } catch (err) {
        await client.query("ROLLBACK");
        logger.error("error occured while updating quantity: ", err);
        return res.status(500).json({
            success: false,
            message: "Failed to update cart"
        });
    }finally {
        client.release();
    }
}

export  { updateQuantityInCart }