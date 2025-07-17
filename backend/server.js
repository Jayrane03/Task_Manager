require('dotenv').config();
const express = require("express");
const connectDB = require("./utils/db");
const taskRouter = require("./routes/taskRoute");
const UserModel = require("./models/login_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require('./routes/adminRoutes');

 // ✅ This should match your route

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
connectDB();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://task-manager-t993.onrender.com',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  credentials: true,
}));

// Routes
app.use("/task", taskRouter);
app.use("/users",userRoutes)


// Register Route
app.post('/register', async (req, res) => {
  const { name, email, password, role, adminKey } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (role === 'admin' && adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ message: 'Invalid Admin Key' });
  }

  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ name, email, password: hashedPassword, role });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'secret23',
      { expiresIn: '2h' }
    );

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// User Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: "Error", message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ status: "Error", message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret23',
      { expiresIn: '2h' }
    );

    res.json({ status: "OK", user, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
});

// User Profile / Home (Protected)
app.get('/api/home', async (req, res) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ status: 'Error', message: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret23');
    const user = await UserModel.findOne({ email: decoded.email }).select("-password");

    if (!user) {
      return res.status(404).json({ status: 'Error', message: 'User not found' });
    }

    res.json({ status: 'OK', user });
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ status: 'Error', message: 'Invalid or expired token' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
