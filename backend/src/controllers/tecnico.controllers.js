import { getRequestsForTecnicoUPC, getTecnicoUPCRequestDetails, validarSolicitudTecnica, getRequestDetailsById } from "../models/user.client.js";
import { addHistorialEntry, ACCION_TYPES } from "../models/historial.client.js";

export const getTecnicoUPCRequestsController = async (req, res) => {
  try {
    const requests = await getRequestsForTecnicoUPC();

    return res.status(200).json({
      ok: true,
      requests
    });
  } catch (error) {
    console.error("Error al obtener solicitudes para tecnico upc:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
}

export const getTecnicoUPCRequestDetailsController = async (req, res) => {
  try {
    const { id } = req.params;

    const detalle = await getTecnicoUPCRequestDetails(id);

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

export const validarSolicitudTecnicaController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Obtener estado anterior antes de la validación
    const requestBefore = await getRequestDetailsById(id);
    const estadoAnteriorId = requestBefore?.estado_id;

    const resultado = await validarSolicitudTecnica(id, data);

    // Registrar en historial
    await addHistorialEntry({
      solicitud_id: parseInt(id),
      estado_anterior_id: estadoAnteriorId,
      estado_nuevo_id: resultado.estado_id,
      usuario_id: req.user?.cedula || req.user?.id,
      rol_usuario: 'tecnico_controlados',
      accion: ACCION_TYPES.VALIDACION_TECNICA,
      comentario: data.comentario_general || null,
      metadata: {
        recomendacion: resultado.recomendacion,
        formulario_cumple: data.formulario_cumple,
        documentos: data.documentos
      }
    });

    res.json({
      ok: true,
      message: "Validación técnica registrada correctamente.",
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
