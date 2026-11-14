/**
 * Verification test for new Firebase configuration (ide-codexa)
 */
const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');

// Parse .env.local manually
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    value = value.trim().replace(/^["']|["']$/g, '');
    env[match[1]] = value;
  }
});

console.log('====================================================');
console.log('  TESTING NEW FIREBASE CONFIGURATION (IDE-CODEXA)   ');
console.log('====================================================\n');

const apiKey = env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementId = env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

console.log('Target Project ID:', projectId);
console.log('Auth Domain:', authDomain);
console.log('App ID:', appId);
console.log('Measurement ID:', measurementId);
console.log('Storage Bucket:', storageBucket);

let allValid = true;

if (projectId !== 'ide-codexa') {
  console.error('❌ Project ID mismatch. Expected "ide-codexa", got:', projectId);
  allValid = false;
}

if (authDomain !== 'ide-codexa.firebaseapp.com') {
  console.error('❌ Auth Domain mismatch. Expected "ide-codexa.firebaseapp.com", got:', authDomain);
  allValid = false;
}

if (appId !== '1:182155365309:web:9e1b25311f9a678039a0d4') {
  console.error('❌ App ID mismatch:', appId);
  allValid = false;
}

if (measurementId !== 'G-MSQWNKL4CE') {
  console.error('❌ Measurement ID mismatch:', measurementId);
  allValid = false;
}

try {
  const app = initializeApp({
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  }, 'test-instance-' + Date.now());

  console.log('✅ Firebase SDK initialized successfully with new credentials!');
} catch (err) {
  console.error('❌ Firebase initialization failed:', err.message);
  allValid = false;
}

console.log('\n====================================================');
if (allValid) {
  console.log('  ALL CONFIGURATION CHECKS PASSED ✅');
} else {
  console.error('  SOME CHECKS FAILED');
  process.exit(1);
}
console.log('====================================================\n');
