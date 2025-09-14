// Test to see the actual Umami API response structure
const API_URL = 'https://api.umami.is/v1';
const API_KEY = 'api_JlOxcn4jG7thE5JSjRp11qo3M5TDG6EN';
const WEBSITE_ID = '6e632a23-ee9d-4c70-8689-cdbc650ad331';

async function testUmamiResponse() {
  console.log('🔍 Testing Umami API Response Structure...');
  
  try {
    // Test the stats endpoint (what we're currently using)
    const statsUrl = `${API_URL}/websites/${WEBSITE_ID}/stats?startAt=1500000000000&endAt=2000000000000`;
    console.log('📊 Testing Stats Endpoint:', statsUrl);
    
    const statsResponse = await fetch(statsUrl, {
      method: 'GET',
      headers: {
        'x-umami-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });
    
    const statsData = await statsResponse.json();
    console.log('📊 Stats Response:', JSON.stringify(statsData, null, 2));
    
    // Test if there's a sessions endpoint
    const sessionsUrl = `${API_URL}/websites/${WEBSITE_ID}/sessions?startAt=1500000000000&endAt=2000000000000`;
    console.log('\n👥 Testing Sessions Endpoint:', sessionsUrl);
    
    const sessionsResponse = await fetch(sessionsUrl, {
      method: 'GET',
      headers: {
        'x-umami-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('👥 Sessions Response Status:', sessionsResponse.status);
    if (sessionsResponse.ok) {
      const sessionsData = await sessionsResponse.json();
      console.log('👥 Sessions Response:', JSON.stringify(sessionsData, null, 2));
    } else {
      const errorText = await sessionsResponse.text();
      console.log('👥 Sessions Error:', errorText);
    }
    
    // Test if there's a pageviews endpoint
    const pageviewsUrl = `${API_URL}/websites/${WEBSITE_ID}/pageviews?startAt=1500000000000&endAt=2000000000000`;
    console.log('\n📄 Testing Pageviews Endpoint:', pageviewsUrl);
    
    const pageviewsResponse = await fetch(pageviewsUrl, {
      method: 'GET',
      headers: {
        'x-umami-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📄 Pageviews Response Status:', pageviewsResponse.status);
    if (pageviewsResponse.ok) {
      const pageviewsData = await pageviewsResponse.json();
      console.log('📄 Pageviews Response:', JSON.stringify(pageviewsData, null, 2));
    } else {
      const errorText = await pageviewsResponse.text();
      console.log('📄 Pageviews Error:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

testUmamiResponse();
