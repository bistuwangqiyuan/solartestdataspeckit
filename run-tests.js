#!/usr/bin/env node

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function runTests() {
  console.log('🧪 Starting comprehensive test suite...\n');

  const testSuites = [
    {
      name: 'Unit Tests',
      command: 'npm test -- --passWithNoTests',
      description: 'Testing individual components'
    },
    {
      name: 'Test Coverage',
      command: 'npm run test:coverage -- --passWithNoTests',
      description: 'Generating code coverage report'
    }
  ];

  const results = {
    passed: [],
    failed: []
  };

  for (const suite of testSuites) {
    console.log(`\n📋 Running ${suite.name}...`);
    console.log(`   ${suite.description}`);
    
    try {
      const { stdout, stderr } = await execAsync(suite.command);
      console.log(stdout);
      if (stderr) console.error(stderr);
      results.passed.push(suite.name);
      console.log(`✅ ${suite.name} completed successfully`);
    } catch (error) {
      console.error(`❌ ${suite.name} failed:`);
      console.error(error.message);
      results.failed.push(suite.name);
    }
  }

  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  
  if (results.passed.length > 0) {
    console.log('\nPassed suites:');
    results.passed.forEach(suite => console.log(`  - ${suite}`));
  }
  
  if (results.failed.length > 0) {
    console.log('\nFailed suites:');
    results.failed.forEach(suite => console.log(`  - ${suite}`));
    process.exit(1);
  }

  console.log('\n🎉 All tests completed!');
  console.log('\nNote: E2E tests (Cypress) should be run separately with the dev server running:');
  console.log('  1. Start dev server: npm run dev');
  console.log('  2. Run Cypress: npm run cypress:open (or npm run cypress:run)');
}

// Run the tests
runTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});