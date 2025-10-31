const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const AdminModel = require('../models/Admin');
const UserModel = require('../models/User');
const JobModel = require('../models/Job');
const JobApplicationModel = require('../models/JobApplication');
const MessageModel = require('../models/Message');
const { verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Admin Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    let admin;
    if ((process.env.DB_ENGINE || 'mysql') === 'mongo') {
      admin = await AdminModel.findOne({ email }).lean();
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }
    } else {
      const [admins] = await pool.execute(
        'SELECT id, name, email, password FROM admins WHERE email = ?',
        [email]
      );
      if (admins.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }
      admin = admins[0];
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Generate JWT token
    const adminId = admin._id ? String(admin._id) : admin.id;
    const token = jwt.sign(
      { id: adminId, email: admin.email, type: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        admin: {
          id: adminId,
          name: admin.name,
          email: admin.email
        },
        token
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin login failed',
      error: error.message
    });
  }
});

// Get Admin Dashboard Stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    if ((process.env.DB_ENGINE || 'mysql') === 'mongo') {
      const [totalUsers, totalJobs, totalApplications, totalMessages] = await Promise.all([
        UserModel.countDocuments({}),
        JobModel.countDocuments({ status: 'active' }),
        JobApplicationModel.countDocuments({}),
        MessageModel.countDocuments({ sender_type: 'admin' })
      ]);
      const recentApplications = await JobApplicationModel.find({})
        .sort({ applied_at: -1 })
        .limit(10)
        .lean();
      return res.json({ success: true, data: { stats: { totalUsers, totalJobs, activeApplications: totalApplications, messagesSent: totalMessages }, recentApplications } });
    }

    // MySQL fallback
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [jobCount] = await pool.execute('SELECT COUNT(*) as count FROM jobs WHERE status = "active"');
    const [applicationCount] = await pool.execute('SELECT COUNT(*) as count FROM job_applications');
    const [messageCount] = await pool.execute('SELECT COUNT(*) as count FROM messages WHERE sender_type = "admin"');
    const [recentApplications] = await pool.execute(`
      SELECT ja.id, ja.status, ja.applied_at, u.name as user_name, j.title as job_title, j.company
      FROM job_applications ja
      JOIN users u ON ja.user_id = u.id
      JOIN jobs j ON ja.job_id = j.id
      ORDER BY ja.applied_at DESC
      LIMIT 10`);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers: userCount[0].count,
          totalJobs: jobCount[0].count,
          activeApplications: applicationCount[0].count,
          messagesSent: messageCount[0].count
        },
        recentApplications
      }
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin stats',
      error: error.message
    });
  }
});

// Get All Users (Admin)
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    if ((process.env.DB_ENGINE || 'mysql') === 'mongo') {
      const total = await UserModel.countDocuments({});
      const users = await UserModel.find({}, { name: 1, email: 1, phone: 1, skills: 1, createdAt: 1 })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean();
      return res.json({ success: true, data: { users: users.map(u => ({ id: String(u._id), name: u.name, email: u.email, phone: u.phone, skills: u.skills || [], created_at: u.createdAt, applications_count: 0 })), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } } });
    }

    const [users] = await pool.execute(
      `SELECT id, name, email, phone, created_at,
        (SELECT COUNT(*) FROM job_applications WHERE user_id = users.id) as applications_count
       FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const [totalCount] = await pool.execute('SELECT COUNT(*) as count FROM users');

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total: totalCount[0].count,
          totalPages: Math.ceil(totalCount[0].count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Delete User
router.delete('/users/:userId', verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    if ((process.env.DB_ENGINE || 'mysql') === 'mongo') {
      // MongoDB: Delete user and related data
      const user = await UserModel.findByIdAndDelete(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Delete related data
      await JobApplicationModel.deleteMany({ user_id: userId });
      await MessageModel.deleteMany({ 
        $or: [
          { sender_id: userId },
          { recipient_id: userId }
        ]
      });

      res.json({
        success: true,
        message: 'User deleted successfully',
        data: { deletedUser: user.name }
      });
    } else {
      // MySQL: Delete user and related data
      const [users] = await pool.execute(
        'SELECT id, name FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Delete related data first (foreign key constraints)
      await pool.execute('DELETE FROM job_applications WHERE user_id = ?', [userId]);
      await pool.execute('DELETE FROM messages WHERE sender_id = ? OR recipient_id = ?', [userId, userId]);
      await pool.execute('DELETE FROM saved_jobs WHERE user_id = ?', [userId]);
      
      // Delete user
      await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

      res.json({
        success: true,
        message: 'User deleted successfully',
        data: { deletedUser: users[0].name }
      });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

// Verify admin token
router.get('/verify', verifyAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Admin token is valid',
    data: {
      admin: req.admin
    }
  });
});

module.exports = router;