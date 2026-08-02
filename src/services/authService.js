// src/services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { info, error, success } = require('../utils/logger');

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

     // Register new admin
    static async registerAdmin(email, password, fullName) {
        try {
            // Check if email exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                throw new Error('Email already registered');
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create user
            const userId = await User.create(email, hashedPassword, fullName);
            
            // Get created user
            const user = await User.findById(userId);

            info(`New admin registered: ${email}`);

            return {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                createdAt: user.created_at
            };
        } catch (err) {
            error(`AuthService.registerAdmin error: ${err.message}`);
            throw err;
        }
    }

}

module.exports = AuthService;