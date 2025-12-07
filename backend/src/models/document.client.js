import pool from "../config/db.js";

export const findSolicitudById = async (id) => {
    const result = await pool.query(
        `SELECT * FROM solicitudes WHERE id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

export const createDocumento = async (solicitud_id, tipo_documento, nombre_archivo, mime_type, tamano, url) => {
    const result = await pool.query(
        `INSERT INTO documentos_solicitud (solicitud_id, tipo_documento, nombre_archivo, mime_type, tamano, url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [solicitud_id, tipo_documento, nombre_archivo, mime_type, tamano, url]
    );
    return result.rows[0];
}

export const getDocumentosBySolicitudId = async (solicitud_id) => {
    const result = await pool.query(
        `SELECT * FROM documentos_solicitud WHERE solicitud_id = $1`,
        [solicitud_id]
    );
    return result.rows;
}

export const sendRequestBySoliciutudId = async (solicitud_id) => {
    // Cuando el usuario envía/reenvía la solicitud, vuelve al estado Pendiente (ID: 1)
    // para que Ventanilla pueda revisarla
    const result = await pool.query(`UPDATE solicitudes
    SET estado_id = 1
    WHERE id = $1`, [solicitud_id]);

    return result.rowCount > 0;
}

export const findDocumentoById = async (id) => {
    const result = await pool.query(
        `SELECT * FROM documentos_solicitud WHERE id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

export const deleteDocumento = async (documentoId) => {
    const result = await pool.query(
        `DELETE FROM documentos_solicitud WHERE id = $1 RETURNING *`,
        [documentoId]
    );
    return result.rows[0];
}
