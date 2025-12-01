import pool from "../config/db.js";

export const createRequest = async (cedula, tipo_servicio_id, formulario) => {
    const result = await pool.query(
        `INSERT INTO solicitudes (cedula_cliente, tipo_servicio_id, form_data, estado_actual)
         VALUES ($1, $2, $3, 'pendiente')
         RETURNING *`,
        [cedula, tipo_servicio_id, JSON.stringify(formulario)]
    );
    return result.rows[0];
};

export const getRequestsBycedula = async (cedula) => {
    const result = await pool.query(
        `SELECT s.id, s.cedula_cliente, s.form_data, s.estado_actual, s.fecha_creacion, 
                ts.nombre_servicio as tipo_servicio
         FROM solicitudes s
         JOIN tipos_servicio ts ON s.tipo_servicio_id = ts.id
         WHERE s.cedula_cliente = $1
         ORDER BY s.fecha_creacion DESC`,
        [cedula]
    );
    return result.rows;
};

export const getRequestDetailsById = async (requestId) => {
    const result = await pool.query(
        `SELECT s.id, s.cedula_cliente, s.form_data, s.estado_actual, s.fecha_creacion,
                ts.nombre_servicio as tipo_servicio
         FROM solicitudes s
         JOIN tipos_servicio ts ON s.tipo_servicio_id = ts.id
         WHERE s.id = $1`,
        [requestId]
    );
    return result.rows[0];
};

export const getSentRequestsByUserId = async (cedula) => {
    const result = await pool.query(
        `SELECT s.id, s.cedula_cliente, s.form_data, s.estado_actual, s.fecha_creacion,
                ts.nombre_servicio as tipo_servicio
         FROM solicitudes s
         JOIN tipos_servicio ts ON s.tipo_servicio_id = ts.id
         WHERE s.cedula_cliente = $1 AND s.estado_actual = 'enviada'
         ORDER BY s.fecha_creacion DESC`,
        [cedula]
    );
    return result.rows;
};

export const getAproveRequestsByUserId = async (cedula) => {
    const result = await pool.query(
        `SELECT s.id, s.cedula_cliente, s.form_data, s.estado_actual, s.fecha_creacion,
                ts.nombre_servicio as tipo_servicio
         FROM solicitudes s
         JOIN tipos_servicio ts ON s.tipo_servicio_id = ts.id
         WHERE s.cedula_cliente = $1 AND s.estado_actual = 'aprobada'
         ORDER BY s.fecha_creacion DESC`,
        [cedula]
    );
    return result.rows;
};

export const getReturnedRequestsByUserId = async (cedula) => {
    const result = await pool.query(
        `SELECT s.id, s.cedula_cliente, s.form_data, s.estado_actual, s.fecha_creacion,
                ts.nombre_servicio as tipo_servicio
         FROM solicitudes s
         JOIN tipos_servicio ts ON s.tipo_servicio_id = ts.id
         WHERE s.cedula_cliente = $1 AND s.estado_actual = 'devuelta'
         ORDER BY s.fecha_creacion DESC`,
        [cedula]
    );
    return result.rows;
};

export const getPendingRequestsByUserId = async (cedula) => {
    const result = await pool.query(
        `SELECT s.id, s.cedula_cliente, s.form_data, s.estado_actual, s.fecha_creacion,
                ts.nombre_servicio as tipo_servicio
         FROM solicitudes s
         JOIN tipos_servicio ts ON s.tipo_servicio_id = ts.id
         WHERE s.cedula_cliente = $1 AND s.estado_actual = 'pendiente'
         ORDER BY s.fecha_creacion DESC`,
        [cedula]
    );
    return result.rows;
};
