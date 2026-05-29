const User = require('../models/User');
const Medication = require('../models/Medication');
const Reminder = require('../models/Reminder');
const DoseLog = require('../models/DoseLog');

// These handlers are mounted behind `protect, admin`, so only admins reach them.

// GET /api/admin/users — list all users (passwords excluded)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/admin/users/:id — update a user's role (promote/demote)
const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (req.body.role && ['user', 'admin'].includes(req.body.role)) {
            user.role = req.body.role;
        }
        const updated = await user.save();
        res.status(200).json({ id: updated.id, name: updated.name, email: updated.email, role: updated.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/admin/users/:id — remove a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.id === req.user.id) {
            return res.status(400).json({ message: 'Admins cannot delete their own account' });
        }
        await user.deleteOne();
        res.status(200).json({ message: 'User removed', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/admin/stats — system-wide totals and overall adherence for the dashboard
const getSystemStats = async (req, res) => {
    try {
        const [userCount, medicationCount, reminderCount, statusCounts] = await Promise.all([
            User.countDocuments(),
            Medication.countDocuments(),
            Reminder.countDocuments(),
            DoseLog.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        ]);
        const summary = { taken: 0, skipped: 0, missed: 0, scheduled: 0 };
        statusCounts.forEach((c) => { summary[c._id] = c.count; });
        const accountable = summary.taken + summary.skipped + summary.missed;
        const adherence = accountable === 0 ? 0 : Math.round((summary.taken / accountable) * 100);
        res.status(200).json({ userCount, medicationCount, reminderCount, doses: summary, adherence });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, updateUserRole, deleteUser, getSystemStats };
