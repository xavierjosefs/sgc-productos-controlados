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

        // Validar inputs
        if (!id) {
            return res.status(400).json({ ok: false, message: "ID de solicitud requerido" });
        }
        if (!status) {
            return res.status(400).json({ ok: false, message: "Estado requerido" });
        }

        // Obtener detalle para verificar usuario
        const request = await getRequestDetailsById(id);
        if (!request) {
            return res.status(404).json({ ok: false, message: "Solicitud no encontrada" });
        }

        // Determinar ID de estado
        // Estados según la BD:
        // 12 = Enviada (solicitud enviada por cliente)
        // 2 = En revisión por VUS (ventanilla está revisando)
        // 3 = Devuelta por VUS (no cumple requisitos formales)
        // 4 = En evaluación técnica (aprobada por VUS, pasa a técnicos UPC)
        //
        // FLUJO:
        // Usuario envía → Enviada(12)
        // Ventanilla devuelve → Devuelta por VUS(3)
        // Usuario corrige y reenvía → Enviada(12) nuevamente
        // Ventanilla aprueba → En evaluación técnica(4)
        
        let newStatusId;
        if (status === 'devuelto_vus') {
            // Devuelto por Ventanilla - estado "Devuelta por VUS"
            newStatusId = 3;
        } else if (status === 'aprobado_vus') {
            // Aprobado por ventanilla - pasa a "En evaluación técnica" (siguiente etapa)
            newStatusId = 4;
        } else {
            return res.status(400).json({ ok: false, message: "Estado inválido" });
        }

        // Actualizar estado
        const updatedRequest = await updateRequestStatus(id, newStatusId);

        // Si es "NO CUMPLE" (devuelto), enviar correo
        if (status === 'devuelto_vus' && reasons) {
            const user = await findUserByCedula(request.user_id);
            if (user && user.email) {
                const subject = `Solicitud #${id} - Corrección Requerida`;
                const text = `Estimado usuario,\n\nSu solicitud #${id} no cumple con los requisitos formales por las siguientes razones:\n\n${reasons}\n\nPor favor ingrese a la plataforma para corregir estos puntos.\n\nAtentamente,\nVentanilla Única de Servicios`;

                // No bloqueamos la respuesta por el envío de correo, pero lo logueamos
                sendEmail(user.email, subject, text).catch(err => console.error("Error enviando email:", err));
            }
        }
        // Si es "APROBADO" (cumple), enviar correo de confirmación
        else if (status === 'aprobado_vus') {
            const user = await findUserByCedula(request.user_id);
            if (user && user.email) {
                const subject = `Solicitud #${id} - Recibida y Validada`;
                const text = `Estimado usuario,\n\nSu solicitud #${id} ha sido validada correctamente por Ventanilla Única y ha pasado a la siguiente etapa de evaluación técnica.\n\nLe mantendremos informado sobre el progreso de su solicitud.\n\nAtentamente,\nVentanilla Única de Servicios`;

                sendEmail(user.email, subject, text).catch(err => console.error("Error enviando email aprobado:", err));
            }
        }

        return res.status(200).json({
            ok: true,
            message: "Solicitud actualizada correctamente",
            request: updatedRequest
        });

    } catch (error) {
        console.error("Error al validar solicitud:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};
