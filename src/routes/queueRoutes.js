// src/routes/queueRoutes.js
const express = require('express');
const router = express.Router();
const { QueueController } = require('../controllers');
const { validate } = require('../middleware/validation');
const { generateQueueSchema } = require('../validators/queueValidator');

// Public routes (No authentication required)
router.post(
    '/generate', 
    validate(generateQueueSchema), 
    QueueController.generate
);

router.get('/position/:number', QueueController.checkPosition);

router.get('/today', QueueController.getTodayStats);

module.exports = router;