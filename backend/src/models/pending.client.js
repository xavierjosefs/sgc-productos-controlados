import pool from "../config/db.js";

export const createPendingUser = async (
  cedula,
  full_name,
  email,
  token,
  expires,
  roleName = "cliente"
) => {
//Buscar el id del rol
  const roleResult = await pool.query(
    "SELECT id FROM roles WHERE name = $1",
    [roleName]
  );

  if (roleResult.rows.length === 0) {
    throw new Error(`Rol inválido: ${roleName}`);
  }

  const roleId = roleResult.rows[0].id;

  // Insertar en pending_users usando role_id
  const result = await pool.query(
    `INSERT INTO pending_users (cedula, full_name, email, token, expires_at, role_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [cedula, full_name, email, token, expires, roleId]
  );

  return result.rows[0];
};


export const findPendingByToken = async (token) => {
  const result = await pool.query(
    `SELECT *
     FROM pending_users
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
};
