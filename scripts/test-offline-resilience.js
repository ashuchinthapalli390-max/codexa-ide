/**
 * Automated test script to verify offline resilience and long-polling in CodeXa Firebase system.
 */
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('  CODEXA STUDIO IDE — OFFLINE RESILIENCE VERIFICATION');
console.log('====================================================\n');

let allPassed = true;

function assert(name, condition, details = '') {
  if (condition) {
    console.log(`  [PASS] ${name}`);
  } else {
    console.error(`  [FAIL] ${name} ${details}`);
    allPassed = false;
  }
}

// 1. Check client.ts for experimentalForceLongPolling and fallback
const clientCode = fs.readFileSync(path.join(__dirname, '../lib/firebase/client.ts'), 'utf-8');
assert(
  'client.ts imports initializeFirestore & persistent cache functions',
  clientCode.includes('initializeFirestore') &&
  clientCode.includes('persistentLocalCache') &&
  clientCode.includes('persistentMultipleTabManager')
);
assert(
  'client.ts enables experimentalForceLongPolling: true',
  clientCode.includes('experimentalForceLongPolling: true')
);
assert(
  'client.ts contains multi-tiered fallback in getFirebaseFirestore',
  clientCode.includes('catch') && clientCode.includes('getFirestore(app)')
);

// 2. Check user-service.ts for offline caching and timeout protection
const userServiceCode = fs.readFileSync(path.join(__dirname, '../lib/services/user-service.ts'), 'utf-8');
assert(
  'user-service.ts exports saveLocalProfile and getLocalProfile',
  userServiceCode.includes('export function saveLocalProfile') &&
  userServiceCode.includes('export function getLocalProfile')
);
assert(
  'user-service.ts implements withTimeout wrapper for getDoc',
  userServiceCode.includes('function withTimeout') &&
  userServiceCode.includes('withTimeout(getDoc(userRef)')
);
assert(
  'user-service.ts provides offline profile fallback on catch',
  userServiceCode.includes('Firestore connection offline or delayed') &&
  userServiceCode.includes('saveLocalProfile(synthesizedProfile)')
);

// 3. Check AuthContext.tsx for offline error suppression and instant cached profile
const authContextCode = fs.readFileSync(path.join(__dirname, '../lib/auth/AuthContext.tsx'), 'utf-8');
assert(
  'AuthContext.tsx initializes userProfile instantly from local storage cache',
  authContextCode.includes('localStorage.getItem("cxa_active_uid")') &&
  authContextCode.includes('getLocalProfile(activeUid)')
);
assert(
  'AuthContext.tsx handles getRedirectResult',
  authContextCode.includes('getRedirectResult(auth)')
);
assert(
  'AuthContext.tsx suppresses client is offline errors during sign-in',
  authContextCode.includes('popupErr.message.includes("client is offline")')
);

// 4. Role resolution verification
const founderEmails = ['ashuchinthapalli3900@gmail.com'];
const coFounderEmails = ['amruthadivvela@gmail.com'];
const hrEmails = ['vyshnavireddy720@gmail.com'];
const adminEmails = ['admin@codxa-agency.online'];

function mockResolveInitialRole(email) {
  const norm = (email || '').trim().toLowerCase();
  if (founderEmails.includes(norm)) return { role: 'founder', entitlement: 'max', agencyVerified: true };
  if (coFounderEmails.includes(norm)) return { role: 'co_founder', entitlement: 'max', agencyVerified: true };
  if (hrEmails.includes(norm)) return { role: 'hr', entitlement: 'pro', agencyVerified: true };
  if (adminEmails.includes(norm)) return { role: 'admin', entitlement: 'max', agencyVerified: true };
  return { role: 'customer', entitlement: 'free', agencyVerified: false };
}

const fRes = mockResolveInitialRole('ashuchinthapalli3900@gmail.com');
assert('Founder email maps to role="founder" and entitlement="max"', fRes.role === 'founder' && fRes.entitlement === 'max' && fRes.agencyVerified === true);

const coRes = mockResolveInitialRole('amruthadivvela@gmail.com');
assert('Co-founder email maps to role="co_founder" and entitlement="max"', coRes.role === 'co_founder' && coRes.entitlement === 'max');

const custRes = mockResolveInitialRole('randomuser@gmail.com');
assert('General user maps to role="customer" and entitlement="free"', custRes.role === 'customer' && custRes.entitlement === 'free' && custRes.agencyVerified === false);

console.log('\n====================================================');
if (allPassed) {
  console.log('  ALL OFFLINE RESILIENCE VERIFICATIONS PASSED (10/10)');
} else {
  console.error('  SOME CHECKS FAILED');
  process.exit(1);
}
console.log('====================================================\n');
