import chalk from 'chalk';
import { fetchAndProcessReleases, extractVersionPrefix } from '../services/releases.js';
import { formatRelease } from '../presentation/formatter.js';
import { printTable, createReleasesTableHeader } from '../presentation/table.js';
import { requireParameter, ValidationError, validateConfig } from '../utils/validation.js';
import { isNewerThan, parseDuration, isWithinLast } from '../utils/date-utils.js';

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

export const filterReleasesInRange = (releases, fromRelease, toRelease) =>
  releases.filter(release =>
    isNewerThan(release.published, fromRelease.published) &&
    !isNewerThan(release.published, toRelease.published)
  );

const filterReleasesByLast = (releases, last) => {
  if (!last) return releases;
  const durationMs = parseDuration(last);
  if (!durationMs) {
    throw new ValidationError(
      `Invalid --last value: ${last}. Use formats like 30m, 24h, 7d`
    );
  }
  return releases.filter(release => isWithinLast(release.published, durationMs));
};

const matchesSearchQuery = (release, query) => {
  const searchableText = [
    release.tag,
    release.name,
    release.releaseNotes
  ].join(' ').toLowerCase();
  
  return searchableText.includes(query.toLowerCase());
};

export const commandReleases = (sinceVersion, config, toVersion) => {
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

  if (toVersion) {
    const toPrefix = extractVersionPrefix(toVersion);
    if (toPrefix !== prefix) {
      throw new ValidationError(
        `Version prefixes must match: ${sinceVersion} (${prefix}) vs ${toVersion} (${toPrefix})`
      );
    }

    const toRelease = findReleaseByVersion(releasesWithPrefix, toVersion);
    if (!toRelease) {
      console.log(chalk.yellow(`\nVersion ${toVersion} not found.`) + ` Showing all releases with prefix "${prefix}":\n`);
      const tableConfig = createReleasesTableHeader();
      printTable(tableConfig);
      releasesWithPrefix.forEach(release =>
        formatRelease(release, { showChanges: true })
      );
      console.log(chalk.dim(`\nTotal: ${releasesWithPrefix.length} release(s)`));
      return;
    }

    if (!isNewerThan(toRelease.published, targetRelease.published)) {
      throw new ValidationError('To version must be newer than from version');
    }

    const rangeReleases = filterReleasesByLast(
      filterReleasesInRange(releasesWithPrefix, targetRelease, toRelease),
      config.last
    );

    console.log(`\nReleases from ${chalk.cyan(sinceVersion)} to ${chalk.cyan(toVersion)} ${chalk.dim(`(prefix: ${prefix}):`)}\n`);
    const tableConfig = createReleasesTableHeader();
    printTable(tableConfig);

    if (rangeReleases.length === 0) {
      console.log(chalk.dim('No releases found in range.'));
    } else {
      rangeReleases.forEach(release =>
        formatRelease(release, { showChanges: true })
      );
      console.log(chalk.dim(`\nTotal: ${rangeReleases.length} release(s)`));
    }
    return;
  }
  
  const newerReleases = filterReleasesByLast(
    filterReleasesNewerThan(releasesWithPrefix, targetRelease),
    config.last
  );
  
  console.log(`\nReleases since ${chalk.cyan(sinceVersion)} ${chalk.dim(`(prefix: ${prefix}):`)}\n`);
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
  
  let filteredReleases = prefix
    ? filterReleasesByPrefix(releases, prefix)
    : releases;

  if (config.last) {
    const durationMs = parseDuration(config.last);
    if (!durationMs) {
      throw new ValidationError(
        `Invalid --last value: ${config.last}. Use formats like 30m, 24h, 7d`
      );
    }
    filteredReleases = filteredReleases.filter(release =>
      isWithinLast(release.published, durationMs)
    );
  }

  const lastSuffix = config.last ? ` (last ${config.last})` : '';
  const title = prefix
    ? `\nReleases with prefix "${prefix}"${lastSuffix}:`
    : `\nAll releases${lastSuffix}:`;
  
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
  rr releases <from> [to]  Compare: What's new since a version, or between two versions
                           Example: rr releases app-25.12.100
                           Example: rr releases app-25.12.100 app-25.12.105

  rr search "<query>"   Search: Find releases by keyword
                        Example: rr search "authentication fix"

  rr list [prefix]      Browse: All releases (optionally filtered)
                        Example: rr list api
                        Example: rr list --last 24h

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
    --last <N>m|h|d    Filter list to releases in the last N minutes/hours/days

EXAMPLES:
  # Setup once
  echo 'export RR_ORG=acme RR_REPO=backend' >> ~/.zshrc

  # Find what changed since production
  rr releases api-2.1.0

  # Compare between two deployed versions
  rr releases api-2.1.0 api-2.1.5

  # Search for security patches
  rr search "CVE"

  # Check a specific release
  rr info api-2.1.5

  # Override for different repo
  rr --org acme --repo frontend list

Need help? Visit: https://github.com/ghershko3/releaseradar
`);
};
