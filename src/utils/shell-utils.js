import { execSync } from 'child_process';
import { GitHubApiError } from './validation.js';

export const executeCommand = (command, options = {}) => {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      stdio: options.silent ? 'ignore' : 'pipe',
      ...options
    });
  } catch (error) {
    if (options.throwOnError !== false) {
      throw new GitHubApiError(`Command failed: ${command}\n${error.message}`);
    }
    return null;
  }
};

export const checkCommandExists = (command) => {
  try {
    executeCommand(`${command} --version`, { silent: true });
    return true;
  } catch {
    return false;
  }
};

