const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();
const { connectMongo } = require('./config/mongo');
const AdminModel = require('./models/Admin');

// Import database and routes
const { testConnection, initializeDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const jobRoutes = require('./routes/jobs');
const recommendationRoutes = require('./routes/recommendations');
const messageRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/upload');
const emailRoutes = require('./routes/email');
const enhancedEmailRoutes = require('./routes/enhancedEmail');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
// Allow all common frontend dev server ports for development and production frontend
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ];
    
    // Allow all Render.com subdomains
    if (origin.endsWith('.onrender.com') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log('⚠️ CORS blocked origin:', origin);
    return callback(null, true); // For development, allow all. In production, use: callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (for uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root endpoint
app.get('/', (req, res) => {
  res.send('MongoDB Connected Successfully 🚀');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Career Navigator Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/enhanced-email', enhancedEmailRoutes);

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Career Navigator API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        updateProfile: 'PUT /api/auth/profile'
      },
      admin: {
        login: 'POST /api/admin/login',
        stats: 'GET /api/admin/stats',
        users: 'GET /api/admin/users'
      },
      jobs: {
        getAllJobs: 'GET /api/jobs',
        getJob: 'GET /api/jobs/:id',
        createJob: 'POST /api/jobs (admin)',
        updateJob: 'PUT /api/jobs/:id (admin)',
        deleteJob: 'DELETE /api/jobs/:id (admin)',
        applyJob: 'POST /api/jobs/:id/apply (user)',
        myApplications: 'GET /api/jobs/applications/my (user)'
      },
      recommendations: {
        getRecommendations: 'GET /api/recommendations (user)',
        getBySkills: 'GET /api/recommendations/by-skills (user)',
        saveJob: 'POST /api/recommendations/:jobId/save (user)',
        getSavedJobs: 'GET /api/recommendations/saved/my (user)'
      },
      messages: {
        sendMessage: 'POST /api/messages/send (admin)',
        getMyMessages: 'GET /api/messages/my (user)',
        markAsRead: 'PATCH /api/messages/:messageId/read (user)',
        getSentMessages: 'GET /api/messages/sent (admin)',
        getUsersBySkills: 'GET /api/messages/users-by-skills (admin)'
      },
      upload: {
        uploadResume: 'POST /api/upload/upload (user)',
        getMyResume: 'GET /api/upload/my (user)',
        downloadResume: 'GET /api/upload/download/:fileId (user)',
        deleteResume: 'DELETE /api/upload/:fileId (user)'
      }
    },
    documentation: 'Visit /api for endpoint documentation'
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: '/api'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.message
    });
  }
  
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🚀 Starting Career Navigator Backend...');

    const engine = (process.env.DB_ENGINE || 'mysql').toLowerCase();
    if (engine === 'mongo') {
      await connectMongo(process.env.MONGODB_URI);
      // Ensure default admin exists
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@careernavigator.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'SecureAdmin2025!';
      const existing = await AdminModel.findOne({ email: adminEmail });
      if (!existing) {
        const bcrypt = require('bcryptjs');
        const hash = await bcrypt.hash(adminPassword, 10);
        await AdminModel.create({ email: adminEmail, password: hash, name: 'Admin' });
        console.log('👤 Default admin created for MongoDB');
      }
    } else {
      // MySQL path
      const dbConnected = await testConnection();
      if (!dbConnected) {
        throw new Error('Database connection failed');
      }
      await initializeDatabase();
    }

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🗄️ DB Engine: ${process.env.DB_ENGINE || 'mysql'}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;