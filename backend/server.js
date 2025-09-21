require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => res.send('API is running'));

// Add routes later (e.g., auth, doctors, appointments)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));