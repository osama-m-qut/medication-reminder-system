const mongoose = require('mongoose');

// A schedule that tells the patient when to take a given medication.
// One medication can have multiple reminders (e.g. morning and evening doses).
const reminderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
        // Times of day to take the dose, stored as "HH:mm" 24h strings, e.g. ["08:00", "20:00"].
        times: { type: [String], default: [] },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'as-needed'],
            default: 'daily',
        },
        // For weekly schedules: 0=Sunday .. 6=Saturday.
        daysOfWeek: { type: [Number], default: [] },
        startDate: { type: Date, required: true },
        endDate: { type: Date },                          // optional; open-ended if omitted
        notes: { type: String },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Reminder', reminderSchema);
