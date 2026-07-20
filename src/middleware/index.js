// src/middleware/index.js
const { auth } = require('./auth');
const { validate } = require('./validation');
const { errorHandler, notFound } = require('./errorHandler');

module.exports = {
    auth,
    validate,
    errorHandler,
    notFound
};