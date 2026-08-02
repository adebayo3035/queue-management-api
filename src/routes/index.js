// src/routes/index.js
const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./authRoutes');
const queueRoutes = require('./queueRoutes');
const adminRoutes = require('./adminRoutes');

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Queue Management API is healthy',
        timestamp: new Date().toISOString()
    });
});

// API routes
router.use('/auth', authRoutes);
router.use('/queue', queueRoutes);
router.use('/admin', adminRoutes);

module.exports = router;