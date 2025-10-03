#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { updateCommand } from './commands/update';
import { version } from '../package.json';

const program = new Command();

program
  .name('quill-shadcn')
  .description('CLI tool for Deriv Quill shadcn/ui components')
  .version(version, '-v, --version', 'display version number');

program
  .command('install')
  .description('Install Deriv Quill components in your project')
  .option('-f, --framework <framework>', 'Framework to use (react, next, vite)', 'react')
  .option('-d, --dir <directory>', 'Directory to install in', '.')
  .option('--skip-deps', 'Skip installing dependencies')
  .option('--skip-config', 'Skip configuration setup')
  .action(initCommand);


program
  .command('update')
  .description('Update Deriv Quill components to latest version')
  .option('-d, --dir <directory>', 'Project directory', '.')
  .action(updateCommand);





program.parse();
