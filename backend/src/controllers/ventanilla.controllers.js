import { getRequestsForVentanilla, updateRequestStatus, getRequestDetailsById, findUserByCedula } from "../models/user.client.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getDocumentosBySolicitudId } from "../models/document.client.js";
import pool from "../config/db.js";
import { addHistorialEntry, ACCION_TYPES } from "../models/historial.client.js";

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
        const { status, reasons, documentValidation, formDataValidation } = req.body;

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

        // Determinar ID de estado
        let newStatusId;
        if (status === 'devuelto_vus') {
            newStatusId = 3; // Devuelta por VUS
        } else if (status === 'aprobado_vus') {
            newStatusId = 4; // En evaluación técnica
        } else {
            return res.status(400).json({ ok: false, message: "Estado inválido" });
        }

        // ====== GUARDAR VALIDACIONES ======
        // Limpiar validaciones anteriores de esta solicitud
        await pool.query('DELETE FROM validaciones_ventanilla WHERE solicitud_id = $1', [id]);

        // Guardar validaciones de documentos
        if (documentValidation && typeof documentValidation === 'object') {
            for (const [docId, cumple] of Object.entries(documentValidation)) {
                if (cumple !== null) {
                    await pool.query(
                        `INSERT INTO validaciones_ventanilla 
                         (solicitud_id, documento_id, cumple, fecha_validacion) 
                         VALUES ($1, $2, $3, NOW())`,
                        [id, docId, cumple]
                    );
                }
            }
        }

        // Guardar validaciones de campos de formulario
        if (formDataValidation && typeof formDataValidation === 'object') {
            for (const [campo, cumple] of Object.entries(formDataValidation)) {
                if (cumple !== null) {
                    await pool.query(
                        `INSERT INTO validaciones_ventanilla 
                         (solicitud_id, campo_formulario, cumple, fecha_validacion) 
                         VALUES ($1, $2, $3, NOW())`,
                        [id, campo, cumple]
                    );
                }
            }
        }
        // ====== FIN GUARDAR VALIDACIONES ======

        // Actualizar estado en BD
        const updatedRequest = await updateRequestStatus(id, newStatusId);

        // Registrar en historial
        const accionType = status === 'devuelto_vus' ? ACCION_TYPES.DEVOLUCION_VENTANILLA : ACCION_TYPES.VALIDACION_VENTANILLA;
        await addHistorialEntry({
            solicitud_id: parseInt(id),
            estado_anterior_id: request.estado_id,
            estado_nuevo_id: newStatusId,
            usuario_id: req.user?.cedula || req.user?.id,
            rol_usuario: 'ventanilla',
            accion: accionType,
            comentario: reasons || null,
            metadata: { documentValidation, formDataValidation }
        });

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

/**
 * Controller to get request detail with validations
 */
export const getRequestDetailController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🔍 Ventanilla - Obteniendo detalle de solicitud:', id);

        // Obtener detalle básico de la solicitud
        const request = await getRequestDetailsById(id);
        console.log('📋 Request encontrada:', request ? 'Sí' : 'No');
        if (!request) {
            return res.status(404).json({ ok: false, message: "Solicitud no encontrada" });
        }

        // Obtener documentos
        const documentos = await getDocumentosBySolicitudId(id);
        console.log('📎 Documentos encontrados:', documentos ? documentos.length : 0);

        // Obtener validaciones previas
        const validacionesResult = await pool.query(
            `SELECT documento_id, campo_formulario, cumple 
             FROM validaciones_ventanilla 
             WHERE solicitud_id = $1`,
            [id]
        );
        console.log('✅ Validaciones encontradas:', validacionesResult.rows.length);

        // Organizar validaciones en objetos separados
        const documentValidation = {};
        const formDataValidation = {};

        validacionesResult.rows.forEach(row => {
            if (row.documento_id) {
                documentValidation[row.documento_id] = row.cumple;
            } else if (row.campo_formulario) {
                formDataValidation[row.campo_formulario] = row.cumple;
            }
        });

        console.log('📤 Enviando respuesta con', Object.keys(documentValidation).length, 'validaciones de documentos y', Object.keys(formDataValidation).length, 'validaciones de campos');

        return res.status(200).json({
            ok: true,
            ...request,
            documentos,
            documentValidation,
            formDataValidation
        });

    } catch (error) {
        console.error("❌ Error al obtener detalle de solicitud:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};
