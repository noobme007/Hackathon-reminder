const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Hackathon = require('../models/Hackathon');

// Configure Email Transporter
let transporter = null;

const initializeTransporter = async () => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️ Email credentials not found. Email reminders will be disabled.');
            console.warn('EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Not set');
            console.warn('EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Set' : '✗ Not set');
            return false;
        }

        console.log('📧 Initializing email transporter with Google SMTP...');
        console.log('Using EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASS length:', process.env.EMAIL_PASS.length, 'chars');

        // Use Gmail SMTP
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            connectionTimeout: 15000,
            socketTimeout: 15000,
        });

        // Verify the connection with timeout
        console.log('🔍 Verifying transporter connection...');
        await Promise.race([
            transporter.verify(),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Verification timeout after 15 seconds')), 15000)
            )
        ]);
        
        console.log('✅ Email transporter initialized and verified successfully');
        return true;
    } catch (err) {
        console.error('❌ Failed to initialize email transporter:', err.message);
        console.error('Stack:', err.stack);
        return false;
    }
};

// Initialize on module load
initializeTransporter();

const sendEmail = async (to, subject, text) => {
    if (!transporter) {
        console.warn(`⚠️ Email transporter not ready. Skipping email to ${to}`);
        return false;
    }

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

    const mailOptions = {
        from: `"Hackathon Reminder" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${to} (Message ID: ${info.messageId})`);
        return true;
    } catch (error) {
        console.error(`❌ Error sending email to ${to}:`, error.message);
        return false;
    }
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
                const success = await sendEmail(
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
                const success = await sendEmail(
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
                const success = await sendEmail(
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
                const success = await sendEmail(
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
