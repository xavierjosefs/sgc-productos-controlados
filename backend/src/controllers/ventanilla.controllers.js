import { getRequestsForVentanilla, updateRequestStatus, getRequestDetailsById, findUserByCedula } from "../models/user.client.js";
import { sendEmail } from "../utils/sendEmail.js";

/**
 * Controller to get requests for Ventanilla role
 * Returns requests with estado 'ENVIADA'
 */
export const getVentanillaRequestsController = async (req, res) => {
    try {
        const requests = await getRequestsForVentanilla();

        return res.status(200).json({
            ok: true,
            requests
        });
    } catch (error) {
        console.error("Error al obtener solicitudes para ventanilla:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};


/**
 * Controller to validate a request (Cumple / No Cumple)
 */
export const validateRequestController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reasons } = req.body;

    if (!id) {
      return res.status(400).json({ ok: false, message: "ID de solicitud requerido" });
    }
    if (!status) {
      return res.status(400).json({ ok: false, message: "Estado requerido" });
    }

    const request = await getRequestDetailsById(id);
    if (!request) {
      return res.status(404).json({ ok: false, message: "Solicitud no encontrada" });
    }

    // 🔥 Mapeo directo sin archivos adicionales
    let newStatusId = null;

    if (status === "devuelto_vus") {
      newStatusId = 3; // DEVUELTA_VUS
    } else if (status === "aprobado_vus") {
      newStatusId = 4; // EN_EVALUACION_UPC
    } else {
      return res.status(400).json({ ok: false, message: "Estado inválido" });
    }

    // Actualizar estado en BD
    const updatedRequest = await updateRequestStatus(id, newStatusId);

    // Buscar usuario solo una vez (para ambos casos)
    const user = await findUserByCedula(request.user_id);

    // Si la solicitud fue devuelta, enviar correo con razones
    if (status === "devuelto_vus" && reasons && user?.email) {
      const subject = `Solicitud #${id} - Corrección requerida`;
      const text = `Estimado usuario,

        Su solicitud #${id} fue devuelta por Ventanilla Única por las siguientes razones:

        ${reasons}

        Por favor, ingrese a la plataforma para corregir los puntos indicados.

        Atentamente,
        Ventanilla Única de Servicios`;

      sendEmail(user.email, subject, text).catch(err =>
        console.error("Error enviando email de devolución:", err)
      );
    }

    // Si la solicitud fue aprobada por Ventanilla, enviar correo de confirmación
    if (status === "aprobado_vus" && user?.email) {
      const subject = `Solicitud #${id} - Recibida y validada`;
      const text = `Estimado usuario,

        Su solicitud #${id} ha sido validada correctamente por la Ventanilla Única de Servicios
        y ha pasado a la etapa de evaluación técnica.

        Le notificaremos cuando se produzcan nuevos avances en su solicitud.

        Atentamente,
        Ventanilla Única de Servicios`;

      sendEmail(user.email, subject, text).catch(err =>
        console.error("Error enviando email de aprobación:", err)
      );
    }

    return res.status(200).json({
      ok: true,
      message: "Solicitud actualizada correctamente",
      request: updatedRequest,
    });

  } catch (error) {
    console.error("Error al validar solicitud:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};


