import pool from "../config/db.js";

/**
 * Controller para manejar decisión de Dirección (Aprobar/Rechazar)
 * Compatible con el frontend que envía { decision: 'APROBAR' | 'RECHAZAR', comentario }
 */
export const direccionDecisionController = async (req, res) => {
    try {
        const { id } = req.params;
        const { decision, comentario } = req.body;

        console.log(`📋 Dirección - Decisión sobre solicitud ${id}:`, decision);

        // Validar decisión
        if (!["APROBAR", "RECHAZAR"].includes(decision)) {
            return res.status(400).json({
                ok: false,
                error: "La decisión debe ser APROBAR o RECHAZAR"
            });
        }

        // Verificar que la solicitud existe y está en estado correcto (6: APROBADA_UPC)
        const { rows: [solicitud] } = await pool.query(
            'SELECT * FROM solicitudes WHERE id = $1',
            [id]
        );

        if (!solicitud) {
            return res.status(404).json({
                ok: false,
                error: "Solicitud no encontrada"
            });
        }

        if (solicitud.estado_id !== 7) {
            return res.status(400).json({
                ok: false,
                error: "Esta solicitud no está pendiente de aprobación por Dirección"
            });
        }

        // Determinar nuevo estado
        // Si aprueba: estado 8 (EN_DNCD - siguiente paso)
        // Si rechaza: estado 18 (rechazada_direccion)
        const nuevoEstadoId = decision === "APROBAR" ? 8 : 18;

        // Actualizar solicitud - solo cambiar el estado
        await pool.query(
            `UPDATE solicitudes 
             SET estado_id = $1
             WHERE id = $2`,
            [nuevoEstadoId, id]
        );

        console.log(`✅ Solicitud ${id} ${decision === "APROBAR" ? "aprobada" : "rechazada"} por Dirección`);

        return res.status(200).json({
            ok: true,
            message: `Solicitud ${decision === "APROBAR" ? "aprobada" : "rechazada"} correctamente`,
            solicitud_id: id,
            nuevo_estado: nuevoEstadoId
        });

    } catch (error) {
        console.error("❌ Error en direccionDecisionController:", error);
        return res.status(500).json({
            ok: false,
            error: error.message
        });
    }
};
