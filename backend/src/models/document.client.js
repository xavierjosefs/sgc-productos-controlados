import pool from "../config/db";

export const findSolicitudById = async(id) => {
    const result = await pool.query(
        `SELECT * FROM solicitudes WHERE id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

export const createDocumento = async (solicitud_id, tipo_documento, nombre_archivo, mime_type, tamano, url) => {
    const result = await pool.query(
        `INSERT INTO documentos (solicitud_id, tipo_documento, nombre_archivo, mime_type, tamano, url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [solicitud_id, tipo_documento, nombre_archivo, mime_type, tamano, url]
    );
    return result.rows[0];
}