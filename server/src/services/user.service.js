import pool from "../database/db.js";

const createUser = async (name, email, hashedPassword, refresh_token) => {
    const query = `
        INSERT INTO users (name, email, password, refresh_token)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email
    `;

    const values = [name, email, hashedPassword]

    const result = await pool.query(query, values)

    return result.rows[0]
}

const findUserByEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0]
}

const updateRefreshToken = async (id, token) => {
    const query = `UPDATE users SELECT refresh_token = $1 WHERE id = $2`;
    await pool.query(query, [id, token]);
}

export {
    createUser,
    findUserByEmail,
    updateRefreshToken
}