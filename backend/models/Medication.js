const mongoose = require('mongoose');

// A medication belonging to a specific patient (user). This is the core entity
// of the Medication Reminder System; reminders and dose logs reference it.
const medicationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },          // e.g. "Metformin"
        dosage: { type: String, required: true },        // e.g. "500 mg"
        form: {                                           // physical form of the medication
            type: String,
            enum: ['tablet', 'capsule', 'liquid', 'injection', 'inhaler', 'other'],
            default: 'tablet',
        },
        instructions: { type: String },                  // e.g. "Take with food"
        prescriber: { type: String },                    // prescribing doctor
        quantity: { type: Number, default: 0 },          // units remaining on hand
        active: { type: Boolean, default: true },        // soft-disable without deleting history
    },
    { timestamps: true }
);

module.exports = mongoose.model('Medication', medicationSchema);
