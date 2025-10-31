const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyAdmin, verifyUser } = require('../middleware/auth');
const enhancedEmailService = require('../services/enhancedEmailService');
const { EmailPreferences } = require('../services/emailHelpers');
const { pool } = require('../config/database');

const router = express.Router();

// Test Enhanced Email Service
router.get('/test-enhanced', verifyAdmin, async (req, res) => {
  try {
    const result = await enhancedEmailService.testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email service test failed',
      error: error.message
    });
  }
});

// Send Welcome Email
router.post('/send-welcome', verifyAdmin, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('userName').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, userName } = req.body;
    
    const result = await enhancedEmailService.sendWelcomeEmail({
      email,
      userName
    });

    res.json(result);
  } catch (error) {
    console.error('Send welcome email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send welcome email',
      error: error.message
    });
  }
});

// Send Job Alert
router.post('/send-job-alert', verifyAdmin, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('jobTitle').notEmpty().withMessage('Job title is required'),
  body('companyName').notEmpty().withMessage('Company name is required'),
  body('jobDescription').notEmpty().withMessage('Job description is required'),
  body('applyLink').isURL().withMessage('Valid apply link is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, jobTitle, companyName, jobDescription, applyLink, requirements, salary, location } = req.body;
    
    // Get user ID
    const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    const userId = users.length > 0 ? users[0].id : null;
    
    const result = await enhancedEmailService.sendJobAlert({
      email,
      userId,
      jobTitle,
      companyName,
      jobDescription,
      applyLink,
      requirements,
      salary,
      location,
      adminId: req.admin.id
    });

    res.json(result);
  } catch (error) {
    console.error('Send job alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send job alert',
      error: error.message
    });
  }
});

// Send Career Guidance
router.post('/send-guidance', verifyAdmin, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Guidance message is required'),
  body('tips').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, message, tips, userName } = req.body;
    
    // Get user ID
    const [users] = await pool.execute('SELECT id, name FROM users WHERE email = ?', [email]);
    const userId = users.length > 0 ? users[0].id : null;
    const actualUserName = userName || (users.length > 0 ? users[0].name : 'Career Explorer');
    
    const result = await enhancedEmailService.sendCareerGuidance({
      email,
      userId,
      userName: actualUserName,
      message,
      tips,
      adminId: req.admin.id
    });

    res.json(result);
  } catch (error) {
    console.error('Send career guidance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send career guidance',
      error: error.message
    });
  }
});

// Send Notification
router.post('/send-notification', verifyAdmin, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, subject, message, userName } = req.body;
    
    // Get user ID
    const [users] = await pool.execute('SELECT id, name FROM users WHERE email = ?', [email]);
    const userId = users.length > 0 ? users[0].id : null;
    const actualUserName = userName || (users.length > 0 ? users[0].name : 'Career Explorer');
    
    const result = await enhancedEmailService.sendNotification({
      email,
      userId,
      userName: actualUserName,
      subject,
      message,
      adminId: req.admin.id
    });

    res.json(result);
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
});

// Send to All Users
router.post('/send-to-all', verifyAdmin, [
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('messageType').isIn(['welcome', 'job_alert', 'career_guidance', 'notification']).withMessage('Valid message type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { subject, message, messageType } = req.body;
    
    // Get all users
    const [users] = await pool.execute('SELECT id, name, email FROM users');
    
    if (users.length === 0) {
      return res.json({
        success: false,
        message: 'No users found to send emails to'
      });
    }

    // Send based on message type
    let results = [];
    
    if (messageType === 'notification') {
      results = await enhancedEmailService.sendToMultipleUsers({
        subject,
        message,
        messageType,
        adminId: req.admin.id
      }, users);
    }
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `Emails sent to ${successful} users, ${failed} failed`,
      results: {
        total: users.length,
        successful,
        failed,
        details: results
      }
    });

  } catch (error) {
    console.error('Send to all error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send emails to all users',
      error: error.message
    });
  }
});

// Get Email Statistics
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const stats = await enhancedEmailService.getEmailStats(req.admin.id);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get email stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get email statistics',
      error: error.message
    });
  }
});

// User Email Preferences Routes

// Get User Preferences
router.get('/preferences', verifyUser, async (req, res) => {
  try {
    const preferences = await EmailPreferences.getUserPreferences(req.user.id);
    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get email preferences',
      error: error.message
    });
  }
});

// Update User Preferences
router.put('/preferences', verifyUser, [
  body('job_alerts').isBoolean(),
  body('career_guidance').isBoolean(),
  body('notifications').isBoolean(),
  body('marketing').isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { job_alerts, career_guidance, notifications, marketing } = req.body;
    
    const success = await EmailPreferences.updateUserPreferences(req.user.id, {
      job_alerts,
      career_guidance,
      notifications,
      marketing
    });

    if (success) {
      res.json({
        success: true,
        message: 'Email preferences updated successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update email preferences'
      });
    }
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update email preferences',
      error: error.message
    });
  }
});

// Unsubscribe (public endpoint)
router.post('/unsubscribe', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('token').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, token } = req.body;
    
    const success = await EmailPreferences.unsubscribeUser(email, token);

    if (success) {
      res.json({
        success: true,
        message: 'Successfully unsubscribed from all email communications'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to unsubscribe. Email not found or invalid token.'
      });
    }
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process unsubscribe request',
      error: error.message
    });
  }
});

module.exports = router;