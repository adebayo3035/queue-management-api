# queue-management-api
Queue Management API for service centers

# Queue Management API

## Overview
A simple REST API for managing queues at service centers, registration offices, and organizations. Users can generate queue numbers and check their position. Admins can manage the queue by calling next numbers and completing services.

## Features
- Generate queue number (Public)
- Check queue position (Public)
- View today's statistics (Public)
- Admin authentication with JWT
- Admin: View waiting list
- Admin: Call next person
- Admin: Complete service
- Admin: Skip no-show
- Admin: Reset daily queue
- Admin: Update daily capacity
- Email notifications (Optional)
- File logging with console output

## Technologies
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT
- **Validation:** Joi
- **Logging:** Custom file logger
- **Email:** Nodemailer

## Setup Instructions

### 1. Clone Repository
git clone https://github.com/adebayo3035/queue-management-api.git
cd queue-management-api

### 2. Install Dependencies
npm install

### 3. Configure Environments
Create .env file

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=queue_db
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

### 4. Setup Database
mysql -u root -p < src/config/init.sql
node src/config/createAdmin.js

### 5. Start Server
npm run dev

### 6. Test API
node src/routes/testRoutes.js

API Endpoints

Public Routes (No Authentication)
Method	    Endpoint	                    Description
POST	    /api/queue/generate	            Generate queue number
GET	        /api/queue/position/:number	    Check position
GET	        /api/queue/today	            Today's statistics
POST	    /api/auth/register	            Register New Admin
POST	    /api/auth/login	                Admin Login


Protected Routes (JWT Authentication Required)
Authorization: Bearer YOUR_TOKEN_HERE

Method	            Endpoint	                        Description
GET	                /api/admin/queue/waiting	        View waiting list
GET	                /api/admin/queue/all	            View all entries
POST	            /api/admin/queue/next	            Call next person
PUT	                /api/admin/queue/complete/:number	Complete service
PUT	                /api/admin/queue/skip/:number	    Skip no-show
POST	            /api/admin/queue/reset	            Reset daily queue
PUT	                /api/admin/settings/capacity	    Update capacity

Logging
Logs are stored in logs/ folder with daily files:


Common HTTP status codes:

200 - Success

201 - Created

400 - Bad request (validation error)

401 - Unauthorized (missing/invalid token)

404 - Not found

500 - Server error

Contributing
Fork the repository

Create feature branch

Commit changes

Push to branch

Create Pull Request

License
This project is for educational purposes as a capstone project.

Author
Abdul-Rahmon Adebayo
Matric Number: BAD/2026/TC-7/0062



---

## Step 7: Commit Everything

```bash
git add .
git commit -m "Added email notifications and API documentation"
git push origin dev