// Detailed test script for session properties API

const API_BASE_URL = 'http://localhost:3000/api';
const WEBSITE_ID = 'your-website-id';
const SESSION_ID = '7c0981bc-8991-52c6-b879-b5a0f85fd664';

async function testSessionPropertiesDetailed() {
  console.log('🚀 Starting detailed session properties test...\n');
  
  try {
    // Test 1: Get sessions list
    console.log('📋 Step 1: Fetching sessions list...');
    const sessionsResponse = await fetch(`${API_BASE_URL}/websites/${WEBSITE_ID}/sessions?startAt=${Date.now() - 7 * 24 * 60 * 60 * 1000}&endAt=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add your API key if required
        // 'x-umami-api-key': 'your-api-key'
      }
    });

    if (!sessionsResponse.ok) {
      throw new Error(`Sessions API error! status: ${sessionsResponse.status}`);
    }

    const sessionsData = await sessionsResponse.json();
    console.log(`✅ Found ${sessionsData.data?.length || 0} sessions`);
    
    if (sessionsData.data && sessionsData.data.length > 0) {
      console.log('📝 First few sessions:', sessionsData.data.slice(0, 3).map(s => ({
        id: s.id,
        browser: s.browser,
        hasProperties: !!s.properties
      })));
    }

    // Test 2: Get properties for specific session
    console.log('\n🔍 Step 2: Fetching properties for specific session...');
    const propertiesResponse = await fetch(`${API_BASE_URL}/websites/${WEBSITE_ID}/sessions/${SESSION_ID}/properties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add your API key if required
        // 'x-umami-api-key': 'your-api-key'
      }
    });

    if (!propertiesResponse.ok) {
      throw new Error(`Properties API error! status: ${propertiesResponse.status}`);
    }

    const propertiesData = await propertiesResponse.json();
    console.log('✅ Session properties response:', propertiesData);
    
    if (propertiesData.isPWA) {
      console.log('🎉 This session is a PWA!');
    } else {
      console.log('❌ This session is not a PWA');
    }

    // Test 3: Test with different session if available
    if (sessionsData.data && sessionsData.data.length > 1) {
      const testSessionId = sessionsData.data[1].id;
      console.log(`\n🧪 Step 3: Testing with another session: ${testSessionId}`);
      
      const testPropertiesResponse = await fetch(`${API_BASE_URL}/websites/${WEBSITE_ID}/sessions/${testSessionId}/properties`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add your API key if required
          // 'x-umami-api-key': 'your-api-key'
        }
      });

      if (testPropertiesResponse.ok) {
        const testPropertiesData = await testPropertiesResponse.json();
        console.log('✅ Test session properties:', testPropertiesData);
      } else {
        console.log(`⚠️ Test session properties failed: ${testPropertiesResponse.status}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
  
  console.log('\n🏁 Test completed!');
}

// Run the test
testSessionPropertiesDetailed();
