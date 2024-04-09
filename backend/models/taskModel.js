// models/task.js
const mongoose = require('mongoose');
const User = require('./login_model');
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  team: {type:String,required:true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: null },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Deployed', 'Deferred'], required: true },
  assignee: { type: String, required: true },
  priority: { type: String, enum: ['P0', 'P1', 'P2'], required: true }
});


const TaskModel = mongoose.model('Task', taskSchema);

module.exports = TaskModel;
