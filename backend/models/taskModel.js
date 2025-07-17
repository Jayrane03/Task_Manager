// models/task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  team: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Task creator
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Task assignee
  priority: { type: String, enum: ['P0', 'P1', 'P2'], default: 'P2' },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed', 'Deployed', 'Deferred'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


const TaskModel = mongoose.model('Task', taskSchema);
module.exports = TaskModel;
