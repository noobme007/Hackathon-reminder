const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Hackathon = require('../models/Hackathon');

const { sendEmail } = require('../utils/email');

const sendReminderEmail = async (to, subject, text) => {
    // Create HTML version of email
    const htmlContent = `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h1 style="margin: 0;">🎯 Hackathon Reminder</h1>
                    </div>
                    <div style="border: 1px solid #e0e0e0; padding: 20px; border-radius: 0 0 8px 8px;">
                        <p>${text.replace(/\n/g, '</p><p>')}</p>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                        <p style="color: #666; font-size: 12px;">
                            This is an automated reminder from the Hackathon Reminder App.
                        </p>
                    </div>
                </div>
            </body>
        </html>
    `;

    const result = await sendEmail({ to, subject, text, html: htmlContent });
    return result.success;
};

const checkReminders = async () => {
    console.log('--- CRON JOB STARTED: Checking Deadlines ---');
    const now = new Date();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    const oneDayInMs = 1 * 24 * 60 * 60 * 1000;

    try {
        // Fetch all hackathons that might need reminders
        const relevantHackathons = await Hackathon.find({
            $or: [
                { registrationDeadline: { $gt: now } }, // Only future deadlines
                { pptDeadline: { $gt: now } }
            ]
        }).populate('userId');

        console.log(`Found ${relevantHackathons.length} hackathons with upcoming deadlines`);

        let emailsSent = 0;

        for (const hackathon of relevantHackathons) {
            if (!hackathon.userId) {
                console.warn(`⚠️ Hackathon "${hackathon.name}" has no associated user`);
                continue;
            }
            const userEmail = hackathon.userId.email;

            // --- Registration Reminders ---
            const regTimeDiff = new Date(hackathon.registrationDeadline) - now;

            // 3 Days Reminder (Between 1 and 3 days)
            if (regTimeDiff <= threeDaysInMs && regTimeDiff > oneDayInMs && !hackathon.registrationReminderSent_3days) {
                console.log(`📧 Sending 3-day registration reminder for "${hackathon.name}" to ${userEmail}`);
                const success = await sendReminderEmail(
                    userEmail,
                    `Reminder: 3 Days left to Register for ${hackathon.name}`,
                    `Hello ${hackathon.userId.name},\n\nThis is a gentle reminder that the registration deadline for "${hackathon.name}" is in 3 days on ${new Date(hackathon.registrationDeadline).toLocaleString()}.\n\nDon't miss out!\n\nBest,\nHackathon Reminder App`
                );
                if (success) {
                    hackathon.registrationReminderSent_3days = true;
                    await hackathon.save();
                    emailsSent++;
                }
            }

            // 1 Day Reminder (Less than 1 day)
            if (regTimeDiff <= oneDayInMs && regTimeDiff > 0 && !hackathon.registrationReminderSent_1day) {
                console.log(`📧 Sending 1-day registration reminder for "${hackathon.name}" to ${userEmail}`);
                const success = await sendReminderEmail(
                    userEmail,
                    `URGENT: 1 Day left to Register for ${hackathon.name}`,
                    `Hello ${hackathon.userId.name},\n\nURGENT REMINDER: The registration deadline for "${hackathon.name}" is tomorrow, ${new Date(hackathon.registrationDeadline).toLocaleString()}.\n\nRegister now!\n\nBest,\nHackathon Reminder App`
                );
                if (success) {
                    hackathon.registrationReminderSent_1day = true;
                    hackathon.registrationReminderSent_3days = true;
                    await hackathon.save();
                    emailsSent++;
                }
            }

            // --- PPT Submission Reminders ---
            const pptTimeDiff = new Date(hackathon.pptDeadline) - now;

            // 3 Days Reminder
            if (pptTimeDiff <= threeDaysInMs && pptTimeDiff > oneDayInMs && !hackathon.pptReminderSent_3days) {
                console.log(`📧 Sending 3-day PPT reminder for "${hackathon.name}" to ${userEmail}`);
                const success = await sendReminderEmail(
                    userEmail,
                    `Reminder: 3 Days left for PPT Submission - ${hackathon.name}`,
                    `Hello ${hackathon.userId.name},\n\nThis is a reminder that the PPT/Submission deadline for "${hackathon.name}" is in 3 days on ${new Date(hackathon.pptDeadline).toLocaleString()}.\n\nGood luck with your project!\n\nBest,\nHackathon Reminder App`
                );
                if (success) {
                    hackathon.pptReminderSent_3days = true;
                    await hackathon.save();
                    emailsSent++;
                }
            }

            // 1 Day Reminder
            if (pptTimeDiff <= oneDayInMs && pptTimeDiff > 0 && !hackathon.pptReminderSent_1day) {
                console.log(`📧 Sending 1-day PPT reminder for "${hackathon.name}" to ${userEmail}`);
                const success = await sendReminderEmail(
                    userEmail,
                    `URGENT: 1 Day left for PPT Submission - ${hackathon.name}`,
                    `Hello ${hackathon.userId.name},\n\nURGENT: The PPT/Submission deadline for "${hackathon.name}" is tomorrow, ${new Date(hackathon.pptDeadline).toLocaleString()}.\n\nSubmit your work soon!\n\nBest,\nHackathon Reminder App`
                );
                if (success) {
                    hackathon.pptReminderSent_1day = true;
                    hackathon.pptReminderSent_3days = true;
                    await hackathon.save();
                    emailsSent++;
                }
            }
        }
        console.log(`--- CRON JOB COMPLETED: ${emailsSent} email(s) sent ---`);
    } catch (error) {
        console.error('❌ Cron job error:', error);
    }
};

const startCron = () => {
    // Schedule to run every 30 minutes (more frequent than hourly for better testing)
    cron.schedule('*/30 * * * *', () => {
        console.log(`[${new Date().toISOString()}] Running reminder check...`);
        checkReminders().catch(err => console.error('Uncaught error in cron job:', err));
    });
    console.log('✅ Cron Job Initialized: Running every 30 minutes.');
};

module.exports = startCron;
