// src/models/QueueEntry.js
const db = require("../config/database");
const { error } = require("../utils/logger");

class QueueEntry {
  // Create new queue entry
  static async create(data) {
    try {
      const { queueNumber, fullName, phone, email, serviceDate } = data;

      const [result] = await db.query(
        `INSERT INTO queue_entries 
                (queue_number, full_name, phone, email, status, service_date) 
                VALUES (?, ?, ?, ?, 'waiting', ?)`,
        [queueNumber, fullName, phone, email, serviceDate],
      );

      return result.insertId;
    } catch (err) {
      error(`QueueEntry.create error: ${err.message}`);
      throw err;
    }
  }

  // Find by queue number
  static async findByNumber(queueNumber, serviceDate) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM queue_entries WHERE queue_number = ? AND service_date = ?",
        [queueNumber, serviceDate],
      );
      return rows[0] || null;
    } catch (err) {
      error(`QueueEntry.findByNumber error: ${err.message}`);
      throw err;
    }
  }

  // Get all waiting entries for today
  static async getWaitingToday(serviceDate) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM queue_entries 
                WHERE service_date = ? AND status = 'waiting' 
                ORDER BY queue_number ASC`,
        [serviceDate],
      );
      return rows;
    } catch (err) {
      error(`QueueEntry.getWaitingToday error: ${err.message}`);
      throw err;
    }
  }

  // Get all entries for today (all statuses)
  static async getAllToday(serviceDate) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM queue_entries 
                WHERE service_date = ? 
                ORDER BY queue_number ASC`,
        [serviceDate],
      );
      return rows;
    } catch (err) {
      error(`QueueEntry.getAllToday error: ${err.message}`);
      throw err;
    }
  }

  // Get next waiting entry
  static async getNextWaiting(serviceDate) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM queue_entries 
                WHERE service_date = ? AND status = 'waiting' 
                ORDER BY queue_number ASC 
                LIMIT 1`,
        [serviceDate],
      );
      return rows[0] || null;
    } catch (err) {
      error(`QueueEntry.getNextWaiting error: ${err.message}`);
      throw err;
    }
  }

  // Update status
  static async updateStatus(id, status, timestampField = null) {
    try {
      let query = "UPDATE queue_entries SET status = ?";
      const params = [status];

      if (timestampField) {
        query += `, ${timestampField} = NOW()`;
      }

      query += " WHERE id = ?";
      params.push(id);

      await db.query(query, params);
    } catch (err) {
      error(`QueueEntry.updateStatus error: ${err.message}`);
      throw err;
    }
  }

  // Get count of waiting entries
  static async getWaitingCount(serviceDate) {
    try {
      const [rows] = await db.query(
        'SELECT COUNT(*) as count FROM queue_entries WHERE service_date = ? AND status = "waiting"',
        [serviceDate],
      );
      return rows[0].count;
    } catch (err) {
      error(`QueueEntry.getWaitingCount error: ${err.message}`);
      throw err;
    }
  }

  // Get statistics for today
  static async getStats(serviceDate) {
    try {
      const [rows] = await db.query(
        `SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'waiting' THEN 1 ELSE 0 END) as waiting,
                    SUM(CASE WHEN status = 'called' THEN 1 ELSE 0 END) as called,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                    SUM(CASE WHEN status = 'skipped' THEN 1 ELSE 0 END) as skipped
                FROM queue_entries 
                WHERE service_date = ?`,
        [serviceDate],
      );
      return rows[0];
    } catch (err) {
      error(`QueueEntry.getStats error: ${err.message}`);
      throw err;
    }
  }

  // src/models/QueueEntry.js

  // Check if phone already has a queue number today
  static async findByPhoneAndDate(phone, serviceDate) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM queue_entries WHERE phone = ? AND service_date = ? AND status != "skipped"',
        [phone, serviceDate],
      );
      return rows[0] || null;
    } catch (err) {
      error(`QueueEntry.findByPhoneAndDate error: ${err.message}`);
      throw err;
    }
  }

  // Check if email already has a queue number today
  static async findByEmailAndDate(email, serviceDate) {
    try {
      if (!email) return null;
      const [rows] = await db.query(
        'SELECT * FROM queue_entries WHERE email = ? AND service_date = ? AND status != "skipped"',
        [email, serviceDate],
      );
      return rows[0] || null;
    } catch (err) {
      error(`QueueEntry.findByEmailAndDate error: ${err.message}`);
      throw err;
    }
  }

  // Count how many times a phone has generated today (including completed)
  static async countByPhoneToday(phone, serviceDate) {
    try {
      const [rows] = await db.query(
        "SELECT COUNT(*) as count FROM queue_entries WHERE phone = ? AND service_date = ?",
        [phone, serviceDate],
      );
      return rows[0].count;
    } catch (err) {
      error(`QueueEntry.countByPhoneToday error: ${err.message}`);
      throw err;
    }
  }
}

module.exports = QueueEntry;
