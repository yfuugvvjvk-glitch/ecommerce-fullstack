// Script pentru a verifica și repara backend-ul

const https = require('https');

console.log('🔍 Verificare backend status...');

// Testează health endpoint
const healthCheck = () => {
  return new Promise((resolve, reject) => {
    const req = https.get('https://ecommerce-fullstack-3y1b.onrender.com/health', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ Backend răspunde:', data);
        resolve(data);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Backend nu răspunde:', err.message);
      reject(err);
    });
    
    req.setTimeout(30000, () => {
      console.log('⏰ Timeout - backend în sleep mode');
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
};

// Testează API login
const testLogin = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'admin@example.com',
      password: 'Admin1234'
    });

    const options = {
      hostname: 'ecommerce-fullstack-3y1b.onrender.com',
      port: 443,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('🔐 Login test:', res.statusCode, data);
        resolve(data);
      });
    });

    req.on('error', (err) => {
      console.log('❌ Login failed:', err.message);
      reject(err);
    });

    req.write(postData);
    req.end();
  });
};

// Rulează testele
async function runTests() {
  try {
    console.log('\n1. Testare health endpoint...');
    await healthCheck();
    
    console.log('\n2. Testare login API...');
    await testLogin();
    
    console.log('\n✅ Backend funcționează corect!');
  } catch (error) {
    console.log('\n❌ Backend are probleme:', error.message);
    console.log('\n🛠️ Soluții:');
    console.log('1. Așteptați 2-3 minute pentru cold start');
    console.log('2. Accesați manual: https://ecommerce-fullstack-3y1b.onrender.com/health');
    console.log('3. Verificați logs pe render.com dashboard');
  }
}

runTests();