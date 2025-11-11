#!/usr/bin/env node

/**
 * Configuration Checker for Predictive Maintenance Backend
 * 
 * This script checks if all required environment variables are set correctly.
 */

require('dotenv').config();

const requiredEnvVars = [
  'DATABASE_URL',
  'DIRECT_URL',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_JWT_SECRET',
];

const optionalEnvVars = [
  'PORT',
  'NODE_ENV',
];

console.log('🔍 Checking Environment Configuration...\n');

let hasErrors = false;

// Check required variables
console.log('📋 Required Variables:');
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    console.log(`  ❌ ${varName}: MISSING`);
    hasErrors = true;
  } else {
    // Mask sensitive data
    const maskedValue = value.length > 20 
      ? value.substring(0, 20) + '...' 
      : value;
    console.log(`  ✅ ${varName}: ${maskedValue}`);
  }
});

console.log('\n📋 Optional Variables:');
optionalEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    console.log(`  ⚠️  ${varName}: NOT SET (will use default)`);
  } else {
    console.log(`  ✅ ${varName}: ${value}`);
  }
});

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('\n❌ Configuration Error!');
  console.log('\nMissing required environment variables.');
  console.log('Please update your .env file with the missing variables.\n');
  console.log('See .env.example for reference.\n');
  process.exit(1);
} else {
  console.log('\n✅ All required configuration is set!');
  console.log('\nYou can now run the application:');
  console.log('  npm run start:dev\n');
  process.exit(0);
}
