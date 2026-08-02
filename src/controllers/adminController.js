// src/controllers/adminController.js
const QueueService = require('../services/queueService');
const { info, error, success } = require('../utils/logger');

class AdminController {
    // Admin: Get all waiting
    static async getWaitingList(req, res) {
        try {
            info('Admin: Getting waiting list');
            
            const result = await QueueService.getWaitingList();
            
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            error(`Get waiting list error: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Failed to get waiting list'
            });
        }
    }

    static async getCalledList(req, res) {
        try {
            info('Admin: Getting called list');
            
            const result = await QueueService.getCalledList();
            
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            error(`An error occured while getting list of Called User: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Failed to get called list'
            });
        }
    }

     static async getCompletedList(req, res) {
        try {
            info('Admin: Getting completed list for today');
            
            const result = await QueueService.getCompletedList();
            
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            error(`An error occured while getting list of completed queues for today: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Failed to get list of completed calls'
            });
        }
    }

    static async getSkippedList(req, res) {
        try {
            info('Admin: Getting skipped list');
            
            const result = await QueueService.getSkippedList();
            
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            error(`An error occured while getting skipped: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Failed to get skipped list'
            });
        }
    }

    // Admin: Get all entries (full history)
    static async getAllEntries(req, res) {
        try {
            info('Admin: Getting all entries');
            
            const result = await QueueService.getAllEntries();
            
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            error(`Get all entries error: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Failed to get entries'
            });
        }
    }

    // Admin: Call next person
    static async callNext(req, res) {
        try {
            info('Admin: Calling next person');
            
            const result = await QueueService.callNext();
            
            success(`Called queue #${result.queueNumber}: ${result.fullName}`);
            
            return res.status(200).json({
                success: true,
                message: 'Next person called successfully',
                data: result
            });
        } catch (err) {
            error(`Call next error: ${err.message}`);
            return res.status(400).json({
                success: false,
                message: err.message || 'Failed to call next person'
            });
        }
    }

    // Admin: Complete service
    static async complete(req, res) {
        try {
            const { number } = req.params;
            
            info(`Admin: Completing queue #${number}`);
            
            const result = await QueueService.complete(parseInt(number));
            
            success(`Queue #${number} completed`);
            
            return res.status(200).json({
                success: true,
                message: result.message,
                data: result
            });
        } catch (err) {
            error(`Complete error: ${err.message}`);
            return res.status(400).json({
                success: false,
                message: err.message || 'Failed to complete service'
            });
        }
    }

    // Admin: Skip no-show
    static async skip(req, res) {
        try {
            const { number } = req.params;
            
            info(`Admin: Skipping queue #${number}`);
            
            const result = await QueueService.skip(parseInt(number));
            
            success(`Queue #${number} skipped`);
            
            return res.status(200).json({
                success: true,
                message: result.message,
                data: result
            });
        } catch (err) {
            error(`Skip error: ${err.message}`);
            return res.status(400).json({
                success: false,
                message: err.message || 'Failed to skip queue entry'
            });
        }
    }

    // Admin: Reset daily queue
    static async resetDaily(req, res) {
        try {
            info('Admin: Resetting daily queue');
            
            const result = await QueueService.resetDaily();
            
            success('Queue reset successfully');
            
            return res.status(200).json({
                success: true,
                message: result.message,
                data: result
            });
        } catch (err) {
            error(`Reset error: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Failed to reset queue'
            });
        }
    }

    // Admin: Update capacity
    static async updateCapacity(req, res) {
        try {
            const { capacity } = req.body;
            
            info(`Admin: Updating capacity to ${capacity}`);
            
            const result = await QueueService.updateCapacity(capacity);
            
            success(`Capacity updated to ${capacity}`);
            
            return res.status(200).json({
                success: true,
                message: result.message,
                data: result
            });
        } catch (err) {
            error(`Update capacity error: ${err.message}`);
            return res.status(400).json({
                success: false,
                message: err.message || 'Failed to update capacity'
            });
        }
    }
}

module.exports = AdminController;