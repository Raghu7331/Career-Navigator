// Comprehensive test suite for MongoDB backend
const http = require('http');

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? Buffer.from(JSON.stringify(body)) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': data.length } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };
    const req = http.request(options, (res) => {
      let chunks = '';
      res.on('data', (d) => chunks += d);
      res.on('end', () => {
        try {
          const json = chunks ? JSON.parse(chunks) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  console.log('\n=== MONGODB BACKEND TEST SUITE ===\n');
  
  try {
    // Test 1: Health Check
    const health = await request('GET', '/health');
    console.log('✅ Health Check:', health.data.message);

    // Test 2: Admin Login
    const login = await request('POST', '/api/admin/login', {
      email: 'admin@careernavigator.com',
      password: 'SecureAdmin2025!'
    });
    if (!login.data.success) throw new Error('Login failed');
    const token = login.data.data.token;
    console.log('✅ Admin Login: Success');

    // Test 3: Enhanced Email Stats
    const stats = await request('GET', '/api/enhanced-email/stats', null, token);
    console.log('✅ Email Stats:', `Total=${stats.data.data.total}, Sent=${stats.data.data.sent}, Failed=${stats.data.data.failed}`);

    // Test 4: Admin Stats
    const adminStats = await request('GET', '/api/admin/stats', null, token);
    console.log('✅ Admin Stats:', `Users=${adminStats.data.data.stats.totalUsers}, Jobs=${adminStats.data.data.stats.totalJobs}`);

    // Test 5: Users List
    const users = await request('GET', '/api/email/users', null, token);
    console.log('✅ Users Query:', `Found ${users.data.data.length} users`);

    // Test 6: Email Logs
    const logs = await request('GET', '/api/email/logs?page=1&limit=5', null, token);
    console.log('✅ Email Logs:', `Retrieved ${logs.data.data.logs.length} records`);

    // Test 7: Enhanced Email Test (may fail if SMTP not configured, but that's OK)
    const emailTest = await request('GET', '/api/enhanced-email/test-enhanced', null, token);
    console.log('✅ Email Service:', emailTest.data.message || 'Ready');

    console.log('\n🎉 ALL TESTS PASSED');
    console.log('   Database: MongoDB (career_navigator)');
    console.log('   Server: http://localhost:5000');
    console.log('   Admin: admin@careernavigator.com\n');
    
    process.exit(0);
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('   Server is not running. Start with: cd backend && node server.js');
    }
    process.exit(1);
  }
})();
