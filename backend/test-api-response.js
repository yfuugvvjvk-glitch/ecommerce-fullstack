async function testAPI() {
  try {
    console.log('🔍 Testing API response...\n');
    
    const response = await fetch('http://localhost:3001/api/public/site-config');
    const data = await response.json();
    
    console.log('📦 API Response Type:', Array.isArray(data) ? 'Array' : 'Object');
    console.log('📦 API Response:', JSON.stringify(data, null, 2));
    
    console.log('\n✅ Translation keys found:');
    const translationKeys = Object.keys(data).filter(key => 
      key.includes('_en') || key.includes('_de') || key.includes('_fr') || 
      key.includes('_es') || key.includes('_it')
    );
    translationKeys.forEach(key => {
      console.log(`  ${key}: ${data[key]?.substring(0, 50)}...`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
