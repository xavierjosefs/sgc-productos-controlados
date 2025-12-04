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

export const getAllRequest = async () => {
  try {
    const response = await pool.query(
      `SELECT s.id, u.full_name, ts.nombre_servicio, es.nombre_mostrar AS estado, s.fecha_creacion
       FROM solicitudes s
       JOIN users u ON s.user_id = u.cedula
       JOIN tipos_servicio ts ON s.tipo_servicio_id = ts.id
       JOIN estados_solicitud es ON s.estado_id = es.id`
    );
    return response.rows;
  } catch (error) {
    throw error;
  }
}

export const changeUserRole = async (cedula, newRole) => {
  try {
    const roleResult = await pool.query(
      `SELECT id FROM roles WHERE name = $1`,
      [newRole]
    );

    if (roleResult.rowCount === 0) {
      throw new Error("Rol no válido");
    }
    const roleId = roleResult.rows[0].id;

    const result = await pool.query(
    `UPDATE users 
    SET role_id = $1 
    WHERE cedula = $2
    RETURNING id, cedula, full_name, email, role_id`,
    [roleId, cedula]
    );

    return result.rows[0];
  } catch (error) {
      throw error;
  } 
};