import { fetchReleasesFromGitHub } from '../api/github.js';
import { extractVersionPrefix } from '../utils/string-utils.js';
import { validateReleases } from '../utils/validation.js';
import { RELEASE_AUTHOR_PATTERN, PR_AUTHOR_PATTERN } from '../utils/constants.js';

export const extractRealAuthorFromReleaseNotes = (releaseNotes, fallbackAuthor) => {
  if (!releaseNotes) return fallbackAuthor;
  
  const createdByMatch = releaseNotes.match(RELEASE_AUTHOR_PATTERN);
  if (createdByMatch) {
    return createdByMatch[1];
  }
  
  const prAuthorMatch = releaseNotes.match(PR_AUTHOR_PATTERN);
  if (prAuthorMatch) {
    return prAuthorMatch[1];
  }
  
  return fallbackAuthor;
};

export const transformReleaseData = (release, repoName) => {
  const botAuthor = release?.author?.login ?? 'unknown';
  const releaseNotes = release.body ?? '';
  const realAuthor = extractRealAuthorFromReleaseNotes(releaseNotes, botAuthor);
  
  return {
    tag: release.tag_name,
    name: release.name || release.tag_name,
    repo: repoName,
    published: release.published_at,
    author: realAuthor,
    releaseNotes,
    url: release.html_url,
    commitSha: release.target_commitish
  };
};

export const sortReleasesByDate = (releases) => {
  return releases.sort((a, b) => 
    new Date(b.published).getTime() - new Date(a.published).getTime()
  );
};

export const fetchAndProcessReleases = (config) => {
  const { org, repo, releaseLimit } = config;
  
  const rawReleases = fetchReleasesFromGitHub(org, repo, releaseLimit);
  validateReleases(rawReleases);
  
  console.log('Processing releases...');
  
  const processedReleases = rawReleases
    .filter(release => release?.tag_name)
    .map(release => transformReleaseData(release, repo));
  
  const sortedReleases = sortReleasesByDate(processedReleases);
  
  console.log(`Processed ${sortedReleases.length} release(s)\n`);
  
  return sortedReleases;
};

export { extractVersionPrefix };
