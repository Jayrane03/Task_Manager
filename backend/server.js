require('dotenv').config();
const express = require("express");
const connectDB = require("./utils/db");
const taskRouter = require("./routes/taskRoute");
const UserModel = require("./models/login_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
connectDB();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',                            // Local dev
  'https://task-manager-t993.onrender.com' // Production
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow no origin (like Postman or curl) or whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  credentials: true,
}));

// Mount Routes
app.use("/task", taskRouter);

// User Registration
app.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: "Error", message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || 'secret23',
      { expiresIn: '2h' }
    );

    res.json({ status: "OK", user: newUser, token });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: "Error", message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ status: "Error", message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret23',
      { expiresIn: '2h' }
    );

    res.json({ status: "OK", user, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
});

// User Home/Profile Route (Protected)
app.get('/api/home', async (req, res) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({ status: 'Error', message: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret23');
    const user = await UserModel.findOne({ email: decoded.email });

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
