const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const User = require('../models/User');

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Verify admin authentication
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Admin access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    if ((process.env.DB_ENGINE || 'mysql') === 'mongo') {
      const adminDoc = await Admin.findById(decoded.id).select('name email');
      if (!adminDoc) {
        return res.status(401).json({ success: false, message: 'Admin not found.' });
      }
      req.admin = { id: String(adminDoc._id), email: adminDoc.email, name: adminDoc.name };
    } else {
      const [admins] = await pool.execute(
        'SELECT id, email, name FROM admins WHERE id = ?',
        [decoded.id]
      );
      if (admins.length === 0) {
        return res.status(401).json({ success: false, message: 'Admin not found.' });
      }
      req.admin = { id: decoded.id, email: decoded.email, name: admins[0].name };
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid admin token.'
    });
  }
};

// Verify user authentication
const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'User access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. User privileges required.'
      });
    }

    if ((process.env.DB_ENGINE || 'mysql') === 'mongo') {
      const userDoc = await User.findById(decoded.id).select('name email');
      if (!userDoc) {
        return res.status(401).json({ success: false, message: 'User not found.' });
      }
      req.user = { id: String(userDoc._id), email: userDoc.email, name: userDoc.name };
    } else {
      const [users] = await pool.execute(
        'SELECT id, email, name FROM users WHERE id = ?',
        [decoded.id]
      );
      if (users.length === 0) {
        return res.status(401).json({ success: false, message: 'User not found.' });
      }
      req.user = { id: decoded.id, email: decoded.email, name: users[0].name };
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid user token.'
    });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyUser
};