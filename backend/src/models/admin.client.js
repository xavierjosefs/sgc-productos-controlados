import pool from "../config/db.js";
import { findUserByCedula } from "./user.client.js";

//listar todos los usuarios
export const getAllUsers = async () => {
  try {
    const response = await pool.query(
      `SELECT u.cedula, u.full_name, u.email, r.name AS role, u.is_active
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

export const changeUserStatus = async (cedula) => {
  try {
    const user = await findUserByCedula(cedula);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const newStatus = !user.is_active;

    // 1) Actualizamos y regresamos datos básicos + role_id
    const result = await pool.query(
      `UPDATE users 
       SET is_active = $1 
       WHERE cedula = $2
       RETURNING cedula, full_name, email, is_active, role_id`,
      [newStatus, cedula]
    );

    if (result.rowCount === 0) {
      throw new Error("Usuario no encontrado");
    }

    const updatedUser = result.rows[0];

    // 2) Buscamos el nombre del rol
    const roleResult = await pool.query(
      `SELECT name FROM roles WHERE id = $1`,
      [updatedUser.role_id]
    );

    const roleName = roleResult.rows[0]?.name || null;

    // 3) Devolvemos todo junto, incluyendo role
    return {
      cedula: updatedUser.cedula,
      full_name: updatedUser.full_name,
      email: updatedUser.email,
      is_active: updatedUser.is_active,
      role: roleName
    };

  } catch (error) {
    throw error;
  }
};


export const createService = async(codigo_servicio, nombre_servicio, precio, documentos_requeridos, formulario) => {
  try {
    console.log(formulario);
    const idFormularioResult = await pool.query(
      `SELECT id FROM formularios WHERE nombre = $1`,
      [formulario]
    );
    // console.log(idFormularioResult);
    const result =  await pool.query(
      `INSERT INTO tipos_servicio (codigo_servicio, nombre_servicio, precio, documentos_requeridos, formulario_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [codigo_servicio, nombre_servicio, precio, documentos_requeridos, idFormularioResult.rows[0].id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

export const getServices = async() => {
  try{
    const result = await pool.query(
      `SELECT s.codigo_servicio, s.nombre_servicio, s.precio, s.documentos_requeridos, f.nombre as formulario_nombre
        FROM tipos_servicio s
        JOIN formularios f ON s.formulario_id = f.id`
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

export const findServiceByCodigo = async(codigo_servicio) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tipos_servicio WHERE codigo_servicio = $1`,
      [codigo_servicio]
    );
    return result.rows[0];
  }catch (error) {
    throw error;
  }
}

export const getFormTypes = async () => {
  try {
    const result = await pool.query(
      `SELECT * FROM formularios`
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getFormByName = async (nombre) => {
  try {
    const result = await pool.query(
      `SELECT * FROM formularios WHERE nombre = $1`,
      [nombre]
    );
    return result.rows[0];
  }catch (error) {
    throw error;
    console.error(error);
  }
}