// src/middleware/errorHandler.js
const { error } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    error(`Error: ${err.message}`);
    error(`Stack: ${err.stack}`);
    
    return res.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

const notFound = (req, res) => {
    return res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};

module.exports = { errorHandler, notFound };