import { getRequestDetailsById, findUserByCedula, updateRequestStatus } from "../models/user.client.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getDocumentosBySolicitudId } from "../models/document.client.js";
import { generateCertificatePDF, getCertificateFilename } from "../services/pdfGenerator.js";
import pool from "../config/db.js";

// Constantes para códigos de estado - más mantenible que IDs hardcodeados
const ESTADO_CODES = {
    APROBADA_DIRECTOR_UPC: 'aprobada_director_upc',
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
 */
const getFullRequestDataForPDF = async (requestId) => {
    const result = await pool.query(`
        SELECT 
            s.id,
            s.user_id,
            s.form_data,
            s.fecha_creacion,
            s.tipo_solicitud,
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
 * Returns requests with estado 'aprobada_director_upc'
 */
export const getDireccionRequestsController = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                s.id,
                s.user_id,
                u.full_name AS nombre_cliente,
                ts.nombre_servicio AS tipo_servicio,
                s.fecha_creacion,
                e.nombre_mostrar AS estado_actual
            FROM solicitudes s
            JOIN users u ON s.user_id = u.cedula
            JOIN tipos_servicio ts ON s.tipo_servicio_id = ts.id
            JOIN estados_solicitud e ON s.estado_id = e.id
            WHERE e.codigo_estado = $1
            ORDER BY s.fecha_creacion DESC
        `, [ESTADO_CODES.APROBADA_DIRECTOR_UPC]);

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
            ...request,
            documentos
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

        // Buscar usuario para notificación por email
        const user = await findUserByCedula(request.user_id);

        // Enviar correo si la solicitud fue rechazada
        if (status === 'rechazado_direccion' && reasons && user?.email) {
            const subject = `Solicitud #${id} - Rechazada por Dirección`;
            const text = `Estimado usuario,

Su solicitud #${id} fue rechazada por la Dirección por las siguientes razones:

${reasons}

Por favor, ingrese a la plataforma para revisar los detalles.

Atentamente,
Dirección`;

            sendEmail(user.email, subject, text).catch(err =>
                console.error("Error enviando email de rechazo:", err)
            );
        }

        // Enviar correo si la solicitud fue aprobada
        if (status === 'aprobado_direccion' && user?.email) {
            const subject = `Solicitud #${id} - Aprobada por Dirección`;
            const text = `Estimado usuario,

Su solicitud #${id} ha sido aprobada y firmada por la Dirección.
Su solicitud continúa al siguiente paso del proceso.

Le notificaremos cuando se produzcan nuevos avances.

Atentamente,
Dirección`;

            sendEmail(user.email, subject, text).catch(err =>
                console.error("Error enviando email de aprobación:", err)
            );
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
