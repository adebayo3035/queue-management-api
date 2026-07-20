// src/controllers/index.js
const AuthController = require('./authController');
const QueueController = require('./queueController');
const AdminController = require('./adminController');

module.exports = {
    AuthController,
    QueueController,
    AdminController
};