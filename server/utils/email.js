const nodemailer = require('nodemailer');

// Create a persistent transporter for Brevo/SMTP Relay
let transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // TLS on port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '',
    },
    // Production stability settings
    connectionTimeout: 10000,
    socketTimeout: 10000,
    requireTLS: true
});

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('❌ Email credentials missing');
            return { success: false, error: 'Credentials missing' };
        }

        const mailOptions = {
            from: `"Hackathon Reminder" <notificationguys@gmail.com>`,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent via Brevo to ${to}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`❌ Brevo email failed to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };
