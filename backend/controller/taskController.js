const Task = require('../models/taskModel');

// Controller functions for tasks
const createTask = async (req, res) => {
    console.log(req.body)
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
};

const getAllTasks = async (req, res) => {
    try {
      const tasks = await Task.find({});
  
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
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  };
  
  

  const updateTask = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'status', 'assignee', 'priority', 'team'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {    console.log('PUT request payload:', req.body);;
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).send("Task not found");
        }
        res.send(task);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

  
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send("Task not found"); // Send a response and exit the function
        }
        // res.json(task); // Send a response
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error"); // Send a response in case of an error
    }
};



module.exports = {
    createTask,
    getAllTasks,
    updateTask,
    deleteTask
};
