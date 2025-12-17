/**
 * PDF Certificate Generator Service - Enhanced Version with Official Logos
 * Generates official certificates for approved/rejected requests
 * Supports Clase A and Clase B certificate types
 * 
 * Design features:
 * - Official government logos (DNCD and Gobierno)
 * - Decorative green guilloche border pattern
 * - Light green textured background
 * - Times New Roman typography (Bold/Italic)
 * - Official government certificate layout
 */

import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get directory path for assets
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asset paths
const ASSETS = {
    logoDNCD: path.join(__dirname, '../assets/DIRECCION_NACIONAL_DE_CONTROL_DE_DROGAS.png'),
    logoGobierno: path.join(__dirname, '../assets/gobierno_logo.png')
};

/**
 * Certificate configuration
 */
const CONFIG = {
    pageSize: 'LETTER',
    margins: {
        top: 40,
        bottom: 40,
        left: 40,
        right: 40
    },
    colors: {
        // Green palette matching official certificates
        borderDark: '#1a5c2a',
        borderMedium: '#2d8a4a',
        borderLight: '#4db36a',
        headerText: '#1a3d2a',
        bodyText: '#2d3748',
        labelText: '#4a5568',
        fieldBorder: '#1a5c2a',
        backgroundTint: '#f0f7f2',
        patternLine: '#c8e6d0',
        saludPublica: '#2d8a4a',
        // Watermark colors
        watermarkApproved: '#2d8a4a',  // Green for approved
        watermarkRejected: '#c53030'    // Red for rejected
    },
    // Times Roman font family (built into PDFKit)
    fonts: {
        regular: 'Times-Roman',
        bold: 'Times-Bold',
        italic: 'Times-Italic',
        boldItalic: 'Times-BoldItalic'
    },
    // Watermark configuration
    watermark: {
        count: 4,           // Number of watermarks per page
        fontSize: 48,       // Font size in points
        opacity: 0.12,      // Transparency (0-1)
        minRotation: -35,   // Minimum rotation angle
        maxRotation: -15,   // Maximum rotation angle
        margin: 100,        // Distance from page edges
        minDistance: 120    // Minimum distance between watermarks
    }
};

/**
 * Draw the decorative guilloche-style border pattern
 */
function drawDecorativeBorder(doc) {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = 20;
    const borderWidth = 30;

    doc.save();

    // Outer dark green border
    doc.lineWidth(2.5);
    doc.strokeColor(CONFIG.colors.borderDark);
    doc.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2)).stroke();

    // Inner border
    doc.lineWidth(1);
    doc.strokeColor(CONFIG.colors.borderMedium);
    doc.rect(margin + 6, margin + 6, pageWidth - (margin * 2) - 12, pageHeight - (margin * 2) - 12).stroke();

    // Draw diagonal guilloche pattern in border area
    const patternSpacing = 5;
    doc.lineWidth(0.4);
    doc.strokeColor(CONFIG.colors.borderLight);
    doc.opacity(0.7);

    // Top border pattern
    for (let x = margin; x < pageWidth - margin; x += patternSpacing) {
        doc.moveTo(x, margin + 1)
            .lineTo(x + patternSpacing / 2, margin + borderWidth - 8)
            .stroke();
        doc.moveTo(x + patternSpacing / 2, margin + 1)
            .lineTo(x, margin + borderWidth - 8)
            .stroke();
    }

    // Bottom border pattern
    for (let x = margin; x < pageWidth - margin; x += patternSpacing) {
        doc.moveTo(x, pageHeight - margin - 1)
            .lineTo(x + patternSpacing / 2, pageHeight - margin - borderWidth + 8)
            .stroke();
        doc.moveTo(x + patternSpacing / 2, pageHeight - margin - 1)
            .lineTo(x, pageHeight - margin - borderWidth + 8)
            .stroke();
    }

    // Left border pattern
    for (let y = margin + borderWidth; y < pageHeight - margin - borderWidth; y += patternSpacing) {
        doc.moveTo(margin + 1, y)
            .lineTo(margin + borderWidth - 8, y + patternSpacing / 2)
            .stroke();
        doc.moveTo(margin + 1, y + patternSpacing / 2)
            .lineTo(margin + borderWidth - 8, y)
            .stroke();
    }

    // Right border pattern
    for (let y = margin + borderWidth; y < pageHeight - margin - borderWidth; y += patternSpacing) {
        doc.moveTo(pageWidth - margin - 1, y)
            .lineTo(pageWidth - margin - borderWidth + 8, y + patternSpacing / 2)
            .stroke();
        doc.moveTo(pageWidth - margin - 1, y + patternSpacing / 2)
            .lineTo(pageWidth - margin - borderWidth + 8, y)
            .stroke();
    }

    // Corner decorations
    const corners = [
        { x: margin + 4, y: margin + 4 },
        { x: pageWidth - margin - 4, y: margin + 4 },
        { x: margin + 4, y: pageHeight - margin - 4 },
        { x: pageWidth - margin - 4, y: pageHeight - margin - 4 }
    ];

    doc.opacity(1);
    doc.lineWidth(1.5);
    doc.strokeColor(CONFIG.colors.borderDark);
    corners.forEach(corner => {
        doc.circle(corner.x, corner.y, 3).stroke();
    });

    doc.restore();
}

/**
 * Draw light background texture pattern
 */
function drawBackgroundTexture(doc) {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    doc.save();

    // Very light green background
    doc.rect(0, 0, pageWidth, pageHeight)
        .fill(CONFIG.colors.backgroundTint);

    // Subtle diagonal pattern
    doc.strokeColor(CONFIG.colors.patternLine);
    doc.lineWidth(0.25);
    doc.opacity(0.25);

    const spacing = 18;
    for (let i = -pageHeight; i < pageWidth + pageHeight; i += spacing) {
        doc.moveTo(i, 0)
            .lineTo(i + pageHeight, pageHeight)
            .stroke();
    }

    doc.restore();
}

/**
 * Generate random positions for watermarks avoiding overlaps
 * @param {number} pageWidth - Width of the page
 * @param {number} pageHeight - Height of the page
 * @param {number} count - Number of watermarks to generate
 * @returns {Array<{x: number, y: number, rotation: number}>} Array of positions
 */
function generateWatermarkPositions(pageWidth, pageHeight, count) {
    const { margin, minDistance, minRotation, maxRotation } = CONFIG.watermark;
    const positions = [];
    const maxAttempts = 100;

    for (let i = 0; i < count; i++) {
        let attempts = 0;
        let validPosition = false;
        let x, y;

        while (!validPosition && attempts < maxAttempts) {
            // Generate random position within margins
            x = margin + Math.random() * (pageWidth - 2 * margin);
            y = margin + Math.random() * (pageHeight - 2 * margin);

            // Check distance from existing watermarks
            validPosition = positions.every(pos => {
                const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
                return distance >= minDistance;
            });

            attempts++;
        }

        // Add position with random rotation
        const rotation = minRotation + Math.random() * (maxRotation - minRotation);
        positions.push({ x, y, rotation });
    }

    return positions;
}

/**
 * Draw watermarks on the current page
 * @param {PDFDocument} doc - PDFKit document
 * @param {boolean} isApproved - True if request is approved, false if rejected
 */
function drawWatermarks(doc, isApproved) {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const { count, fontSize, opacity } = CONFIG.watermark;

    // Determine watermark text and color based on status
    const watermarkText = isApproved ? 'APROBADO' : 'RECHAZADO';
    const watermarkColor = isApproved
        ? CONFIG.colors.watermarkApproved
        : CONFIG.colors.watermarkRejected;

    // Generate random positions for this page
    const positions = generateWatermarkPositions(pageWidth, pageHeight, count);

    doc.save();

    // Set watermark styling
    doc.font(CONFIG.fonts.bold)
        .fontSize(fontSize)
        .fillColor(watermarkColor)
        .opacity(opacity);

    // Draw each watermark
    positions.forEach(({ x, y, rotation }) => {
        doc.save();

        // Translate to position and rotate
        doc.translate(x, y);
        doc.rotate(rotation);

        // Draw the watermark text centered at origin
        doc.text(watermarkText, 0, 0, {
            align: 'center',
            baseline: 'middle'
        });

        doc.restore();
    });

    doc.restore();
}

/**
 * Draw official header with government logos and titles
 */
function drawHeader(doc, certificateClass) {
    const pageWidth = doc.page.width;
    const contentStartY = 60;

    // Main titles - Times-Bold
    doc.font(CONFIG.fonts.bold)
        .fontSize(22)
        .fillColor(CONFIG.colors.headerText)
        .text('República Dominicana', 0, contentStartY, { align: 'center' });

    doc.font(CONFIG.fonts.bold)
        .fontSize(18)
        .text('Presidencia de la República', { align: 'center' });

    // Logos section
    const logoY = contentStartY + 55;

    // Left logo - DNCD
    const leftLogoX = 75;
    try {
        if (fs.existsSync(ASSETS.logoDNCD)) {
            doc.image(ASSETS.logoDNCD, leftLogoX, logoY, {
                width: 70
            });
        }
    } catch (e) {
        // Fallback circle if image not found
        doc.circle(leftLogoX + 35, logoY + 35, 35)
            .lineWidth(2)
            .strokeColor(CONFIG.colors.borderDark)
            .stroke();
    }

    // Text below left logo
    doc.font(CONFIG.fonts.bold)
        .fontSize(9)
        .fillColor(CONFIG.colors.headerText)
        .text('Dirección Nacional', leftLogoX - 5, logoY + 75, { width: 80, align: 'center' })
        .text('de Control de Drogas', leftLogoX - 5, logoY + 87, { width: 80, align: 'center' });

    // Right logo - Gobierno (logo already contains text)
    const rightLogoX = pageWidth - 180;
    try {
        if (fs.existsSync(ASSETS.logoGobierno)) {
            doc.image(ASSETS.logoGobierno, rightLogoX, logoY, {
                width: 120
            });
        }
    } catch (e) {
        // Fallback text if image not found
        doc.font(CONFIG.fonts.regular)
            .fontSize(9)
            .fillColor(CONFIG.colors.labelText)
            .text('GOBIERNO DE LA', rightLogoX, logoY + 5, { width: 120 });

        doc.font(CONFIG.fonts.bold)
            .fontSize(12)
            .fillColor(CONFIG.colors.headerText)
            .text('REPÚBLICA DOMINICANA', rightLogoX, logoY + 20, { width: 120 });
    }

    // Note: No additional text below logo - the logo image already contains "SALUD PÚBLICA"

    // Certificate title - with small caps effect
    const titleY = logoY + 115;

    doc.font(CONFIG.fonts.bold)
        .fontSize(11)
        .fillColor(CONFIG.colors.headerText)
        .text('CERTIFICADO DE INSCRIPCIÓN DE DROGAS CONTROLADAS', 0, titleY, {
            align: 'center',
            characterSpacing: 0.5
        });

    doc.font(CONFIG.fonts.bold)
        .fontSize(18)
        .fillColor(CONFIG.colors.borderDark)
        .text(`- CLASE ${certificateClass} -`, 0, titleY + 18, { align: 'center' });

    return titleY + 50;
}

/**
 * Draw a form field with label and bordered value area
 */
function drawFormField(doc, number, label, value, y, fieldWidth = 400) {
    const labelX = 60;
    const fieldX = 60;
    const fieldHeight = 35;

    // Field label - Times-Roman
    doc.font(CONFIG.fonts.regular)
        .fontSize(11)
        .fillColor(CONFIG.colors.bodyText)
        .text(`${number}) ${label}:`, labelX, y);

    // Draw field box
    const boxY = y + 15;
    doc.rect(fieldX, boxY, fieldWidth, fieldHeight)
        .lineWidth(1)
        .strokeColor(CONFIG.colors.fieldBorder)
        .stroke();

    // Value text inside box - Times-Italic for filled values
    if (value) {
        doc.font(CONFIG.fonts.italic)
            .fontSize(11)
            .fillColor(CONFIG.colors.bodyText)
            .text(value, fieldX + 8, boxY + 10, { width: fieldWidth - 16 });
    }

    return boxY + fieldHeight + 8;
}

/**
 * Draw page 1 - Certificate front page with form data
 * @param {PDFDocument} doc - PDFKit document
 * @param {Object} data - Request data
 * @param {string} certificateClass - 'A' or 'B'
 * @param {boolean|null} isApproved - True if approved, false if rejected, null for no watermark
 */
function drawPage1(doc, data, certificateClass, isApproved = null) {
    // Background and border
    drawBackgroundTexture(doc);
    drawDecorativeBorder(doc);

    // Header section
    let y = drawHeader(doc, certificateClass);

    const formData = data.form_data || {};
    const fieldWidth = doc.page.width - 130;

    // Form fields with boxes
    y = drawFormField(doc, 1, 'Nombre',
        formData.nombre || formData.nombreCompleto || formData.nombreSolicitante || data.nombre_cliente || '',
        y, fieldWidth);

    y = drawFormField(doc, 2, 'Dirección',
        formData.direccion || formData.direccionAdmin || '',
        y, fieldWidth);

    y = drawFormField(doc, 3, 'Ciudad',
        formData.ciudad || formData.municipio || '',
        y, fieldWidth);

    // Calculate expiration date (1 year from now)
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    const formattedExpDate = expirationDate.toLocaleDateString('es-DO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    y = drawFormField(doc, 4, 'Fecha de expiración', formattedExpDate, y, fieldWidth);

    y = drawFormField(doc, 5, 'Actividad',
        formData.actividad || formData.tipoActividad || formData.profesion || '',
        y, fieldWidth);

    // Category and Number fields (side by side)
    const halfFieldWidth = (fieldWidth - 20) / 2;
    const halfFieldY = y;

    // Category field
    doc.font(CONFIG.fonts.regular)
        .fontSize(11)
        .fillColor(CONFIG.colors.bodyText)
        .text('6) Categoría:', 60, halfFieldY);

    doc.rect(60, halfFieldY + 15, halfFieldWidth, 35)
        .lineWidth(1)
        .strokeColor(CONFIG.colors.fieldBorder)
        .stroke();

    doc.font(CONFIG.fonts.italic)
        .text(formData.categoria || certificateClass, 68, halfFieldY + 25);

    // Number field
    const numberFieldX = 60 + halfFieldWidth + 20;
    doc.font(CONFIG.fonts.regular)
        .text('7) Número de Lista:', numberFieldX, halfFieldY);

    doc.rect(numberFieldX, halfFieldY + 15, halfFieldWidth, 35)
        .lineWidth(1)
        .strokeColor(CONFIG.colors.fieldBorder)
        .stroke();

    doc.font(CONFIG.fonts.italic)
        .text(String(data.id || ''), numberFieldX + 8, halfFieldY + 25);

    // Footer with seal and signatures
    const footerY = 600;

    // Central seal - DNCD logo smaller
    const sealX = doc.page.width / 2 - 30;
    try {
        if (fs.existsSync(ASSETS.logoDNCD)) {
            doc.image(ASSETS.logoDNCD, sealX, footerY, {
                width: 60
            });
        }
    } catch (e) {
        // Fallback circle
        doc.circle(sealX + 30, footerY + 30, 30)
            .lineWidth(2)
            .strokeColor(CONFIG.colors.borderDark)
            .stroke();
    }

    // Signature lines
    const signatureY = footerY + 75;

    // Left signature - MISPAS
    doc.font(CONFIG.fonts.regular)
        .fontSize(10)
        .fillColor(CONFIG.colors.bodyText)
        .text('8)', 80, signatureY);

    doc.moveTo(100, signatureY + 12)
        .lineTo(230, signatureY + 12)
        .lineWidth(1)
        .strokeColor(CONFIG.colors.fieldBorder)
        .stroke();

    doc.font(CONFIG.fonts.bold)
        .fontSize(10)
        .text('Por MISPAS', 130, signatureY + 18);

    // Right signature - DNCD
    doc.font(CONFIG.fonts.regular)
        .text('9)', 360, signatureY);

    doc.moveTo(380, signatureY + 12)
        .lineTo(510, signatureY + 12)
        .stroke();

    doc.font(CONFIG.fonts.bold)
        .text('Por DNCD', 420, signatureY + 18);

    // "Ver al dorso" text
    doc.font(CONFIG.fonts.italic)
        .fontSize(9)
        .fillColor(CONFIG.colors.labelText)
        .text('Ver al dorso', doc.page.width - 110, signatureY + 18);

    // Draw watermarks if status is defined
    if (isApproved !== null) {
        drawWatermarks(doc, isApproved);
    }
}

/**
 * Draw page 2 - Legal text and conditions
 * @param {PDFDocument} doc - PDFKit document
 * @param {string} certificateClass - 'A' or 'B'
 * @param {boolean|null} isApproved - True if approved, false if rejected, null for no watermark
 */
function drawPage2(doc, certificateClass, isApproved = null) {
    // Background and border
    drawBackgroundTexture(doc);
    drawDecorativeBorder(doc);

    const marginLeft = 70;
    const marginRight = 70;
    const textWidth = doc.page.width - marginLeft - marginRight;
    let y = 100;

    // Main legal text - Times-Italic with proper justification
    const mainParagraph = `En virtud de las atribuciones que nos confiere la Ley 50-88, sobre Drogas y Sustancias Controladas; damos fé que el titular de este Certificado de Inscripción de Drogas Controladas - CLASE "${certificateClass}" ha cumplido con todas las disposiciones legales establecidas por lo cual se le autoriza a prescribir sustancias controladas según la actividad indicada en el renglón No. 5 de este formulario.`;

    doc.font(CONFIG.fonts.italic)
        .fontSize(12)
        .fillColor(CONFIG.colors.bodyText)
        .text(mainParagraph, marginLeft, y, {
            width: textWidth,
            align: 'justify',
            lineGap: 6
        });

    // Note section
    y = 280;
    doc.font(CONFIG.fonts.regular)
        .fontSize(12)
        .fillColor(CONFIG.colors.bodyText)
        .text('Nota: Este Certificado no. es válido si:', marginLeft, y);

    y += 45;
    const conditions = [
        'No esta debidamente firmado y sellado por los funcionarios autorizados por MISPAS y DNCD.',
        'Los renglones que lo conforman no están completos.',
        'Se determina que los datos suministrados para su autorización no corresponden con la verdad.',
        'Tiene tachaduras o borraduras en su contenido.'
    ];

    conditions.forEach((condition, index) => {
        const letter = String.fromCharCode(97 + index); // a, b, c, d

        doc.font(CONFIG.fonts.regular)
            .fontSize(11)
            .fillColor(CONFIG.colors.bodyText)
            .text(`${letter})`, marginLeft, y);

        doc.font(CONFIG.fonts.italic)
            .fontSize(11)
            .text(condition, marginLeft + 25, y, {
                width: textWidth - 25,
                lineGap: 4
            });

        y += 50;
    });

    // Warning section
    y = 560;
    doc.font(CONFIG.fonts.bold)
        .fontSize(12)
        .fillColor(CONFIG.colors.bodyText)
        .text('Advertencia:', marginLeft, y);

    doc.font(CONFIG.fonts.regular)
        .fontSize(11)
        .text('El Código Penal de la Rep. Dom. sanciona la falsificación, alteración o falsedad de escritura técnica o pública.',
            marginLeft, y + 20, {
            width: textWidth,
            lineGap: 4
        });

    // Draw watermarks if status is defined
    if (isApproved !== null) {
        drawWatermarks(doc, isApproved);
    }
}

/**
 * Generate a certificate PDF
 * @param {Object} requestData - Request data including form_data, id, user info, estado_id
 * @param {string} formCode - 'FORM_CLASE_A' or 'FORM_CLASE_B'
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function generateCertificatePDF(requestData, formCode) {
    return new Promise((resolve, reject) => {
        try {
            const certificateClass = formCode === 'FORM_CLASE_A' ? 'A' : 'B';

            // Determine approval status for watermarks
            // estado_id 8 = approved (aprobada_direccion)
            // estado_id 18 = rejected (rechazada_direccion)
            let isApproved = null;
            if (requestData.estado_id === 8) {
                isApproved = true;
            } else if (requestData.estado_id === 18) {
                isApproved = false;
            }

            const doc = new PDFDocument({
                size: CONFIG.pageSize,
                margins: CONFIG.margins,
                bufferPages: true,
                info: {
                    Title: `Certificado de Inscripción de Drogas Controladas - Clase ${certificateClass}`,
                    Author: 'Dirección Nacional de Control de Drogas',
                    Subject: `Certificado Oficial - Solicitud #${requestData.id}`,
                    Creator: 'SGC Productos Controlados',
                    Producer: 'PDFKit',
                    Keywords: 'certificado, drogas controladas, DNCD, MISPAS'
                }
            });

            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Page 1 - Certificate front
            drawPage1(doc, requestData, certificateClass, isApproved);

            // Page 2 - Legal text
            doc.addPage();
            drawPage2(doc, certificateClass, isApproved);

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Get filename for certificate
 * @param {number} requestId 
 * @param {string} formCode 
 * @returns {string}
 */
export function getCertificateFilename(requestId, formCode) {
    const clase = formCode === 'FORM_CLASE_A' ? 'A' : 'B';
    const timestamp = new Date().toISOString().split('T')[0];
    return `Certificado_Clase${clase}_Solicitud${requestId}_${timestamp}.pdf`;
}

export default {
    generateCertificatePDF,
    getCertificateFilename
};
