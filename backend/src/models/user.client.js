import pool from "../config/db.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Funcion para crear un nuevo usuario
export const createUser = async (full_name, cedula, email, password) => {
    // Nomalizar datos de entrada
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = full_name.trim();

    const search = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]); // Se revisa que no exista el email en la BD
    if (search.rows.length > 0) {
        throw new Error('El correo ya está registrado');
    }

    const passwordHash = await bcrypt.hash(password, 10) // Hashear la contraseña
    const result = await pool.query(
        'INSERT INTO users (cedula, full_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
        [cedula, normalizedName, normalizedEmail, passwordHash]
    );
    return result.rows[0];;
};

export const findUserByEmail = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [normalizedEmail]);
    return result.rows[0];
};

// Funcion para hacer login
export const login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("Correo y contraseña son obligatorios");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { rows } = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [normalizedEmail]
    );

    if (rows.length === 0) {
      const error = new Error("No existe una cuenta asociada con ese correo");
      error.statusCode = 400;
      throw error;
    }

    const user = rows[0];

    const isValid = bcrypt.compareSync(password, user.password_hash);

    if (!isValid) {
      const error = new Error("La contraseña es incorrecta");
      error.statusCode = 400;
      throw error;
    }


    delete user.password_hash;

    return { user };
  } catch (err) {
    // Si no tiene statusCode, asumimos 500
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Error interno en el servidor";
    }
    throw err;
  }
};

export const createRequest = async (user_id, tipo_servicio_id, formulario) => {
  const result = await pool.query(
    `INSERT INTO solicitudes (user_id, tipo_servicio_id, form_data)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [user_id, tipo_servicio_id, formulario]
  );

  return result.rows[0];
};

export const getRequestsBycedula = async (cedula) => {
  const result = await pool.query("SELECT * FROM solicitudes WHERE user_id = $1", [cedula]);

  return result.rows;
}

export const getRequestDetailsById = async (id) => {
  const result = await pool.query(`
    SELECT 
      s.id,
      s.user_id,
      s.form_data,
      s.fecha_creacion,
      s.fecha_actualizacion,
      s.tipo_solicitud,
      s.solicitud_original_id,
      s.fase,
      s.solicitud_anterior_id,
      ts.nombre_servicio AS tipo_servicio,
      e.nombre_mostrar   AS estado_actual
    FROM solicitudes s
    JOIN tipos_servicio ts
      ON s.tipo_servicio_id = ts.id
    JOIN estados_solicitud e
      ON s.estado_id = e.id
    WHERE s.id = $1
  `,[id]);

  return result.rows[0] || null;
};

export const getSentRequestsByUserId = async (cedula) => {
  const result = await pool.query(`SELECT * FROM solicitudes WHERE user_id = $1 AND estado_id = 12`, [cedula]);

  return result.rows || null;
}

export const getAproveRequestsByUserId = async (cedula) => {
  const result = await pool.query(`SELECT * FROM solicitudes WHERE user_id = $1 AND estado_id = 10`, [cedula]);

  return result.rows || null;
}

export const getReturnedRequestsByUserId = async (cedula) => {
  const result = await pool.query(`SELECT * FROM solicitudes WHERE user_id = $1 AND (estado_id = 3 OR estado_id = 5)`, [cedula]);

  return result.rows || null;
}

export const getPendingRequestsByUserId = async (cedula) => {
  const result = await pool.query(`SELECT * FROM solicitudes WHERE user_id = $1 AND estado_id = 1`, [cedula]);

  return result.rows || null;
}