// Script to check Supabase configuration
require('dotenv').config();

console.log('🔍 Checking Supabase Configuration...\n');
console.log('='.repeat(60));

const checks = {
  'SUPABASE_URL': process.env.SUPABASE_URL,
  'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY,
  'SUPABASE_JWT_SECRET': process.env.SUPABASE_JWT_SECRET,
  'DATABASE_URL': process.env.DATABASE_URL,
  'DIRECT_URL': process.env.DIRECT_URL,
};

let allGood = true;

for (const [key, value] of Object.entries(checks)) {
  const status = value ? '✅' : '❌';
  const display = value 
    ? `${value.substring(0, 20)}...${value.substring(value.length - 10)}`
    : 'NOT SET';
  
  console.log(`${status} ${key.padEnd(25)} : ${display}`);
  
  if (!value) allGood = false;
}

console.log('='.repeat(60));

if (allGood) {
  console.log('\n✅ All Supabase configurations are set!\n');
  
  // Test Supabase connection
  console.log('🔗 Testing Supabase connection...\n');
  
  const { createClient } = require('@supabase/supabase-js');
  
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    console.log('✅ Supabase client created successfully!');
    console.log('📝 Supabase URL:', process.env.SUPABASE_URL);
    console.log('\n💡 Next steps:');
    console.log('   1. Make sure "Enable email confirmations" is DISABLED in Supabase Dashboard');
    console.log('   2. Go to: https://app.supabase.com → Your Project → Authentication → Settings');
    console.log('   3. Uncheck "Enable email confirmations"');
    console.log('   4. Save and restart your server');
    console.log('\n🧪 Test signup:');
    console.log('   node scripts/test-signup.js');
    
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error.message);
    allGood = false;
  }
  
} else {
  console.log('\n❌ Some configurations are missing!\n');
  console.log('📝 Please add the missing environment variables to your .env file:');
  console.log('   - Check HOW_TO_GET_JWT_SECRET.md for details\n');
}

console.log('\n' + '='.repeat(60));
