const nodemailer = require('nodemailer');

/**
 * Sends an email using Gmail SMTP.
 * Note: If Render blocks the port, this might time out. 
 */
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('❌ Gmail credentials missing in environment variables');
            return { success: false, error: 'Credentials missing' };
        }

        // Create transporter using explicit Gmail SMTP settings
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS.replace(/\s+/g, ''), // Clean any spaces
            },
            connectionTimeout: 20000, // 20 seconds
            socketTimeout: 20000,
        });

        const mailOptions = {
            from: `"Hackathon Reminder" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html: html || text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Gmail sent to ${to}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`❌ Gmail failed to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };
