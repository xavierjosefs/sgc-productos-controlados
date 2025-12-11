import pool from "../config/db.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { getDocumentosBySolicitudId } from "./document.client.js"

// Funcion para crear un nuevo usuario
export const createUser = async (full_name, cedula, email, password, role_id) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = full_name.trim();

  const search = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [normalizedEmail]
  );
  if (search.rows.length > 0) {
    throw new Error("El correo ya está registrado");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (cedula, full_name, email, password_hash, role_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [cedula, normalizedName, normalizedEmail, passwordHash, role_id]
  );

  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [normalizedEmail]
  );
  return result.rows[0];
};

export const findUserByCedula = async (cedula) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE cedula = $1",
    [cedula]
  );
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
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = "Error interno en el servidor";
    }
    throw err;
  }
};

export const createRequest = async (user_id, tipo_servicio_id, formulario, condicion) => {
  const result = await pool.query(
    `INSERT INTO solicitudes (user_id, tipo_servicio_id, form_data, tipo_solicitud)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, tipo_servicio_id, formulario, condicion]
  );

  return result.rows[0];
};

export const getRequestsBycedula = async (cedula) => {
  const result = await pool.query(`
    SELECT 
      s.id,
      s.user_id,
      s.form_data,
      s.fecha_creacion,
      s.tipo_solicitud,
      s.solicitud_original_id,
      s.fase,
      s.solicitud_anterior_id,
      s.estado_id,
      ts.nombre_servicio AS tipo_servicio,
      e.nombre_mostrar   AS estado_actual
    FROM solicitudes s
    JOIN tipos_servicio ts
      ON s.tipo_servicio_id = ts.id
    JOIN estados_solicitud e
      ON s.estado_id = e.id
    WHERE s.user_id = $1
    ORDER BY s.fecha_creacion DESC
  `, [cedula]);

  return result.rows;
}

export const getRequestDetailsById = async (id) => {
  const result = await pool.query(`
    SELECT 
      s.id,
      s.user_id,
      s.form_data,
      s.fecha_creacion,
      s.tipo_solicitud,
      s.solicitud_original_id,
      s.fase,
      s.solicitud_anterior_id,
      s.estado_id,
      ts.nombre_servicio AS tipo_servicio,
      e.nombre_mostrar   AS estado_actual
    FROM solicitudes s
    JOIN tipos_servicio ts
      ON s.tipo_servicio_id = ts.id
    JOIN estados_solicitud e
      ON s.estado_id = e.id
    WHERE s.id = $1
  `, [id]);

  return result.rows[0] || null;
};

export const getRequestsByStatus = async (status) => {
  const result = await pool.query(`SELECT s.id, s.user_id, s.form_data, s.fecha_creacion, s.tipo_solicitud, s.solicitud_original_id, s.fase, s.solicitud_anterior_id, s.estado_id, ts.nombre_servicio AS tipo_servicio, e.nombre_mostrar AS estado_actual
    FROM solicitudes s
    JOIN tipos_servicio ts ON s.tipo_servicio_id = ts.id
    JOIN estados_solicitud e ON s.estado_id = e.id
    WHERE e.nombre_mostrar = $1
    ORDER BY s.fecha_creacion DESC`, [status]);

  return result.rows || null;
}

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

export const getStatuses = async () => {
  const result = await pool.query(`SELECT nombre_mostrar FROM estados_solicitud`);

  return result.rows || null;
}

/**
 * Find user by cedula with role information
 * Used by getProfile controller
 */
export const findUserByCedulaWithRole = async (cedula) => {
  const result = await pool.query(`
    SELECT 
      u.cedula,
      u.full_name,
      u.email,
      u.is_active,
      u.role_id,
      r.name as role_name 
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.cedula = $1
  `, [cedula]);
  return result.rows[0];
};

/**
 * Get requests for Ventanilla role
 * Returns requests with estado 'ENVIADA' (id: 12)
 */
export const getRequestsForVentanilla = async () => {
  const result = await pool.query(`
    SELECT 
      s.id,
      s.user_id,
      u.full_name AS nombre_cliente,
      ts.nombre_servicio AS tipo_servicio,
      s.fecha_creacion,
      e.nombre_mostrar AS estado_actual
    FROM solicitudes s
    JOIN users u ON s.user_id = u.cedula
    JOIN tipos_servicio ts ON s.tipo_servicio_id = ts.id
    JOIN estados_solicitud e ON s.estado_id = e.id
    WHERE s.estado_id IN (12, 2, 3, 4)
    ORDER BY s.fecha_creacion DESC
  `);
  return result.rows;
};

export const updateRequestStatus = async (requestId, statusId) => {
  const result = await pool.query(
    `UPDATE solicitudes SET estado_id = $1 WHERE id = $2 RETURNING *`,
    [statusId, requestId]
  );
  return result.rows[0];
};

export const getRequestsForTecnicoUPC = async () => {
  const result = await pool.query(`
     SELECT 
      s.id,
      s.user_id,
      u.full_name AS nombre_cliente,
      ts.nombre_servicio AS tipo_servicio,
      s.fecha_creacion,
      e.nombre_mostrar AS estado_actual
    FROM solicitudes s
    JOIN users u ON s.user_id = u.cedula
    JOIN tipos_servicio ts ON s.tipo_servicio_id = ts.id
    JOIN estados_solicitud e ON s.estado_id = e.id
    WHERE s.estado_id IN (4, 16)
    ORDER BY s.fecha_creacion DESC
  `);
  return result.rows;
};

export const getTecnicoUPCRequestDetails = async (id) => {
  const result = await pool.query(
    `SELECT 
        s.id,
        s.user_id,
        s.form_data,
        s.fecha_creacion,
        s.tipo_solicitud,
        s.tipo_servicio_id,
        ts.nombre_servicio,
        u.full_name AS cliente_nombre,
        u.cedula AS cliente_cedula,
        u.email AS cliente_email,
        s.comentario_director_upc,
        s.estado_id
     FROM solicitudes s
     JOIN tipos_servicio ts ON ts.id = s.tipo_servicio_id
     JOIN users u ON u.cedula = s.user_id
     WHERE s.id = $1`,
    [id]);

  if (result.rowCount === 0) {
    throw new Error("Solicitud no encontrada");
  }

  const solicitud = result.rows[0];

  // 2) Obtener documentos entregados
  const documentos = await getDocumentosBySolicitudId(id)

  return {
    solicitud: {
      id: solicitud.id,
      tipo_solicitud: solicitud.tipo_solicitud,
      fecha_creacion: solicitud.fecha_creacion,
      servicio: solicitud.nombre_servicio,
      form_data: solicitud.form_data,
      comentario_director_upc: solicitud.comentario_director_upc,
      estado_id: solicitud.estado_id
    },
    cliente: {
      cedula: solicitud.cliente_cedula,
      nombre: solicitud.cliente_nombre,
      email: solicitud.cliente_email
    },
    documentos: documentos
  };
}

export const validarSolicitudTecnica = async (solicitudId, data) => {
  const { formulario_cumple, documentos, recomendacion, comentario_general } = data;

  // Validación mínima
  if (typeof formulario_cumple !== "boolean") {
    throw new Error("formulario_cumple debe ser boolean.");
  }
  if (!Array.isArray(documentos)) {
    throw new Error("documentos debe ser un arreglo.");
  }
  if (!["APROBADO", "NO_APROBADO"].includes(recomendacion)) {
    throw new Error("recomendacion debe ser APROBADO o NO_APROBADO.");
  }

  // 1) Guardar validación del formulario y comentario del técnico
  await pool.query(
    `UPDATE solicitudes
     SET validacion_formulario = $1,
         comentario_tecnico = $2,
         recomendacion_tecnico = $3
     WHERE id = $4`,
    [
      formulario_cumple,
      comentario_general || null,
      recomendacion === "APROBADO",
      solicitudId
    ]
  );

  // 2) Actualizar cada documento
  for (const doc of documentos) {
    await pool.query(
      `UPDATE documentos_solicitud
       SET estado = $1
       WHERE id = $2 AND solicitud_id = $3`,
      [
        doc.cumple ? "APROBADO" : "RECHAZADO",
        doc.id,
        solicitudId
      ]
    );
  }

  // 3) Cambiar estado
  // Estado 6: En evaluación Director Técnico (antes de ir a Dirección)
  const ESTADO_EN_EVALUACION_DIRECTOR_TECNICO = 6;

  await pool.query(
    `UPDATE solicitudes
     SET estado_id = $1
     WHERE id = $2`,
    [ESTADO_EN_EVALUACION_DIRECTOR_TECNICO, solicitudId]
  );

  return {
    solicitud_id: solicitudId,
    estado_id: ESTADO_EN_EVALUACION_DIRECTOR_TECNICO,
    recomendacion,
    comentario_general
  };
};

export const getRequestsForDirectorUPC = async () => {
  try {
    console.log('🔍 Ejecutando query para solicitudes con estado_id = 6');
    
    const result = await pool.query(
      `SELECT 
        s.id,
        s.user_id,
        s.fecha_creacion,
        s.tipo_solicitud,
        s.estado_id,
        ts.nombre_servicio AS tipo_servicio,
        e.nombre_mostrar AS estado_actual,
        u.full_name AS cliente_nombre,
        u.cedula AS cliente_cedula,
        s.validacion_formulario,
        s.comentario_tecnico,
        s.recomendacion_tecnico
     FROM solicitudes s
     JOIN tipos_servicio ts ON ts.id = s.tipo_servicio_id
     JOIN users u ON u.cedula = s.user_id
     JOIN estados_solicitud e ON e.id = s.estado_id
     WHERE s.estado_id = 6
     ORDER BY s.fecha_creacion ASC`);

    console.log('✅ Registros encontrados:', result.rows.length);
    if (result.rows.length > 0) {
      console.log('Primera solicitud:', result.rows[0]);
    }

    return result.rows;
  } catch (error) {
    console.error('❌ Error en getRequestsForDirectorUPC:', error);
    throw error;
  }
};

export const getDirectorUPCRequestDetails = async (id) => {
  const result = await pool.query(
    `SELECT 
        s.id,
        s.user_id,
        s.form_data,
        s.fecha_creacion,
        s.tipo_solicitud,
        s.tipo_servicio_id,
        s.estado_id,
        s.validacion_formulario,
        s.comentario_tecnico,
        s.recomendacion_tecnico,
        ts.nombre_servicio,
        e.nombre_mostrar AS estado_actual,
        u.full_name AS cliente_nombre,
        u.cedula AS cliente_cedula,
        u.email AS cliente_email
     FROM solicitudes s
     JOIN tipos_servicio ts ON ts.id = s.tipo_servicio_id
     JOIN users u ON u.cedula = s.user_id
     JOIN estados_solicitud e ON e.id = s.estado_id
     WHERE s.id = $1`,
    [id]);

  if (result.rowCount === 0) {
    throw new Error("Solicitud no encontrada");
  }

  const solicitud = result.rows[0];

  // 2) Obtener documentos entregados
  const documentos = await getDocumentosBySolicitudId(id)

  return {
    id: solicitud.id,
    user_id: solicitud.user_id,
    cedula_rnc: solicitud.cliente_cedula,
    nombre_solicitante: solicitud.cliente_nombre,
    email: solicitud.cliente_email,
    tipo_servicio: solicitud.nombre_servicio,
    condicion: solicitud.tipo_solicitud,
    estado_actual: solicitud.estado_actual,
    estado_id: solicitud.estado_id,
    form_data: solicitud.form_data,
    created_at: solicitud.fecha_creacion,
    validaciones_tecnico: {
      formulario_estado: solicitud.validacion_formulario,
      comentarios: solicitud.comentario_tecnico,
      recomendacion: solicitud.recomendacion_tecnico,
      documentos_validados: documentos.reduce((acc, doc) => {
        acc[doc.tipo_documento || doc.nombre] = doc.estado === 'APROBADO';
        return acc;
      }, {})
    },
    documentos: documentos
  };
}

export const directorUPCDecision = async (id, data) => {
  const { decision, comentario } = data;

  // decision: "APROBAR" | "RECHAZAR"
  if (!["APROBAR", "RECHAZAR"].includes(decision)) {
    throw new Error("La decisión debe ser APROBAR o RECHAZAR.");
  }

  // Si aprueba: va a Dirección (estado 7)
  // Si rechaza: devuelve al técnico (estado 16)
  const nuevoEstadoId =
    decision === "APROBAR"
      ? 7  // Aprobada por Director Técnico - va a Dirección
      : 16; // Devuelta por Director Técnico - regresa al técnico

  await pool.query(
    `UPDATE solicitudes
     SET estado_id = $1,
         comentario_director_upc = $2,
         decision_director_upc   = $3
     WHERE id = $4`,
    [nuevoEstadoId, comentario || null, decision, id]
  );

  return {
    solicitud_id: id,
    estado_id: nuevoEstadoId,
    decision,
    comentario: comentario || null
  };
};