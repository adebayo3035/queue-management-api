// src/services/queueService.js
const DailyCounter = require('../models/DailyCounter');
const QueueEntry = require('../models/QueueEntry');
const emailService = require('./emailService');
const { error, info, success } = require('../utils/logger');

class QueueService {
    // Generate new queue number
    // src/services/queueService.js
// src/services/queueService.js

static async generateNumber(fullName, phone, email = null) {
    try {
        // Check if queue is full
        const isFull = await DailyCounter.isFull();
        if (isFull) {
            throw new Error('Queue is full for today. Please try again tomorrow.');
        }

        const today = new Date().toISOString().split('T')[0];

        // RATE LIMIT: Check if phone already has a queue number today
        const existingPhone = await QueueEntry.findByPhoneAndDate(phone, today);
        if (existingPhone) {
            throw new Error(
                `You already have a queue number for today (Queue #${existingPhone.queue_number}). ` +
                `You cannot generate another number.`
            );
        }

        // RATE LIMIT: Check if email already has a queue number today (if provided)
        if (email) {
            const existingEmail = await QueueEntry.findByEmailAndDate(email, today);
            if (existingEmail) {
                throw new Error(
                    `This email already has a queue number for today (Queue #${existingEmail.queue_number}).`
                );
            }
        }

        // Get today's counter
        const counter = await DailyCounter.getToday();
        
        // Calculate new queue number
        const queueNumber = counter.current_number + 1;

        console.log(`Generating number: current=${counter.current_number}, new=${queueNumber}`);

        // Create queue entry
        await QueueEntry.create({
            queueNumber,
            fullName,
            phone,
            email,
            serviceDate: today
        });

        // Update counter
        await DailyCounter.update(counter.id, queueNumber);

        // Get people ahead
        const peopleAhead = await QueueEntry.getWaitingCount(today, queueNumber);

        info(`Queue #${queueNumber} generated for ${fullName} (${phone})`);
        info(`People ahead: ${peopleAhead}`);

        // Send email notification
        if (email) {
            try {
                await emailService.sendQueueNumber(
                    email,
                    fullName,
                    queueNumber,
                    peopleAhead
                );
            } catch (emailErr) {
                error(`Email notification failed: ${emailErr.message}`);
            }
        }

        return {
            queueNumber,
            position: queueNumber,
            peopleAhead: peopleAhead,
            fullName,
            phone,
            email,
            status: 'waiting'
        };
    } catch (err) {
        error(`QueueService.generateNumber error: ${err.message}`);
        throw err;
    }
}

    // Check position
    static async checkPosition(queueNumber) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const entry = await QueueEntry.findByNumber(queueNumber, today);
            
            if (!entry) {
                throw new Error('Queue number not found for today');
            }

            // Get people ahead
            const peopleAheadCount = await QueueEntry.getWaitingCount(today);
            const peopleAhead = entry.status === 'waiting' ? peopleAheadCount - 1 : 0;

            return {
                queueNumber: entry.queue_number,
                fullName: entry.full_name,
                status: entry.status,
                position: entry.queue_number,
                peopleAhead: peopleAhead,
                generatedAt: entry.generated_at,
                calledAt: entry.called_at,
                completedAt: entry.completed_at
            };
        } catch (err) {
            error(`QueueService.checkPosition error: ${err.message}`);
            throw err;
        }
    }

    // Get today's stats
    static async getTodayStats() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const counter = await DailyCounter.getToday();
            const stats = await QueueEntry.getStats(today);
            
            // Get currently serving (first called but not completed)
            const waitingEntries = await QueueEntry.getWaitingToday(today);
            const currentlyServing = waitingEntries.length > 0 ? waitingEntries[0].queue_number : null;
            
            return {
                date: today,
                capacity: counter.capacity,
                used: counter.current_number,
                remaining: counter.capacity - counter.current_number,
                waiting: stats.waiting,
                called: stats.called,
                completed: stats.completed,
                skipped: stats.skipped,
                total: stats.total,
                currentlyServing: currentlyServing
            };
        } catch (err) {
            error(`QueueService.getTodayStats error: ${err.message}`);
            throw err;
        }
    }

    // Admin: Get all waiting
    static async getWaitingList() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const entries = await QueueEntry.getWaitingToday(today);
            const counter = await DailyCounter.getToday();
            
            return {
                totalWaiting: entries.length,
                capacity: counter.capacity,
                used: counter.current_number,
                remaining: counter.capacity - counter.current_number,
                queue: entries.map(entry => ({
                    queueNumber: entry.queue_number,
                    fullName: entry.full_name,
                    phone: entry.phone,
                    status: entry.status,
                    generatedAt: entry.generated_at
                }))
            };
        } catch (err) {
            error(`QueueService.getWaitingList error: ${err.message}`);
            throw err;
        }
    }

    // Admin: get called list
    static async getCalledList() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const entries = await QueueEntry.getCalledToday(today);
            const counter = await DailyCounter.getToday();
            
            return {
                totalCalled: entries.length,
                capacity: counter.capacity,
                used: counter.current_number,
                remaining: counter.capacity - counter.current_number,
                queue: entries.map(entry => ({
                    queueNumber: entry.queue_number,
                    fullName: entry.full_name,
                    phone: entry.phone,
                    status: entry.status,
                    generatedAt: entry.generated_at
                }))
            };
        } catch (err) {
            error(`QueueService.getCalledList error: ${err.message}`);
            throw err;
        }
    }

    // Admin: get Completed list
    static async getCompletedList() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const entries = await QueueEntry.getCompletedToday(today);
            const counter = await DailyCounter.getToday();
            
            return {
                totalCompleted: entries.length,
                capacity: counter.capacity,
                used: counter.current_number,
                remaining: counter.capacity - counter.current_number,
                queue: entries.map(entry => ({
                    queueNumber: entry.queue_number,
                    fullName: entry.full_name,
                    phone: entry.phone,
                    status: entry.status,
                    generatedAt: entry.generated_at
                }))
            };
        } catch (err) {
            error(`QueueService.getCompletedList error: ${err.message}`);
            throw err;
        }
    }

    // Admin: get skipped list
    static async getSkippedList() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const entries = await QueueEntry.getSkippedToday(today);
            const counter = await DailyCounter.getToday();
            
            return {
                totalSkipped: entries.length,
                capacity: counter.capacity,
                used: counter.current_number,
                remaining: counter.capacity - counter.current_number,
                queue: entries.map(entry => ({
                    queueNumber: entry.queue_number,
                    fullName: entry.full_name,
                    phone: entry.phone,
                    status: entry.status,
                    generatedAt: entry.generated_at
                }))
            };
        } catch (err) {
            error(`QueueService.getSkippedList error: ${err.message}`);
            throw err;
        }
    }


    // Admin: Call next person
    static async callNext() {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            // Get next waiting entry
            const entry = await QueueEntry.getNextWaiting(today);
            if (!entry) {
                throw new Error('No one waiting in queue');
            }

            // Update status to 'called'
            await QueueEntry.updateStatus(entry.id, 'called', 'called_at');

            info(`Called queue #${entry.queue_number}: ${entry.full_name}`);

            // Send email notification (if email exists)
            if (entry.email) {
                try {
                    await emailService.sendCalledNotification(
                        entry.email,
                        entry.full_name,
                        entry.queue_number
                    );
                } catch (emailErr) {
                    error(`Email notification failed: ${emailErr.message}`);
                }
            }

            return {
                queueNumber: entry.queue_number,
                fullName: entry.full_name,
                phone: entry.phone,
                status: 'called',
                calledAt: new Date()
            };
        } catch (err) {
            error(`QueueService.callNext error: ${err.message}`);
            throw err;
        }
    }

    // Admin: Complete service
    static async complete(queueNumber) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const entry = await QueueEntry.findByNumber(queueNumber, today);
            
            if (!entry) {
                throw new Error('Queue entry not found');
            }

            // Check status
        if (entry.status === 'completed') {
            throw new Error('This entry is already completed');
        }
        
        if (entry.status === 'skipped') {
            throw new Error('Cannot complete a skipped entry');
        }
        
        // Only allow completion if called
        if (entry.status === 'waiting') {
            throw new Error(
                `Please call queue #${queueNumber} first before completing. ` +
                `Use the "Call Next" endpoint.`
            );
        }

        // Update status to 'completed'
        await QueueEntry.updateStatus(entry.id, 'completed', 'completed_at');

        info(`Completed queue #${queueNumber}: ${entry.full_name}`);

            return {
                success: true,
                message: `Queue number ${queueNumber} marked as completed`,
                queueNumber: entry.queue_number,
                fullName: entry.full_name
            };
        } catch (err) {
            error(`QueueService.complete error: ${err.message}`);
            throw err;
        }
    }

    // Admin: Skip no-show
    static async skip(queueNumber) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const entry = await QueueEntry.findByNumber(queueNumber, today);
            
            if (!entry) {
                throw new Error('Queue entry not found');
            }

            if (entry.status === 'completed' || entry.status === 'skipped') {
                throw new Error(`This entry is already ${entry.status}`);
            }

            // Update status to 'skipped'
            await QueueEntry.updateStatus(entry.id, 'skipped');

            info(`Skipped queue #${queueNumber}: ${entry.full_name}`);

            return {
                success: true,
                message: `Queue number ${queueNumber} marked as skipped`,
                queueNumber: entry.queue_number,
                fullName: entry.full_name
            };
        } catch (err) {
            error(`QueueService.skip error: ${err.message}`);
            throw err;
        }
    }

    // Admin: Reset daily queue
    static async resetDaily() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const counter = await DailyCounter.getToday();
            
            // Reset counter
            await DailyCounter.update(counter.id, 0);

            info(`Queue reset for ${today}`);

            return {
                success: true,
                message: 'Queue reset successfully',
                date: today,
                capacity: counter.capacity
            };
        } catch (err) {
            error(`QueueService.resetDaily error: ${err.message}`);
            throw err;
        }
    }

    // Admin: Update capacity
    static async updateCapacity(newCapacity) {
        try {
            if (newCapacity < 1) {
                throw new Error('Capacity must be at least 1');
            }

            const counter = await DailyCounter.getToday();
            
            if (newCapacity < counter.current_number) {
                throw new Error(`Capacity cannot be less than current queue count (${counter.current_number})`);
            }

            await DailyCounter.updateCapacity(counter.id, newCapacity);

            info(`Capacity updated to ${newCapacity}`);

            return {
                success: true,
                message: 'Capacity updated successfully',
                capacity: newCapacity,
                currentUsed: counter.current_number,
                remaining: newCapacity - counter.current_number
            };
        } catch (err) {
            error(`QueueService.updateCapacity error: ${err.message}`);
            throw err;
        }
    }

    // Get all entries for today (admin)
    static async getAllEntries() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const entries = await QueueEntry.getAllToday(today);
            const stats = await QueueEntry.getStats(today);
            const counter = await DailyCounter.getToday();

            return {
                stats: {
                    total: stats.total,
                    waiting: stats.waiting,
                    called: stats.called,
                    completed: stats.completed,
                    skipped: stats.skipped,
                    capacity: counter.capacity,
                    used: counter.current_number
                },
                entries: entries.map(entry => ({
                    queueNumber: entry.queue_number,
                    fullName: entry.full_name,
                    phone: entry.phone,
                    email: entry.email,
                    status: entry.status,
                    generatedAt: entry.generated_at,
                    calledAt: entry.called_at,
                    completedAt: entry.completed_at
                }))
            };
        } catch (err) {
            error(`QueueService.getAllEntries error: ${err.message}`);
            throw err;
        }
    }
}

module.exports = QueueService;