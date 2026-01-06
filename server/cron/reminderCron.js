const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Hackathon = require('../models/Hackathon');

// Configure Email Transporter
// NOTE: For Production, use environment variables for secure credentials
// Configure Email Transporter
let transporter;

(async () => {
    try {
        if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS.length < 10) {
            console.log('⚠️ No valid email credentials found. Generating Ethereal Test Account...');
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for others
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            console.log('✅ Ethereal Email Ready. Preview URL will be logged for every email.');
        } else {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
        }
    } catch (err) {
        console.error("Failed to Setup Mailer", err);
    }
})();

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        if (transporter) {
            const info = await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${to}`);
            const previewUrl = nodemailer.getTestMessageUrl(info);
            if (previewUrl) {
                console.log('🔎 PREVIEW EMAIL HERE: ' + previewUrl);
            }
        } else {
            console.warn('Transporter not ready, skipping email.');
        }
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw error; // Re-throw to handle in caller
    }
};

const checkReminders = async () => {
    console.log('--- CRON JOB STARTED: Checking Deadlines ---');
    const now = new Date();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    const oneDayInMs = 1 * 24 * 60 * 60 * 1000;

    try {
        // Find all hackathons where deadlines are in the future (or recently passed within check window)
        // We iterate through all to be safe and checking flags
        // Optimisation: Filter by deadlines that are close

        // Fetch all hackathons that might need reminders (deadlines within next 3.1 days)
        // For simplicity and to ensure we catch everything, we can query widely or iterate active ones.
        // Let's filter in JS for granular control or strict query.
        // Querying for efficiency: deadlines > now AND deadlines < now + 4 days

        const relevantHackathons = await Hackathon.find({
            $or: [
                { registrationDeadline: { $gt: now } }, // Only future deadlines
                { pptDeadline: { $gt: now } }
            ]
        }).populate('userId');

        for (const hackathon of relevantHackathons) {
            if (!hackathon.userId) continue;
            const userEmail = hackathon.userId.email;

            // --- Registration Reminders ---
            const regTimeDiff = new Date(hackathon.registrationDeadline) - now;

            // 3 Days Reminder (Between 1 and 3 days)
            if (regTimeDiff <= threeDaysInMs && regTimeDiff > oneDayInMs && !hackathon.registrationReminderSent_3days) {
                await sendEmail(
                    userEmail,
                    `Reminder: 3 Days left to Register for ${hackathon.name}`,
                    `Hello ${hackathon.userId.name},\n\nThis is a gentle reminder that the registration deadline for "${hackathon.name}" is in 3 days on ${new Date(hackathon.registrationDeadline).toLocaleString()}.\n\nDon't miss out!\n\nBest,\nHackathon Reminder App`
                );
                hackathon.registrationReminderSent_3days = true;
                await hackathon.save();
            }

            // 1 Day Reminder (Less than 1 day)
            if (regTimeDiff <= oneDayInMs && regTimeDiff > 0 && !hackathon.registrationReminderSent_1day) {
                await sendEmail(
                    userEmail,
                    `URGENT: 1 Day left to Register for ${hackathon.name}`,
                    `Hello ${hackathon.userId.name},\n\nURGENT REMINDER: The registration deadline for "${hackathon.name}" is tomorrow, ${new Date(hackathon.registrationDeadline).toLocaleString()}.\n\nRegister now!\n\nBest,\nHackathon Reminder App`
                );
                hackathon.registrationReminderSent_1day = true;
                // Optionally mark 3-day as sent to avoid weird overlap if cron missed
                hackathon.registrationReminderSent_3days = true;
                await hackathon.save();
            }

            // --- PPT Submission Reminders ---
            const pptTimeDiff = new Date(hackathon.pptDeadline) - now;

            // 3 Days Reminder
            if (pptTimeDiff <= threeDaysInMs && pptTimeDiff > oneDayInMs && !hackathon.pptReminderSent_3days) {
                await sendEmail(
                    userEmail,
                    `Reminder: 3 Days left for PPT Submission - ${hackathon.name}`,
                    `Hello ${hackathon.userId.name},\n\nThis is a reminder that the PPT/Submission deadline for "${hackathon.name}" is in 3 days on ${new Date(hackathon.pptDeadline).toLocaleString()}.\n\nGood luck with your project!\n\nBest,\nHackathon Reminder App`
                );
                hackathon.pptReminderSent_3days = true;
                await hackathon.save();
            }

            // 1 Day Reminder
            if (pptTimeDiff <= oneDayInMs && pptTimeDiff > 0 && !hackathon.pptReminderSent_1day) {
                await sendEmail(
                    userEmail,
                    `URGENT: 1 Day left for PPT Submission - ${hackathon.name}`,
                    `Hello ${hackathon.userId.name},\n\nURGENT: The PPT/Submission deadline for "${hackathon.name}" is tomorrow, ${new Date(hackathon.pptDeadline).toLocaleString()}.\n\nSubmit your work soon!\n\nBest,\nHackathon Reminder App`
                );
                hackathon.pptReminderSent_1day = true;
                hackathon.pptReminderSent_3days = true;
                await hackathon.save();
            }
        }
    } catch (error) {
        console.error('Cron job error:', error);
    }
};

const startCron = () => {
    // Schedule to run every hour
    cron.schedule('0 * * * *', checkReminders);
    console.log('Cron Job Initialized: Running every hour.');
};

module.exports = startCron;
