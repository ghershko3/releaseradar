import assert from 'assert';
import { extractPrefix } from '../src/services/releases.js';
import { formatDate, extractWhatsChanged } from '../src/presentation/formatter.js';

console.log('Running formatting tests...\n');

// extractPrefix() should extract the service/component name from version tags
(() => {
  assert.strictEqual(extractPrefix('app-25.12.105'), 'app-');
  assert.strictEqual(extractPrefix('apex-25.12.16'), 'apex-');
  assert.strictEqual(extractPrefix('ai-soc-25.12.23'), 'ai-soc-');
  assert.strictEqual(extractPrefix('ui-25.12.36'), 'ui-');
  console.log('✓ extractPrefix() extracts prefixes correctly');
})();

// extractPrefix() should handle edge cases
(() => {
  assert.strictEqual(extractPrefix(null), null);
  assert.strictEqual(extractPrefix(''), null);
  assert.strictEqual(extractPrefix('nodashversion'), null);
  console.log('✓ extractPrefix() handles edge cases');
})();

// extractPrefix() should return consistent results
(() => {
  const version = 'app-25.12.105';
  const first = extractPrefix(version);
  const second = extractPrefix(version);
  assert.strictEqual(first, second);
  assert.strictEqual(first, 'app-');
  console.log('✓ extractPrefix() returns consistent results');
})();

// formatDate() should convert ISO dates to readable format
(() => {
  const isoDate = '2025-12-18T14:13:40Z';
  const formatted = formatDate(isoDate);
  assert.strictEqual(formatted, '2025-12-18 14:13:40');
  console.log('✓ formatDate() formats ISO dates correctly');
})();

// extractWhatsChanged() should extract the main change from release notes
(() => {
  const body = `Release created by johndoe
**🚀 Services tagged in this release: app**

## What's Changed
* SP-62488 - fix upload image to notes by @johndoe in https://github.com/myorg/myrepo/pull/12946


**Full Changelog**: https://github.com/myorg/myrepo/compare/ai-soc-25.12.23...app-25.12.107`;
  
  const changes = extractWhatsChanged(body);
  assert.strictEqual(changes, 'SP-62488 - fix upload image to notes');
  console.log('✓ extractWhatsChanged() extracts and cleans change text');
})();

// extractWhatsChanged() should handle missing or empty body
(() => {
  assert.strictEqual(extractWhatsChanged(''), '');
  assert.strictEqual(extractWhatsChanged(null), '');
  assert.strictEqual(extractWhatsChanged('No bullet points here'), '');
  console.log('✓ extractWhatsChanged() handles missing content gracefully');
})();

console.log('\n✅ All formatting tests passed!\n');

