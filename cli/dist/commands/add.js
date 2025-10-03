"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommand = addCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const components_1 = require("../utils/components");
async function addCommand(componentName, options) {
    console.log(chalk_1.default.blue.bold(`\n➕ Adding ${componentName} component\n`));
    const targetDir = path_1.default.resolve(options.dir || 'src/components/ui');
    const componentFile = path_1.default.join(targetDir, `${componentName}.tsx`);
    const spinner = (0, ora_1.default)(`Adding ${componentName} component...`).start();
    try {
        // Check if component already exists
        if (await fs_extra_1.default.pathExists(componentFile)) {
            const { overwrite } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: `Component ${componentName} already exists. Overwrite?`,
                    default: false
                }
            ]);
            if (!overwrite) {
                spinner.fail('Operation cancelled');
                return;
            }
        }
        // Get component template from actual source files
        const componentTemplate = await (0, components_1.getComponentTemplate)(componentName);
        if (!componentTemplate) {
            spinner.fail(`Component ${componentName} not found`);
            // Show available components from actual source
            const availableComponents = await (0, components_1.getAvailableComponents)();
            if (availableComponents.length > 0) {
                console.log(chalk_1.default.yellow('Available components:'));
                console.log(chalk_1.default.gray(`• ${availableComponents.join(', ')}`));
            }
            return;
        }
        // Ensure directory exists
        await fs_extra_1.default.ensureDir(targetDir);
        // Write component file
        await fs_extra_1.default.writeFile(componentFile, componentTemplate);
        spinner.succeed(`${componentName} component added successfully!`);
        console.log(chalk_1.default.green(`\n✅ ${componentName} component added to ${componentFile}`));
        console.log(chalk_1.default.blue('\nUsage:'));
        console.log(chalk_1.default.gray(`import { ${componentName.charAt(0).toUpperCase() + componentName.slice(1)} } from './components/ui/${componentName}';`));
    }
    catch (error) {
        spinner.fail('Failed to add component');
        console.error(chalk_1.default.red('Error:'), error);
        process.exit(1);
    }
}
//# sourceMappingURL=add.js.map