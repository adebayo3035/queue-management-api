-- src/config/init.sql
-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS queue_db;
USE queue_db;

-- Users table (Admin only)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Daily counters table
CREATE TABLE IF NOT EXISTS daily_counters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_date DATE UNIQUE NOT NULL,
    current_number INT DEFAULT 0,
    capacity INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_service_date (service_date)
);

-- Queue entries table
CREATE TABLE IF NOT EXISTS queue_entries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    queue_number INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NULL,
    status ENUM('waiting', 'called', 'completed', 'skipped') DEFAULT 'waiting',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    called_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    service_date DATE NOT NULL,
    INDEX idx_queue_number (queue_number),
    INDEX idx_status (status),
    INDEX idx_service_date (service_date)
);

-- Insert default admin (password: admin123)
INSERT INTO users (email, password_hash, full_name) 
VALUES (
    'admin@queue.com', 
    '$2b$10$YourHashedPasswordHere',  -- We'll generate this properly in code
    'Admin User'
);

-- Insert sample counter for today
INSERT INTO daily_counters (service_date, current_number, capacity)
VALUES (CURDATE(), 0, 100)
ON DUPLICATE KEY UPDATE current_number = current_number;