import { DEFAULT_RELEASE_LIMIT } from './constants.js';

export class GvmError extends Error {
  constructor(message, code = 'GVM_ERROR') {
    super(message);
    this.name = 'GvmError';
    this.code = code;
  }
}

export class ValidationError extends GvmError {
  constructor(message) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class GitHubApiError extends GvmError {
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
    throw new ValidationError(`Usage: rr ${commandName} <parameter>`);
  }
};

export const validateReleases = (releases) => {
  if (!releases || releases.length === 0) {
    throw new GitHubApiError('Failed to fetch releases or no releases found');
  }
  return releases;
};

