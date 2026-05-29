const express = require('express');
const {
    getMedications,
    getMedicationById,
    createMedication,
    updateMedication,
    deleteMedication,
} = require('../controllers/medicationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All medication routes require a logged-in user.
router.route('/').get(protect, getMedications).post(protect, createMedication);
router
    .route('/:id')
    .get(protect, getMedicationById)
    .put(protect, updateMedication)
    .delete(protect, deleteMedication);

module.exports = router;
