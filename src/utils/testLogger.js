// src/utils/testLogger.js
const { info, error, warning, success } = require('./logger');

// Test all log types
info('This is an info message');
success('This is a success message');
warning('This is a warning message');
error('This is an error message');

console.log('\n Check logs/ folder for log file');