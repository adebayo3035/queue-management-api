// src/controllers/authController.js
const AuthService = require('../services/authService');
const {log, info, error, warning, success  } = require('../utils/logger');

class AuthController {
    // Admin login
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            info(`Login attempt: ${email}`);
            
            const result = await AuthService.login(email, password);
            
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (err) {
            error(`Login error: ${err.message}`);
            return res.status(401).json({
                success: false,
                message: err.message || 'Login failed'
            });
        }
    }

    // Get current admin info
    static async getProfile(req, res) {
        try {
            const user = req.user; // Set by auth middleware
            
            return res.status(200).json({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    fullName: user.full_name
                }
            });
        } catch (err) {
            error(`Get profile error: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Failed to get profile'
            });
        }
    }

      // Register new admin
    static async registerAdmin(req, res) {
        try {
            const { email, password, fullName } = req.body;
            
            info(`Registering new admin: ${email}`);
            
            const result = await AuthService.registerAdmin(email, password, fullName);
            
            success(`New admin registered: ${email}`);
            
            return res.status(201).json({
                success: true,
                message: 'Admin registered successfully',
                data: result
            });
        } catch (err) {
            error(`Register admin error: ${err.message}`);
            return res.status(400).json({
                success: false,
                message: err.message || 'Failed to register admin'
            });
        }
    }
}

module.exports = AuthController;