import pool from "../config/db.js";

//listar todos los usuarios
export const getAllUsers = async () => {
  try {
    const response = await pool.query(
      `SELECT u.cedula, u.full_name, u.email, r.name AS role
       FROM users u
       JOIN roles r ON u.role_id = r.id`
    );
    return response.rows;
  } catch (error) {
    throw error;
  }
};