import logger from '../../utils/logger.js'
import pool from '../../database/db.js'

async function getCart(req, res) {
  try {
    const userId = req.user.id;


    const booksResult = await pool.query(
        `
             SELECT
                ci.format_id,
                ci.quantity,
                bf.format,
                bf.price,
                bf.stock,
                b.id AS book_id,
                b.title,
                b.authors,
                b.images
            FROM cart_items ci
            JOIN book_formats bf ON bf.id = ci.format_id
            JOIN books b ON b.id = bf.book_id
            WHERE ci.user_id = $1
            ORDER BY b.title ASC;
        `,
        [userId]
    )
    return res.status(200).json({
      success: true,
      cart: booksResult.rows
    });

  } catch (err) {
    logger.error("getCart failed", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart"
    });
  }
}

async function getFavorites(req, res) {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT favorites FROM users WHERE id = $1",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: "Please log in again"
      });
    }

    const favoriteIds =  Array.isArray(result.rows[0].favorites) ?
        result.rows[0].favorites :
        []
    ;

    if (favoriteIds.length === 0) {
        return res.status(200).json({
            success: true,
            favorites: []
        });
    };

    const booksResult  = await pool.query(
        `
            SELECT
                b.id,
                b.title,
                b.authors,
                b.images,
                f.price
            FROM books b
            LEFT JOIN book_formats f 
                ON f.book_id = b.id 
               AND f.format = 'paperback'
            WHERE b.id = ANY($1::uuid[]) 
        `,
        [favoriteIds]
    )

    return res.status(200).json({
      success: true,
      favorites: booksResult.rows
    });

  } catch (err) {
    logger.error("getFavorites failed", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch favorites"
    });
  }
}

export {
  getCart,
  getFavorites
};
