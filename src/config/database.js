// src/config/database.js
const mysql = require('mysql2');
const { info, error } = require('../utils/logger');

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'queue_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        error(`Database connection failed: ${err.message}`);
        return;
    }
    info('Database connected successfully');
    connection.release();
});

// Promise wrapper for async/await
const promisePool = pool.promise();

module.exports = promisePool;