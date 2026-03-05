const axios = require('axios');

/**
 * Sends an email using Brevo's REST API.
 * This bypasses SMTP port blocks on hosts like Render.
 */
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const apiKey = process.env.EMAIL_PASS; // We store the API Key in EMAIL_PASS

        if (!apiKey) {
            console.error('❌ Brevo API Key missing (EMAIL_PASS environment variable)');
            return { success: false, error: 'API Key missing' };
        }

        console.log(`📡 Sending API request to Brevo for: ${to}`);

        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: {
                name: "Hackathon Reminder",
                email: "notificationguys@gmail.com"
            },
            to: [{ email: to }],
            subject: subject,
            textContent: text,
            htmlContent: html || text
        }, {
            headers: {
                'api-key': apiKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log(`✅ Email sent via Brevo API: ${response.data.messageId}`);
        return { success: true, messageId: response.data.messageId };
    } catch (error) {
        const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error(`❌ Brevo API failed:`, errorMsg);
        return { success: false, error: errorMsg };
    }
};

module.exports = { sendEmail };
