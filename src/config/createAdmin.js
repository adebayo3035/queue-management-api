// src/config/createAdmin.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./database');
const { info, error, success } = require('../utils/logger');

async function createAdmin() {
    try {
        const email = 'admin@queue.com';
        const password = 'admin123';
        const fullName = 'Admin User';
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Insert or update admin
        const query = `
            INSERT INTO users (email, password_hash, full_name) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            password_hash = VALUES(password_hash),
            full_name = VALUES(full_name)
        `;
        
        await db.query(query, [email, hashedPassword, fullName]);
        
        success(`✅ Admin created successfully!`);
        info(`Email: ${email}`);
        info(`Password: ${password}`);
        info(`Please change password after first login.`);
        
        process.exit(0);
    } catch (err) {
        error(`Failed to create admin: ${err.message}`);
        process.exit(1);
    }
}

createAdmin();