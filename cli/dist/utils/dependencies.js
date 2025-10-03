"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDependencies = installDependencies;
exports.installDevDependencies = installDevDependencies;
const execa_1 = __importDefault(require("execa"));
const ora_1 = __importDefault(require("ora"));
async function installDependencies(targetDir, dependencies) {
    const spinner = (0, ora_1.default)('Installing dependencies...').start();
    try {
        // Install production dependencies
        await (0, execa_1.default)('npm', ['install', ...dependencies], {
            cwd: targetDir,
            stdio: 'pipe'
        });
        spinner.succeed('Dependencies installed successfully');
    }
    catch (error) {
        spinner.fail('Failed to install dependencies');
        console.error('Error:', error);
        throw error;
    }
}
async function installDevDependencies(targetDir, devDependencies) {
    const spinner = (0, ora_1.default)('Installing dev dependencies...').start();
    try {
        // Install dev dependencies
        await (0, execa_1.default)('npm', ['install', '--save-dev', ...devDependencies], {
            cwd: targetDir,
            stdio: 'pipe'
        });
        spinner.succeed('Dev dependencies installed successfully');
    }
    catch (error) {
        spinner.fail('Failed to install dev dependencies');
        console.error('Error:', error);
        throw error;
    }
}
//# sourceMappingURL=dependencies.js.map