const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'employee', 'student', 'manager'], default: 'employee' },
  team: { type: String, default: null },
  department: { type: String, default: 'Operations' },
  title: { type: String, default: 'Team Member' },
  phone: { type: String, default: '' },
  notifications: [
    {
      message: String,
      task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
