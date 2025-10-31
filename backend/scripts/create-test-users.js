const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  address: String,
  profile_summary: String,
  skills: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const testUsers = [
  {
    name: 'John Doe',
    email: 'john@test.com',
    password: 'Test123!',
    phone: '+1234567890',
    address: '123 Main St, New York, NY',
    profile_summary: 'Full-stack developer with 5 years of experience',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB']
  },
  {
    name: 'Jane Smith',
    email: 'jane@test.com',
    password: 'Test123!',
    phone: '+1234567891',
    address: '456 Oak Ave, San Francisco, CA',
    profile_summary: 'Data scientist specializing in machine learning',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL']
  },
  {
    name: 'Mike Johnson',
    email: 'mike@test.com',
    password: 'Test123!',
    phone: '+1234567892',
    address: '789 Pine Rd, Austin, TX',
    profile_summary: 'DevOps engineer with cloud expertise',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
  },
  {
    name: 'Sarah Williams',
    email: 'sarah@test.com',
    password: 'Test123!',
    phone: '+1234567893',
    address: '321 Elm St, Seattle, WA',
    profile_summary: 'UI/UX Designer with a passion for user-centered design',
    skills: ['Figma', 'Adobe XD', 'UI Design', 'UX Research']
  },
  {
    name: 'David Brown',
    email: 'david@test.com',
    password: 'Test123!',
    phone: '+1234567894',
    address: '654 Maple Dr, Boston, MA',
    profile_summary: 'Backend engineer focused on scalable systems',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices']
  }
];

async function createTestUsers() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/career_navigator');
    console.log('\n✅ Connected to MongoDB\n');

    // Delete existing test users
    await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
    console.log('🗑️  Cleared any existing test users\n');

    // Create new test users with hashed passwords
    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      console.log(`✅ Created user: ${userData.name} (${userData.email})`);
    }

    console.log('\n========================================');
    console.log('     TEST USERS CREATED SUCCESSFULLY');
    console.log('========================================\n');

    console.log('LOGIN CREDENTIALS:\n');
    testUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email:    ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Skills:   ${user.skills.join(', ')}`);
      console.log('');
    });

    console.log('========================================');
    console.log('All users have the same password: Test123!');
    console.log('Login URL: http://localhost:5173/login');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestUsers();
