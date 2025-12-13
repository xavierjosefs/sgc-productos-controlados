import { getRequestsForDirectorUPC, getDirectorUPCRequestDetails, directorUPCDecision, getRequestDetailsById } from "../models/user.client.js";
import { addHistorialEntry, ACCION_TYPES } from "../models/historial.client.js";

export const getDirectorRequestsController = async (req, res) => {
  try {
    const requests = await getRequestsForDirectorUPC();

    res.json({
      ok: true,
      requests
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      error: "Error obteniendo solicitudes para el Director."
    });
  }
};

export const getDirectorUPCRequestDetailsController = async (req, res) => {
  try {
    const { id } = req.params;

    const detalle = await getDirectorUPCRequestDetails(id);
    console.log(detalle);


    res.json({
      ok: true,
      detalle
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

export const directorUPCDecisionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, comentario } = req.body;

    // Obtener estado anterior
    const requestBefore = await getRequestDetailsById(id);
    const estadoAnteriorId = requestBefore?.estado_id;

    const resultado = await directorUPCDecision(id, { decision, comentario });

    // Registrar en historial
    await addHistorialEntry({
      solicitud_id: parseInt(id),
      estado_anterior_id: estadoAnteriorId,
      estado_nuevo_id: resultado.estado_id,
      usuario_id: req.user?.cedula || req.user?.id,
      rol_usuario: 'director_controlados',
      accion: ACCION_TYPES.DECISION_DIRECTOR_UPC,
      comentario: comentario || null,
      metadata: { decision: resultado.decision }
    });

    res.json({
      ok: true,
      message: "Decisión del Director UPC registrada correctamente.",
      resultado
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      ok: false,
      error: error.message
    });
  }
};
