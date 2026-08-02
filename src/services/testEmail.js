// src/services/testEmail.js
require('dotenv').config();
const emailService = require('./emailService');
const { info, success, error } = require('../utils/logger');

async function testEmail() {
    try {
        info('Testing email service...');
        
        // Test email
        const testEmail = 'adebayoabdulrahmon@gmail.com'; // Change to your email
        
        const result = await emailService.sendQueueNumber(
            testEmail,
            'Test User',
            72,
            10
        );
        
        if (result) {
            success(' Email sent successfully!');
            info(`Check your inbox: ${testEmail}`);
        } else {
            error(' Email failed to send');
        }
        
        process.exit(0);
    } catch (err) {
        error(`Email test error: ${err.message}`);
        process.exit(1);
    }
}

testEmail();