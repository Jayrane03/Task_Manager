// controllers/userController.js
const User = require('../models/login_model'); // Adjust path as needed

// Get all users for assignee dropdown
const getAllUsers = async (req, res) => {
    try {
        // Fetch all users but only return necessary fields for security
        const users = await User.find({}, 'name email role _id team')
            .sort({ name: 1 }); // Sort by name alphabetically
        
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            message: 'Failed to fetch users',
            error: error.message 
        });
    }
};

// Get users by role (optional - if you want to filter assignees by role)
const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        
        const users = await User.find({ role }, 'name email role _id team')
            .sort({ name: 1 });
        
        res.json(users);
    } catch (error) {
        console.error('Error fetching users by role:', error);
        res.status(500).json({ 
            message: 'Failed to fetch users by role',
            error: error.message 
        });
    }
};

// Get current user info (if you have authentication middleware)
const getCurrentUser = async (req, res) => {
    try {
        // Assuming you have user info from authentication middleware
        const userId = req.user?.id || req.userId; // Adjust based on your auth setup
        
        const user = await User.findById(userId, 'name email role _id team');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ 
            message: 'Failed to fetch current user',
            error: error.message 
        });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId, 'name email role _id team');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ 
            message: 'Failed to fetch user',
            error: error.message 
        });
    }
};

const assignTeam = async (req, res) => {
  try {
    const { team } = req.body;
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { team }, { new: true });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Assign Team Error:', err);
    res.status(500).json({ error: 'Failed to assign team' });
  }
};


module.exports = {
    getAllUsers,
    getUsersByRole,
    getCurrentUser,
    getUserById,
    assignTeam
};