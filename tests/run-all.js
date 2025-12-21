#!/usr/bin/env node

import { spawnSync } from 'child_process';

const tests = [
  'tests/formatting.test.js',
  'tests/github.test.js'
];

console.log('🧪 Running all tests...\n');
console.log('='.repeat(60));
console.log('\n');

let passed = 0;
let failed = 0;

for (const test of tests) {
  const result = spawnSync('node', [test], { encoding: 'utf-8' });
  
  if (result.status === 0) {
    console.log(result.stdout);
    passed++;
  } else {
    console.error(`❌ ${test} failed:`);
    console.error(result.stderr);
    console.error(result.stdout);
    failed++;
  }
}

console.log('='.repeat(60));
console.log(`\n📊 Test Summary: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}

