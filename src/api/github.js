import { executeCommand, checkCommandExists } from '../utils/shell-utils.js';
import { GitHubApiError } from '../utils/validation.js';
import { RELEASES_PER_PAGE, MAX_BUFFER_SIZE } from '../utils/constants.js';

export const checkGitHubCliInstalled = () => {
  if (!checkCommandExists('gh')) {
    const errorMessage = [
      '\n❌ Error: GitHub CLI (gh) is not installed or not in PATH',
      '\nPlease install GitHub CLI:',
      '  macOS:   brew install gh',
      '  Linux:   https://github.com/cli/cli/blob/trunk/docs/install_linux.md',
      '  Windows: https://github.com/cli/cli/releases\n'
    ].join('\n');
    
    throw new GitHubApiError(errorMessage);
  }
};

export const checkGitHubAuthentication = () => {
  try {
    const result = executeCommand('gh auth status 2>&1');
    
    if (!result?.includes('Logged in to github.com')) {
      throw new Error('Not authenticated');
    }
  } catch {
    const errorMessage = [
      '\n❌ Error: GitHub CLI is not authenticated',
      '\nPlease authenticate with GitHub:',
      '  Run: gh auth login\n'
    ].join('\n');
    
    throw new GitHubApiError(errorMessage);
  }
};

export const checkGitHubCli = () => {
  checkGitHubCliInstalled();
  checkGitHubAuthentication();
};

export const fetchReleasesFromGitHub = (org, repo, limit = 300) => {
  console.log('Fetching from GitHub API...');
  
  const totalPages = Math.ceil(limit / RELEASES_PER_PAGE);
  const allReleases = [];
  
  for (let page = 1; page <= totalPages; page++) {
    const apiEndpoint = `/repos/${org}/${repo}/releases`;
    const params = `per_page=${RELEASES_PER_PAGE}&page=${page}`;
    const command = `gh api "${apiEndpoint}?${params}"`;
    
    try {
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
    } catch (error) {
      if (page === 1) {
        throw error;
      }
      console.log(`Warning: Failed to fetch page ${page}, using ${allReleases.length} releases from previous pages`);
      break;
    }
  }
  
  const limitedReleases = allReleases.slice(0, limit);
  console.log(`Fetched ${limitedReleases.length} release(s) from GitHub`);
  
  return limitedReleases;
};
