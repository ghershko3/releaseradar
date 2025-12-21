import assert from 'assert';
import { extractRealAuthorFromReleaseNotes } from '../src/services/releases.js';

console.log('Running GitHub tests...\n');

(() => {
  const releaseNotes = `Release created by johndoe
**🚀 Services tagged in this release: app**`;
  
  const author = extractRealAuthorFromReleaseNotes(releaseNotes, 'bot');
  assert.strictEqual(author, 'johndoe');
  console.log('✓ extractRealAuthorFromReleaseNotes() finds author from "Release created by"');
})();

(() => {
  const releaseNotes = `* SP-62488 - fix upload image to notes by @johndoe in https://github.com/pull/123`;
  
  const author = extractRealAuthorFromReleaseNotes(releaseNotes, 'bot');
  assert.strictEqual(author, 'johndoe');
  console.log('✓ extractRealAuthorFromReleaseNotes() finds author from PR mention');
})();

(() => {
  const releaseNotes = `No author information here`;
  
  const author = extractRealAuthorFromReleaseNotes(releaseNotes, 'defaultBot');
  assert.strictEqual(author, 'defaultBot');
  console.log('✓ extractRealAuthorFromReleaseNotes() returns fallback when no patterns match');
})();

(() => {
  assert.strictEqual(extractRealAuthorFromReleaseNotes(null, 'fallback'), 'fallback');
  assert.strictEqual(extractRealAuthorFromReleaseNotes('', 'fallback'), 'fallback');
  console.log('✓ extractRealAuthorFromReleaseNotes() handles null/empty releaseNotes');
})();

console.log('\n✅ All GitHub tests passed!\n');
