// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { AdminController } = require('../controllers');
const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { updateCapacitySchema } = require('../validators/queueValidator');

// All admin routes require authentication
router.use(auth);

// Queue management
router.get('/queue/waiting', AdminController.getWaitingList);
router.get('/queue/called', AdminController.getCalledList);
router.get('/queue/skipped', AdminController.getSkippedList);
router.get('/queue/completed', AdminController.getCompletedList);
router.get('/queue/all', AdminController.getAllEntries);
router.post('/queue/next', AdminController.callNext);
router.put('/queue/complete/:number', AdminController.complete);
router.put('/queue/skip/:number', AdminController.skip);

// Settings
router.post('/queue/reset', AdminController.resetDaily);
router.put(
    '/settings/capacity', 
    validate(updateCapacitySchema), 
    AdminController.updateCapacity
);

module.exports = router;