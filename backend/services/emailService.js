const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = null;
    this.fromEmail = process.env.EMAIL_FROM || 'Career Navigator <no-reply@careernavigator.com>';
    this.ready = this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      const service = (process.env.EMAIL_SERVICE || 'gmail').toLowerCase();
      
      // Use console fallback for development/testing
      if (service === 'console' || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('📧 Using development email mode (Console Fallback)');
        this.setupFallbackEmail();
      } else if (service === 'ethereal') {
        await this.setupEtherealEmail();
      } else if (process.env.EMAIL_PASSWORD !== 'your-gmail-app-password-here' &&
                 process.env.EMAIL_PASSWORD !== 'your-app-password') {
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
      
      console.log('✅ Ethereal test email service initialized');
      console.log('📧 Test email credentials:');
      console.log('   User:', testAccount.user);
      console.log('   Pass:', testAccount.pass);
      console.log('   Preview emails at: https://ethereal.email');
    } catch (error) {
      console.error('❌ Ethereal setup failed:', error.message);
      this.setupFallbackEmail();
    }
  }

  setupProductionEmail() {
    const service = (process.env.EMAIL_SERVICE || 'gmail').toLowerCase();
    let transportConfig;

    if (service === 'smtp') {
      transportConfig = {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
      };
    } else {
      transportConfig = {
        service,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
      };
    }

    this.transporter = nodemailer.createTransport(transportConfig);
    console.log(`✅ Email service initialized with ${service}`);
  }

  setupFallbackEmail() {
    this.transporter = {
      sendMail: async (mailOptions) => {
        console.log('\n' + '='.repeat(80));
        console.log('📧 EMAIL (DEV MODE)');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        if (mailOptions.text) console.log('Text:', mailOptions.text);
        if (mailOptions.html) console.log('HTML:', mailOptions.html.substring(0, 200) + '...');
        console.log('='.repeat(80) + '\n');
        return { messageId: 'console-' + Date.now() };
      },
      verify: async () => true
    };
  }

  async sendEmail({ to, subject, text, html, attachments = [] }) {
    try {
      // Wait for initialization to complete
      await this.ready;
      
      const mailOptions = { from: this.fromEmail, to, subject, text, html, attachments };
      const result = await this.transporter.sendMail(mailOptions);
      
      // Generate preview URL for Ethereal emails
      const previewURL = nodemailer.getTestMessageUrl(result);
      
      if (previewURL) {
        console.log('📧 Email sent! Preview at:', previewURL);
      }
      
      return { 
        success: true, 
        messageId: result.messageId,
        previewURL: previewURL || null
      };
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendJobAlert({ to, jobTitle, companyName, jobDescription, applyLink }) {
    const subject = `New Job Alert: ${jobTitle} at ${companyName}`;
    const text = `New Job Alert: ${jobTitle} at ${companyName}\n\n${jobDescription}\n\n${applyLink ? 'Apply: ' + applyLink : ''}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">🎯 New Job Opportunity</h2>
        <h3>${jobTitle}</h3>
        <p><strong>Company:</strong> ${companyName}</p>
        <p>${jobDescription}</p>
        ${applyLink ? `<a href="${applyLink}" style="background:#2563eb;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">Apply Now</a>` : ''}
      </div>`;
    return this.sendEmail({ to, subject, text, html });
  }

  async sendCareerGuidance({ to, userName, message, tips = [] }) {
    const subject = 'Career Guidance from Career Navigator';
    const tipsHtml = tips.length ? `<ul>${tips.map(t => `<li>${t}</li>`).join('')}</ul>` : '';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color:#10b981;">🌟 Career Guidance</h2>
        <p>Hello ${userName || 'there'},</p>
        <p>${message}</p>
        ${tipsHtml}
      </div>`;
    const text = `Hello ${userName || 'there'},\n\n${message}\n\n${tips.map(t=>'- '+t).join('\n')}`;
    return this.sendEmail({ to, subject, text, html });
  }

  async sendCustomMessage({ to, subject, message }) {
    const html = `<div style=\"font-family:Arial,sans-serif\">${message.replace(/\n/g,'<br>')}</div>`;
    return this.sendEmail({ to, subject, text: message, html });
  }

  async testConnection() {
    try {
      if (this.transporter.verify) await this.transporter.verify();
      return { success: true, message: 'Email service ready' };
    } catch (e) {
      return { success: false, message: 'Email service verify failed', error: e.message };
    }
  }
}

module.exports = new EmailService();