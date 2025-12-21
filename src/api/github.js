import chalk from 'chalk';
import { executeCommand, checkCommandExists } from '../utils/shell-utils.js';
import { GitHubApiError } from '../utils/validation.js';
import { RELEASES_PER_PAGE, MAX_BUFFER_SIZE } from '../utils/constants.js';

export const checkGitHubCliInstalled = () => {
  if (!checkCommandExists('gh')) {
    console.error(chalk.red('\nGitHub CLI (gh) is not installed or not in PATH'));
    console.log('\nInstall GitHub CLI:');
    console.log(chalk.dim('  macOS:   brew install gh'));
    console.log(chalk.dim('  Linux:   https://github.com/cli/cli/blob/trunk/docs/install_linux.md'));
    console.log(chalk.dim('  Windows: https://github.com/cli/cli/releases\n'));
    
    throw new GitHubApiError('GitHub CLI not found');
  }
};

export const checkGitHubAuthentication = () => {
  try {
    const result = executeCommand('gh auth status 2>&1');
    
    if (!result?.includes('Logged in to github.com')) {
      throw new Error('Not authenticated');
    }
  } catch {
    console.error(chalk.red('\nGitHub CLI is not authenticated'));
    console.log('\nAuthenticate with GitHub:');
    console.log(chalk.dim('  Run: gh auth login\n'));
    
    throw new GitHubApiError('GitHub CLI not authenticated');
  }
};

export const checkGitHubCli = () => {
  checkGitHubCliInstalled();
  checkGitHubAuthentication();
};

export const fetchReleasesFromGitHub = (org, repo, limit = 300) => {
  process.stdout.write(chalk.dim(`Fetching releases from ${chalk.cyan(org + '/' + repo)}...`));
  
  const totalPages = Math.ceil(limit / RELEASES_PER_PAGE);
  const allReleases = [];
  
  try {
    for (let page = 1; page <= totalPages; page++) {
      const apiEndpoint = `/repos/${org}/${repo}/releases`;
      const params = `per_page=${RELEASES_PER_PAGE}&page=${page}`;
      const command = `gh api "${apiEndpoint}?${params}"`;
      
      const result = executeCommand(command, { 
        maxBuffer: MAX_BUFFER_SIZE 
      });
      
      const pageReleases = JSON.parse(result);
      
      if (!Array.isArray(pageReleases) || pageReleases.length === 0) {
        break;
      }
      
      allReleases.push(...pageReleases);
      
      if (pageReleases.length < RELEASES_PER_PAGE || allReleases.length >= limit) {
        break;
      }
    }
    
    const limitedReleases = allReleases.slice(0, limit);
    process.stdout.write('\r' + ' '.repeat(80) + '\r');
    
    return limitedReleases;
  } catch (error) {
    process.stdout.write('\r' + ' '.repeat(80) + '\r');
    throw error;
  }
};
