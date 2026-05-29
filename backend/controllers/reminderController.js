const Reminder = require('../models/Reminder');
const Medication = require('../models/Medication');

// Reminders are owner-scoped and always tied to one of the user's medications.

// GET /api/reminders — list reminders, with medication details populated
const getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({ user: req.user.id })
            .populate('medication', 'name dosage form')
            .sort({ createdAt: -1 });
        res.status(200).json(reminders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/reminders — create a reminder for one of the user's medications
const createReminder = async (req, res) => {
    const { medication, times, frequency, daysOfWeek, startDate, endDate, notes } = req.body;
    try {
        if (!medication || !startDate) {
            return res.status(400).json({ message: 'Medication and start date are required' });
        }
        // Verify the medication exists and belongs to this user before linking.
        const med = await Medication.findById(medication);
        if (!med || med.user.toString() !== req.user.id) {
            return res.status(400).json({ message: 'Invalid medication' });
        }
        const reminder = await Reminder.create({
            user: req.user.id,
            medication,
            times,
            frequency,
            daysOfWeek,
            startDate,
            endDate,
            notes,
        });
        res.status(201).json(reminder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/reminders/:id — update a reminder
const updateReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);
        if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
        if (reminder.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const fields = ['times', 'frequency', 'daysOfWeek', 'startDate', 'endDate', 'notes', 'active'];
        fields.forEach((f) => {
            if (req.body[f] !== undefined) reminder[f] = req.body[f];
        });
        const updated = await reminder.save();
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/reminders/:id — delete a reminder
const deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);
        if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
        if (reminder.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await reminder.deleteOne();
        res.status(200).json({ message: 'Reminder removed', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getReminders, createReminder, updateReminder, deleteReminder };
