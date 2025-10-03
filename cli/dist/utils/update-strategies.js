"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_STRATEGIES = void 0;
exports.updateComponentWithStrategy = updateComponentWithStrategy;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
exports.UPDATE_STRATEGIES = {
    overwrite: {
        name: 'Overwrite',
        description: 'Always overwrite existing components with latest version',
        updateComponent: async (componentPath, newContent) => {
            await fs_extra_1.default.writeFile(componentPath, newContent);
            return true;
        }
    },
    backup: {
        name: 'Backup and Update',
        description: 'Create backup of existing component before updating',
        updateComponent: async (componentPath, newContent) => {
            const backupPath = `${componentPath}.backup.${Date.now()}`;
            await fs_extra_1.default.copyFile(componentPath, backupPath);
            await fs_extra_1.default.writeFile(componentPath, newContent);
            console.log(chalk_1.default.gray(`  Backup created: ${path_1.default.basename(backupPath)}`));
            return true;
        }
    },
    merge: {
        name: 'Smart Merge',
        description: 'Attempt to merge changes while preserving custom modifications',
        updateComponent: async (componentPath, newContent) => {
            const existingContent = await fs_extra_1.default.readFile(componentPath, 'utf-8');
            // Simple merge strategy: check if component has been significantly modified
            const hasCustomModifications = checkForCustomModifications(existingContent, newContent);
            if (hasCustomModifications) {
                console.log(chalk_1.default.yellow(`  ⚠️  ${path_1.default.basename(componentPath)} has custom modifications`));
                console.log(chalk_1.default.gray(`     Skipping update to preserve your changes`));
                return false;
            }
            else {
                await fs_extra_1.default.writeFile(componentPath, newContent);
                return true;
            }
        }
    },
    prompt: {
        name: 'Prompt for Each',
        description: 'Ask for confirmation before updating each component',
        updateComponent: async (componentPath, newContent) => {
            const { update } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'update',
                    message: `Update ${path_1.default.basename(componentPath)}?`,
                    default: true
                }
            ]);
            if (update) {
                await fs_extra_1.default.writeFile(componentPath, newContent);
                return true;
            }
            return false;
        }
    }
};
function checkForCustomModifications(existing, newContent) {
    // Simple heuristics to detect custom modifications
    const existingLines = existing.split('\n');
    const newLines = newContent.split('\n');
    // Check if the number of lines differs significantly
    const lineDiff = Math.abs(existingLines.length - newLines.length);
    if (lineDiff > 10)
        return true;
    // Check for custom comments or modifications
    const customComments = existingLines.filter(line => line.includes('// Custom') ||
        line.includes('// TODO') ||
        line.includes('// FIXME') ||
        line.includes('// Modified'));
    if (customComments.length > 0)
        return true;
    // Check for significant content differences in key areas
    const existingExports = existing.match(/export\s+\{[^}]+\}/g) || [];
    const newExports = newContent.match(/export\s+\{[^}]+\}/g) || [];
    if (existingExports.length !== newExports.length)
        return true;
    return false;
}
async function updateComponentWithStrategy(componentPath, newContent, strategy) {
    try {
        const updated = await strategy.updateComponent(componentPath, newContent);
        return { updated };
    }
    catch (error) {
        return {
            updated: false,
            message: `Failed to update: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}
//# sourceMappingURL=update-strategies.js.map