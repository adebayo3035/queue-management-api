// src/services/testServices.js
const QueueService = require('./queueService');
const { info, success, error } = require('../utils/logger');

async function testServices() {
    try {
        info('Testing services...');
        
        // Test 1: Generate queue number
        const entry = await QueueService.generateNumber('John Doe', '08012345678', 'john@test.com');
        success(`Generated queue #${entry.queueNumber} for ${entry.fullName}`);
        info(`People ahead: ${entry.peopleAhead}`);
        
        // Test 2: Check position
        const position = await QueueService.checkPosition(entry.queueNumber);
        success(`Position check: #${position.queueNumber} - Status: ${position.status}`);
        
        // Test 3: Get today's stats
        const stats = await QueueService.getTodayStats();
        success(`Today's stats: Total=${stats.total}, Waiting=${stats.waiting}, Completed=${stats.completed}`);
        
        // Test 4: Get waiting list
        const waiting = await QueueService.getWaitingList();
        success(`Waiting list: ${waiting.totalWaiting} people waiting`);
        
        info('✅ All service tests passed!');
        process.exit(0);
    } catch (err) {
        error(`Service test failed: ${err.message}`);
        process.exit(1);
    }
}

testServices();