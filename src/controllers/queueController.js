// src/controllers/queueController.js
const QueueService = require('../services/queueService');
const { info, error, success } = require('../utils/logger');

class QueueController {
    // Public: Generate queue number
    static async generate(req, res) {
        try {
            const { name, phone, email } = req.body;
            
            info(`Generating queue for: ${name} (${phone})`);
            
            const result = await QueueService.generateNumber(name, phone, email);
            
            success(`Queue #${result.queueNumber} generated for ${name}`);
            
            return res.status(201).json({
                success: true,
                message: 'Queue number generated successfully',
                data: result
            });
        } catch (err) {
            error(`Generate queue error: ${err.message}`);
            return res.status(400).json({
                success: false,
                message: err.message || 'Failed to generate queue number'
            });
        }
    }

    // Public: Check position
    static async checkPosition(req, res) {
        try {
            const { number } = req.params;
            
            info(`Checking position for queue #${number}`);
            
            const result = await QueueService.checkPosition(parseInt(number));
            
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            error(`Check position error: ${err.message}`);
            return res.status(404).json({
                success: false,
                message: err.message || 'Queue number not found'
            });
        }
    }

    // Public: Get today's stats
    static async getTodayStats(req, res) {
        try {
            info('Getting today\'s stats');
            
            const result = await QueueService.getTodayStats();
            
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (err) {
            error(`Get stats error: ${err.message}`);
            return res.status(500).json({
                success: false,
                message: 'Failed to get statistics'
            });
        }
    }
}

module.exports = QueueController;