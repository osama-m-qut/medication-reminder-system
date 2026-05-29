const express = require('express');
const {
    getUsers,
    updateUserRole,
    deleteUser,
    getSystemStats,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Every admin route is guarded by protect (authenticated) + admin (role check).
router.get('/stats', protect, admin, getSystemStats);
router.get('/users', protect, admin, getUsers);
router.route('/users/:id').put(protect, admin, updateUserRole).delete(protect, admin, deleteUser);

module.exports = router;
