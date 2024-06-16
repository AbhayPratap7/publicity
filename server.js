require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const formRoutes = require('./routes/formRoutes'); // Import the form routes

const app = express();
const PORT = process.env.PORT || 5007; // Set the port

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors({
    origin: 'http://127.0.0.1:5500' // Allow requests from this specific origin
}));

// MongoDB connection
const mongoURI = process.env.MONGO_URI.trim(); // Use the MONGO_URI from environment variables and trim any leading/trailing whitespace
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process if MongoDB connection fails
    });

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB Cluster');
});

mongoose.connection.on('error', (error) => {
    console.error('Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Use form routes
app.use('/api/forms', formRoutes); // Use the form routes for handling requests

// Catch-all route for handling requests to the root URL
app.get('*', (_, res) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Graceful shutdown
const gracefulShutdown = () => {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
};

process.on('SIGINT', gracefulShutdown); // Listen for SIGINT (Ctrl+C)
process.on('SIGTERM', gracefulShutdown); // Listen for SIGTERM (kill command)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
