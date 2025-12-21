#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { checkGitHubCli } from './src/api/github.js';
import { 
  commandReleases, 
  commandInfo, 
  commandSearch, 
  commandList,
  commandInit,
  showHelp 
} from './src/commands/index.js';
import { validateConfig, GvmError } from './src/utils/validation.js';
import { COMMANDS_REQUIRING_GH } from './src/utils/constants.js';

const CONFIG_PATH = join(homedir(), '.releaseradar', 'config.json');

const loadConfig = () => {
  if (!existsSync(CONFIG_PATH)) {
    return null;
  }
  
  try {
    const configData = readFileSync(CONFIG_PATH, 'utf-8');
    const rawConfig = JSON.parse(configData);
    return validateConfig(rawConfig);
  } catch (error) {
    if (error instanceof GvmError) {
      throw error;
    }
    throw new GvmError(`Error loading config: ${error.message}`);
  }
};

const resolveConfig = (storedConfig, configOverrides) => {
  const merged = {
    org: configOverrides.org || storedConfig?.org,
    repo: configOverrides.repo || storedConfig?.repo,
    releaseLimit: configOverrides.releaseLimit 
      ? parseInt(configOverrides.releaseLimit, 10) 
      : storedConfig?.releaseLimit || 300
  };
  
  if (!merged.org || !merged.repo) {
    throw new GvmError(
      'Missing required configuration.\n\n' +
      'Either:\n' +
      '  1. Run "rr init" to save default config, or\n' +
      '  2. Use flags: --org <name> --repo <name>\n\n' +
      'Example: rr --org myorg --repo myrepo list'
    );
  }
  
  return validateConfig(merged);
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
    options: {
      showChanges: flags.includes('--changes')
    },
    configOverrides: {
      org: getFlagValue('org'),
      repo: getFlagValue('repo'),
      releaseLimit: getFlagValue('limit')
    }
  };
};

const COMMAND_HANDLERS = {
  releases: commandReleases,
  info: commandInfo,
  search: commandSearch,
  list: commandList,
  init: commandInit,
  help: showHelp,
  '--help': showHelp,
  '-h': showHelp
};

const COMMANDS_NOT_REQUIRING_CONFIG = ['init', 'help', '--help', '-h'];

const executeCommand = (command, parameter, config, options) => {
  const handler = COMMAND_HANDLERS[command];
  
  if (!handler) {
    throw new GvmError(`Unknown command: ${command}`);
  }
  
  if (COMMANDS_REQUIRING_GH.includes(command)) {
    checkGitHubCli();
  }
  
  handler(parameter, config, options);
};

const main = () => {
  try {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      const storedConfig = loadConfig();
      showHelp(storedConfig);
      process.exit(0);
    }
    
    const { command, parameter, options, configOverrides } = parseArguments(args);
    
    if (COMMANDS_NOT_REQUIRING_CONFIG.includes(command)) {
      executeCommand(command, parameter, null, options);
    } else {
      const storedConfig = loadConfig();
      const config = resolveConfig(storedConfig, configOverrides);
      executeCommand(command, parameter, config, options);
    }
    
  } catch (error) {
    if (error instanceof GvmError) {
      console.error(`\n${error.message}\n`);
      process.exit(1);
    }
    
    console.error('\n❌ Unexpected error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

main();
