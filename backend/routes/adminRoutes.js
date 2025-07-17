// routes/userRoutes.js or wherever your user routes are

const express = require('express');
// const { getAllUsers } = require('../controller/adminController');

const router = express.Router();
const {
    getAllUsers,
    getUsersByRole,
    getCurrentUser,
    getUserById
} = require('../controller/adminController');

// Get all users (for assignee dropdown)
router.get('/all', getAllUsers);

// Get users by role (optional)
router.get('/role/:role', getUsersByRole);

// Get current authenticated user
router.get('/me', getCurrentUser);

// Get user by ID
router.get('/:userId', getUserById);

module.exports = router;// ✅ Make sure this exists
module.exports = router;
