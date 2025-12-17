import { getRequestDetailsById, findUserByCedula, updateRequestStatus } from "../models/user.client.js";
import { sendEmail, sendEmailWithAttachment } from "../utils/sendEmail.js";
import { getDocumentosBySolicitudId } from "../models/document.client.js";
import { generateCertificatePDF, getCertificateFilename } from "../services/pdfGenerator.js";
import pool from "../config/db.js";
import { addHistorialEntry, ACCION_TYPES } from "../models/historial.client.js";

// Constantes para códigos de estado - más mantenible que IDs hardcodeados
const ESTADO_CODES = {
    APROBADA_DIRECTOR_UPC: 'FIRMADA_DIRECCION',  // Solicitudes aprobadas por Director Técnico
    APROBADA_DIRECCION: 'aprobada_direccion',
    RECHAZADA_DIRECCION: 'rechazada_direccion'
};

/**
 * Helper para obtener el ID de un estado por su código
 */
const getEstadoIdByCode = async (codigo) => {
    const result = await pool.query(
        'SELECT id FROM estados_solicitud WHERE codigo_estado = $1',
        [codigo]
    );
    return result.rows[0]?.id || null;
};

/**
 * Helper para obtener el código del formulario de una solicitud
 * @param {number} requestId 
 * @returns {Promise<string>} 'FORM_CLASE_A' or 'FORM_CLASE_B'
 */
const getFormCodeByRequestId = async (requestId) => {
    const result = await pool.query(`
        SELECT f.codigo
        FROM solicitudes s
        JOIN tipos_servicio ts ON s.tipo_servicio_id = ts.id
        JOIN formularios f ON ts.formulario_id = f.id
        WHERE s.id = $1
    `, [requestId]);
    return result.rows[0]?.codigo || 'FORM_CLASE_A';
};

/**
 * Helper para obtener datos completos de la solicitud para el PDF
 * Includes estado_id for watermark determination
 */
const getFullRequestDataForPDF = async (requestId) => {
    const result = await pool.query(`
        SELECT 
            s.id,
            s.user_id,
            s.form_data,
            s.fecha_creacion,
            s.tipo_solicitud,
            s.estado_id,
            u.full_name AS nombre_cliente,
            u.cedula AS cliente_cedula,
            ts.nombre_servicio AS tipo_servicio,
            f.codigo AS form_code
        FROM solicitudes s
        JOIN users u ON s.user_id = u.cedula
        JOIN tipos_servicio ts ON s.tipo_servicio_id = ts.id
        JOIN formularios f ON ts.formulario_id = f.id
        WHERE s.id = $1
    `, [requestId]);
    return result.rows[0] || null;
};

/**
 * Controller to get requests for Dirección role
 * Returns requests pendientes (estado 7), aprobadas (estado 8) y rechazadas (estado 18)
 */
export const getDireccionRequestsController = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                s.id,
                s.user_id,
                s.estado_id,
                u.full_name AS nombre_cliente,
                ts.nombre_servicio AS tipo_servicio,
                s.fecha_creacion,
                e.nombre_mostrar AS estado_actual,
                e.codigo_estado
            FROM solicitudes s
            JOIN users u ON s.user_id = u.cedula
            JOIN tipos_servicio ts ON s.tipo_servicio_id = ts.id
            JOIN estados_solicitud e ON s.estado_id = e.id
            WHERE s.estado_id IN (7, 8, 18)
            ORDER BY s.fecha_creacion DESC
        `);

        return res.status(200).json({
            ok: true,
            requests: result.rows
        });
    } catch (error) {
        console.error("Error al obtener solicitudes para direccion:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

/**
 * Controller to get request detail with documents
 * Specific for Dirección role
 */
export const getDireccionRequestDetailController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🔍 Dirección - Obteniendo detalle de solicitud:', id);

        // Obtener detalle básico de la solicitud
        const request = await getRequestDetailsById(id);
        console.log('📋 Request encontrada:', request ? 'Sí' : 'No');
        if (!request) {
            return res.status(404).json({ ok: false, message: "Solicitud no encontrada" });
        }

        // Obtener documentos
        const documentos = await getDocumentosBySolicitudId(id);
        console.log('📎 Documentos encontrados:', documentos ? documentos.length : 0);

        console.log('📤 Enviando respuesta con', documentos?.length || 0, 'documentos');

        return res.status(200).json({
            ok: true,
            detalle: {
                ...request,
                documentos
            }
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

/**
 * Controller to validate a request (Aprobar / Reprobar)
 * For Dirección role
 */
export const validateDireccionRequestController = async (req, res) => {
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

        // Obtener ID del estado requerido para validar
        const estadoRequeridoId = await getEstadoIdByCode(ESTADO_CODES.APROBADA_DIRECTOR_UPC);

        // Verificar que la solicitud está en estado correcto
        if (request.estado_id !== estadoRequeridoId) {
            return res.status(400).json({
                ok: false,
                message: "Esta solicitud no está pendiente de aprobación por Dirección"
            });
        }

        // Determinar nuevo estado
        let newStatusId;
        let statusMessage;
        if (status === 'aprobado_direccion') {
            newStatusId = await getEstadoIdByCode(ESTADO_CODES.APROBADA_DIRECCION);
            statusMessage = 'aprobada';
        } else if (status === 'rechazado_direccion') {
            newStatusId = await getEstadoIdByCode(ESTADO_CODES.RECHAZADA_DIRECCION);
            statusMessage = 'rechazada';
        } else {
            return res.status(400).json({ ok: false, message: "Estado inválido" });
        }

        if (!newStatusId) {
            return res.status(500).json({
                ok: false,
                message: "Estado destino no encontrado en la base de datos"
            });
        }

        // Actualizar estado en BD
        const updatedRequest = await updateRequestStatus(id, newStatusId);

        // Registrar en historial
        const accionType = status === 'aprobado_direccion' ? ACCION_TYPES.APROBACION_DIRECCION : ACCION_TYPES.RECHAZO_DIRECCION;
        await addHistorialEntry({
            solicitud_id: parseInt(id),
            estado_anterior_id: request.estado_id,
            estado_nuevo_id: newStatusId,
            usuario_id: req.user?.cedula || req.user?.id,
            rol_usuario: 'direccion',
            accion: accionType,
            comentario: reasons || null,
            metadata: { status }
        });

        // Buscar usuario para notificación por email
        const user = await findUserByCedula(request.user_id);

        // Generar PDF del certificado para adjuntar al email
        let pdfBuffer = null;
        let pdfFilename = null;
        if (user?.email) {
            try {
                // Obtener datos completos para el PDF con el nuevo estado
                const pdfRequestData = await getFullRequestDataForPDF(id);
                if (pdfRequestData) {
                    // Actualizar estado_id para que el PDF refleje el estado correcto
                    pdfRequestData.estado_id = newStatusId;
                    pdfBuffer = await generateCertificatePDF(pdfRequestData, pdfRequestData.form_code);
                    pdfFilename = getCertificateFilename(id, pdfRequestData.form_code);
                    console.log('📄 PDF generado para email:', pdfFilename);
                }
            } catch (pdfError) {
                console.error('⚠️ Error generando PDF para email (continuando sin adjunto):', pdfError);
            }
        }

        // Enviar correo si la solicitud fue rechazada
        if (status === 'rechazado_direccion' && user?.email) {
            const subject = `Solicitud #${id} - Rechazada por Dirección`;
            const text = `Estimado usuario,

Su solicitud #${id} fue rechazada por la Dirección${reasons ? ` por las siguientes razones:\n\n${reasons}` : '.'}\n\nAdjunto encontrará el certificado con el estado de su solicitud.\n\nPor favor, ingrese a la plataforma para revisar los detalles.\n\nAtentamente,\nDirección`;

            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #c53030;">Solicitud Rechazada</h2>
                    <p>Estimado usuario,</p>
                    <p>Su solicitud <strong>#${id}</strong> fue rechazada por la Dirección${reasons ? ` por las siguientes razones:</p><blockquote style="border-left: 3px solid #c53030; padding-left: 10px; color: #666;">${reasons}</blockquote>` : '.</p>'}
                    ${pdfBuffer ? '<p>Adjunto encontrará el certificado con el estado de su solicitud.</p>' : ''}
                    <p>Por favor, ingrese a la plataforma para revisar los detalles.</p>
                    <p>Atentamente,<br><strong>Dirección</strong></p>
                </div>`;

            const attachments = pdfBuffer ? [{
                filename: pdfFilename,
                content: pdfBuffer,
                contentType: 'application/pdf'
            }] : [];

            sendEmailWithAttachment({
                to: user.email,
                subject,
                text,
                html,
                attachments
            }).catch(err => console.error("❌ Error enviando email de rechazo:", err));
        }

        // Enviar correo si la solicitud fue aprobada
        if (status === 'aprobado_direccion' && user?.email) {
            const subject = `Solicitud #${id} - Aprobada por Dirección`;
            const text = `Estimado usuario,

Su solicitud #${id} ha sido aprobada y firmada por la Dirección.\n\nAdjunto encontrará el certificado oficial de su solicitud aprobada.\n\nSu solicitud continúa al siguiente paso del proceso.\nLe notificaremos cuando se produzcan nuevos avances.\n\nAtentamente,\nDirección`;

            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2d8a4a;">¡Solicitud Aprobada!</h2>
                    <p>Estimado usuario,</p>
                    <p>Su solicitud <strong>#${id}</strong> ha sido aprobada y firmada por la Dirección.</p>
                    ${pdfBuffer ? '<p>Adjunto encontrará el <strong>certificado oficial</strong> de su solicitud aprobada.</p>' : ''}
                    <p>Su solicitud continúa al siguiente paso del proceso.<br>Le notificaremos cuando se produzcan nuevos avances.</p>
                    <p>Atentamente,<br><strong>Dirección</strong></p>
                </div>`;

            const attachments = pdfBuffer ? [{
                filename: pdfFilename,
                content: pdfBuffer,
                contentType: 'application/pdf'
            }] : [];

            sendEmailWithAttachment({
                to: user.email,
                subject,
                text,
                html,
                attachments
            }).catch(err => console.error("❌ Error enviando email de aprobación:", err));
        }

        return res.status(200).json({
            ok: true,
            message: `Solicitud ${statusMessage} correctamente`,
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
 * Controller to generate and download certificate PDF
 * For Dirección role - generates certificate after approval
 */
export const generateCertificatePDFController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('📄 Generando certificado PDF para solicitud:', id);

        // Get full request data including form code
        const requestData = await getFullRequestDataForPDF(id);

        if (!requestData) {
            return res.status(404).json({
                ok: false,
                message: "Solicitud no encontrada"
            });
        }

        // Generate PDF buffer
        const pdfBuffer = await generateCertificatePDF(requestData, requestData.form_code);
        const filename = getCertificateFilename(id, requestData.form_code);

        console.log('✅ PDF generado exitosamente:', filename);

        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send PDF
        return res.send(pdfBuffer);

    } catch (error) {
        console.error("❌ Error al generar certificado PDF:", error);
        return res.status(500).json({
            ok: false,
            message: "Error al generar el certificado PDF",
            error: error.message
        });
    }
};
