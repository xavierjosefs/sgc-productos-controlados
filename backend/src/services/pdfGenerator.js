/**
 * PDF Certificate Generator Service - Enhanced Version
 * Generates official certificates for approved/rejected requests
 * Supports Clase A and Clase B certificate types
 * 
 * Design features:
 * - Decorative green guilloche border pattern
 * - Light green textured background
 * - Professional typography
 * - Official government certificate layout
 */

import PDFDocument from 'pdfkit';

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
        fieldLine: '#2d8a4a',
        backgroundTint: '#f0f7f2',
        patternLine: '#c8e6d0'
    }
};

/**
 * Draw the decorative guilloche-style border pattern
 * Creates the characteristic security pattern seen on official certificates
 */
function drawDecorativeBorder(doc) {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = 25;
    const borderWidth = 35;

    doc.save();

    // Outer dark green border
    doc.lineWidth(3);
    doc.strokeColor(CONFIG.colors.borderDark);
    doc.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2)).stroke();

    // Inner lighter border
    doc.lineWidth(1);
    doc.strokeColor(CONFIG.colors.borderMedium);
    doc.rect(margin + 8, margin + 8, pageWidth - (margin * 2) - 16, pageHeight - (margin * 2) - 16).stroke();

    // Draw diagonal guilloche pattern in border area
    const patternSpacing = 6;
    doc.lineWidth(0.5);
    doc.strokeColor(CONFIG.colors.borderLight);
    doc.opacity(0.6);

    // Top border pattern
    for (let x = margin; x < pageWidth - margin; x += patternSpacing) {
        doc.moveTo(x, margin + 2)
            .lineTo(x + patternSpacing / 2, margin + borderWidth - 10)
            .stroke();
        doc.moveTo(x + patternSpacing / 2, margin + 2)
            .lineTo(x, margin + borderWidth - 10)
            .stroke();
    }

    // Bottom border pattern
    for (let x = margin; x < pageWidth - margin; x += patternSpacing) {
        doc.moveTo(x, pageHeight - margin - 2)
            .lineTo(x + patternSpacing / 2, pageHeight - margin - borderWidth + 10)
            .stroke();
        doc.moveTo(x + patternSpacing / 2, pageHeight - margin - 2)
            .lineTo(x, pageHeight - margin - borderWidth + 10)
            .stroke();
    }

    // Left border pattern
    for (let y = margin + borderWidth; y < pageHeight - margin - borderWidth; y += patternSpacing) {
        doc.moveTo(margin + 2, y)
            .lineTo(margin + borderWidth - 10, y + patternSpacing / 2)
            .stroke();
        doc.moveTo(margin + 2, y + patternSpacing / 2)
            .lineTo(margin + borderWidth - 10, y)
            .stroke();
    }

    // Right border pattern
    for (let y = margin + borderWidth; y < pageHeight - margin - borderWidth; y += patternSpacing) {
        doc.moveTo(pageWidth - margin - 2, y)
            .lineTo(pageWidth - margin - borderWidth + 10, y + patternSpacing / 2)
            .stroke();
        doc.moveTo(pageWidth - margin - 2, y + patternSpacing / 2)
            .lineTo(pageWidth - margin - borderWidth + 10, y)
            .stroke();
    }

    // Corner decorations
    const corners = [
        { x: margin + 5, y: margin + 5 },
        { x: pageWidth - margin - 5, y: margin + 5 },
        { x: margin + 5, y: pageHeight - margin - 5 },
        { x: pageWidth - margin - 5, y: pageHeight - margin - 5 }
    ];

    doc.opacity(1);
    doc.lineWidth(2);
    doc.strokeColor(CONFIG.colors.borderDark);
    corners.forEach(corner => {
        doc.circle(corner.x, corner.y, 4).stroke();
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
    doc.lineWidth(0.3);
    doc.opacity(0.3);

    const spacing = 20;
    for (let i = -pageHeight; i < pageWidth + pageHeight; i += spacing) {
        doc.moveTo(i, 0)
            .lineTo(i + pageHeight, pageHeight)
            .stroke();
    }

    doc.restore();
}

/**
 * Draw official header with government titles
 */
function drawHeader(doc, certificateClass) {
    const centerX = doc.page.width / 2;
    const contentStartY = 70;

    // Main titles
    doc.font('Helvetica-Bold')
        .fontSize(20)
        .fillColor(CONFIG.colors.headerText)
        .text('República Dominicana', 0, contentStartY, { align: 'center' });

    doc.font('Helvetica-Bold')
        .fontSize(17)
        .text('Presidencia de la República', { align: 'center' });

    // Logos section
    const logoY = contentStartY + 55;

    // Left logo - DNCD (placeholder circle with text)
    const leftLogoX = 100;
    doc.save();
    doc.circle(leftLogoX, logoY + 30, 35)
        .lineWidth(2)
        .strokeColor(CONFIG.colors.borderDark)
        .stroke();

    // Inner circle
    doc.circle(leftLogoX, logoY + 30, 28)
        .lineWidth(1)
        .stroke();

    doc.font('Helvetica-Bold')
        .fontSize(6)
        .fillColor(CONFIG.colors.headerText)
        .text('DIRECCIÓN', leftLogoX - 22, logoY + 20, { width: 44, align: 'center' })
        .text('NACIONAL', leftLogoX - 22, logoY + 28, { width: 44, align: 'center' })
        .text('DE CONTROL', leftLogoX - 22, logoY + 36, { width: 44, align: 'center' })
        .text('DE DROGAS', leftLogoX - 22, logoY + 44, { width: 44, align: 'center' });
    doc.restore();

    // Separator text
    doc.font('Helvetica')
        .fontSize(8)
        .fillColor(CONFIG.colors.labelText)
        .text('Dirección Nacional', leftLogoX - 40, logoY + 75, { width: 80, align: 'center' })
        .text('de Control de Drogas', leftLogoX - 40, logoY + 85, { width: 80, align: 'center' });

    // Right side - Government text
    const rightTextX = doc.page.width - 210;

    doc.font('Helvetica')
        .fontSize(10)
        .fillColor(CONFIG.colors.labelText)
        .text('GOBIERNO DE LA', rightTextX, logoY + 5, { width: 150 });

    doc.font('Helvetica-Bold')
        .fontSize(14)
        .fillColor(CONFIG.colors.headerText)
        .text('REPÚBLICA DOMINICANA', rightTextX, logoY + 20, { width: 170 });

    // Decorative line
    doc.moveTo(rightTextX, logoY + 40)
        .lineTo(rightTextX + 160, logoY + 40)
        .lineWidth(2)
        .strokeColor(CONFIG.colors.borderMedium)
        .stroke();

    doc.font('Helvetica-Bold')
        .fontSize(16)
        .fillColor(CONFIG.colors.borderMedium)
        .text('SALUD PÚBLICA', rightTextX, logoY + 48, { width: 160 });

    // Certificate title
    const titleY = logoY + 110;

    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(CONFIG.colors.headerText)
        .text('CERTIFICADO DE INSCRIPCIÓN DE DROGAS CONTROLADAS', 0, titleY, { align: 'center' });

    doc.font('Helvetica-Bold')
        .fontSize(18)
        .fillColor(CONFIG.colors.borderDark)
        .text(`- CLASE ${certificateClass} -`, 0, titleY + 20, { align: 'center' });

    return titleY + 55;
}

/**
 * Draw a form field with label and underlined value area
 */
function drawFormField(doc, number, label, value, y, valueWidth = 350) {
    const labelX = 75;
    const valueX = 170;

    // Field label
    doc.font('Helvetica')
        .fontSize(11)
        .fillColor(CONFIG.colors.bodyText)
        .text(`${number}) ${label}:`, labelX, y);

    // Value area with underline
    const valueText = value || '';

    // Draw underline
    doc.moveTo(valueX, y + 15)
        .lineTo(valueX + valueWidth, y + 15)
        .lineWidth(1)
        .strokeColor(CONFIG.colors.fieldLine)
        .stroke();

    // Value text
    doc.font('Helvetica')
        .fontSize(11)
        .fillColor(CONFIG.colors.bodyText)
        .text(valueText, valueX + 5, y, { width: valueWidth - 10 });
}

/**
 * Draw page 1 - Certificate front page with form data
 */
function drawPage1(doc, data, certificateClass) {
    // Background and border
    drawBackgroundTexture(doc);
    drawDecorativeBorder(doc);

    // Header section
    const startY = drawHeader(doc, certificateClass);

    const formData = data.form_data || {};
    let y = startY;
    const fieldSpacing = 45;

    // Form fields
    drawFormField(doc, 1, 'Nombre',
        formData.nombre || formData.nombreCompleto || formData.nombreSolicitante || data.nombre_cliente || '',
        y);
    y += fieldSpacing;

    drawFormField(doc, 2, 'Dirección',
        formData.direccion || formData.direccionAdmin || '',
        y);
    y += fieldSpacing;

    drawFormField(doc, 3, 'Ciudad',
        formData.ciudad || formData.municipio || '',
        y);
    y += fieldSpacing;

    // Calculate expiration date (1 year from now)
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    const formattedExpDate = expirationDate.toLocaleDateString('es-DO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    drawFormField(doc, 4, 'Fecha de expiración', formattedExpDate, y);
    y += fieldSpacing;

    drawFormField(doc, 5, 'Actividad',
        formData.actividad || formData.tipoActividad || formData.profesion || '',
        y);
    y += fieldSpacing;

    // Category and Number fields (side by side)
    const halfFieldY = y;

    doc.font('Helvetica')
        .fontSize(11)
        .fillColor(CONFIG.colors.bodyText)
        .text('6) Categoría:', 75, halfFieldY);

    // Category underline and value
    doc.moveTo(160, halfFieldY + 15)
        .lineTo(280, halfFieldY + 15)
        .lineWidth(1)
        .strokeColor(CONFIG.colors.fieldLine)
        .stroke();

    doc.text(formData.categoria || certificateClass, 165, halfFieldY);

    // Number field
    doc.text('7) Número de Lista:', 320, halfFieldY);

    doc.moveTo(430, halfFieldY + 15)
        .lineTo(530, halfFieldY + 15)
        .stroke();

    doc.text(String(data.id || ''), 435, halfFieldY);

    // Footer with seal and signatures
    y = 580;

    // Central seal placeholder
    const sealX = doc.page.width / 2;
    doc.save();
    doc.circle(sealX, y + 35, 40)
        .lineWidth(2)
        .strokeColor(CONFIG.colors.borderDark)
        .stroke();

    doc.circle(sealX, y + 35, 33)
        .lineWidth(1)
        .stroke();

    doc.circle(sealX, y + 35, 25)
        .lineWidth(0.5)
        .stroke();

    doc.font('Helvetica-Bold')
        .fontSize(6)
        .fillColor(CONFIG.colors.headerText)
        .text('REPÚBLICA', sealX - 20, y + 25, { width: 40, align: 'center' })
        .text('DOMINICANA', sealX - 20, y + 33, { width: 40, align: 'center' })
        .text('SELLO', sealX - 20, y + 43, { width: 40, align: 'center' });
    doc.restore();

    // Signature labels
    const signatureY = y + 95;

    doc.font('Helvetica')
        .fontSize(10)
        .fillColor(CONFIG.colors.bodyText);

    doc.text('8)', 90, signatureY);
    doc.moveTo(110, signatureY + 12)
        .lineTo(220, signatureY + 12)
        .lineWidth(1)
        .strokeColor(CONFIG.colors.fieldLine)
        .stroke();
    doc.text('Por MISPAS', 130, signatureY + 18);

    doc.text('9)', 370, signatureY);
    doc.moveTo(390, signatureY + 12)
        .lineTo(500, signatureY + 12)
        .stroke();
    doc.text('Por DNCD', 420, signatureY + 18);

    // "Ver al dorso" text
    doc.font('Helvetica-Oblique')
        .fontSize(9)
        .fillColor(CONFIG.colors.labelText)
        .text('Ver al dorso', doc.page.width - 120, signatureY + 18);
}

/**
 * Draw page 2 - Legal text and conditions
 */
function drawPage2(doc, certificateClass) {
    // Background and border
    drawBackgroundTexture(doc);
    drawDecorativeBorder(doc);

    const marginLeft = 80;
    const marginRight = 80;
    const textWidth = doc.page.width - marginLeft - marginRight;
    let y = 100;

    // Main legal text with proper paragraph styling
    const mainParagraph = `En virtud de las atribuciones que nos confiere la Ley 50-88, sobre Drogas y Sustancias Controladas; damos fé que el titular de este Certificado de Inscripción de Drogas Controladas - CLASE "${certificateClass}" ha cumplido con todas las disposiciones legales establecidas por lo cual se le autoriza a prescribir sustancias controladas según la actividad indicada en el renglón No. 5 de este formulario.`;

    doc.font('Helvetica-Oblique')
        .fontSize(12)
        .fillColor(CONFIG.colors.bodyText)
        .text(mainParagraph, marginLeft, y, {
            width: textWidth,
            align: 'justify',
            lineGap: 6
        });

    // Note section
    y = 300;
    doc.font('Helvetica')
        .fontSize(12)
        .fillColor(CONFIG.colors.bodyText)
        .text('Nota: Este Certificado no. es válido si:', marginLeft, y);

    y += 50;
    const conditions = [
        'No esta debidamente firmado y sellado por los funcionarios autorizados por MISPAS y DNCD.',
        'Los renglones que lo conforman no están completos.',
        'Se determina que los datos suministrados para su autorización no corresponden con la verdad.',
        'Tiene tachaduras o borraduras en su contenido.'
    ];

    conditions.forEach((condition, index) => {
        const letter = String.fromCharCode(97 + index); // a, b, c, d

        doc.font('Helvetica')
            .fontSize(11)
            .fillColor(CONFIG.colors.bodyText)
            .text(`${letter})`, marginLeft, y);

        doc.font('Helvetica-Oblique')
            .fontSize(11)
            .text(condition, marginLeft + 25, y, {
                width: textWidth - 25,
                lineGap: 4
            });

        y += 55;
    });

    // Warning section
    y = 580;
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .fillColor(CONFIG.colors.bodyText)
        .text('Advertencia:', marginLeft, y);

    doc.font('Helvetica')
        .fontSize(11)
        .text('El Código Penal de la Rep. Dom. sanciona la falsificación, alteración o falsedad de escritura técnica o pública.',
            marginLeft, y + 20, {
            width: textWidth,
            lineGap: 4
        });
}

/**
 * Generate a certificate PDF
 * @param {Object} requestData - Request data including form_data, id, user info
 * @param {string} formCode - 'FORM_CLASE_A' or 'FORM_CLASE_B'
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function generateCertificatePDF(requestData, formCode) {
    return new Promise((resolve, reject) => {
        try {
            const certificateClass = formCode === 'FORM_CLASE_A' ? 'A' : 'B';

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
            drawPage1(doc, requestData, certificateClass);

            // Page 2 - Legal text
            doc.addPage();
            drawPage2(doc, certificateClass);

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
