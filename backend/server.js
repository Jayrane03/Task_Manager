require('dotenv').config();
const express = require("express");
const connectDB = require("./utils/db");
const taskRouter = require("./routes/taskRoute"); // Corrected import path
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("./models/login_model");
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));


// Connect with the database
connectDB();
app.use(cors({
    // origin: allowedOrigins,
    // origin: 'http://localhost:5173,
    origin: 'https://task-manager-t993.onrender.com',
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use("/task", taskRouter); // Mounting task routes

// User registration route
app.post('/', async (req, res) => {
    try {
        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ status: "Error", message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await UserModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        // Generate JWT token for the newly registered user
        const token = jwt.sign({
            userId: newUser._id,
            email: newUser.email,
        }, 'secret23', { expiresIn: '2h' }); // Set token expiration to 2 hours

        res.json({ status: "OK", user: newUser, token }); // Include token in the response
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Error", message: "Internal Server Error" });
    }
});

// User login route
app.post('/api/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ status: "Error", message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ status: "Error", message: "Invalid password" });
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
        }, 'secret23', { expiresIn: '2h' });

        // Return user data along with the token
        res.json({ status: "OK", user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Error", message: "Internal Server Error" });
    }
});

// User home route
app.get('/api/home', async (req, res) => {
    const token = req.headers['x-access-token'];
    try {
        if (!token) {
            return res.status(401).json({ status: 'Error', message: 'Token not provided' });
        }
        
        const decoded = jwt.verify(token, 'secret23');
        const email = decoded.email;
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ status: 'Error', message: 'User not found' });
        }

        res.json({ status: 'OK', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'Error', message: error.message || 'Internal Server Error' });
    }
});

// Start server
const PORT  = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
