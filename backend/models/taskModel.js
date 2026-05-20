// models/task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    project: { type: String, default: 'General' },
    client: { type: String, default: 'Company' },
    team: { type: String, default: 'General' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Task creator
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Task assignee
    priority: { type: String, enum: ['P0', 'P1', 'P2'], default: 'P2' },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Deployed', 'Deferred'],
      default: 'Pending',
    },
    dueDate: { type: Date },
    estimatedHours: { type: Number, min: 0 },
    tags: [{ type: String }],
    comments: [
      {
        text: String,
        author: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model('Task', taskSchema);
module.exports = TaskModel;
