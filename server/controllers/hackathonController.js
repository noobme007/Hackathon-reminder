const Hackathon = require('../models/Hackathon');

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

        const userId = req.user.id || req.user._id;

        const hackathon = await Hackathon.create({
            userId,
            name,
            registrationDeadline,
            pptDeadline,
        });

        // 📅 Sync to Google Calendar automatically
        const User = require('../models/User');
        const user = await User.findById(userId);
        console.log(`📅 Attempting Sync for: ${user?.email}. Has Token: ${!!user?.accessToken}`);

        if (user && user.accessToken) {
            const { addEventToGoogleCalendar } = require('../utils/googleCalendar');
            const googleLink = await addEventToGoogleCalendar(user, hackathon);
            if (googleLink) {
                hackathon.googleEventLink = googleLink;
                await hackathon.save();
            }
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
