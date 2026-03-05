const nodemailer = require('nodemailer');

/**
 * Sends an email using Gmail SMTP (Port 587 / STARTTLS).
 * This is the alternative to Port 465 and often works better on Render.
 */
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('❌ Gmail credentials missing');
            return { success: false, error: 'Credentials missing' };
        }

        // Create transporter using Port 587 (STARTTLS)
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // Use STARTTLS instead of direct SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS.replace(/\s+/g, ''),
            },
            tls: {
                // This is crucial for cloud servers to avoid certificate handshake errors
                rejectUnauthorized: false
            },
            connectionTimeout: 30000,
            socketTimeout: 30000,
        });

        const mailOptions = {
            from: `"Hackathon Reminder" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html: html || text
        };

        console.log(`📡 Attempting Gmail delivery via Port 587 to ${to}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Gmail sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`❌ Gmail Port 587 failed:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };
