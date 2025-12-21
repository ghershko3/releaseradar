import chalk from 'chalk';
import { formatIsoDate } from '../utils/date-utils.js';
import { extractFirstChangeFromNotes, truncateText, padText } from '../utils/string-utils.js';
import { createSeparator } from './table.js';
import { TABLE_WIDTHS } from '../utils/constants.js';

export const formatReleaseDetailed = (release) => {
  if (!release?.tag) return;
  
  const maxWidth = 80;
  const border = '═'.repeat(maxWidth);
  const light = '─'.repeat(maxWidth);
  
  console.log(chalk.dim(border));
  console.log(chalk.cyan.bold(`  ${release.tag}`));
  console.log(chalk.dim(light));
  
  const formatRow = (label, value, dimValue = false) => {
    const padding = ' '.repeat(2);
    const labelFormatted = chalk.dim(label.padEnd(12));
    const valueFormatted = dimValue ? chalk.dim(value) : value;
    console.log(`${padding}${labelFormatted}${valueFormatted}`);
  };
  
  formatRow('Published:', formatIsoDate(release.published), true);
  formatRow('Author:', release.author);
  formatRow('Repository:', release.repo, true);
  
  if (release.commitSha) {
    formatRow('Commit:', release.commitSha.substring(0, 12), true);
  }
  
  formatRow('URL:', release.url, true);
  
  if (release.releaseNotes && release.releaseNotes.trim()) {
    console.log(chalk.dim(light));
    console.log(chalk.dim('  Release Notes:'));
    console.log();
    const notes = release.releaseNotes.split('\n').map(line => `  ${line}`).join('\n');
    console.log(notes);
  }
  
  console.log(chalk.dim(border));
};

export const formatReleaseCompact = (release, options = {}) => {
  if (!release?.tag) return;
  
  const { showChanges = false } = options;
  const tag = chalk.cyan(padText(release.tag, TABLE_WIDTHS.TAG));
  const date = chalk.dim(padText(formatIsoDate(release.published).substring(0, 16), TABLE_WIDTHS.DATE));
  const author = padText(release.author, TABLE_WIDTHS.AUTHOR);
  
  if (showChanges) {
    const changes = extractFirstChangeFromNotes(release.releaseNotes);
    const truncatedChanges = truncateText(changes, TABLE_WIDTHS.CHANGES);
    const changesPadded = padText(truncatedChanges, TABLE_WIDTHS.CHANGES);
    console.log(`${tag} ${date} ${author} ${changesPadded}`);
  } else {
    const repo = padText(release.repo, TABLE_WIDTHS.REPO);
    console.log(`${tag} ${repo} ${date} ${author}`);
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
