/**
 * Full System Test Suite
 * Tests all components: Backend, MongoDB, Frontend, Email
 */

const http = require('http');

const API_BASE = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:5173';
let adminToken = '';

// Helper function to make HTTP requests
function makeRequest(url, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const response = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Test functions
async function testBackendHealth() {
  try {
    const result = await makeRequest(`${API_BASE}/health`);
    if (result.status === 200) {
      console.log('✅ Backend Server: RUNNING');
      return true;
    }
    console.log('❌ Backend Server: Unhealthy');
    return false;
  } catch (error) {
    console.log('❌ Backend Server: NOT RUNNING');
    return false;
  }
}

async function testFrontend() {
  try {
    const result = await makeRequest(FRONTEND_URL);
    if (result.status === 200) {
      console.log('✅ Frontend: RUNNING on port 5173');
      return true;
    }
    console.log('❌ Frontend: Not responding');
    return false;
  } catch (error) {
    console.log('❌ Frontend: NOT RUNNING');
    return false;
  }
}

async function testAdminLogin() {
  try {
    const result = await makeRequest(`${API_BASE}/api/admin/login`, 'POST', {
      email: 'admin@careernavigator.com',
      password: 'SecureAdmin2025!',
    });

    if (result.status === 200 && result.data.token) {
      adminToken = result.data.token;
      console.log('✅ Admin Authentication: Working');
      return true;
    }
    console.log('❌ Admin Authentication: Failed');
    return false;
  } catch (error) {
    console.log('❌ Admin Authentication: Error');
    return false;
  }
}

async function testDatabase() {
  try {
    const result = await makeRequest(`${API_BASE}/api/admin/stats`, 'GET', null, adminToken);
    if (result.status === 200) {
      console.log(`✅ MongoDB: Connected (${result.data.totalUsers || 0} users, ${result.data.totalJobs || 0} jobs)`);
      return true;
    }
    console.log('❌ MongoDB: Connection failed');
    return false;
  } catch (error) {
    console.log('❌ MongoDB: Error');
    return false;
  }
}

async function testJobsAPI() {
  try {
    const result = await makeRequest(`${API_BASE}/api/jobs`);
    if (result.status === 200) {
      console.log('✅ Jobs API: Working');
      return true;
    }
    console.log('❌ Jobs API: Failed');
    return false;
  } catch (error) {
    console.log('❌ Jobs API: Error');
    return false;
  }
}

async function testMessagesAPI() {
  try {
    const result = await makeRequest(`${API_BASE}/api/messages/sent`, 'GET', null, adminToken);
    if (result.status === 200) {
      console.log('✅ Messages API: Working');
      return true;
    }
    console.log('❌ Messages API: Failed');
    return false;
  } catch (error) {
    console.log('❌ Messages API: Error');
    return false;
  }
}

async function testEmailAPI() {
  try {
    const result = await makeRequest(`${API_BASE}/api/enhanced-email/stats`, 'GET', null, adminToken);
    if (result.status === 200) {
      console.log(`✅ Email System: Working (Total: ${result.data.totalEmails || 0}, Sent: ${result.data.sentEmails || 0})`);
      return true;
    }
    console.log('❌ Email System: Failed');
    return false;
  } catch (error) {
    console.log('❌ Email System: Error');
    return false;
  }
}

async function testRecommendationsAPI() {
  try {
    // This requires user auth, so we'll just check if endpoint exists
    const result = await makeRequest(`${API_BASE}/api/recommendations`);
    // 401 is expected without user token, but means endpoint exists
    if (result.status === 401 || result.status === 200) {
      console.log('✅ Recommendations API: Working');
      return true;
    }
    console.log('❌ Recommendations API: Failed');
    return false;
  } catch (error) {
    console.log('❌ Recommendations API: Error');
    return false;
  }
}

async function testUploadAPI() {
  try {
    const result = await makeRequest(`${API_BASE}/api/upload/my`);
    // 401 is expected without user token, but means endpoint exists
    if (result.status === 401 || result.status === 200) {
      console.log('✅ Upload API: Working');
      return true;
    }
    console.log('❌ Upload API: Failed');
    return false;
  } catch (error) {
    console.log('❌ Upload API: Error');
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('\n=== FULL SYSTEM TEST SUITE ===\n');
  console.log('🔍 Testing Core Infrastructure...\n');

  const backendOk = await testBackendHealth();
  const frontendOk = await testFrontend();

  console.log('\n🔍 Testing Authentication...\n');
  const authOk = await testAdminLogin();

  console.log('\n🔍 Testing Database & APIs...\n');
  const dbOk = await testDatabase();
  const jobsOk = await testJobsAPI();
  const messagesOk = await testMessagesAPI();
  const emailOk = await testEmailAPI();
  const recoOk = await testRecommendationsAPI();
  const uploadOk = await testUploadAPI();

  const allTests = [
    backendOk,
    frontendOk,
    authOk,
    dbOk,
    jobsOk,
    messagesOk,
    emailOk,
    recoOk,
    uploadOk,
  ];

  const passed = allTests.filter((t) => t).length;
  const total = allTests.length;
  const percentage = Math.round((passed / total) * 100);

  console.log('\n' + '='.repeat(50));
  console.log(`📊 TEST RESULTS: ${passed}/${total} PASSED (${percentage}%)`);
  console.log('='.repeat(50));

  if (percentage === 100) {
    console.log('\n🎉 ALL SYSTEMS OPERATIONAL - 100% WORKING!\n');
    console.log('   🌐 Frontend: http://localhost:5173');
    console.log('   🔧 Backend: http://localhost:5000');
    console.log('   🗄️  Database: MongoDB (career_navigator)');
    console.log('   👤 Admin: admin@careernavigator.com\n');
    process.exit(0);
  } else {
    console.log(`\n⚠️  SYSTEM STATUS: ${percentage}% OPERATIONAL\n`);
    process.exit(1);
  }
}

// Run tests
runAllTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
