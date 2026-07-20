// src/models/User.js
const db = require('../config/database');
const { error } = require('../utils/logger');

class User {
    // Find user by email
    static async findByEmail(email) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0] || null;
        } catch (err) {
            error(`User.findByEmail error: ${err.message}`);
            throw err;
        }
    }

    // Find user by ID
    static async findById(id) {
        try {
            const [rows] = await db.query(
                'SELECT id, email, full_name, created_at FROM users WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } catch (err) {
            error(`User.findById error: ${err.message}`);
            throw err;
        }
    }

    // Create new user
    static async create(email, hashedPassword, fullName) {
        try {
            const [result] = await db.query(
                'INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)',
                [email, hashedPassword, fullName]
            );
            return result.insertId;
        } catch (err) {
            error(`User.create error: ${err.message}`);
            throw err;
        }
    }
}

module.exports = User;