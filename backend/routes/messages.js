const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { verifyAdmin, verifyUser } = require('../middleware/auth');

const router = express.Router();

// Send Message/Announcement (Admin only)
router.post('/send', verifyAdmin, [
  body('content').notEmpty().withMessage('Message content is required'),
  body('recipient_type').isIn(['all_users', 'user']).withMessage('Invalid recipient type')
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

    const {
      subject, content, recipient_type, recipient_id, 
      message_type, target_skills
    } = req.body;

    const adminId = req.admin.id;

    if (recipient_type === 'user' && !recipient_id) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID is required for user messages'
      });
    }

    // Insert message
    const [result] = await pool.execute(
      `INSERT INTO messages 
      (sender_id, sender_type, recipient_id, recipient_type, subject, 
       content, message_type, target_skills) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        adminId, 'admin', recipient_id || null, recipient_type,
        subject, content, message_type || 'general',
        JSON.stringify(target_skills || [])
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        messageId: result.insertId
      }
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// Get User Messages
router.get('/my', verifyUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get user skills for targeted messages
    const [users] = await pool.execute(
      'SELECT skills FROM users WHERE id = ?',
      [userId]
    );

    const userSkills = users[0]?.skills ? JSON.parse(users[0].skills) : [];

    // Get messages for this user (direct messages + announcements + skill-targeted)
    const [messages] = await pool.execute(
      `SELECT 
        m.id, m.subject, m.content, m.message_type, m.target_skills,
        m.is_read, m.created_at,
        a.name as sender_name
      FROM messages m
      LEFT JOIN admins a ON m.sender_id = a.id
      WHERE 
        (m.recipient_type = 'user' AND m.recipient_id = ?) OR
        (m.recipient_type = 'all_users') OR
        (m.recipient_type = 'all_users' AND JSON_LENGTH(m.target_skills) > 0)
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    // Filter skill-targeted messages
    const filteredMessages = messages.filter(message => {
      if (message.recipient_type === 'all_users' && message.target_skills) {
        const targetSkills = JSON.parse(message.target_skills || '[]');
        if (targetSkills.length === 0) return true; // General announcement
        
        // Check if user has any of the target skills
        return targetSkills.some(targetSkill =>
          userSkills.some(userSkill =>
            userSkill.toLowerCase().includes(targetSkill.toLowerCase()) ||
            targetSkill.toLowerCase().includes(userSkill.toLowerCase())
          )
        );
      }
      return true;
    });

    // Get total count for pagination
    const [totalCount] = await pool.execute(
      `SELECT COUNT(*) as count FROM messages 
      WHERE 
        (recipient_type = 'user' AND recipient_id = ?) OR
        (recipient_type = 'all_users')`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        messages: filteredMessages,
        pagination: {
          page,
          limit,
          total: totalCount[0].count,
          totalPages: Math.ceil(totalCount[0].count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get user messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

// Mark Message as Read
router.patch('/:messageId/read', verifyUser, async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user.id;

    // Verify user can access this message
    const [messages] = await pool.execute(
      `SELECT id FROM messages 
      WHERE id = ? AND (
        (recipient_type = 'user' AND recipient_id = ?) OR
        recipient_type = 'all_users'
      )`,
      [messageId, userId]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // For now, we'll just return success since marking read for broadcast messages
    // would require a separate user_message_reads table
    res.json({
      success: true,
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark message as read',
      error: error.message
    });
  }
});

// Get Admin Sent Messages
router.get('/sent', verifyAdmin, async (req, res) => {
  try {
    const adminId = parseInt(req.admin.id);
    
    // Get messages sent by this admin
    const [messages] = await pool.execute(
      `SELECT id, subject, content, recipient_type, recipient_id, 
              message_type, target_skills, created_at
       FROM messages 
       WHERE sender_id = ? AND sender_type = 'admin'
       ORDER BY created_at DESC`,
      [adminId]
    );

    // Get total count for pagination
    const [totalCount] = await pool.execute(
      `SELECT COUNT(*) as count 
       FROM messages 
       WHERE sender_id = ? AND sender_type = 'admin'`,
      [adminId]
    );

    // Parse target_skills JSON and add recipient names if needed
    const messagesWithDetails = messages.map(message => ({
      ...message,
      target_skills: message.target_skills ? JSON.parse(message.target_skills) : [],
      recipient_name: message.recipient_type === 'all_users' ? 'All Users' : null
    }));

    res.json({
      success: true,
      data: {
        messages: messagesWithDetails,
        pagination: {
          total: totalCount[0].count
        }
      }
    });

  } catch (error) {
    console.error('Get sent messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sent messages',
      error: error.message
    });
  }
});

// Get Users with Skills (for targeted messaging)
router.get('/users-by-skills', verifyAdmin, async (req, res) => {
  try {
    const { skills } = req.query;
    
    if (!skills) {
      return res.status(400).json({
        success: false,
        message: 'Skills parameter is required'
      });
    }

    const skillsArray = skills.split(',').map(skill => skill.trim());

    const [users] = await pool.execute(
      'SELECT id, name, email, skills FROM users WHERE skills IS NOT NULL'
    );

    const matchingUsers = users.filter(user => {
      const userSkills = user.skills ? JSON.parse(user.skills) : [];
      return skillsArray.some(targetSkill =>
        userSkills.some(userSkill =>
          userSkill.toLowerCase().includes(targetSkill.toLowerCase()) ||
          targetSkill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
    });

    res.json({
      success: true,
      data: {
        users: matchingUsers.map(user => ({
          ...user,
          skills: user.skills ? JSON.parse(user.skills) : []
        })),
        searchSkills: skillsArray,
        totalMatches: matchingUsers.length
      }
    });

  } catch (error) {
    console.error('Get users by skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users by skills',
      error: error.message
    });
  }
});

module.exports = router;