export const DEFAULT_RELEASE_LIMIT = 300;
export const RELEASES_PER_PAGE = 100;
export const MAX_BUFFER_SIZE = 10 * 1024 * 1024;

export const ENV_VAR_KEYS = {
  ORG: 'RR_ORG',
  REPO: 'RR_REPO',
  LIMIT: 'RR_LIMIT'
};

export const TABLE_WIDTHS = {
  TAG: 30,
  REPO: 20,
  DATE: 17,
  AUTHOR: 16,
  CHANGES: 50,
  SEPARATOR_FULL: 115,
  SEPARATOR_STANDARD: 80
};

export const COMMANDS_REQUIRING_GH = ['releases', 'info', 'search', 'list'];

export const VERSION_PREFIX_PATTERN = /^([a-zA-Z]+-?[a-zA-Z]*-|\d+\.)/;
export const RELEASE_AUTHOR_PATTERN = /Release created by (\S+)/;
export const PR_AUTHOR_PATTERN = /by @(\S+) in/;
export const BULLET_POINT_PATTERN = /^[*-]\s+(.+)/;

export const EXCLUDED_CHANGELOG_PHRASES = ['Full Changelog', 'Services tagged'];

