const axios = require('axios');
const { generateGoogleCalendarLink } = require('./calendar');

/**
 * Sends a notification via Discord Webhook with Google Calendar links.
 */
const sendEmail = async ({ to, subject, text }) => {
    try {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error('❌ Discord Webhook URL missing');
            return { success: false, error: 'Webhook missing' };
        }

        // We assume the text contains the deadline date string for this demo
        // In a real scenario, we'd pass the actual date object
        const calendarLink = `[Add to Google Calendar](${generateGoogleCalendarLink(subject, new Date())})`;

        const embed = {
            title: subject,
            description: `${text}\n\n📅 ${calendarLink}`,
            color: 5814783,
            timestamp: new Date().toISOString(),
        };

        await axios.post(webhookUrl, {
            content: `🔔 **Hackathon Update!**`,
            embeds: [embed]
        });

        console.log(`✅ Discord + Calendar link sent!`);
        return { success: true };
    } catch (error) {
        console.error(`❌ Notification failed:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };
