import assert from 'assert';
import { extractVersionPrefix, extractFirstChangeFromNotes } from '../src/utils/string-utils.js';
import { formatIsoDate } from '../src/utils/date-utils.js';

console.log('Running formatting tests...\n');

// extractVersionPrefix() should extract the service/component name from version tags
(() => {
  assert.strictEqual(extractVersionPrefix('app-25.12.105'), 'app-');
  assert.strictEqual(extractVersionPrefix('apex-25.12.16'), 'apex-');
  assert.strictEqual(extractVersionPrefix('ai-soc-25.12.23'), 'ai-soc-');
  assert.strictEqual(extractVersionPrefix('ui-25.12.36'), 'ui-');
  console.log('✓ extractVersionPrefix() extracts prefixes correctly');
})();

// extractVersionPrefix() should handle edge cases
(() => {
  assert.strictEqual(extractVersionPrefix(null), null);
  assert.strictEqual(extractVersionPrefix(''), null);
  assert.strictEqual(extractVersionPrefix('nodashversion'), null);
  console.log('✓ extractVersionPrefix() handles edge cases');
})();

// extractVersionPrefix() should return consistent results
(() => {
  const version = 'app-25.12.105';
  const first = extractVersionPrefix(version);
  const second = extractVersionPrefix(version);
  assert.strictEqual(first, second);
  assert.strictEqual(first, 'app-');
  console.log('✓ extractVersionPrefix() returns consistent results');
})();

// formatIsoDate() should convert ISO dates to readable format
(() => {
  const isoDate = '2025-12-18T14:13:40Z';
  const formatted = formatIsoDate(isoDate);
  assert.strictEqual(formatted, '2025-12-18 14:13:40');
  console.log('✓ formatIsoDate() formats ISO dates correctly');
})();

// extractFirstChangeFromNotes() should extract the main change from release notes
(() => {
  const body = `Release created by johndoe
**🚀 Services tagged in this release: app**

## What's Changed
* SP-62488 - fix upload image to notes by @johndoe in https://github.com/myorg/myrepo/pull/12946


**Full Changelog**: https://github.com/myorg/myrepo/compare/ai-soc-25.12.23...app-25.12.107`;
  
  const changes = extractFirstChangeFromNotes(body);
  assert.strictEqual(changes, 'SP-62488 - fix upload image to notes');
  console.log('✓ extractFirstChangeFromNotes() extracts and cleans change text');
})();

// extractFirstChangeFromNotes() should handle missing or empty body
(() => {
  assert.strictEqual(extractFirstChangeFromNotes(''), '');
  assert.strictEqual(extractFirstChangeFromNotes(null), '');
  assert.strictEqual(extractFirstChangeFromNotes('No bullet points here'), '');
  console.log('✓ extractFirstChangeFromNotes() handles missing content gracefully');
})();

console.log('\n✅ All formatting tests passed!\n');

