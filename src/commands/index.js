import { fetchAndProcessReleases, extractVersionPrefix } from '../services/releases.js';
import { formatRelease } from '../presentation/formatter.js';
import { printTable, createReleasesTableHeader } from '../presentation/table.js';
import { requireParameter, ValidationError, validateConfig } from '../utils/validation.js';
import { isNewerThan } from '../utils/date-utils.js';
import { createInterface } from 'readline';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

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
    console.log(`Version ${sinceVersion} not found. Showing all releases with prefix "${prefix}":\n`);
    const tableConfig = createReleasesTableHeader(true);
    printTable(tableConfig);
    releasesWithPrefix.forEach(release => 
      formatRelease(release, { showChanges: true })
    );
    console.log(`\nTotal: ${releasesWithPrefix.length} release(s)`);
    return;
  }
  
  const newerReleases = filterReleasesNewerThan(releasesWithPrefix, targetRelease);
  
  console.log(`Releases since ${sinceVersion} (prefix: ${prefix}):\n`);
  const tableConfig = createReleasesTableHeader(true);
  printTable(tableConfig);
  
  if (newerReleases.length === 0) {
    console.log('No newer releases found.');
  } else {
    newerReleases.forEach(release => 
      formatRelease(release, { showChanges: true })
    );
    console.log(`\nTotal: ${newerReleases.length} release(s)`);
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
  
  console.log(`Search results for "${query}":\n`);
  const tableConfig = createReleasesTableHeader(true);
  printTable(tableConfig);
  
  if (matchingReleases.length === 0) {
    console.log('No matches found.');
  } else {
    matchingReleases.forEach(release => 
      formatRelease(release, { showChanges: true })
    );
    console.log(`\nTotal: ${matchingReleases.length} match(es)`);
  }
};

export const commandList = (prefix, config, options = {}) => {
  const releases = fetchAndProcessReleases(config);
  
  const filteredReleases = prefix 
    ? filterReleasesByPrefix(releases, prefix)
    : releases;
  
  const title = prefix 
    ? `Releases with prefix "${prefix}":`
    : 'All releases:';
  
  console.log(`${title}\n`);
  
  const { showChanges = false } = options;
  const tableConfig = createReleasesTableHeader(showChanges);
  printTable(tableConfig);
  
  filteredReleases.forEach(release => 
    formatRelease(release, { showChanges })
  );
  
  console.log(`\nTotal: ${filteredReleases.length} release(s)`);
};

const promptUser = (question) => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
};

export const commandInit = async () => {
  console.log('\n🔧 ReleaseRadar - Configuration Setup\n');
  console.log('This will save default config to ~/.releaseradar/config.json');
  console.log('(Optional - you can also use --org and --repo flags instead)\n');
  
  const org = await promptUser('GitHub organization name: ');
  const repo = await promptUser('GitHub repository name: ');
  const releaseLimitInput = await promptUser('Release limit (default: 300): ');
  
  const releaseLimit = releaseLimitInput ? parseInt(releaseLimitInput, 10) : 300;
  
  const config = {
    org: org || 'myorg',
    repo: repo || 'myrepo',
    releaseLimit: isNaN(releaseLimit) ? 300 : releaseLimit
  };
  
  try {
    validateConfig(config);
  } catch (error) {
    console.error(`\n❌ Invalid configuration: ${error.message}\n`);
    process.exit(1);
  }
  
  const configDir = join(homedir(), '.releaseradar');
  const configPath = join(configDir, 'config.json');
  
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }
  
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  console.log(`\n✅ Configuration saved to ${configPath}`);
  console.log('\nYou can now use gvm without flags:');
  console.log('  gvm list');
  console.log('  gvm releases <version>');
  console.log('\nOr override with flags anytime:');
  console.log('  gvm --org otherorg --repo otherrepo list\n');
};

export const showHelp = (config) => {
  const configInfo = config 
    ? `Stored config: ${config.org}/${config.repo} (limit: ${config.releaseLimit})`
    : 'No stored config (optional - use flags or run "gvm init")';
  
  console.log(`
GitHub Version Management Tool (gvm)

Usage:
  gvm init               Set up default configuration (optional)
  gvm releases <version>  Show releases since a specific version (same prefix)
  gvm info <version>      Show detailed info about a specific release
  gvm search <query>      Search across all releases
  gvm list [prefix]       List all releases, optionally filtered by prefix
  gvm help               Show this help message

Config Flags (override stored config or use without init):
  --org <name>           GitHub organization name
  --repo <name>          GitHub repository name
  --limit <number>       Max releases to fetch (default: 300)

Display Flags:
  --changes              Show what's changed in list view

Examples:
  gvm init
  gvm list
  gvm --org myorg --repo backend list
  gvm --org myorg --repo api releases app-1.0.0
  gvm releases app-25.12.105
  gvm info app-25.12.107
  gvm search "bug fix"
  gvm list app --changes

Configuration:
  ${configInfo}
`);
};
