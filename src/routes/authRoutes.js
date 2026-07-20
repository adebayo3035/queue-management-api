// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { AuthController } = require('../controllers');
const { validate } = require('../middleware/validation');
const { loginSchema } = require('../validators/authValidator');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/login', validate(loginSchema), AuthController.login);

// Protected routes
router.get('/profile', auth, AuthController.getProfile);

module.exports = router;