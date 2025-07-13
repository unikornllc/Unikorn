// Test script for feature permissions
import { hasFeaturePermission } from './src/middlewares/featurePermissions.js';

console.log('Testing Feature Permission System\n');

// Test cases
const testCases = [
  { tier: 'Standard', isInvestor: false, feature: 'POSTING', expected: false },
  { tier: 'Standard', isInvestor: false, feature: 'CHATTING', expected: false },
  { tier: 'Standard', isInvestor: false, feature: 'INVESTING', expected: false },
  { tier: 'Standard', isInvestor: false, feature: 'RAISING_FUNDS', expected: false },
  
  { tier: 'Standard', isInvestor: true, feature: 'POSTING', expected: true },
  { tier: 'Standard', isInvestor: true, feature: 'CHATTING', expected: true },
  { tier: 'Standard', isInvestor: true, feature: 'INVESTING', expected: true },
  { tier: 'Standard', isInvestor: true, feature: 'RAISING_FUNDS', expected: false },
  
  { tier: 'Pro', isInvestor: false, feature: 'POSTING', expected: true },
  { tier: 'Pro', isInvestor: false, feature: 'CHATTING', expected: true },
  { tier: 'Pro', isInvestor: false, feature: 'INVESTING', expected: false },
  { tier: 'Pro', isInvestor: false, feature: 'RAISING_FUNDS', expected: false },
  
  { tier: 'Pro', isInvestor: true, feature: 'POSTING', expected: true },
  { tier: 'Pro', isInvestor: true, feature: 'CHATTING', expected: true },
  { tier: 'Pro', isInvestor: true, feature: 'INVESTING', expected: true },
  { tier: 'Pro', isInvestor: true, feature: 'RAISING_FUNDS', expected: true },
];

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = hasFeaturePermission(testCase.tier, testCase.isInvestor, testCase.feature);
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

console.log(`\nTest Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All tests passed! Permission system is working correctly.');
} else {
  console.log('⚠️  Some tests failed. Please check the permission configuration.');
} 