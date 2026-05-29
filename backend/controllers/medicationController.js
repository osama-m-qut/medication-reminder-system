const Medication = require('../models/Medication');

// All handlers are owner-scoped: a patient can only see and change their own
// medications. req.user is populated by the `protect` middleware.

// GET /api/medications  — list the logged-in user's medications
const getMedications = async (req, res) => {
    try {
        const medications = await Medication.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(medications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/medications/:id — read a single medication
const getMedicationById = async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id);
        if (!medication) return res.status(404).json({ message: 'Medication not found' });
        if (medication.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.status(200).json(medication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/medications — create a medication
const createMedication = async (req, res) => {
    const { name, dosage, form, instructions, prescriber, quantity } = req.body;
    try {
        if (!name || !dosage) {
            return res.status(400).json({ message: 'Name and dosage are required' });
        }
        const medication = await Medication.create({
            user: req.user.id,
            name,
            dosage,
            form,
            instructions,
            prescriber,
            quantity,
        });
        res.status(201).json(medication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/medications/:id — update a medication
const updateMedication = async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id);
        if (!medication) return res.status(404).json({ message: 'Medication not found' });
        if (medication.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const fields = ['name', 'dosage', 'form', 'instructions', 'prescriber', 'quantity', 'active'];
        fields.forEach((f) => {
            if (req.body[f] !== undefined) medication[f] = req.body[f];
        });
        const updated = await medication.save();
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/medications/:id — delete a medication
const deleteMedication = async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id);
        if (!medication) return res.status(404).json({ message: 'Medication not found' });
        if (medication.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await medication.deleteOne();
        res.status(200).json({ message: 'Medication removed', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMedications,
    getMedicationById,
    createMedication,
    updateMedication,
    deleteMedication,
};
