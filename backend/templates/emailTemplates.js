const emailTemplates = {
  // Welcome email for new users
  welcome: {
    subject: 'Welcome to Career Navigator! 🚀',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Career Navigator!</h1>
            <p>Your journey to career success starts here</p>
          </div>
          <div class="content">
            <h2>Hello ${data.userName || 'Career Explorer'}!</h2>
            <p>We're thrilled to have you join Career Navigator, your comprehensive platform for career growth and job opportunities.</p>
            
            <h3>What you can do with Career Navigator:</h3>
            <ul>
              <li>🎯 Discover personalized job recommendations</li>
              <li>📚 Access skill-building resources</li>
              <li>🗣️ Get personalized career guidance</li>
              <li>📄 Upload and manage your resume</li>
              <li>💼 Stay updated with the latest job opportunities</li>
            </ul>
            
            <p>Ready to take your career to the next level?</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5175'}/dashboard" class="button">Explore Your Dashboard</a>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
            
            <p>Best regards,<br>The Career Navigator Team</p>
          </div>
          <div class="footer">
            <p>© 2025 Career Navigator. All rights reserved.</p>
            <p>You're receiving this email because you signed up for Career Navigator.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: (data) => `
Welcome to Career Navigator!

Hello ${data.userName || 'Career Explorer'}!

We're thrilled to have you join Career Navigator, your comprehensive platform for career growth and job opportunities.

What you can do with Career Navigator:
- Discover personalized job recommendations
- Access skill-building resources  
- Get personalized career guidance
- Upload and manage your resume
- Stay updated with the latest job opportunities

Visit your dashboard: ${process.env.FRONTEND_URL || 'http://localhost:5175'}/dashboard

Best regards,
The Career Navigator Team
    `
  },

  // Job alert email
  jobAlert: {
    subject: (data) => `🚨 New Job Alert: ${data.jobTitle} at ${data.companyName}`,
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .job-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50; }
          .button { background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 New Job Alert!</h1>
            <p>A perfect match for your career goals</p>
          </div>
          <div class="content">
            <h2>Great opportunity alert!</h2>
            <p>We found a job that matches your profile and preferences.</p>
            
            <div class="job-card">
              <h3>💼 ${data.jobTitle}</h3>
              <p><strong>🏢 Company:</strong> ${data.companyName}</p>
              <p><strong>📋 Description:</strong></p>
              <p>${data.jobDescription}</p>
              ${data.requirements ? `<p><strong>✅ Requirements:</strong> ${data.requirements}</p>` : ''}
              ${data.salary ? `<p><strong>💰 Salary:</strong> ${data.salary}</p>` : ''}
              ${data.location ? `<p><strong>📍 Location:</strong> ${data.location}</p>` : ''}
            </div>
            
            <p>This opportunity won't last long. Apply now to secure your spot!</p>
            <a href="${data.applyLink}" class="button">Apply Now</a>
            
            <p>Good luck with your application!</p>
            
            <p>Best regards,<br>The Career Navigator Team</p>
          </div>
          <div class="footer">
            <p>© 2025 Career Navigator. All rights reserved.</p>
            <p><a href="${process.env.FRONTEND_URL}/preferences">Update your job preferences</a> | <a href="${process.env.FRONTEND_URL}/unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: (data) => `
🚨 New Job Alert: ${data.jobTitle} at ${data.companyName}

Great opportunity alert!

We found a job that matches your profile and preferences.

Job Details:
- Position: ${data.jobTitle}
- Company: ${data.companyName}
- Description: ${data.jobDescription}
${data.requirements ? `- Requirements: ${data.requirements}` : ''}
${data.salary ? `- Salary: ${data.salary}` : ''}
${data.location ? `- Location: ${data.location}` : ''}

Apply now: ${data.applyLink}

Good luck with your application!

Best regards,
The Career Navigator Team
    `
  },

  // Career guidance email
  careerGuidance: {
    subject: (data) => `🎯 Personalized Career Guidance from Career Navigator`,
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF6B6B 0%, #ee5a52 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .tip { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #FF6B6B; }
          .button { background: #FF6B6B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Career Guidance</h1>
            <p>Personalized advice for your career journey</p>
          </div>
          <div class="content">
            <h2>Hello ${data.userName || 'Career Explorer'}!</h2>
            <p>Here's some personalized career guidance to help you achieve your professional goals:</p>
            
            <div class="tip">
              <p>${data.message}</p>
            </div>
            
            ${data.tips && data.tips.length > 0 ? `
              <h3>💡 Additional Tips:</h3>
              ${data.tips.map(tip => `<div class="tip">📝 ${tip}</div>`).join('')}
            ` : ''}
            
            <p>Remember, every small step counts towards your career success. Keep pushing forward!</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5175'}/guidance" class="button">Get More Guidance</a>
            
            <p>Wishing you continued success,<br>The Career Navigator Team</p>
          </div>
          <div class="footer">
            <p>© 2025 Career Navigator. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: (data) => `
🎯 Career Guidance from Career Navigator

Hello ${data.userName || 'Career Explorer'}!

Here's some personalized career guidance:

${data.message}

${data.tips && data.tips.length > 0 ? `
Additional Tips:
${data.tips.map(tip => `- ${tip}`).join('\n')}
` : ''}

Remember, every small step counts towards your career success!

Best regards,
The Career Navigator Team
    `
  },

  // General notification email
  notification: {
    subject: (data) => data.subject || '📢 Notification from Career Navigator',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 Career Navigator</h1>
            <p>Important update for you</p>
          </div>
          <div class="content">
            <h2>Hello ${data.userName || 'Career Explorer'}!</h2>
            <p>${data.message}</p>
            
            <p>Thank you for being part of the Career Navigator community!</p>
            
            <p>Best regards,<br>The Career Navigator Team</p>
          </div>
          <div class="footer">
            <p>© 2025 Career Navigator. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: (data) => `
Career Navigator Notification

Hello ${data.userName || 'Career Explorer'}!

${data.message}

Thank you for being part of the Career Navigator community!

Best regards,
The Career Navigator Team
    `
  }
};

module.exports = emailTemplates;