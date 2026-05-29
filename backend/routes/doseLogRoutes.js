const express = require('express');
const {
    getDoseLogs,
    createDoseLog,
    updateDoseLog,
    deleteDoseLog,
    getAdherence,
} = require('../controllers/doseLogController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Static route declared before '/:id' so "adherence" is not treated as an id.
router.get('/adherence', protect, getAdherence);
router.route('/').get(protect, getDoseLogs).post(protect, createDoseLog);
router.route('/:id').put(protect, updateDoseLog).delete(protect, deleteDoseLog);

module.exports = router;
