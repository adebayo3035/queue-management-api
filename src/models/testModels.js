// src/models/testModels.js
const User = require('./User');
const DailyCounter = require('./DailyCounter');
const QueueEntry = require('./QueueEntry');
const { info, success, error } = require('../utils/logger');

async function testModels() {
    try {
        info('Testing models...');
        
        // Test 1: Get today's counter
        const counter = await DailyCounter.getToday();
        success(`Counter: Date=${counter.service_date}, Number=${counter.current_number}, Capacity=${counter.capacity}`);
        
        // Test 2: Find admin user
        const admin = await User.findByEmail('admin@queue.com');
        if (admin) {
            success(`Admin found: ${admin.full_name} (${admin.email})`);
        } else {
            error('Admin not found');
        }
        
        // Test 3: Get queue stats
        const today = new Date().toISOString().split('T')[0];
        const stats = await QueueEntry.getStats(today);
        success(`Today's stats: Total=${stats.total}, Waiting=${stats.waiting}, Completed=${stats.completed}`);
        
        info('All model tests passed!');
        process.exit(0);
    } catch (err) {
        error(`Model test failed: ${err.message}`);
        process.exit(1);
    }
}

testModels();