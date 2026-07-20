// src/models/DailyCounter.js
const db = require('../config/database');
const { error } = require('../utils/logger');

class DailyCounter {
    // Get or create counter for today
    // src/models/DailyCounter.js
static async getToday() {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        let [rows] = await db.query(
            'SELECT * FROM daily_counters WHERE service_date = ?',
            [today]
        );
        
        // If no record for today, create one
        if (rows.length === 0) {
            console.log('No counter found, creating new one...');
            const [result] = await db.query(
                'INSERT INTO daily_counters (service_date, current_number, capacity) VALUES (?, 0, 100)',
                [today]
            );
            
            [rows] = await db.query(
                'SELECT * FROM daily_counters WHERE id = ?',
                [result.insertId]
            );
        }
        
        console.log(`Current counter: ${rows[0].current_number}`);
        return rows[0];
    } catch (err) {
        error(`DailyCounter.getToday error: ${err.message}`);
        throw err;
    }
}

    // Update counter
static async update(id, currentNumber) {
    try {
        const [result] = await db.query(
            'UPDATE daily_counters SET current_number = ? WHERE id = ?',
            [currentNumber, id]
        );
        
        // Log the update
        console.log(`Counter updated: ${currentNumber}`);
        
        return result;
    } catch (err) {
        error(`DailyCounter.update error: ${err.message}`);
        throw err;
    }
}

    // Update capacity
    static async updateCapacity(id, capacity) {
        try {
            await db.query(
                'UPDATE daily_counters SET capacity = ? WHERE id = ?',
                [capacity, id]
            );
        } catch (err) {
            error(`DailyCounter.updateCapacity error: ${err.message}`);
            throw err;
        }
    }

    // Check if queue is full
    static async isFull() {
        const counter = await this.getToday();
        return counter.current_number >= counter.capacity;
    }

    // Get remaining slots
    static async getRemainingSlots() {
        const counter = await this.getToday();
        return counter.capacity - counter.current_number;
    }
}

module.exports = DailyCounter;