// Simple test script untuk debug signup issue
const https = require('https');

// Test data
const testData = {
  email: 'test@gmail.com',
  password: 'password123',
  fullName: 'Test User'
};

console.log('🧪 Testing Sign Up endpoint...\n');
console.log('Request Body:', JSON.stringify(testData, null, 2));
console.log('\n' + '='.repeat(50) + '\n');

// Test with fetch (Node 18+)
fetch('http://localhost:3000/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
  .then(async (response) => {
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('\nResponse Body:');
    console.log(JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.log('\n❌ Request failed!');
      console.log('Error details:', data);
    } else {
      console.log('\n✅ Request successful!');
    }
  })
  .catch((error) => {
    console.error('❌ Network Error:', error.message);
    console.error('\nMake sure:');
    console.error('1. Server is running (npm run start:dev)');
    console.error('2. Server is accessible at http://localhost:3000');
  });
