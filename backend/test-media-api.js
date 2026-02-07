// Script de test pentru API-ul Media
const axios = require('axios');

const API_URL = 'http://localhost:3001';

async function testMediaAPI() {
  console.log('🧪 Testare API Media...\n');

  try {
    // 1. Test health check
    console.log('1️⃣ Test health check...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Server activ:', health.data.status);

    // 2. Test autentificare (trebuie să ai un user admin)
    console.log('\n2️⃣ Test autentificare...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    const token = loginResponse.data.token;
    console.log('✅ Autentificare reușită');

    // 3. Test GET /api/media
    console.log('\n3️⃣ Test GET /api/media...');
    const mediaResponse = await axios.get(`${API_URL}/api/media`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Fișiere media găsite:', mediaResponse.data.length);
    
    if (mediaResponse.data.length > 0) {
      console.log('📁 Primul fișier:', {
        id: mediaResponse.data[0].id,
        filename: mediaResponse.data[0].filename,
        url: mediaResponse.data[0].url,
        category: mediaResponse.data[0].category
      });
    }

    console.log('\n✅ Toate testele au trecut!');
  } catch (error) {
    console.error('\n❌ Eroare:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('\n💡 Asigură-te că ai un user admin cu credențialele:');
      console.log('   Email: admin@example.com');
      console.log('   Password: admin123');
    }
  }
}

testMediaAPI();
