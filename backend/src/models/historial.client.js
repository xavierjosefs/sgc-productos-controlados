/**
 * Historial Client - Database functions for request timeline
 * Handles all CRUD operations for the historial_solicitud table
 */

import pool from '../config/db.js';

/**
 * Action types catalog for timeline events
 */
export const ACCION_TYPES = {
    CREACION: 'CREACION',
    ENVIO: 'ENVIO',
    REENVIO: 'REENVIO',
    VALIDACION_VENTANILLA: 'VALIDACION_VENTANILLA',
    DEVOLUCION_VENTANILLA: 'DEVOLUCION_VENTANILLA',
    VALIDACION_TECNICA: 'VALIDACION_TECNICA',
    DECISION_DIRECTOR_UPC: 'DECISION_DIRECTOR_UPC',
    APROBACION_DIRECCION: 'APROBACION_DIRECCION',
    RECHAZO_DIRECCION: 'RECHAZO_DIRECCION',
    DOCUMENTO_SUBIDO: 'DOCUMENTO_SUBIDO',
    DOCUMENTO_ELIMINADO: 'DOCUMENTO_ELIMINADO',
    DOCUMENTO_ACTUALIZADO: 'DOCUMENTO_ACTUALIZADO',
    CORRECCION_CLIENTE: 'CORRECCION_CLIENTE'
};

/**
 * Display names for action types (Spanish)
 */
export const ACCION_DISPLAY_NAMES = {
    CREACION: 'Solicitud Creada',
    ENVIO: 'Solicitud Enviada',
    REENVIO: 'Solicitud Reenviada',
    VALIDACION_VENTANILLA: 'Aprobada por Ventanilla',
    DEVOLUCION_VENTANILLA: 'Devuelta por Ventanilla',
    VALIDACION_TECNICA: 'Evaluación Técnica Completada',
    DECISION_DIRECTOR_UPC: 'Decisión del Director UPC',
    APROBACION_DIRECCION: 'Aprobada por Dirección',
    RECHAZO_DIRECCION: 'Rechazada por Dirección',
    DOCUMENTO_SUBIDO: 'Documento Subido',
    DOCUMENTO_ELIMINADO: 'Documento Eliminado',
    DOCUMENTO_ACTUALIZADO: 'Documento Actualizado',
    CORRECCION_CLIENTE: 'Correcciones Realizadas'
};

/**
 * Add a new entry to the request timeline
 * @param {Object} data - Timeline entry data
 * @param {number} data.solicitud_id - Request ID
 * @param {number|null} data.estado_anterior_id - Previous state ID
 * @param {number|null} data.estado_nuevo_id - New state ID
 * @param {string|null} data.usuario_id - User cedula who performed the action
 * @param {string|null} data.rol_usuario - User's role name
 * @param {string} data.accion - Action type (from ACCION_TYPES)
 * @param {string|null} data.comentario - Comments or reasons
 * @param {Object|null} data.metadata - Additional JSON data
 * @returns {Promise<Object>} Created timeline entry
 */
export const addHistorialEntry = async (data) => {
    const {
        solicitud_id,
        estado_anterior_id = null,
        estado_nuevo_id = null,
        usuario_id = null,
        rol_usuario = null,
        accion,
        comentario = null,
        metadata = null
    } = data;

    const result = await pool.query(
        `INSERT INTO historial_solicitud 
         (solicitud_id, estado_anterior_id, estado_nuevo_id, usuario_id, rol_usuario, accion, comentario, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [solicitud_id, estado_anterior_id, estado_nuevo_id, usuario_id, rol_usuario, accion, comentario, metadata ? JSON.stringify(metadata) : null]
    );

    return result.rows[0];
};

/**
 * Get complete timeline for a request
 * @param {number} solicitudId - Request ID
 * @returns {Promise<Array>} Array of timeline entries with state names
 */
export const getHistorialBySolicitudId = async (solicitudId) => {
    const result = await pool.query(
        `SELECT 
            h.id,
            h.solicitud_id,
            h.estado_anterior_id,
            ea.nombre_mostrar AS estado_anterior,
            h.estado_nuevo_id,
            en.nombre_mostrar AS estado_nuevo,
            h.usuario_id,
            u.full_name AS usuario_nombre,
            h.rol_usuario,
            h.accion,
            h.comentario,
            h.metadata,
            h.fecha_evento
         FROM historial_solicitud h
         LEFT JOIN estados_solicitud ea ON h.estado_anterior_id = ea.id
         LEFT JOIN estados_solicitud en ON h.estado_nuevo_id = en.id
         LEFT JOIN users u ON h.usuario_id = u.cedula
         WHERE h.solicitud_id = $1
         ORDER BY h.fecha_evento ASC`,
        [solicitudId]
    );

    return result.rows;
};

/**
 * Get timeline entries by user
 * @param {string} cedula - User cedula
 * @param {number} limit - Maximum entries to return
 * @returns {Promise<Array>} Array of timeline entries
 */
export const getHistorialByUserId = async (cedula, limit = 50) => {
    const result = await pool.query(
        `SELECT 
            h.*,
            ea.nombre_mostrar AS estado_anterior,
            en.nombre_mostrar AS estado_nuevo,
            s.tipo_servicio_id
         FROM historial_solicitud h
         LEFT JOIN estados_solicitud ea ON h.estado_anterior_id = ea.id
         LEFT JOIN estados_solicitud en ON h.estado_nuevo_id = en.id
         LEFT JOIN solicitudes s ON h.solicitud_id = s.id
         WHERE h.usuario_id = $1
         ORDER BY h.fecha_evento DESC
         LIMIT $2`,
        [cedula, limit]
    );

    return result.rows;
};

/**
 * Get the latest timeline entry for a request
 * @param {number} solicitudId - Request ID
 * @returns {Promise<Object|null>} Latest timeline entry or null
 */
export const getLatestHistorialEntry = async (solicitudId) => {
    const result = await pool.query(
        `SELECT * FROM historial_solicitud 
         WHERE solicitud_id = $1 
         ORDER BY fecha_evento DESC 
         LIMIT 1`,
        [solicitudId]
    );

    return result.rows[0] || null;
};

/**
 * Count timeline entries for a request
 * @param {number} solicitudId - Request ID
 * @returns {Promise<number>} Count of entries
 */
export const countHistorialEntries = async (solicitudId) => {
    const result = await pool.query(
        `SELECT COUNT(*) as count FROM historial_solicitud WHERE solicitud_id = $1`,
        [solicitudId]
    );

    return parseInt(result.rows[0].count, 10);
};

export default {
    ACCION_TYPES,
    ACCION_DISPLAY_NAMES,
    addHistorialEntry,
    getHistorialBySolicitudId,
    getHistorialByUserId,
    getLatestHistorialEntry,
    countHistorialEntries
};
