// src/services/emailService.js
const nodemailer = require('nodemailer');
const { info, error, success } = require('../utils/logger');

class EmailService {
    constructor() {
        // Create transporter with explicit configuration
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // false for port 587 (TLS/STARTTLS)
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            // Optional: Add timeout settings
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
            // Optional: Add debug info for troubleshooting
            debug: false, // Set to true for detailed logs
            logger: false // Set to true for detailed logs
        });

        // Verify connection on startup
        this.verifyConnection();
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            success('Email transporter verified successfully');
        } catch (err) {
            error(`Email transporter verification failed: ${err.message}`);
            // Don't throw - allow the app to continue
        }
    }

    // Send queue number email
    async sendQueueNumber(email, name, queueNumber, peopleAhead) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your Queue Number',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #4CAF50;">Queue Management System</h2>
                        <h3>Hello ${name}!</h3>
                        <p>Your queue number is:</p>
                        <h1 style="font-size: 48px; color: #2196F3; text-align: center; padding: 20px; background: #f0f0f0; border-radius: 10px;">
                            ${queueNumber}
                        </h1>
                        <p><strong>People ahead of you:</strong> ${peopleAhead}</p>
                        <p><strong>Status:</strong> Waiting</p>
                        <p>Please arrive at the center when your number is called.</p>
                        <p style="margin-top: 20px; color: #888; font-size: 12px;">
                            This is an automated message. Please do not reply.
                        </p>
                    </div>
                `
            };

            const result = await this.transporter.sendMail(mailOptions);
            success(`Email sent to ${email} for queue #${queueNumber}`);
            return true;
        } catch (err) {
            error(`Email send failed: ${err.message}`);
            return false;
        }
    }

    // Send notification when called
    async sendCalledNotification(email, name, queueNumber) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `Queue Number ${queueNumber} - Your Turn!`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #FF9800;">Queue Management System</h2>
                        <h3>Hello ${name}!</h3>
                        <p>Your queue number <strong>${queueNumber}</strong> has been called!</p>
                        <div style="padding: 20px; background: #fff3cd; border-radius: 10px; text-align: center;">
                            <p style="font-size: 20px;">Please proceed to the service desk.</p>
                        </div>
                        <p style="margin-top: 20px; color: #888; font-size: 12px;">
                            This is an automated message. Please do not reply.
                        </p>
                    </div>
                `
            };

            const result = await this.transporter.sendMail(mailOptions);
            success(`Called notification sent to ${email} for queue #${queueNumber}`);
            return true;
        } catch (err) {
            error(`Email send failed: ${err.message}`);
            return false;
        }
    }
}

module.exports = new EmailService();