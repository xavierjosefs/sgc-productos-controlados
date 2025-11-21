import pool from "../config/db.js";

export const createPendingUser = async (cedula, full_name, email, token, expires) => {
  const result = await pool.query(
    `INSERT INTO pending_users (cedula, full_name, email, token, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [cedula, full_name, email, token, expires]
  );

  return result.rows[0];
};


export const findPendingByToken = async (token) => {
  const result = await pool.query(
    `SELECT * FROM pending_users
     WHERE token = $1
       AND expires_at > NOW()`,
    [token]
  );
  return result.rows[0];
};

export const deletePendingUser = async (cedula) => {
  await pool.query(
    "DELETE FROM pending_users WHERE cedula = $1",
    [cedula]
  );
};

export const deletePendingUserByEmail = async (email) => {
  await pool.query(
    "DELETE FROM pending_users WHERE email = $1",
    [email]
  );
}
