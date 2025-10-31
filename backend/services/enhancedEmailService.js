const nodemailer = require('nodemailer');
const emailTemplates = require('../templates/emailTemplates');
const { EmailValidator, EmailLogger, EmailRetryHandler, EmailPreferences } = require('./emailHelpers');
require('dotenv').config();

class EnhancedEmailService {
  constructor() {
    this.transporter = null;
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@careernavigator.com';
    this.ready = this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      const emailService = (process.env.EMAIL_SERVICE || 'gmail').toLowerCase();
      
      // Use console fallback for development/testing
      if (emailService === 'console' || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('📧 Using development email mode (Console Fallback)');
        this.setupFallbackEmail();
      } else if (emailService === 'ethereal') {
        await this.setupEtherealEmail();
      } else if (process.env.EMAIL_PASSWORD !== 'your-gmail-app-password-here' &&
                 process.env.EMAIL_PASSWORD !== 'your-app-password') {
        console.log('📧 Setting up production email service...');
        this.setupProductionEmail();
      } else {
        console.log('📧 Using development email mode (Console Fallback)');
        this.setupFallbackEmail();
      }
      return true;
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      this.setupFallbackEmail();
      return false;
    }
  }

  async setupEtherealEmail() {
    try {
      // Create a test account on Ethereal
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      
      console.log('✅ Production email service initialized with ethereal');
      console.log('📧 Ethereal test credentials:', testAccount.user);
    } catch (error) {
      console.error('❌ Ethereal setup failed:', error.message);
      this.setupFallbackEmail();
    }
  }

  setupProductionEmail() {
    const emailService = process.env.EMAIL_SERVICE || 'gmail';
    
    let transportConfig = {};
    
    switch (emailService.toLowerCase()) {
      case 'gmail':
        transportConfig = {
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        };
        break;
      
      case 'outlook':
      case 'hotmail':
        transportConfig = {
          service: 'hotmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        };
        break;
      
      case 'smtp':
        transportConfig = {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        };
        break;
      
      default:
        transportConfig = {
          service: emailService,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        };
    }

  this.transporter = nodemailer.createTransport(transportConfig);
    console.log(`✅ Production email service initialized with ${emailService}`);
  }

  setupFallbackEmail() {
    // Create a mock transporter for development
    this.transporter = {
      sendMail: async (mailOptions) => {
        console.log('\n📧 ===== EMAIL SENT (Development Mode) =====');
        console.log(`📬 To: ${mailOptions.to}`);
        console.log(`📝 Subject: ${mailOptions.subject}`);
        console.log(`📄 Content: ${mailOptions.text || 'HTML content provided'}`);
        console.log('📧 ==========================================\n');
        
        return {
          messageId: 'dev-' + Date.now(),
          previewURL: `Console logged email for development`
        };
      },
      verify: async () => true
    };
    
    console.log('📧 Using console fallback for email service - emails will be logged to console');
  }

  async sendWelcomeEmail(userData) {
    try {
      const template = emailTemplates.welcome;
      const emailData = {
        to: userData.email,
        subject: template.subject,
        html: template.html(userData),
        text: template.text(userData),
        messageType: 'welcome',
        adminId: 1
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Failed to send welcome email:', error.message);
      throw error;
    }
  }

  async sendJobAlert(jobData) {
    try {
      // Check user preferences
      const preferences = await EmailPreferences.getUserPreferences(jobData.userId);
      if (!preferences.job_alerts) {
        console.log(`Job alerts disabled for user ${jobData.email}`);
        return { success: false, message: 'User has disabled job alerts' };
      }

      const template = emailTemplates.jobAlert;
      const emailData = {
        to: jobData.email,
        subject: template.subject(jobData),
        html: template.html(jobData),
        text: template.text(jobData),
        messageType: 'job_alert',
        adminId: jobData.adminId || 1
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Failed to send job alert:', error.message);
      throw error;
    }
  }

  async sendCareerGuidance(guidanceData) {
    try {
      // Check user preferences
      const preferences = await EmailPreferences.getUserPreferences(guidanceData.userId);
      if (!preferences.career_guidance) {
        console.log(`Career guidance emails disabled for user ${guidanceData.email}`);
        return { success: false, message: 'User has disabled career guidance emails' };
      }

      const template = emailTemplates.careerGuidance;
      const emailData = {
        to: guidanceData.email,
        subject: template.subject(guidanceData),
        html: template.html(guidanceData),
        text: template.text(guidanceData),
        messageType: 'career_guidance',
        adminId: guidanceData.adminId || 1
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Failed to send career guidance:', error.message);
      throw error;
    }
  }

  async sendNotification(notificationData) {
    try {
      // Check user preferences
      const preferences = await EmailPreferences.getUserPreferences(notificationData.userId);
      if (!preferences.notifications) {
        console.log(`Notifications disabled for user ${notificationData.email}`);
        return { success: false, message: 'User has disabled notifications' };
      }

      const template = emailTemplates.notification;
      const emailData = {
        to: notificationData.email,
        subject: template.subject(notificationData),
        html: template.html(notificationData),
        text: template.text(notificationData),
        messageType: 'notification',
        adminId: notificationData.adminId || 1
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Failed to send notification:', error.message);
      throw error;
    }
  }

  async sendEmail(emailData) {
    try {
      // Wait for initialization to complete
      await this.ready;
      
      // Validate email data
      const validation = EmailValidator.validateEmailData(emailData);
      if (!validation.isValid) {
        const error = new Error(`Email validation failed: ${validation.errors.join(', ')}`);
        await EmailLogger.logEmail(emailData, 'failed', error);
        throw error;
      }

      // Sanitize data
      const sanitizedData = EmailValidator.sanitizeEmailData(emailData);

      const mailOptions = {
        from: this.fromEmail,
        to: sanitizedData.to,
        subject: sanitizedData.subject,
        text: sanitizedData.text,
        html: sanitizedData.html,
        attachments: sanitizedData.attachments
      };

      // Send email with retry mechanism
      const result = await EmailRetryHandler.retryEmail(
        () => this.transporter.sendMail(mailOptions),
        3,
        1000
      );

      // Generate preview URL for Ethereal emails
      const previewURL = nodemailer.getTestMessageUrl(result);
      
      if (previewURL) {
        console.log('📧 Email sent! Preview at:', previewURL);
      }

      // Log successful send
      await EmailLogger.logEmail(emailData, 'sent');

      return {
        success: true,
        messageId: result.messageId,
        previewURL: previewURL || null,
        message: 'Email sent successfully'
      };

    } catch (error) {
      // Log failed send
      await EmailLogger.logEmail(emailData, 'failed', error);
      
      return {
        success: false,
        message: error.message,
        error: error.message
      };
    }
  }

  async sendToMultipleUsers(emailData, userList) {
    const results = [];
    
    for (const user of userList) {
      try {
        const personalizedData = {
          ...emailData,
          to: user.email,
          userName: user.name,
          userId: user.id
        };
        
        const result = await this.sendEmail(personalizedData);
        results.push({
          email: user.email,
          ...result
        });
        
        // Add delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        results.push({
          email: user.email,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  async testConnection() {
    try {
      // Wait for initialization to complete
      await this.ready;
      
      if (this.transporter.verify) {
        const isConnected = await this.transporter.verify();
        return {
          success: isConnected,
          message: isConnected ? 'Email service is working properly' : 'Email service connection failed'
        };
      } else {
        return {
          success: true,
          message: 'Development mode - using console fallback'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Email service test failed',
        error: error.message
      };
    }
  }

  async getEmailStats(adminId) {
    return await EmailLogger.getEmailStats(adminId);
  }
}

module.exports = new EnhancedEmailService();