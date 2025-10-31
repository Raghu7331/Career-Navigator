const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');
const Admin = require('../models/Admin');
const Message = require('../models/Message');
const JobApplication = require('../models/JobApplication');
const EmailLog = require('../models/EmailLog');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/career_navigator';

async function verifyDatabaseConnections() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  DATABASE CONNECTION & DATA VERIFICATION TEST              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected Successfully\n');

    // Test 1: Check Users Collection
    console.log('📋 TEST 1: Users Collection');
    console.log('─────────────────────────────────');
    const users = await User.find({}).select('email firstName lastName skills');
    console.log(`✅ Found ${users.length} users in database`);
    if (users.length > 0) {
      users.forEach((user, idx) => {
        console.log(`   ${idx + 1}. ${user.email} - ${user.firstName} ${user.lastName}`);
        if (user.skills && user.skills.length > 0) {
          console.log(`      Skills: ${user.skills.join(', ')}`);
        }
      });
    }
    console.log('');

    // Test 2: Check Jobs Collection
    console.log('📋 TEST 2: Jobs Collection');
    console.log('─────────────────────────────────');
    const jobs = await Job.find({ isDeleted: { $ne: true } }).select('title company location salary');
    console.log(`✅ Found ${jobs.length} active jobs in database`);
    if (jobs.length > 0) {
      jobs.forEach((job, idx) => {
        console.log(`   ${idx + 1}. ${job.title} at ${job.company}`);
        console.log(`      Location: ${job.location} | Salary: ${job.salary}`);
      });
    }
    console.log('');

    // Test 3: Check Admin Collection
    console.log('📋 TEST 3: Admin Collection');
    console.log('─────────────────────────────────');
    const admins = await Admin.find({}).select('email name role');
    console.log(`✅ Found ${admins.length} admin(s) in database`);
    if (admins.length > 0) {
      admins.forEach((admin, idx) => {
        console.log(`   ${idx + 1}. ${admin.email} - ${admin.name} (${admin.role})`);
      });
    }
    console.log('');

    // Test 4: Check Messages Collection
    console.log('📋 TEST 4: Messages Collection');
    console.log('─────────────────────────────────');
    const messages = await Message.find({}).select('name email subject createdAt');
    console.log(`✅ Found ${messages.length} message(s) in database`);
    if (messages.length > 0) {
      messages.slice(0, 3).forEach((msg, idx) => {
        console.log(`   ${idx + 1}. From: ${msg.name} (${msg.email})`);
        console.log(`      Subject: ${msg.subject}`);
      });
      if (messages.length > 3) {
        console.log(`   ... and ${messages.length - 3} more`);
      }
    }
    console.log('');

    // Test 5: Check Job Applications Collection
    console.log('📋 TEST 5: Job Applications Collection');
    console.log('─────────────────────────────────');
    const applications = await JobApplication.find({})
      .select('userId jobId status createdAt')
      .populate('userId', 'email firstName lastName')
      .populate('jobId', 'title company');
    console.log(`✅ Found ${applications.length} job application(s) in database`);
    if (applications.length > 0) {
      applications.slice(0, 3).forEach((app, idx) => {
        const userName = app.userId ? `${app.userId.firstName} ${app.userId.lastName}` : 'Unknown';
        const jobTitle = app.jobId ? app.jobId.title : 'Unknown Job';
        console.log(`   ${idx + 1}. ${userName} applied for ${jobTitle}`);
        console.log(`      Status: ${app.status}`);
      });
      if (applications.length > 3) {
        console.log(`   ... and ${applications.length - 3} more`);
      }
    }
    console.log('');

    // Test 6: Check Email Logs Collection
    console.log('📋 TEST 6: Email Logs Collection');
    console.log('─────────────────────────────────');
    const emailLogs = await EmailLog.find({}).select('to subject status createdAt');
    console.log(`✅ Found ${emailLogs.length} email log(s) in database`);
    if (emailLogs.length > 0) {
      emailLogs.slice(0, 3).forEach((log, idx) => {
        console.log(`   ${idx + 1}. To: ${log.to} | Subject: ${log.subject}`);
        console.log(`      Status: ${log.status}`);
      });
      if (emailLogs.length > 3) {
        console.log(`   ... and ${emailLogs.length - 3} more`);
      }
    }
    console.log('');

    // Summary
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║  SUMMARY                                                   ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`✅ MongoDB Connection: WORKING`);
    console.log(`✅ Users in DB: ${users.length}`);
    console.log(`✅ Jobs in DB: ${jobs.length}`);
    console.log(`✅ Admins in DB: ${admins.length}`);
    console.log(`✅ Messages in DB: ${messages.length}`);
    console.log(`✅ Applications in DB: ${applications.length}`);
    console.log(`✅ Email Logs in DB: ${emailLogs.length}`);
    console.log('');
    console.log('🎉 ALL DATABASE COLLECTIONS ARE ACCESSIBLE!\n');

  } catch (error) {
    console.error('❌ Error during verification:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.\n');
  }
}

verifyDatabaseConnections();
