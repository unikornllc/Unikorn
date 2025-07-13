import { 
  hasFeaturePermission, 
  hasUserFeaturePermission, 
  hasCompanyFeaturePermission,
  getFeatureRequirements 
} from './src/middlewares/unifiedFeaturePermissions.js';

// Test user permissions
console.log('=== Testing User Permissions ===');
const userTests = [
  { tier: 'Standard', isInvestor: false, feature: 'POSTING', expected: false },
  { tier: 'Standard', isInvestor: true, feature: 'POSTING', expected: true },
  { tier: 'Pro', isInvestor: false, feature: 'POSTING', expected: true },
  { tier: 'Pro', isInvestor: true, feature: 'POSTING', expected: true },
  { tier: 'Standard', isInvestor: false, feature: 'CHATTING', expected: false },
  { tier: 'Standard', isInvestor: true, feature: 'CHATTING', expected: true },
  { tier: 'Pro', isInvestor: false, feature: 'CHATTING', expected: true },
  { tier: 'Pro', isInvestor: true, feature: 'CHATTING', expected: true },
  { tier: 'Standard', isInvestor: false, feature: 'INVESTING', expected: false },
  { tier: 'Standard', isInvestor: true, feature: 'INVESTING', expected: true },
  { tier: 'Pro', isInvestor: false, feature: 'INVESTING', expected: false },
  { tier: 'Pro', isInvestor: true, feature: 'INVESTING', expected: true },
  { tier: 'Standard', isInvestor: false, feature: 'RAISING_FUNDS', expected: false },
  { tier: 'Standard', isInvestor: true, feature: 'RAISING_FUNDS', expected: false },
  { tier: 'Pro', isInvestor: false, feature: 'RAISING_FUNDS', expected: false },
  { tier: 'Pro', isInvestor: true, feature: 'RAISING_FUNDS', expected: true },
];

userTests.forEach(test => {
  const result = hasUserFeaturePermission(test.tier, test.isInvestor, test.feature);
  const status = result === test.expected ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} User ${test.tier} ${test.isInvestor ? 'Investor' : 'Non-Investor'} ${test.feature}: ${result} (expected: ${test.expected})`);
});

// Test company permissions
console.log('\n=== Testing Company Permissions ===');
const companyTests = [
  { tier: 'Holder', isInvestor: false, feature: 'POSTING', expected: false },
  { tier: 'Holder', isInvestor: true, feature: 'POSTING', expected: true },
  { tier: 'Hunter', isInvestor: false, feature: 'POSTING', expected: true },
  { tier: 'Hunter', isInvestor: true, feature: 'POSTING', expected: true },
  { tier: 'Holder', isInvestor: false, feature: 'CHATTING', expected: false },
  { tier: 'Holder', isInvestor: true, feature: 'CHATTING', expected: true },
  { tier: 'Hunter', isInvestor: false, feature: 'CHATTING', expected: true },
  { tier: 'Hunter', isInvestor: true, feature: 'CHATTING', expected: true },
  { tier: 'Holder', isInvestor: false, feature: 'INVESTING', expected: false },
  { tier: 'Holder', isInvestor: true, feature: 'INVESTING', expected: true },
  { tier: 'Hunter', isInvestor: false, feature: 'INVESTING', expected: false },
  { tier: 'Hunter', isInvestor: true, feature: 'INVESTING', expected: true },
  { tier: 'Holder', isInvestor: false, feature: 'RAISING_FUNDS', expected: false },
  { tier: 'Holder', isInvestor: true, feature: 'RAISING_FUNDS', expected: false },
  { tier: 'Hunter', isInvestor: false, feature: 'RAISING_FUNDS', expected: false },
  { tier: 'Hunter', isInvestor: true, feature: 'RAISING_FUNDS', expected: true },
];

companyTests.forEach(test => {
  const result = hasCompanyFeaturePermission(test.tier, test.isInvestor, test.feature);
  const status = result === test.expected ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} Company ${test.tier} ${test.isInvestor ? 'Investor' : 'Non-Investor'} ${test.feature}: ${result} (expected: ${test.expected})`);
});

// Test unified function
console.log('\n=== Testing Unified Function ===');
const unifiedTests = [
  { accountType: 'user', tier: 'Standard', isInvestor: true, feature: 'POSTING', expected: true },
  { accountType: 'user', tier: 'Standard', isInvestor: false, feature: 'POSTING', expected: false },
  { accountType: 'company', tier: 'Holder', isInvestor: true, feature: 'POSTING', expected: true },
  { accountType: 'company', tier: 'Holder', isInvestor: false, feature: 'POSTING', expected: false },
  { accountType: 'user', tier: 'Pro', isInvestor: true, feature: 'RAISING_FUNDS', expected: true },
  { accountType: 'company', tier: 'Hunter', isInvestor: true, feature: 'RAISING_FUNDS', expected: true },
];

unifiedTests.forEach(test => {
  const result = hasFeaturePermission(test.accountType, test.tier, test.isInvestor, test.feature);
  const status = result === test.expected ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${test.accountType} ${test.tier} ${test.isInvestor ? 'Investor' : 'Non-Investor'} ${test.feature}: ${result} (expected: ${test.expected})`);
});

// Test feature requirements
console.log('\n=== Testing Feature Requirements ===');
const features = ['POSTING', 'CHATTING', 'INVESTING', 'RAISING_FUNDS'];
features.forEach(feature => {
  const userReqs = getFeatureRequirements(feature, 'user');
  const companyReqs = getFeatureRequirements(feature, 'company');
  console.log(`${feature} - User requirements: ${userReqs.join(', ')}`);
  console.log(`${feature} - Company requirements: ${companyReqs.join(', ')}`);
});

console.log('\n=== Test Summary ===');
console.log('All tests completed. Check the results above for any failures.'); 