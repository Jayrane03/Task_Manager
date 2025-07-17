const Task = require('../models/taskModel');

// Controller functions for tasks
const createTask = async (req, res) => {
    console.log('Create task request body:', req.body);
    try {
        const task = new Task(req.body);
        await task.save();
        
        // Populate the created task with user details for better response
        const populatedTask = await Task.findById(task._id)
            .populate('user', 'name email role')
            .populate('assignee', 'name email role');
            
        res.status(201).json(populatedTask);
    } catch (error) {
        console.log('Error creating task:', error);
        res.status(400).json({ 
            message: 'Failed to create task', 
            error: error.message 
        });
    }
};

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({})
            .populate('user', 'name email role')
            .populate('assignee', 'name email role')
            .sort({ createdAt: -1 });

        const tasksByStatus = {
            Pending: [],
            'In Progress': [],
            Completed: [],
            Deployed: [],
            Deferred: []
        };

        tasks.forEach(task => {
            tasksByStatus[task.status].push(task);
        });

        res.json(tasksByStatus);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ 
            message: 'Failed to fetch tasks',
            error: error.message 
        });
    }
};

// Get tasks created by a specific user (for admin dashboard)
const getTasksByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const tasks = await Task.find({ user: userId })
            .populate('user', 'name email role')
            .populate('assignee', 'name email role')
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks by user:', error);
        res.status(500).json({ 
            message: 'Failed to fetch tasks by user',
            error: error.message 
        });
    }
};

// Get tasks assigned to a specific user (for employee dashboard)
const getTasksAssignedToUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const tasks = await Task.find({ assignee: userId })
            .populate('user', 'name email role')
            .populate('assignee', 'name email role')
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching assigned tasks:', error);
        res.status(500).json({ 
            message: 'Failed to fetch assigned tasks',
            error: error.message 
        });
    }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('user', 'name email role')
            .populate('assignee', 'name email role');
            
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.json(task);
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        res.status(500).json({ 
            message: 'Failed to fetch task',
            error: error.message 
        });
    }
};

const updateTask = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'status', 'assignee', 'priority', 'team'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ 
            message: 'Invalid updates!',
            allowedFields: allowedUpdates 
        });
    }

    try {
        console.log('PUT request payload:', req.body);
        
        // Add updatedAt timestamp
        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };
        
        const task = await Task.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        ).populate('user', 'name email role')
         .populate('assignee', 'name email role');
         
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(400).json({ 
            message: 'Failed to update task',
            error: error.message 
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.status(200).json({ 
            message: 'Task deleted successfully',
            deletedTask: task 
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ 
            message: 'Failed to delete task',
            error: error.message 
        });
    }
};

// Get tasks statistics (optional - for dashboard analytics)
const getTaskStats = async (req, res) => {
    try {
        const stats = await Task.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const priorityStats = await Task.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        res.json({
            statusStats: stats,
            priorityStats: priorityStats,
            totalTasks: await Task.countDocuments()
        });
    } catch (error) {
        console.error('Error fetching task stats:', error);
        res.status(500).json({ 
            message: 'Failed to fetch task statistics',
            error: error.message 
        });
    }
};

// Bulk update tasks (optional - for batch operations)
const bulkUpdateTasks = async (req, res) => {
    try {
        const { taskIds, updates } = req.body;
        
        if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
            return res.status(400).json({ message: 'Task IDs array is required' });
        }
        
        const allowedUpdates = ['status', 'priority', 'assignee'];
        const updateKeys = Object.keys(updates);
        const isValidOperation = updateKeys.every(key => allowedUpdates.includes(key));
        
        if (!isValidOperation) {
            return res.status(400).json({ 
                message: 'Invalid bulk update fields',
                allowedFields: allowedUpdates 
            });
        }
        
        const updateData = {
            ...updates,
            updatedAt: new Date()
        };
        
        const result = await Task.updateMany(
            { _id: { $in: taskIds } },
            updateData
        );
        
        res.json({
            message: 'Tasks updated successfully',
            modifiedCount: result.modifiedCount,
            matchedCount: result.matchedCount
        });
    } catch (error) {
        console.error('Error bulk updating tasks:', error);
        res.status(500).json({ 
            message: 'Failed to bulk update tasks',
            error: error.message 
        });
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTasksByUser,
    getTasksAssignedToUser,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskStats,
    bulkUpdateTasks
};