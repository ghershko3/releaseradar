import { formatIsoDate } from '../utils/date-utils.js';
import { extractFirstChangeFromNotes, truncateText, padText } from '../utils/string-utils.js';
import { createSeparator } from './table.js';
import { TABLE_WIDTHS } from '../utils/constants.js';

export const formatReleaseDetailed = (release) => {
  if (!release?.tag) return;
  
  const separator = createSeparator(TABLE_WIDTHS.SEPARATOR_STANDARD);
  
  console.log(separator);
  console.log(`Tag:       ${release.tag}`);
  console.log(`Name:      ${release.name}`);
  console.log(`Repo:      ${release.repo}`);
  console.log(`Published: ${formatIsoDate(release.published)}`);
  console.log(`Author:    ${release.author}`);
  console.log(`URL:       ${release.url}`);
  
  if (release.commitSha) {
    console.log(`Commit:    ${release.commitSha}`);
  }
  
  if (release.releaseNotes) {
    console.log(`\nRelease Notes:\n${release.releaseNotes}`);
  }
  
  console.log(separator);
};

export const formatReleaseCompact = (release, options = {}) => {
  if (!release?.tag) return;
  
  const { showChanges = false } = options;
  const tag = padText(release.tag, TABLE_WIDTHS.TAG);
  const date = padText(formatIsoDate(release.published).substring(0, 16), TABLE_WIDTHS.DATE);
  const author = padText(release.author, TABLE_WIDTHS.AUTHOR);
  
  if (showChanges) {
    const changes = extractFirstChangeFromNotes(release.releaseNotes);
    const truncatedChanges = truncateText(changes, TABLE_WIDTHS.CHANGES);
    const changesPadded = padText(truncatedChanges, TABLE_WIDTHS.CHANGES);
    console.log(`${tag} ${date} ${author} ${changesPadded}`);
  } else {
    const repo = padText(release.repo, TABLE_WIDTHS.REPO);
    console.log(`${tag.substring(0, 25).padEnd(25)} ${repo} ${date} ${author}`);
  }
};

export const formatRelease = (release, options = {}) => {
  const { detailed = false, showChanges = false } = options;
  
  if (detailed) {
    formatReleaseDetailed(release);
  } else {
    formatReleaseCompact(release, { showChanges });
  }
};
