#!/usr/bin/env node

import chalk from 'chalk';
import { checkGitHubCli } from './src/api/github.js';
import { 
  commandReleases, 
  commandInfo, 
  commandSearch, 
  commandList,
  showHelp 
} from './src/commands/index.js';
import { validateConfig, RrError } from './src/utils/validation.js';
import { COMMANDS_REQUIRING_GH, ENV_VAR_KEYS, DEFAULT_RELEASE_LIMIT } from './src/utils/constants.js';

const resolveConfig = (configOverrides) => {
  const merged = {
    org: configOverrides.org || process.env[ENV_VAR_KEYS.ORG],
    repo: configOverrides.repo || process.env[ENV_VAR_KEYS.REPO],
    releaseLimit: process.env[ENV_VAR_KEYS.LIMIT] 
      ? parseInt(process.env[ENV_VAR_KEYS.LIMIT], 10) 
      : DEFAULT_RELEASE_LIMIT
  };
  
  if (!merged.org || !merged.repo) {
    console.error(chalk.red('\nMissing required configuration\n'));
    console.log('Set environment variables (recommended):');
    console.log(chalk.dim('  export RR_ORG=myorg'));
    console.log(chalk.dim('  export RR_REPO=myrepo\n'));
    console.log('Or use flags:');
    console.log(chalk.dim('  rr --org myorg --repo myrepo list\n'));
    process.exit(1);
  }
  
  const validated = validateConfig(merged);
  return { ...validated, last: configOverrides.last };
};

const parseArguments = (args) => {
  const flags = args.filter(arg => arg.startsWith('--'));
  const nonFlags = args.filter(arg => !arg.startsWith('--'));
  
  const getFlagValue = (flagName) => {
    const flag = flags.find(f => f.startsWith(`--${flagName}=`) || f === `--${flagName}`);
    if (!flag) return null;
    
    const equalIndex = flag.indexOf('=');
    if (equalIndex === -1) {
      const flagIndex = args.indexOf(flag);
      const nextArg = args[flagIndex + 1];
      return nextArg && !nextArg.startsWith('--') ? nextArg : null;
    }
    return flag.substring(equalIndex + 1);
  };
  
  return {
    command: nonFlags[0],
    parameter: nonFlags[1],
    parameter2: nonFlags[2],
    configOverrides: {
      org: getFlagValue('org'),
      repo: getFlagValue('repo'),
      last: getFlagValue('last')
    }
  };
};

const COMMAND_HANDLERS = {
  releases: commandReleases,
  info: commandInfo,
  search: commandSearch,
  list: commandList,
  help: showHelp,
  '--help': showHelp,
  '-h': showHelp
};

const COMMANDS_NOT_REQUIRING_CONFIG = ['help', '--help', '-h'];

const executeCommand = (command, parameter, parameter2, config) => {
  const handler = COMMAND_HANDLERS[command];
  
  if (!handler) {
    throw new RrError(`Unknown command: ${command}`);
  }
  
  if (COMMANDS_REQUIRING_GH.includes(command)) {
    checkGitHubCli();
  }
  
  handler(parameter, config, parameter2);
};

const main = () => {
  try {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      showHelp();
      process.exit(0);
    }
    
    const { command, parameter, parameter2, configOverrides } = parseArguments(args);
    
    if (COMMANDS_NOT_REQUIRING_CONFIG.includes(command)) {
      executeCommand(command, parameter, parameter2, null);
    } else {
      const config = resolveConfig(configOverrides);
      executeCommand(command, parameter, parameter2, config);
    }
    
  } catch (error) {
    if (error instanceof RrError) {
      console.error(chalk.red(`\n${error.message}\n`));
      process.exit(1);
    }
    
    console.error(chalk.red('\nUnexpected error:'), error.message);
    console.error(chalk.dim(error.stack));
    process.exit(1);
  }
};

main();
