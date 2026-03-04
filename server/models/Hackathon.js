const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    registrationDeadline: { type: Date, required: true },
    pptDeadline: { type: Date, required: true },
    
    // New fields for enhanced features
    location: { type: String, default: 'Online' },
    prize: { type: String, default: 'TBD' },
    teamSize: { type: String, default: 'Any' },
    description: { type: String, default: '' },
    category: { 
        type: String, 
        enum: ['Web Development', 'Mobile Development', 'Machine Learning', 'AI/LLM', 'DevOps', 'Blockchain', 'IoT', 'Other'],
        default: 'Web Development' 
    },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium' 
    },
    notificationsEnabled: { type: Boolean, default: true },
    
    // Reminder tracking flags
    registrationReminderSent_3days: { type: Boolean, default: false },
    registrationReminderSent_1day: { type: Boolean, default: false },
    pptReminderSent_3days: { type: Boolean, default: false },
    pptReminderSent_1day: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Hackathon', hackathonSchema);
