// src/config/testDb.js
const db = require('./database');
const { info, error, success } = require('../utils/logger');

async function testConnection() {
    try {
        // Test query
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        success(' Database test successful!');
        info(`Test result: ${rows[0].result}`);
        
        // Check tables
        const [tables] = await db.query('SHOW TABLES');
        info('Tables in database:');
        tables.forEach(row => {
            console.log(`  - ${Object.values(row)[0]}`);
        });
        
        process.exit(0);
    } catch (err) {
        error(`Database test failed: ${err.message}`);
        process.exit(1);
    }
}

testConnection();