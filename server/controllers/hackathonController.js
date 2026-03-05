const Hackathon = require('../models/Hackathon');
const { sendEmail } = require('../utils/email');

// Test email function using centralized utility
const sendTestEmail = async (to, hackathonName) => {
    console.log('🧪 Starting test email for:', hackathonName);

    const htmlContent = `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h1 style="margin: 0;">🧪 TEST SUCCESS!</h1>
                    </div>
                    <div style="border: 1px solid #e0e0e0; padding: 20px; border-radius: 0 0 8px 8px;">
                        <p style="font-size: 16px;">This confirms your email system is <strong>working perfectly</strong> on Render! ✅</p>
                        <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0;">Hackathon: <strong>${hackathonName}</strong></p>
                            <p style="margin: 5px 0;">Time: ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `;

    return await sendEmail({
        to,
        subject: `🧪 TEST: ${hackathonName} Email Check`,
        text: `This is a test email for hackathon: ${hackathonName}`,
        html: htmlContent,
    });
};

// Get all hackathons for logged in user
exports.getHackathons = async (req, res) => {
    try {
        const hackathons = await Hackathon.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(hackathons);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create new hackathon
exports.createHackathon = async (req, res) => {
    try {
        const { name, registrationDeadline, pptDeadline } = req.body;

        if (!name || !registrationDeadline || !pptDeadline) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const hackathon = await Hackathon.create({
            userId: req.user.id,
            name,
            registrationDeadline,
            pptDeadline,
        });

        // 📅 Sync to Google Calendar automatically
        const User = require('../models/User');
        const user = await User.findById(req.user.id);
        if (user && user.accessToken) {
            const { addEventToGoogleCalendar } = require('../utils/googleCalendar');
            await addEventToGoogleCalendar(user, hackathon);
        }

        res.status(201).json(hackathon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update hackathon
exports.updateHackathon = async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);

        if (!hackathon) {
            return res.status(404).json({ message: 'Hackathon not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the hackathon user
        if (hackathon.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedHackathon = await Hackathon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedHackathon);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete hackathon
exports.deleteHackathon = async (req, res) => {
    try {
        const hackathon = await Hackathon.findById(req.params.id);

        if (!hackathon) {
            return res.status(404).json({ message: 'Hackathon not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the hackathon user
        if (hackathon.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await hackathon.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Send test email
exports.sendTestEmail = async (req, res) => {
    try {
        const { hackathonId } = req.params;

        const hackathon = await Hackathon.findById(hackathonId).populate('userId');

        if (!hackathon) {
            return res.status(404).json({ message: 'Hackathon not found' });
        }

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (hackathon.userId._id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const result = await sendTestEmail(hackathon.userId.email, hackathon.name);

        if (result.success) {
            res.status(200).json({
                message: 'Test email sent successfully!',
                hackathonName: hackathon.name,
                email: hackathon.userId.email
            });
        } else {
            res.status(500).json({
                message: 'Failed to send test email',
                error: result.error
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
