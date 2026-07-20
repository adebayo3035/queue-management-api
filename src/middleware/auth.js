// src/middleware/auth.js
const AuthService = require('../services/authService');
const { error } = require('../utils/logger');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Please login first.'
            });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify token
        const user = await AuthService.verifyToken(token);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (err) {
        error(`Auth middleware error: ${err.message}`);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }
};

module.exports = { auth };