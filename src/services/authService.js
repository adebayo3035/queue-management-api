// src/services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { error } = require('../utils/logger');

class AuthService {
    // Admin login
    static async login(email, password) {
        try {
            // Find user
            const user = await User.findByEmail(email);
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            // Generate JWT token
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email,
                    fullName: user.full_name 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.full_name
                }
            };
        } catch (err) {
            error(`AuthService.login error: ${err.message}`);
            throw err;
        }
    }

    // Verify token
    static async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            return user;
        } catch (err) {
            error(`AuthService.verifyToken error: ${err.message}`);
            throw err;
        }
    }
}

module.exports = AuthService;