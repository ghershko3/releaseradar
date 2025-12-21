import chalk from 'chalk';
import { fetchAndProcessReleases, extractVersionPrefix } from '../services/releases.js';
import { formatRelease } from '../presentation/formatter.js';
import { printTable, createReleasesTableHeader } from '../presentation/table.js';
import { requireParameter, ValidationError, validateConfig } from '../utils/validation.js';
import { isNewerThan } from '../utils/date-utils.js';

const findReleaseByVersion = (releases, version) => {
  return releases.find(release => release.tag === version);
};

const filterReleasesByPrefix = (releases, prefix) => {
  return releases.filter(release => extractVersionPrefix(release.tag) === prefix);
};

const filterReleasesNewerThan = (releases, targetRelease) => {
  return releases.filter(release => 
    isNewerThan(release.published, targetRelease.published)
  );
};

const matchesSearchQuery = (release, query) => {
  const searchableText = [
    release.tag,
    release.name,
    release.releaseNotes
  ].join(' ').toLowerCase();
  
  return searchableText.includes(query.toLowerCase());
};

export const commandReleases = (sinceVersion, config) => {
  requireParameter(sinceVersion, 'releases');
  
  const releases = fetchAndProcessReleases(config);
  const prefix = extractVersionPrefix(sinceVersion);
  
  if (!prefix) {
    throw new ValidationError(`Could not extract prefix from version: ${sinceVersion}`);
  }
  
  const releasesWithPrefix = filterReleasesByPrefix(releases, prefix);
  const targetRelease = findReleaseByVersion(releasesWithPrefix, sinceVersion);
  
  if (!targetRelease) {
    console.log(chalk.yellow(`\nVersion ${sinceVersion} not found.`) + ` Showing all releases with prefix "${prefix}":\n`);
    const tableConfig = createReleasesTableHeader();
    printTable(tableConfig);
    releasesWithPrefix.forEach(release => 
      formatRelease(release, { showChanges: true })
    );
    console.log(chalk.dim(`\nTotal: ${releasesWithPrefix.length} release(s)`));
    return;
  }
  
  const newerReleases = filterReleasesNewerThan(releasesWithPrefix, targetRelease);
  
  console.log(`\nReleases since ${chalk.cyan(sinceVersion)} ${chalk.dim(`(prefix: ${prefix}):`)}\\n`);
  const tableConfig = createReleasesTableHeader();
  printTable(tableConfig);
  
  if (newerReleases.length === 0) {
    console.log(chalk.dim('No newer releases found.'));
  } else {
    newerReleases.forEach(release => 
      formatRelease(release, { showChanges: true })
    );
    console.log(chalk.dim(`\nTotal: ${newerReleases.length} release(s)`));
  }
};

export const commandInfo = (version, config) => {
  requireParameter(version, 'info');
  
  const releases = fetchAndProcessReleases(config);
  const release = findReleaseByVersion(releases, version);
  
  if (!release) {
    throw new ValidationError(`Release not found: ${version}`);
  }
  
  formatRelease(release, { detailed: true });
};

export const commandSearch = (query, config) => {
  requireParameter(query, 'search');
  
  const releases = fetchAndProcessReleases(config);
  const matchingReleases = releases.filter(release => 
    matchesSearchQuery(release, query)
  );
  
  console.log(`\nSearch results for "${query}":\n`);
  const tableConfig = createReleasesTableHeader();
  printTable(tableConfig);
  
  if (matchingReleases.length === 0) {
    console.log(chalk.dim('No matches found.'));
  } else {
    matchingReleases.forEach(release => 
      formatRelease(release, { showChanges: true })
    );
    console.log(chalk.dim(`\nTotal: ${matchingReleases.length} match(es)`));
  }
};

export const commandList = (prefix, config) => {
  const releases = fetchAndProcessReleases(config);
  
  const filteredReleases = prefix 
    ? filterReleasesByPrefix(releases, prefix)
    : releases;
  
  const title = prefix 
    ? `\nReleases with prefix "${prefix}":`
    : '\nAll releases:';
  
  console.log(`${title}\n`);
  
  const tableConfig = createReleasesTableHeader();
  printTable(tableConfig);
  
  filteredReleases.forEach(release => 
    formatRelease(release, { showChanges: true })
  );
  
  console.log(chalk.dim(`\nTotal: ${filteredReleases.length} release(s)`));
};

export const showHelp = () => {
  console.log(`
ReleaseRadar (rr) 🚀

QUICK START:
  # Set once in ~/.zshrc or ~/.bashrc
  export RR_ORG=myorg RR_REPO=myrepo
  
  # Start using immediately!
  rr list

COMMANDS:
  rr releases <tag>     Compare: What's new since this version?
                        Example: rr releases app-25.12.100

  rr search "<query>"   Search: Find releases by keyword
                        Example: rr search "authentication fix"

  rr list [prefix]      Browse: All releases (optionally filtered)
                        Example: rr list api

  rr info <tag>         Details: Full info about a release
                        Example: rr info app-25.12.107

CONFIGURATION:
  Environment Variables (recommended):
    RR_ORG=myorg       Your GitHub organization
    RR_REPO=myrepo     Your repository name
    RR_LIMIT=500       Max releases to fetch (default: 300)

  Override with flags:
    --org <name>       One-time org override
    --repo <name>      One-time repo override

EXAMPLES:
  # Setup once
  echo 'export RR_ORG=acme RR_REPO=backend' >> ~/.zshrc

  # Find what changed since production
  rr releases api-2.1.0

  # Search for security patches
  rr search "CVE"

  # Check a specific release
  rr info api-2.1.5

  # Override for different repo
  rr --org acme --repo frontend list

Need help? Visit: https://github.com/ghershko3/releaseradar
`);
};
