import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Send a simple text email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text content
 */
export async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw error;
    }
}

/**
 * Send an email with optional attachments
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} [options.html] - HTML content (optional)
 * @param {Array<Object>} [options.attachments] - Attachments array (optional)
 * @param {string} options.attachments[].filename - Attachment filename
 * @param {Buffer} options.attachments[].content - File content as Buffer
 * @param {string} [options.attachments[].contentType] - MIME type (e.g., 'application/pdf')
 */
export async function sendEmailWithAttachment(options) {
    const { to, subject, text, html, attachments } = options;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        ...(html && { html }),
        ...(attachments && { attachments }),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email enviado exitosamente a ${to}. MessageId: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`❌ Error enviando email a ${to}:`, error);
        throw error;
    }
}