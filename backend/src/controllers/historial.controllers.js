/**
 * Historial Controllers - API endpoints for request timeline
 */

import {
    getHistorialBySolicitudId,
    getHistorialByUserId,
    ACCION_DISPLAY_NAMES
} from '../models/historial.client.js';

/**
 * Get timeline for a specific request
 * GET /api/requests/:id/timeline
 */
export const getRequestTimelineController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                ok: false,
                message: 'ID de solicitud requerido'
            });
        }

        const timeline = await getHistorialBySolicitudId(id);

        // Enrich with display names
        const enrichedTimeline = timeline.map(entry => ({
            ...entry,
            accion_display: ACCION_DISPLAY_NAMES[entry.accion] || entry.accion,
            fecha_formateada: new Date(entry.fecha_evento).toLocaleString('es-DO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }));

        return res.status(200).json({
            ok: true,
            timeline: enrichedTimeline,
            count: enrichedTimeline.length
        });

    } catch (error) {
        console.error('Error al obtener timeline:', error);
        return res.status(500).json({
            ok: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

/**
 * Get activity history for the authenticated user
 * GET /api/requests/my-activity
 */
export const getUserActivityController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const limit = parseInt(req.query.limit) || 50;

        if (!userId) {
            return res.status(401).json({
                ok: false,
                message: 'Usuario no autenticado'
            });
        }

        const activity = await getHistorialByUserId(userId, limit);

        const enrichedActivity = activity.map(entry => ({
            ...entry,
            accion_display: ACCION_DISPLAY_NAMES[entry.accion] || entry.accion
        }));

        return res.status(200).json({
            ok: true,
            activity: enrichedActivity,
            count: enrichedActivity.length
        });

    } catch (error) {
        console.error('Error al obtener actividad del usuario:', error);
        return res.status(500).json({
            ok: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

export default {
    getRequestTimelineController,
    getUserActivityController
};
