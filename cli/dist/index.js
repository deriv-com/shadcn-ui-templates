#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const init_1 = require("./commands/init");
const update_1 = require("./commands/update");
const package_json_1 = require("../package.json");
const program = new commander_1.Command();
program
    .name('quill-shadcn')
    .description('CLI tool for Deriv Quill shadcn/ui components')
    .version(package_json_1.version, '-v, --version', 'display version number');
program
    .command('install')
    .description('Install Deriv Quill components in your project')
    .option('-f, --framework <framework>', 'Framework to use (react, next, vite)', 'react')
    .option('-d, --dir <directory>', 'Directory to install in', '.')
    .option('--skip-deps', 'Skip installing dependencies')
    .option('--skip-config', 'Skip configuration setup')
    .action(init_1.initCommand);
program
    .command('update')
    .description('Update Deriv Quill components to latest version')
    .option('-d, --dir <directory>', 'Project directory', '.')
    .action(update_1.updateCommand);
program.parse();
//# sourceMappingURL=index.js.map