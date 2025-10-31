const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  skills: [String],
  phone: String,
  address: String
});

const User = mongoose.model('User', userSchema);

async function showUsers() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/career_navigator');
    console.log('\n========================================');
    console.log('     TEST USER CREDENTIALS');
    console.log('========================================\n');

    const users = await User.find({}, 'name email skills').limit(10);
    
    if (users.length === 0) {
      console.log('No users found in database.\n');
      console.log('You can create a test user by registering at:');
      console.log('http://localhost:5173/signup\n');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Name:  ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   URL:   http://localhost:5173/login`);
        console.log(`   Note:  Password was set during registration`);
        if (user.skills && user.skills.length > 0) {
          console.log(`   Skills: ${user.skills.join(', ')}`);
        }
        console.log('');
      });
      
      console.log('========================================');
      console.log(`Total Users: ${users.length}`);
      console.log('========================================\n');
      
      console.log('NOTE: These users were created with passwords.');
      console.log('If you need a fresh test user, register at:');
      console.log('http://localhost:5173/signup\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

showUsers();
