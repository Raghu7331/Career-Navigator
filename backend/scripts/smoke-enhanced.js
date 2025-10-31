// Simple smoke test for enhanced email endpoints
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
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            const err = new Error(json.message || `HTTP ${res.statusCode}`);
            err.status = res.statusCode;
            err.body = json;
            reject(err);
          }
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
  try {
    const login = await request('POST', '/api/admin/login', { email: 'admin@careernavigator.com', password: 'SecureAdmin2025!' });
    if (!login.success) throw new Error('Login failed: ' + (login.message || 'unknown'));
    const token = login.data.token;
    console.log('Admin login OK');

    const test = await request('GET', '/api/enhanced-email/test-enhanced', null, token);
    console.log('Test enhanced:', test);

    const stats = await request('GET', '/api/enhanced-email/stats', null, token);
    console.log('Stats:', stats);

    process.exit(0);
  } catch (err) {
    console.error('Smoke test failed:', err && err.message ? err.message : err);
    if (err && err.status) console.error('Status:', err.status);
    if (err && err.body) console.error('Body:', JSON.stringify(err.body));
    if (err && err.stack) console.error(err.stack);
    process.exit(1);
  }
})();
