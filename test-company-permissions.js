import { hasCompanyFeaturePermission } from './src/middlewares/companyFeaturePermissions.js';

// Test cases for company permissions
const testCases = [
  { tier: 'Holder', isInvestor: false, feature: 'POSTING', expected: false },
  { tier: 'Holder', isInvestor: false, feature: 'CHATTING', expected: false },
  { tier: 'Holder', isInvestor: false, feature: 'INVESTING', expected: false },
  { tier: 'Holder', isInvestor: false, feature: 'RAISING_FUNDS', expected: false },
  
  { tier: 'Holder', isInvestor: true, feature: 'POSTING', expected: true },
  { tier: 'Holder', isInvestor: true, feature: 'CHATTING', expected: true },
  { tier: 'Holder', isInvestor: true, feature: 'INVESTING', expected: true },
  { tier: 'Holder', isInvestor: true, feature: 'RAISING_FUNDS', expected: false },
  
  { tier: 'Hunter', isInvestor: false, feature: 'POSTING', expected: true },
  { tier: 'Hunter', isInvestor: false, feature: 'CHATTING', expected: true },
  { tier: 'Hunter', isInvestor: false, feature: 'INVESTING', expected: false },
  { tier: 'Hunter', isInvestor: false, feature: 'RAISING_FUNDS', expected: false },
  
  { tier: 'Hunter', isInvestor: true, feature: 'POSTING', expected: true },
  { tier: 'Hunter', isInvestor: true, feature: 'CHATTING', expected: true },
  { tier: 'Hunter', isInvestor: true, feature: 'INVESTING', expected: true },
  { tier: 'Hunter', isInvestor: true, feature: 'RAISING_FUNDS', expected: true },
];

let passed = 0;
let failed = 0;

console.log('Testing Company Feature Permissions\n');

testCases.forEach((testCase, index) => {
  const result = hasCompanyFeaturePermission(testCase.tier, testCase.isInvestor, testCase.feature);
  const status = result === testCase.expected ? '✅ PASS' : '❌ FAIL';
  
  console.log(`Test ${index + 1}: ${status}`);
  console.log(`  Tier: ${testCase.tier}, Investor: ${testCase.isInvestor}, Feature: ${testCase.feature}`);
  console.log(`  Expected: ${testCase.expected}, Got: ${result}`);
  console.log('');
  
  if (result === testCase.expected) {
    passed++;
  } else {
    failed++;
  }
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

// Summary of permission matrix
console.log('\nCompany Permission Matrix:');
console.log('| Company Type | Tier | isInvestor | Can Post | Can Chat | Can Invest | Can Raise Funds |');
console.log('|--------------|------|------------|----------|----------|------------|-----------------|');
console.log('| Non-Investor | Holder | false | ❌ | ❌ | ❌ | ❌ |');
console.log('| Investor | Holder | true | ✅ | ✅ | ✅ | ❌ |');
console.log('| Non-Investor | Hunter | false | ✅ | ✅ | ❌ | ❌ |');
console.log('| Investor | Hunter | true | ✅ | ✅ | ✅ | ✅ |'); 