const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'employee', 'student', 'manager'], default: 'employee' },
   team: { type: String, default: null }, 
});

module.exports = mongoose.model('User', userSchema);
