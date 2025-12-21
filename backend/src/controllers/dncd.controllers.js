import { getDNCDRequest, getDNCDRequestDetail, findUserByCedula } from "../models/user.client.js";
import { generateCertificatePDF, getCertificateFilename } from "../services/pdfGenerator.js";
import { sendEmailWithAttachment } from "../utils/sendEmail.js";
import { addHistorialEntry, ACCION_TYPES } from "../models/historial.client.js";
import pool from "../config/db.js";

/**
 * Helper para obtener datos completos de la solicitud para el PDF
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

export const getDNCDRequestsController = async (req, res) => {
    try {
        const requests = await getDNCDRequest();

        return res.status(200).json({
            ok: true,
            requests
        });
    } catch (error) {
        console.error("Error al obtener solicitudes para dncd:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

/**
 * Get DNCD request detail with documents
 */
export const getDNCDRequestDetailController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🔍 DNCD - Obteniendo detalle de solicitud:', id);

        const detalle = await getDNCDRequestDetail(id);

        if (!detalle) {
            return res.status(404).json({ ok: false, message: "Solicitud no encontrada" });
        }

        return res.status(200).json({
            ok: true,
            detalle
        });
    } catch (error) {
        console.error("❌ Error al obtener detalle de solicitud DNCD:", error);
        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

/**
 * Generate and download certificate PDF for DNCD role
 */
export const getDNCDCertificatePDFController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('📄 DNCD - Generando certificado PDF para solicitud:', id);

        const requestData = await getFullRequestDataForPDF(id);

        if (!requestData) {
            return res.status(404).json({
                ok: false,
                message: "Solicitud no encontrada"
            });
        }

        // Only allow viewing for DNCD-visible requests (estados 10, 18)
        if (![10, 18].includes(requestData.estado_id)) {
            return res.status(403).json({
                ok: false,
                message: "El certificado solo está disponible para solicitudes aprobadas o rechazadas"
            });
        }

        // Generate PDF buffer
        const pdfBuffer = await generateCertificatePDF(requestData, requestData.form_code);
        const filename = getCertificateFilename(id, requestData.form_code);

        console.log('✅ PDF generado exitosamente:', filename);

        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        return res.send(pdfBuffer);
    } catch (error) {
        console.error("❌ Error al generar certificado PDF DNCD:", error);
        return res.status(500).json({
            ok: false,
            message: "Error al generar el certificado PDF",
            error: error.message
        });
    }
};

/**
 * Approve a request from DNCD role
 * Changes estado from 8 (aprobada_direccion) to 10 (aprobada_dncd)
 * Generates PDF and sends email with attachment to client
 */
export const approveDncdRequestController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('✅ DNCD - Aprobando solicitud:', id);

        // Get request data
        const requestData = await getFullRequestDataForPDF(id);

        if (!requestData) {
            return res.status(404).json({
                ok: false,
                message: "Solicitud no encontrada"
            });
        }

        // Only allow approval for requests in estado 8 (aprobada_direccion)
        if (requestData.estado_id !== 8) {
            return res.status(400).json({
                ok: false,
                message: "Solo se pueden aprobar solicitudes pendientes de aprobación DNCD (estado 8)"
            });
        }

        const estadoAnteriorId = requestData.estado_id;
        const nuevoEstadoId = 10; // aprobada_dncd

        // Update status in database
        await pool.query(
            `UPDATE solicitudes SET estado_id = $1 WHERE id = $2`,
            [nuevoEstadoId, id]
        );

        // Record in historial
        await addHistorialEntry({
            solicitud_id: parseInt(id),
            estado_anterior_id: estadoAnteriorId,
            estado_nuevo_id: nuevoEstadoId,
            usuario_id: req.user?.cedula || req.user?.id,
            rol_usuario: 'dncd',
            accion: ACCION_TYPES.APROBACION_DIRECCION, // Using same action type
            comentario: 'Aprobación final DNCD',
            metadata: { status: 'aprobado_dncd' }
        });

        // Get user for email
        const user = await findUserByCedula(requestData.user_id);

        // Generate PDF and send email
        if (user?.email) {
            try {
                // Update estado_id for PDF watermark
                requestData.estado_id = nuevoEstadoId;

                const pdfBuffer = await generateCertificatePDF(requestData, requestData.form_code);
                const pdfFilename = getCertificateFilename(id, requestData.form_code);

                console.log('📄 PDF generado para email DNCD:', pdfFilename);

                const subject = `Solicitud #${id} - ¡Aprobación Final!`;
                const text = `Estimado usuario,

¡Felicidades! Su solicitud #${id} ha sido aprobada de forma definitiva.

Adjunto encontrará el certificado oficial de su solicitud aprobada.

Este documento es la constancia oficial de la aprobación de su solicitud.

Atentamente,
DNCD`;

                const html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2d8a4a;">🎉 ¡Solicitud Aprobada!</h2>
                        <p>Estimado usuario,</p>
                        <p><strong>¡Felicidades!</strong> Su solicitud <strong>#${id}</strong> ha sido aprobada de forma definitiva.</p>
                        <p>Adjunto encontrará el <strong>certificado oficial</strong> de su solicitud aprobada.</p>
                        <p>Este documento es la constancia oficial de la aprobación de su solicitud.</p>
                        <p>Atentamente,<br><strong>DNCD</strong></p>
                    </div>`;

                const attachments = [{
                    filename: pdfFilename,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }];

                await sendEmailWithAttachment({
                    to: user.email,
                    subject,
                    text,
                    html,
                    attachments
                });

                console.log('📧 Email con certificado enviado exitosamente');
            } catch (emailError) {
                console.error('❌ Error enviando email con certificado:', emailError);
                // Continue even if email fails - the approval is still valid
            }
        }

        return res.status(200).json({
            ok: true,
            message: "Solicitud aprobada exitosamente. Certificado enviado al cliente.",
            solicitud_id: id,
            nuevo_estado: nuevoEstadoId
        });

    } catch (error) {
        console.error("❌ Error al aprobar solicitud DNCD:", error);
        return res.status(500).json({
            ok: false,
            message: "Error al aprobar la solicitud",
            error: error.message
        });
    }
};

export default getDNCDRequestsController;