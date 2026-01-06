const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    registrationDeadline: { type: Date, required: true },
    pptDeadline: { type: Date, required: true },
    registrationReminderSent_3days: { type: Boolean, default: false },
    registrationReminderSent_1day: { type: Boolean, default: false },
    pptReminderSent_3days: { type: Boolean, default: false },
    pptReminderSent_1day: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

// Compound index for efficiency if needed in future
// hackathonSchema.index({ userId: 1 });

module.exports = mongoose.model('Hackathon', hackathonSchema);
