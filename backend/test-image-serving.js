// Test servire imagini
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const HOST = 'localhost';

async function testImageServing() {
  console.log('🧪 Testare servire imagini...\n');

  // Verifică dacă serverul rulează
  console.log('1️⃣ Verificare server...');
  try {
    await makeRequest('/health');
    console.log('✅ Server activ pe http://localhost:3001\n');
  } catch (error) {
    console.log('❌ Serverul nu rulează!');
    console.log('💡 Pornește serverul: npm run dev\n');
    return;
  }

  // Verifică dacă există fișiere în directoare
  console.log('2️⃣ Verificare fișiere locale...');
  const uploadsDir = path.join(__dirname, 'public', 'uploads');
  const categories = ['products', 'avatars', 'offers'];
  
  let totalFiles = 0;
  for (const category of categories) {
    const dir = path.join(uploadsDir, category);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      console.log(`   📁 ${category}: ${files.length} fișiere`);
      totalFiles += files.length;
      
      // Testează primul fișier din fiecare categorie
      if (files.length > 0) {
        const testFile = files[0];
        const testPath = `/uploads/${category}/${testFile}`;
        try {
          await makeRequest(testPath);
          console.log(`   ✅ Servire OK: ${testPath}`);
        } catch (error) {
          console.log(`   ❌ Eroare servire: ${testPath}`);
        }
      }
    } else {
      console.log(`   ⚠️  ${category}: director lipsă`);
    }
  }
  
  console.log(`\n📊 Total fișiere găsite: ${totalFiles}\n`);

  // Testează endpoint-ul /api/media
  console.log('3️⃣ Testare endpoint /api/media...');
  console.log('⚠️  Necesită autentificare admin - testează manual în browser\n');

  console.log('✅ Testare completă!\n');
  console.log('📝 Următorii pași:');
  console.log('   1. Pornește frontend: cd ../frontend && npm run dev');
  console.log('   2. Loghează-te ca admin');
  console.log('   3. Accesează: Admin Panel → Editare Conținut → Media');
  console.log('   4. Verifică că imaginile se încarcă corect\n');
}

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: path,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve(res);
      } else {
        reject(new Error(`Status ${res.statusCode}`));
      }
    });

    req.on('error', reject);
    req.setTimeout(2000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

testImageServing();
