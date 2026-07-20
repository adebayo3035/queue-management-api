// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { info, success, error } = require('./src/utils/logger');

// Import routes
const routes = require('./src/routes');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
    info(`${req.method} ${req.url}`);
    next();
});

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Queue Management API',
        version: '1.0.0',
        endpoints: {
            public: {
                'POST /api/queue/generate': 'Generate queue number',
                'GET /api/queue/position/:number': 'Check position',
                'GET /api/queue/today': 'Today\'s stats',
                'POST /api/auth/login': 'Admin login'
            },
            admin: {
                'GET /api/admin/queue/waiting': 'View waiting list',
                'GET /api/admin/queue/all': 'View all entries',
                'POST /api/admin/queue/next': 'Call next person',
                'PUT /api/admin/queue/complete/:number': 'Complete service',
                'PUT /api/admin/queue/skip/:number': 'Skip no-show',
                'POST /api/admin/queue/reset': 'Reset daily queue',
                'PUT /api/admin/settings/capacity': 'Update capacity'
            }
        }
    });
});

// API routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    success(`Server running on http://localhost:${PORT}`);
    info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    info('API available at: http://localhost:' + PORT + '/api');
});