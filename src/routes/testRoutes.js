// src/routes/testRoutes.js
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testRoutes() {
    console.log('\n Testing API Routes...\n');
    
    try {
        // Test 1: Health check
        console.log('1. Testing health check...');
        const health = await axios.get('http://localhost:5000/health');
        console.log(`  - Health: ${health.data.status}\n`);
        
        // Test 2: Generate queue number
        console.log('2. Generating queue number...');
        const generate = await axios.post(`${BASE_URL}/queue/generate`, {
            name: 'Test User',
            phone: '08012345678',
            email: 'test@example.com'
        });
        console.log(`   - Queue #${generate.data.data.queueNumber} generated for ${generate.data.data.fullName}\n`);
        
        // Test 3: Check position
        console.log('3. Checking position...');
        const position = await axios.get(`${BASE_URL}/queue/position/${generate.data.data.queueNumber}`);
        console.log(`   - Position: #${position.data.data.queueNumber} - Status: ${position.data.data.status}\n`);
        
        // Test 4: Today's stats
        console.log('4. Getting today\'s stats...');
        const stats = await axios.get(`${BASE_URL}/queue/today`);
        console.log(`   - Today: ${stats.data.data.total} total, ${stats.data.data.waiting} waiting\n`);
        
        // Test 5: Admin login
        console.log('5. Testing admin login...');
        const login = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@queue.com',
            password: 'admin123'
        });
        const token = login.data.data.token;
        console.log(`   - Admin logged in successfully\n`);
        
        // Test 6: Get waiting list (Protected)
        console.log('6. Getting waiting list...');
        const waiting = await axios.get(`${BASE_URL}/admin/queue/waiting`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`   - ${waiting.data.data.totalWaiting} people waiting\n`);
        
        // Test 7: Call next (Protected)
        console.log('7. Calling next person...');
        const next = await axios.post(`${BASE_URL}/admin/queue/next`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`   - Called queue #${next.data.data.queueNumber}: ${next.data.data.fullName}\n`);
        
        console.log('- All tests passed!');
        console.log('- Your Queue Management API is working!\n');
        
    } catch (err) {
        console.error('x Test failed:', err.response?.data?.message || err.message);
    }
}

testRoutes();