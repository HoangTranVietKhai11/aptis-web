// Quick test: starts the server, then tests the API endpoints
const http = require('http');

function testEndpoint(method, path, body) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : '';
    const options = {
      hostname: '127.0.0.1',
      port: 3003,
      path: path,
      method: method,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    };
    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        console.log(`\n${method} ${path} => Status: ${res.statusCode}`);
        console.log(`Response: ${responseBody}`);
        resolve(res.statusCode);
      });
    });
    req.on('error', (e) => {
      console.log(`\n${method} ${path} => ERROR: ${e.message}`);
      resolve(0);
    });
    if (data) req.write(data);
    req.end();
  });
}

// Wait for server to be ready, then test
setTimeout(async () => {
  console.log('\n========== TESTING API ==========');
  await testEndpoint('GET', '/api/test', null);
  await testEndpoint('GET', '/api/health', null);
  await testEndpoint('POST', '/api/auth/register', { name: 'TestUser', email: 'test999@example.com', password: 'password123' });
  await testEndpoint('POST', '/api/auth/login', { email: 'admin@aptis.local', password: 'admin123' });
  console.log('\n========== TESTS DONE ==========');
  console.log('Server is still running. Press Ctrl+C to stop.');
}, 3000);

// Start the actual server
require('./server');
