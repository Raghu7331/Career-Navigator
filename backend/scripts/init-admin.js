const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
require('dotenv').config();

const initializeAdmin = async () => {
  try {
    console.log('🔧 Initializing admin user...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'SecureAdmin2025!';
    
    // Check if admin already exists
    const [existingAdmins] = await pool.execute(
      'SELECT id FROM admins WHERE email = ?',
      [adminEmail]
    );

    if (existingAdmins.length > 0) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const [result] = await pool.execute(
      'INSERT INTO admins (email, password, name) VALUES (?, ?, ?)',
      [adminEmail, hashedPassword, 'System Administrator']
    );

    console.log('✅ Admin user created successfully');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`🆔 Admin ID: ${result.insertId}`);

  } catch (error) {
    console.error('❌ Failed to initialize admin:', error);
    throw error;
  }
};

const initializeTestUser = async () => {
  try {
    console.log('👤 Initializing test user...');

    const testEmail = 'user@test.com';
    const testPassword = 'test123';
    
    // Check if test user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [testEmail]
    );

    if (existingUsers.length > 0) {
      console.log('✅ Test user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 12);

    // Create test user
    const [result] = await pool.execute(
      `INSERT INTO users 
      (name, email, password, phone, address, profile_summary, education, skills) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Test User',
        testEmail,
        hashedPassword,
        '+1234567890',
        'New York, USA',
        'Experienced software developer passionate about creating innovative solutions and learning new technologies.',
        "Bachelor's in Computer Science",
        JSON.stringify(['JavaScript', 'React', 'Node.js', 'Python', 'SQL'])
      ]
    );

    console.log('✅ Test user created successfully');
    console.log(`📧 Email: ${testEmail}`);
    console.log(`🔑 Password: ${testPassword}`);
    console.log(`🆔 User ID: ${result.insertId}`);

  } catch (error) {
    console.error('❌ Failed to initialize test user:', error);
    throw error;
  }
};

const createSampleJobs = async () => {
  try {
    console.log('📝 Creating sample jobs...');

    // Check if jobs already exist
    const [existingJobs] = await pool.execute('SELECT COUNT(*) as count FROM jobs');
    
    if (existingJobs[0].count > 0) {
      console.log('✅ Sample jobs already exist');
      return;
    }

    // Get admin ID
    const [admins] = await pool.execute('SELECT id FROM admins LIMIT 1');
    if (admins.length === 0) {
      console.log('⚠️ No admin found, skipping sample jobs creation');
      return;
    }

    const adminId = admins[0].id;

    const sampleJobs = [
      {
        title: 'Frontend Developer',
        company: 'TechCorp Solutions',
        location: 'New York, NY',
        experience_level: 'Mid Level',
        salary_range: '$70,000 - $90,000',
        description: 'We are looking for a skilled Frontend Developer to join our dynamic team. You will be responsible for creating beautiful, responsive web applications using modern JavaScript frameworks.',
        requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years of experience with React.js, HTML5, CSS3, and JavaScript. Experience with Redux, Git, and RESTful APIs.',
        skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Redux', 'Git'],
        job_type: 'Full-time'
      },
      {
        title: 'Backend Developer',
        company: 'DataFlow Systems',
        location: 'San Francisco, CA',
        experience_level: 'Senior',
        salary_range: '$90,000 - $120,000',
        description: 'Join our backend team to build scalable server-side applications and APIs. Work with microservices architecture and cloud technologies.',
        requirements: '5+ years of backend development experience. Strong knowledge of Node.js, Python, or Java. Experience with databases (MySQL, MongoDB), cloud platforms (AWS, Azure), and containerization (Docker, Kubernetes).',
        skills: ['Node.js', 'Python', 'MySQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes'],
        job_type: 'Full-time'
      },
      {
        title: 'Full Stack Developer',
        company: 'Innovation Labs',
        location: 'Remote',
        experience_level: 'Mid Level',
        salary_range: '$75,000 - $95,000',
        description: 'Develop end-to-end web applications using modern technologies. Work in an agile environment with cross-functional teams.',
        requirements: '3-5 years of full-stack development experience. Proficiency in JavaScript, React, Node.js, and database technologies. Experience with version control, testing frameworks, and deployment processes.',
        skills: ['JavaScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Git', 'Jest'],
        job_type: 'Full-time'
      },
      {
        title: 'UI/UX Designer',
        company: 'Creative Studio',
        location: 'Los Angeles, CA',
        experience_level: 'Junior',
        salary_range: '$50,000 - $70,000',
        description: 'Create intuitive and visually appealing user interfaces for web and mobile applications. Collaborate with developers and product managers.',
        requirements: '1-3 years of UI/UX design experience. Proficiency in design tools (Figma, Adobe Creative Suite). Understanding of user-centered design principles and responsive design.',
        skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Prototyping', 'User Research'],
        job_type: 'Full-time'
      },
      {
        title: 'DevOps Engineer',
        company: 'CloudTech Inc',
        location: 'Seattle, WA',
        experience_level: 'Senior',
        salary_range: '$100,000 - $130,000',
        description: 'Manage cloud infrastructure and CI/CD pipelines. Ensure high availability and scalability of our production systems.',
        requirements: '4+ years of DevOps experience. Strong knowledge of AWS/Azure, Docker, Kubernetes, Jenkins, and infrastructure as code (Terraform, CloudFormation).',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux', 'Python'],
        job_type: 'Full-time'
      }
    ];

    for (const job of sampleJobs) {
      await pool.execute(
        `INSERT INTO jobs 
        (title, company, location, experience_level, salary_range, description, 
         requirements, skills, job_type, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          job.title, job.company, job.location, job.experience_level,
          job.salary_range, job.description, job.requirements,
          JSON.stringify(job.skills), job.job_type, adminId
        ]
      );
    }

    console.log(`✅ Created ${sampleJobs.length} sample jobs`);

  } catch (error) {
    console.error('❌ Failed to create sample jobs:', error);
    throw error;
  }
};

const initializeSystem = async () => {
  try {
    console.log('🚀 Initializing Career Navigator System...');
    
    // Initialize database tables first
    const { initializeDatabase } = require('../config/database');
    await initializeDatabase();
    
    await initializeAdmin();
    await initializeTestUser();
    await createSampleJobs();
    
    console.log('✅ System initialization completed successfully!');
    console.log('🎉 You can now start using the Career Navigator API');
    
  } catch (error) {
    console.error('❌ System initialization failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

// Run initialization
initializeSystem();