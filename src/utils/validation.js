import { DEFAULT_RELEASE_LIMIT } from './constants.js';

import chalk from 'chalk';

export class RrError extends Error {
  constructor(message, code = 'RR_ERROR') {
    super(message);
    this.name = 'RrError';
    this.code = code;
  }
}

export class ValidationError extends RrError {
  constructor(message) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class GitHubApiError extends RrError {
  constructor(message) {
    super(message, 'GITHUB_API_ERROR');
    this.name = 'GitHubApiError';
  }
}

export const validateConfig = (config) => {
  if (!config) {
    throw new ValidationError('Configuration is required');
  }
  
  const required = ['org', 'repo'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    throw new ValidationError(`Missing required config fields: ${missing.join(', ')}`);
  }
  
  return {
    org: config.org,
    repo: config.repo,
    releaseLimit: config.releaseLimit ?? DEFAULT_RELEASE_LIMIT
  };
};

export const requireParameter = (param, commandName) => {
  if (!param) {
    throw new ValidationError(
      `Missing required parameter for '${commandName}' command\n\n` +
      `Usage: rr ${commandName} <parameter>`
    );
  }
};

export const validateReleases = (releases) => {
  if (!releases || releases.length === 0) {
    console.log(chalk.yellow('\nNo releases found'));
    console.log(chalk.dim('Tips:'));
    console.log(chalk.dim('  • Check your org/repo configuration'));
    console.log(chalk.dim('  • Increase limit: export RR_LIMIT=500'));
    console.log(chalk.dim('  • Verify the repository has releases\n'));
    throw new GitHubApiError('No releases found');
  }
  return releases;
};

