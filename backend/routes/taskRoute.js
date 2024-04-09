const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');

// Routes for tasks
router.post('/create', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.put('/update/:id', taskController.updateTask);
router.delete('/delete/:id', taskController.deleteTask);

module.exports = router;
