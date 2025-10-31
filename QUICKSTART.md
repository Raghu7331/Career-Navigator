# 🚀 Career Navigator - Quick Start Card

## ⚡ Quick Commands

### First Time Setup
```bash
# 1. Install backend
cd backend
npm install

# 2. Install frontend
cd ../frontend
npm install
```

### Daily Development
```bash
# Terminal 1: Start backend
cd backend
node server.js

# Terminal 2: Start frontend
cd frontend
npm run dev
```

## 🌐 Access URLs
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Admin Login:** http://localhost:5173/admin-login

## 🔐 Quick Login

### Admin
- Email: `admin@careernavigator.com`
- Password: `SecureAdmin2025!`

### Test Users (All use password: `Test123!`)
- john@test.com
- jane@test.com
- mike@test.com
- sarah@test.com
- david@test.com

## 📚 Documentation Files
1. **README.md** - Complete guide (READ THIS FIRST!)
2. **CREDENTIALS.md** - All test credentials
3. **DEPLOYMENT_GUIDE.md** - Deploy to production

## 🐛 Common Issues

**Backend won't start:**
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <process-id> /F
```

**MongoDB not running:**
```bash
mongod
```

**Need fresh start:**
```bash
# Backend
cd backend
npm install
node scripts/init-admin.js
node server.js

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## ✅ Health Check
```bash
# Test backend
curl http://localhost:5000/api/admin/login

# Test frontend
# Visit http://localhost:5173 in browser
```

---
**For detailed instructions, see README.md**
