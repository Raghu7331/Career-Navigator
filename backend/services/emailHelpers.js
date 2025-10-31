const emailTemplates = require('../templates/emailTemplates');
const { pool } = require('../config/database');
const EmailLogModel = require('../models/EmailLog');

class EmailValidator {
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateEmailData(data) {
    const errors = [];
    
    if (!data.to || !this.isValidEmail(data.to)) {
      errors.push('Valid recipient email is required');
    }
    
    if (!data.subject || data.subject.trim().length === 0) {
      errors.push('Email subject is required');
    }
    
    if (data.subject && data.subject.length > 200) {
      errors.push('Email subject must be less than 200 characters');
    }
    
    if (!data.text && !data.html) {
      errors.push('Email content (text or html) is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static sanitizeEmailData(data) {
    return {
      to: data.to?.trim().toLowerCase(),
      subject: data.subject?.trim(),
      text: data.text?.trim(),
      html: data.html?.trim(),
      attachments: Array.isArray(data.attachments) ? data.attachments : []
    };
  }
}

class EmailLogger {
  static async logEmail(emailData, status, error = null) {
    try {
      if ((process.env.DB_ENGINE || 'mysql') === 'mongo') {
        await EmailLogModel.create({
          adminId: emailData.adminId,
          recipient_email: emailData.to,
          subject: emailData.subject,
          message: emailData.text || emailData.html,
          message_type: emailData.messageType || 'general',
          status,
          error_message: error ? error.message : null,
          sent_at: new Date()
        });
      } else {
        await pool.execute(
          `INSERT INTO email_logs (admin_id, recipient_email, subject, message, message_type, status, error_message, sent_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            emailData.adminId || 1,
            emailData.to,
            emailData.subject,
            emailData.text || emailData.html,
            emailData.messageType || 'general',
            status,
            error ? error.message : null
          ]
        );
      }
    } catch (logError) {
      console.error('Failed to log email:', logError.message);
    }
  }

  static async getEmailStats(adminId) {
    try {
      if ((process.env.DB_ENGINE || 'mysql') === 'mongo') {
        const [total, sent, failed, today] = await Promise.all([
          EmailLogModel.countDocuments({ adminId }),
          EmailLogModel.countDocuments({ adminId, status: 'sent' }),
          EmailLogModel.countDocuments({ adminId, status: 'failed' }),
          EmailLogModel.countDocuments({ adminId, sent_at: { $gte: new Date(new Date().setHours(0,0,0,0)) } })
        ]);
        return { total, sent, failed, today };
      }
      const [stats] = await pool.execute(
        `SELECT COUNT(*) as total,
          SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
          SUM(CASE WHEN DATE(sent_at) = CURDATE() THEN 1 ELSE 0 END) as today
         FROM email_logs WHERE admin_id = ?`,
        [adminId]
      );
      return stats[0];
    } catch (error) {
      console.error('Failed to get email stats:', error.message);
      return { total: 0, sent: 0, failed: 0, today: 0 };
    }
  }
}

class EmailRetryHandler {
  static async retryEmail(emailFunction, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await emailFunction();
      } catch (error) {
        lastError = error;
        console.log(`Email attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxRetries) {
          await this.delay(delay * attempt); // Exponential backoff
        }
      }
    }
    
    throw lastError;
  }
  
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class EmailPreferences {
  static async getUserPreferences(userId) {
    try {
      const [prefs] = await pool.execute(
        'SELECT * FROM email_preferences WHERE user_id = ?',
        [userId]
      );
      
      if (prefs.length === 0) {
        // Create default preferences
        await this.createDefaultPreferences(userId);
        return this.getDefaultPreferences();
      }
      
      return prefs[0];
    } catch (error) {
      console.error('Failed to get user preferences:', error.message);
      return this.getDefaultPreferences();
    }
  }
  
  static async updateUserPreferences(userId, preferences) {
    try {
      await pool.execute(
        `UPDATE email_preferences 
         SET job_alerts = ?, career_guidance = ?, notifications = ?, marketing = ?
         WHERE user_id = ?`,
        [
          preferences.job_alerts,
          preferences.career_guidance,
          preferences.notifications,
          preferences.marketing,
          userId
        ]
      );
      
      return true;
    } catch (error) {
      console.error('Failed to update preferences:', error.message);
      return false;
    }
  }
  
  static async createDefaultPreferences(userId) {
    try {
      await pool.execute(
        `INSERT INTO email_preferences (user_id, job_alerts, career_guidance, notifications, marketing)
         VALUES (?, true, true, true, false)`,
        [userId]
      );
    } catch (error) {
      console.error('Failed to create default preferences:', error.message);
    }
  }
  
  static getDefaultPreferences() {
    return {
      job_alerts: true,
      career_guidance: true,
      notifications: true,
      marketing: false
    };
  }
  
  static async unsubscribeUser(email, token) {
    try {
      // Verify unsubscribe token (implement token verification logic)
      const [users] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      
      if (users.length === 0) {
        return false;
      }
      
      // Set all preferences to false
      await pool.execute(
        `UPDATE email_preferences 
         SET job_alerts = false, career_guidance = false, notifications = false, marketing = false
         WHERE user_id = ?`,
        [users[0].id]
      );
      
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe user:', error.message);
      return false;
    }
  }
}

module.exports = {
  EmailValidator,
  EmailLogger,
  EmailRetryHandler,
  EmailPreferences
};