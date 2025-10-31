# 🚀 Career Navigator

A comprehensive full-stack career guidance and job recommendation platform built with **React**, **Node.js**, **Express**, and **MongoDB**.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Test Credentials](#test-credentials)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### 👤 User Features
- ✅ User registration and authentication
- ✅ Personalized dashboard with job recommendations
- ✅ Smart job matching based on skills
- ✅ Resume upload and profile management
- ✅ Browse and search job opportunities
- ✅ Real-time messaging system
- ✅ Email preferences management

### 👨‍💼 Admin Features
- ✅ Secure admin dashboard
- ✅ User management (view, delete)
- ✅ Job posting and management (create, edit, delete)
- ✅ Analytics and insights dashboard
- ✅ Email notification system
- ✅ Message management
- ✅ System-wide statistics

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File uploads

### Security & Additional
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting
- **Express Validator** - Input validation

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Package manager
- **Git** (optional) - Version control

---

## 🚀 Installation

### 1. Clone or Download the Project

```bash
# If using Git
git clone <repository-url>
cd "Last Hop"

# Or download and extract the ZIP file
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Environment Variables:**
   The `.env` file is already configured. Here are the key settings:

   ```env
   # Database
   DB_ENGINE=mongo
   MONGODB_URI=mongodb://127.0.0.1:27017/career_navigator

   # JWT
   JWT_SECRET=career_navigator_super_secure_jwt_secret_key_2025_minimum_32_chars
   JWT_EXPIRES_IN=24h

   # Admin
   ADMIN_EMAIL=admin@careernavigator.com
   ADMIN_PASSWORD=SecureAdmin2025!

   # Server
   PORT=5000
   NODE_ENV=development

   # Email (Console mode for testing)
   EMAIL_SERVICE=console
   EMAIL_FROM=Career Navigator <noreply@careernavigator.com>
   ```

3. **Initialize Database:**
   ```bash
   # The database will auto-initialize on first run
   # Admin account is created automatically
   # Test users are included
   ```

### Frontend Configuration

Frontend is configured to connect to `http://localhost:5000` by default. No additional configuration needed for local development.

---

## 🎯 Running the Application

### Start MongoDB (if not running as service)

```bash
# Windows
mongod

# macOS/Linux
sudo mongod
```

### Start Backend Server

```bash
cd backend
node server.js
```

✅ Backend runs on: **http://localhost:5000**

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

✅ Frontend runs on: **http://localhost:5173**

### Access the Application

- **User Portal:** http://localhost:5173
- **Admin Portal:** http://localhost:5173/admin-login

---

## 📁 Project Structure

```
Last Hop/
├── backend/
│   ├── config/
│   │   ├── database.js       # MySQL config (legacy)
│   │   └── mongo.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.js           # JWT authentication
│   ├── models/
│   │   ├── Admin.js          # Admin model
│   │   ├── User.js           # User model
│   │   ├── Job.js            # Job model
│   │   ├── Message.js        # Message model
│   │   ├── EmailLog.js       # Email log model
│   │   └── ...
│   ├── routes/
│   │   ├── auth.js           # User authentication
│   │   ├── admin.js          # Admin routes
│   │   ├── jobs.js           # Job routes
│   │   ├── messages.js       # Messaging routes
│   │   ├── email.js          # Email routes
│   │   └── ...
│   ├── scripts/
│   │   ├── init-admin.js     # Initialize admin
│   │   ├── create-test-users.js
│   │   └── ...
│   ├── services/
│   │   ├── emailService.js
│   │   └── enhancedEmailService.js
│   ├── templates/
│   │   └── emailTemplates.js
│   ├── uploads/              # File uploads directory
│   ├── .env                  # Environment variables
│   ├── server.js             # Main server file
│   └── package.json
│
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/          # Images, icons
│   │   ├── pages/           # React pages/components
│   │   │   ├── login.jsx
│   │   │   ├── signup.jsx
│   │   │   ├── dashboard.jsx
│   │   │   ├── adminlogin.jsx
│   │   │   ├── admindashboard.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.js       # API service
│   │   ├── styles/          # CSS files
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── vite.config.js       # Vite configuration
│   └── package.json
│
├── CREDENTIALS.md           # Test credentials
├── DEPLOYMENT_GUIDE.md      # Deployment instructions
└── README.md                # This file
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### User Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+1234567890",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

### Admin Endpoints

#### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@careernavigator.com",
  "password": "SecureAdmin2025!"
}
```

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin-token>
```

#### Delete User
```http
DELETE /api/admin/users/:userId
Authorization: Bearer <admin-token>
```

#### Dashboard Stats
```http
GET /api/admin/dashboard/stats
Authorization: Bearer <admin-token>
```

### Job Endpoints

#### Get All Jobs
```http
GET /api/jobs
```

#### Get Job by ID
```http
GET /api/jobs/:id
```

#### Create Job (Admin)
```http
POST /api/jobs
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "location": "Remote",
  "type": "Full-time",
  "salary": "$80k-$120k",
  "description": "...",
  "requirements": ["React", "Node.js"],
  "skills": ["JavaScript", "MongoDB"]
}
```

#### Update Job (Admin)
```http
PUT /api/jobs/:id
Authorization: Bearer <admin-token>
```

#### Delete Job (Admin)
```http
DELETE /api/jobs/:id
Authorization: Bearer <admin-token>
```

### Email Endpoints

#### Send Email Notification (Admin)
```http
POST /api/enhanced-email/send-notification
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "email": "user@example.com",
  "subject": "Job Alert",
  "message": "New job posted!"
}
```

#### Get Email Stats (Admin)
```http
GET /api/enhanced-email/stats
Authorization: Bearer <admin-token>
```

### Message Endpoints

#### Send Message
```http
POST /api/messages/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientId": "user-id",
  "content": "Hello!"
}
```

#### Get User Messages
```http
GET /api/messages/user/:userId
Authorization: Bearer <token>
```

---

## 🔐 Test Credentials

### User Accounts
All test users have the password: **Test123!**

| Name | Email | Skills |
|------|-------|--------|
| John Doe | john@test.com | JavaScript, React, Node.js, MongoDB |
| Jane Smith | jane@test.com | Python, Django, PostgreSQL, AWS |
| Mike Johnson | mike@test.com | Java, Spring Boot, MySQL, Docker |
| Sarah Williams | sarah@test.com | C#, .NET, Azure, SQL Server |
| David Brown | david@test.com | PHP, Laravel, PostgreSQL, Redis |

### Admin Account
- **Email:** admin@careernavigator.com
- **Password:** SecureAdmin2025!

### Quick Login Test

**User Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Test123!"}'
```

**Admin Login:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@careernavigator.com","password":"SecureAdmin2025!"}'
```

---

## 🌐 Deployment

### Production Deployment Options

#### Option 1: Render + Vercel (Recommended - FREE)

**Backend on Render:**
1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect your repository
4. Configure environment variables
5. Deploy

**Frontend on Vercel:**
1. Create account at [vercel.com](https://vercel.com)
2. Import project
3. Set build command: `npm run build`
4. Deploy

**Database on MongoDB Atlas:**
1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Get connection string
4. Update MONGODB_URI in backend

#### Option 2: Railway (All-in-One)

1. Create account at [railway.app](https://railway.app)
2. Create new project
3. Add MongoDB service
4. Deploy backend and frontend
5. Configure environment variables

### Environment Variables for Production

```env
# Production MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/career_navigator

# Strong JWT Secret (generate new)
JWT_SECRET=<generate-64-char-random-string>

# Production Mode
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com

# Email Service (configure for production)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Pre-Deployment Checklist

- [ ] Update MONGODB_URI to MongoDB Atlas
- [ ] Generate new JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Configure CORS with production domain
- [ ] Set up email service (optional)
- [ ] Build frontend: `npm run build`
- [ ] Test all API endpoints
- [ ] Verify database connection

**Detailed deployment instructions:** See `DEPLOYMENT_GUIDE.md`

---

## 🐛 Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <process-id> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

**MongoDB connection failed:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB service is active

**JWT errors:**
- Ensure JWT_SECRET is at least 32 characters
- Check token expiration time
- Verify token format in requests

### Frontend Issues

**API calls failing:**
- Check backend is running on port 5000
- Verify API_BASE_URL in `src/services/api.js`
- Check CORS configuration

**Port 5173 already in use:**
```bash
# Kill the process and restart
npm run dev
```

**Build fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Issues

**Users not found:**
```bash
# Run test user creation script
cd backend
node scripts/create-test-users.js
```

**Admin not working:**
```bash
# Reinitialize admin
cd backend
node scripts/init-admin.js
```

---

## 📝 Development Scripts

### Backend Scripts

```bash
# Start server
npm start
# or
node server.js

# Initialize admin
node scripts/init-admin.js

# Create test users
node scripts/create-test-users.js

# Check system
node scripts/verify-database-connections.js
```

### Frontend Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Career Navigator Team**

---

## 🙏 Acknowledgments

- React and Vite teams for excellent tooling
- MongoDB for robust database solution
- Express.js community
- All open-source contributors

---

## 📞 Support

For issues and questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review `DEPLOYMENT_GUIDE.md` for deployment help
- Check `CREDENTIALS.md` for test credentials

---

## 🎯 Quick Start Summary

```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Start MongoDB
mongod

# 3. Start backend (in new terminal)
cd backend
node server.js

# 4. Start frontend (in new terminal)
cd frontend
npm run dev

# 5. Access application
# User: http://localhost:5173
# Admin: http://localhost:5173/admin-login
```

---

**Last Updated:** October 31, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
