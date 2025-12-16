import { getDNCDRequest, getDNCDRequestDetail } from "../models/user.client.js";
import { generateCertificatePDF, getCertificateFilename } from "../services/pdfGenerator.js";
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

export default getDNCDRequestsController;