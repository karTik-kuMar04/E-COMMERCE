import logger from "../../utils/logger.js";
import pool from "../../database/db.js";

async function checkoutCart(req, res) {
    const client =  await pool.connect();
    try {
        const userId = req.user.id;
        await client.query("BEGIN");

        const cartResult = await client.query(
            `
                SELECT
                    c.format_id,
                    c.quantity,
                    f.book_id,
                    f.price
                FROM cart_items c
                JOIN book_formats f ON f.id = c.format_id
                WHERE c.user_id = $1
            `, [userId]
        );

        if (cartResult.rowCount === 0) {
            logger.error("Can not find cart in db");
            return res.status(400).json({
                success: false,
                message: "This service not working now. Please try again later"
            });
        };

        const totalAmount = cartResult.rows.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );


        const orderResult = await client.query(
            `
                INSERT INTO orders (user_id, total_amount, status)
                VALUES ($1, $2, 'paid')
                RETURNING id
            `,
            [userId, totalAmount]
        );

        const orderId = orderResult.rows[0].id;

        for(const item of cartResult.rows){
            await client.query(
                `
                INSERT INTO order_items (order_id, book_id, format_id, price, quantity)
                VALUES ($1, $2, $3, $4, $5)
                `,
                [orderId, item.book_id, item.format_id, item.price, item.quantity]
            );
        };

        await client.query(
            `DELETE FROM cart_items WHERE user_id = $1`,
            [userId]
        );

        await client.query("COMMIT");

        return res.status(200).json({
            success: true,
            message: "Order placed successfully",
            orderId
        });
    
    } catch (err) {
        await client.query("ROLLBACK");
        logger.error("Checkout cart failed", err);

        return res.status(500).json({
            success: false,
            message: "Checkout failed. Try again later"
        });
    }finally{
        client.release();
    }
}


async function checkoutSingleBook(req, res) {
  const client = await pool.connect();

  try {
    const userId = req.user.id;
    const { formatId, quantity = 1 } = req.body;

    if (!formatId) {
      return res.status(400).json({
        success: false,
        message: "Format ID is required"
      });
    }

    await client.query("BEGIN");

    // Get format + book
    const formatResult = await client.query(
      `
      SELECT id, book_id, price
      FROM book_formats
      WHERE id = $1
      `,
      [formatId]
    );

    if (formatResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Book format not found"
      });
    }

    const format = formatResult.rows[0];
    const totalAmount = format.price * quantity;

    // Create order
    const orderResult = await client.query(
      `
      INSERT INTO orders (user_id, total_amount, status)
      VALUES ($1, $2, 'paid')
      RETURNING id
      `,
      [userId, totalAmount]
    );

    const orderId = orderResult.rows[0].id;

    // Insert order item
    await client.query(
      `
      INSERT INTO order_items (order_id, book_id, format_id, price, quantity)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [orderId, format.book_id, format.id, format.price, quantity]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      orderId
    });

  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("Single book checkout failed", err);

    return res.status(500).json({
      success: false,
      message: "Checkout failed"
    });

  } finally {
    client.release();
  }
}


export {
    checkoutCart,
    checkoutSingleBook
}