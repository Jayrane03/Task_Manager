// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const {
    createTask,
    getAllTasks,
    getTasksByUser,
    getTasksAssignedToUser,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskStats,
    bulkUpdateTasks
} = require("../controller/taskController");

// Create a new task
router.post('/create', createTask);

// Get all tasks (grouped by status)
router.get('/all', getAllTasks);

// Get tasks created by a specific user (for admin dashboard)
router.get('/user/:userId', getTasksByUser);

// Get tasks assigned to a specific user (for employee dashboard)
router.get('/assigned/:userId', getTasksAssignedToUser);

// Get a single task by ID
router.get('/:id', getTaskById);

// Update a task
router.put('/update/:id', updateTask);

// Delete a task
router.delete('/:id', deleteTask);

// Get task statistics (optional)
router.get('/stats/overview', getTaskStats);

// Bulk update tasks (optional)
router.put('/bulk/update', bulkUpdateTasks);

module.exports = router;