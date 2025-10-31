const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyAdmin } = require('../middleware/auth');
const emailService = require('../services/emailService');
const { pool } = require('../config/database');
const EmailLog = require('../models/EmailLog');

const router = express.Router();

// Test Email Service
router.get('/test', verifyAdmin, async (req, res) => {
  try {
    const result = await emailService.testConnection();
    res.json({
      success: result.success,
      message: result.message,
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email service test failed',
      error: error.message
    });
  }
});

// Send Email to Specific User
router.post('/send-to-user', verifyAdmin, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('messageType').optional().isIn(['general', 'urgent', 'announcement', 'guidance']).withMessage('Invalid message type')
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

    const { email, subject, message, messageType = 'general' } = req.body;

    // Send email
    const result = await emailService.sendCustomMessage({
      to: email,
      subject,
      message,
      messageType
    });

    if (result.success) {
      // Log the email in database for record keeping
      try {
        await pool.execute(
          `INSERT INTO email_logs (admin_id, recipient_email, subject, message, message_type, status, sent_at)
           VALUES (?, ?, ?, ?, ?, 'sent', NOW())`,
          [req.admin.id, email, subject, message, messageType]
        );
      } catch (dbError) {
        console.log('Failed to log email in database:', dbError.message);
        // Continue even if logging fails
      }

      res.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId,
        previewURL: result.previewURL
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({
      success: false,
      message: 'Email sending failed',
      error: error.message
    });
  }
});

// Send Email to All Users
router.post('/send-to-all', verifyAdmin, [
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('messageType').optional().isIn(['general', 'urgent', 'announcement', 'guidance']).withMessage('Invalid message type')
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

    const { subject, message, messageType = 'general' } = req.body;

    // Get all user emails
    const [users] = await pool.execute('SELECT email, name FROM users WHERE email IS NOT NULL');

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found to send emails to'
      });
    }

    const results = [];
    const failedEmails = [];

    // Send emails to all users
    for (const user of users) {
      try {
        const result = await emailService.sendCustomMessage({
          to: user.email,
          subject,
          message,
          messageType
        });

        if (result.success) {
          results.push({
            email: user.email,
            status: 'sent',
            messageId: result.messageId
          });

          // Log successful email
          try {
            await pool.execute(
              `INSERT INTO email_logs (admin_id, recipient_email, subject, message, message_type, status, sent_at)
               VALUES (?, ?, ?, ?, ?, 'sent', NOW())`,
              [req.admin.id, user.email, subject, message, messageType]
            );
          } catch (dbError) {
            console.log('Failed to log email for', user.email, dbError.message);
          }
        } else {
          failedEmails.push({
            email: user.email,
            error: result.error
          });
        }
      } catch (emailError) {
        failedEmails.push({
          email: user.email,
          error: emailError.message
        });
      }
    }

    res.json({
      success: true,
      message: `Emails sent to ${results.length} users${failedEmails.length > 0 ? `, ${failedEmails.length} failed` : ''}`,
      results: {
        sent: results.length,
        failed: failedEmails.length,
        details: results,
        failures: failedEmails
      }
    });

  } catch (error) {
    console.error('Bulk email error:', error);
    res.status(500).json({
      success: false,
      message: 'Bulk email sending failed',
      error: error.message
    });
  }
});

// Send Job Alert Email
router.post('/job-alert', verifyAdmin, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('jobTitle').notEmpty().withMessage('Job title is required'),
  body('companyName').notEmpty().withMessage('Company name is required'),
  body('jobDescription').notEmpty().withMessage('Job description is required'),
  body('applyLink').optional().isURL().withMessage('Apply link must be a valid URL')
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

    const { email, jobTitle, companyName, jobDescription, applyLink } = req.body;

    const result = await emailService.sendJobAlert({
      to: email,
      jobTitle,
      companyName,
      jobDescription,
      applyLink
    });

    if (result.success) {
      // Log job alert email
      try {
        await pool.execute(
          `INSERT INTO email_logs (admin_id, recipient_email, subject, message, message_type, status, sent_at)
           VALUES (?, ?, ?, ?, 'job_alert', 'sent', NOW())`,
          [req.admin.id, email, `Job Alert: ${jobTitle}`, jobDescription]
        );
      } catch (dbError) {
        console.log('Failed to log job alert email:', dbError.message);
      }

      res.json({
        success: true,
        message: 'Job alert email sent successfully',
        messageId: result.messageId,
        previewURL: result.previewURL
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send job alert email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Job alert email error:', error);
    res.status(500).json({
      success: false,
      message: 'Job alert email sending failed',
      error: error.message
    });
  }
});

// Get Email Logs
router.get('/logs', verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    if ((process.env.DB_ENGINE || 'mysql') === 'mongo') {
      const query = { adminId: req.admin.id };
      const total = await EmailLog.countDocuments(query);
      const logs = await EmailLog.find(query)
        .sort({ sent_at: -1 })
        .skip(offset)
        .limit(limit)
        .lean();

      return res.json({
        success: true,
        data: {
          logs: logs.map(l => ({ id: String(l._id), recipient_email: l.recipient_email, subject: l.subject, message_type: l.message_type, status: l.status, error_message: l.error_message, sent_at: l.sent_at })),
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        }
      });
    }

    // MySQL fallback
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const safeOffset = Math.max(0, offset);
    const [logs] = await pool.query(
      `SELECT id, recipient_email, subject, message_type, status, error_message, sent_at
       FROM email_logs WHERE admin_id = ? ORDER BY sent_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`,
      [req.admin.id]
    );
    const [totalCount] = await pool.execute('SELECT COUNT(*) as count FROM email_logs WHERE admin_id = ?', [req.admin.id]);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total: totalCount[0].count,
          totalPages: Math.ceil(totalCount[0].count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get email logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email logs',
      error: error.message
    });
  }
});

// Get All Users for Email Selection
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email FROM users WHERE email IS NOT NULL ORDER BY name'
    );

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users for email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

module.exports = router;