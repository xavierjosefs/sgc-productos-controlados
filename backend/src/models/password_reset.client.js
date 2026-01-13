import pool from "../config/db.js";

/**
 * Create a new password reset token
 * @param {string} email - User email
 * @param {string} token - Unique token
 * @param {string} expires - ISO date string for expiration
 */
export const createPasswordResetToken = async (email, token, expires) => {
    // Delete any existing tokens for this email first
    await deleteByEmail(email);

    const result = await pool.query(
        `INSERT INTO password_reset_tokens (email, token, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
        [email.trim().toLowerCase(), token, expires]
    );

    return result.rows[0];
};

/**
 * Find a valid token (not expired)
 * @param {string} token - Token to find
 */
export const findByToken = async (token) => {
    const result = await pool.query(
        `SELECT * FROM password_reset_tokens
     WHERE token = $1 AND expires_at > NOW()`,
        [token]
    );
    return result.rows[0];
};

/**
 * Delete all tokens for an email
 * @param {string} email - Email to delete tokens for
 */
export const deleteByEmail = async (email) => {
    await pool.query(
        "DELETE FROM password_reset_tokens WHERE email = $1",
        [email.trim().toLowerCase()]
    );
};

/**
 * Delete a specific token
 * @param {string} token - Token to delete
 */
export const deleteByToken = async (token) => {
    await pool.query(
        "DELETE FROM password_reset_tokens WHERE token = $1",
        [token]
    );
};
