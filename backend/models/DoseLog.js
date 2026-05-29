const mongoose = require('mongoose');

// A single dose event generated from a reminder. Tracking taken/skipped/missed
// doses is what gives the system its adherence reporting (used by the admin panel).
const doseLogSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        reminder: { type: mongoose.Schema.Types.ObjectId, ref: 'Reminder' },
        medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
        scheduledTime: { type: Date, required: true },   // when the dose was due
        status: {
            type: String,
            enum: ['scheduled', 'taken', 'skipped', 'missed'],
            default: 'scheduled',
        },
        takenAt: { type: Date },                          // set when the patient marks it taken
        notes: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('DoseLog', doseLogSchema);
