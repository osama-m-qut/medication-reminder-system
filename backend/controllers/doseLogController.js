const DoseLog = require('../models/DoseLog');
const Medication = require('../models/Medication');

// GET /api/doselogs — list the user's dose history (most recent first)
const getDoseLogs = async (req, res) => {
    try {
        const logs = await DoseLog.find({ user: req.user.id })
            .populate('medication', 'name dosage')
            .sort({ scheduledTime: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/doselogs — record a dose event (e.g. mark a dose taken or skipped)
const createDoseLog = async (req, res) => {
    const { medication, reminder, scheduledTime, status, notes } = req.body;
    try {
        if (!medication || !scheduledTime) {
            return res.status(400).json({ message: 'Medication and scheduled time are required' });
        }
        const med = await Medication.findById(medication);
        if (!med || med.user.toString() !== req.user.id) {
            return res.status(400).json({ message: 'Invalid medication' });
        }
        const log = await DoseLog.create({
            user: req.user.id,
            medication,
            reminder,
            scheduledTime,
            status: status || 'taken',
            takenAt: status === 'taken' || !status ? new Date() : undefined,
            notes,
        });
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/doselogs/:id — update a dose status (scheduled -> taken/skipped/missed)
const updateDoseLog = async (req, res) => {
    try {
        const log = await DoseLog.findById(req.params.id);
        if (!log) return res.status(404).json({ message: 'Dose log not found' });
        if (log.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (req.body.status !== undefined) {
            log.status = req.body.status;
            log.takenAt = req.body.status === 'taken' ? new Date() : undefined;
        }
        if (req.body.notes !== undefined) log.notes = req.body.notes;
        const updated = await log.save();
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/doselogs/:id — remove a dose log entry
const deleteDoseLog = async (req, res) => {
    try {
        const log = await DoseLog.findById(req.params.id);
        if (!log) return res.status(404).json({ message: 'Dose log not found' });
        if (log.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await log.deleteOne();
        res.status(200).json({ message: 'Dose log removed', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/doselogs/adherence — adherence summary for the logged-in user.
// Adherence % = taken / (taken + skipped + missed). Computed from the dose events.
const getAdherence = async (req, res) => {
    try {
        const counts = await DoseLog.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);
        const summary = { taken: 0, skipped: 0, missed: 0, scheduled: 0 };
        counts.forEach((c) => { summary[c._id] = c.count; });
        const accountable = summary.taken + summary.skipped + summary.missed;
        const adherence = accountable === 0 ? 0 : Math.round((summary.taken / accountable) * 100);
        res.status(200).json({ ...summary, adherence });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDoseLogs, createDoseLog, updateDoseLog, deleteDoseLog, getAdherence };
