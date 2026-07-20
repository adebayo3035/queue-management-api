// src/utils/logger.js
const fs = require('fs');
const path = require('path');

// Create logs folder if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

function getLogFileName() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}.log`;
}

function log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${type}] ${message}\n`;
    
    // Print to console (colored for easy reading)
    const colors = {
        INFO: '\x1b[32m',  // Green
        ERROR: '\x1b[31m', // Red
        WARNING: '\x1b[33m', // Yellow
        SUCCESS: '\x1b[36m' // Cyan
    };
    const reset = '\x1b[0m';
    const color = colors[type] || colors.INFO;
    
    // console.log(`${color}${logEntry}${reset}`);
    
    // Append to log file
    const logFile = path.join(logsDir, getLogFileName());
    fs.appendFileSync(logFile, logEntry);
}

// Helper methods
function info(message) {
    log(message, 'INFO');
}

function error(message) {
    log(message, 'ERROR');
}

function warning(message) {
    log(message, 'WARNING');
}

function success(message) {
    log(message, 'SUCCESS');
}

module.exports = { log, info, error, warning, success };