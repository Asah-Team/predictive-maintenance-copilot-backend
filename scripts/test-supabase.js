const https = require('https');

// Supabase configuration dari .env
const SUPABASE_URL = 'https://pbxmuvqwshhoseuchotw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBieG11dnF3c2hob3NldWNob3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NDA0NDYsImV4cCI6MjA3NzQxNjQ0Nn0.gPjfikK-m0zoUueQWG_LrC1OiDKafsCg12EVcB-TVdw';

console.log('🔍 Testing Supabase Configuration...\n');

// Test 1: Check Supabase URL
console.log('1. Testing Supabase URL...');
const url = new URL(SUPABASE_URL);
https.get(SUPABASE_URL, (res) => {
  if (res.statusCode === 200 || res.statusCode === 404) {
    console.log('✅ Supabase URL is reachable');
    console.log(`   Status: ${res.statusCode}`);
  } else {
    console.log(`❌ Supabase URL returned status: ${res.statusCode}`);
  }
}).on('error', (err) => {
  console.log('❌ Cannot reach Supabase URL');
  console.log(`   Error: ${err.message}`);
});

// Test 2: Test Sign Up with Supabase
console.log('\n2. Testing Sign Up endpoint...');

const signUpData = JSON.stringify({
  email: 'testuser' + Date.now() + '@example.com',
  password: 'password123',
});

const options = {
  hostname: url.hostname,
  path: '/auth/v1/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Content-Length': signUpData.length,
  },
};

setTimeout(() => {
  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(`   Status: ${res.statusCode}`);
      
      try {
        const response = JSON.parse(data);
        
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ Sign up test successful!');
          console.log('   User created:', response.user?.email || 'Unknown');
          
          if (response.user && !response.session) {
            console.log('⚠️  WARNING: Email confirmation is ENABLED');
            console.log('   User needs to confirm email before login.');
            console.log('\n📝 Action Required:');
            console.log('   1. Go to Supabase Dashboard: https://supabase.com/dashboard');
            console.log('   2. Navigate to: Authentication → Settings → Email Auth');
            console.log('   3. DISABLE "Confirm email" option');
            console.log('   4. Save changes');
            console.log('   5. Restart your NestJS app');
          } else if (response.session) {
            console.log('✅ Email confirmation is DISABLED (Good for development!)');
            console.log('   Users can sign up and login immediately.');
          }
        } else if (res.statusCode === 400) {
          console.log('❌ Sign up failed with 400 Bad Request');
          console.log('   Error:', response.msg || response.message || 'Unknown error');
          
          if (response.msg && response.msg.includes('invalid')) {
            console.log('\n📝 Possible causes:');
            console.log('   1. Email domain is blocked by Supabase');
            console.log('   2. Email provider restrictions are enabled');
            console.log('   3. Rate limit exceeded');
            console.log('\n💡 Solutions:');
            console.log('   1. Use a different email provider (e.g., Gmail, Outlook)');
            console.log('   2. Check Supabase Auth settings for domain restrictions');
            console.log('   3. Wait a few minutes if rate limited');
          }
        } else {
          console.log('❌ Unexpected status code:', res.statusCode);
          console.log('   Response:', JSON.stringify(response, null, 2));
        }
      } catch (err) {
        console.log('❌ Error parsing response:', err.message);
        console.log('   Raw response:', data);
      }
      
      console.log('\n✅ Test complete!');
      console.log('\nℹ️  Read TROUBLESHOOTING_EMAIL.md for more details.');
    });
  });

  req.on('error', (err) => {
    console.log('❌ Request failed:', err.message);
  });

  req.write(signUpData);
  req.end();
}, 1000);
