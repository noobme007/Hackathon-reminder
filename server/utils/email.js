const axios = require('axios');

/**
 * Sends a notification via Discord Webhook.
 * This ALWAYS works on Render because it uses standard HTTPS.
 */
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error('❌ Discord Webhook URL missing (DISCORD_WEBHOOK_URL environment variable)');
            return { success: false, error: 'Webhook missing' };
        }

        console.log(`📡 Sending Discord notification...`);

        // Format a beautiful Discord message
        const embed = {
            title: subject,
            description: text,
            color: 5814783, // Nice "Hackathon Blue"
            timestamp: new Date().toISOString(),
            footer: {
                text: `Reminder for ${to}`
            }
        };

        await axios.post(webhookUrl, {
            content: `🔔 **New Hackathon Reminder!**`,
            embeds: [embed]
        });

        console.log(`✅ Discord notification sent successfully!`);
        return { success: true };
    } catch (error) {
        console.error(`❌ Discord failed:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };
