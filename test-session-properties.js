// Test script for session properties API

const API_BASE_URL = 'http://localhost:3000/api';
const WEBSITE_ID = 'your-website-id';
const SESSION_ID = '7c0981bc-8991-52c6-b879-b5a0f85fd664';

async function testSessionProperties() {
  try {
    console.log('Testing session properties API...');
    
    const response = await fetch(`${API_BASE_URL}/websites/${WEBSITE_ID}/sessions/${SESSION_ID}/properties`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add your API key if required
        // 'x-umami-api-key': 'your-api-key'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Session properties response:', data);
    
    if (data.isPWA) {
      console.log('✅ This session is a PWA!');
    } else {
      console.log('❌ This session is not a PWA');
    }
    
  } catch (error) {
    console.error('Error testing session properties:', error);
  }
}

// Run the test
testSessionProperties();
