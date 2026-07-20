// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { info, error, success } = require('./src/utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
    info('Home page accessed');
    res.json({ 
        message: 'Queue Management API is running!',
        status: 'success'
    });
});

// Start server
app.listen(PORT, () => {
    success(`Server running on http://localhost:${PORT}`);
    info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});