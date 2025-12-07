import { getRequestsForVentanilla, updateRequestStatus, getRequestDetailsById, findUserByCedula } from "../models/user.client.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getDocumentosBySolicitudId } from "../models/document.client.js";
import pool from "../config/db.js";

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
