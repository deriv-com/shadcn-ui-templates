"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdvancedCommand = updateAdvancedCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const inquirer_1 = __importDefault(require("inquirer"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const execa_1 = __importDefault(require("execa"));
const framework_1 = require("../utils/framework");
const files_1 = require("../utils/files");
const update_strategies_1 = require("../utils/update-strategies");
const components_1 = require("../utils/components");
async function updateAdvancedCommand(options) {
    console.log(chalk_1.default.blue.bold('\n🔄 Advanced Update for Deriv Quill Components\n'));
    const targetDir = path_1.default.resolve(options.dir || '.');
    const packageJsonPath = path_1.default.join(targetDir, 'package.json');
    const spinner = (0, ora_1.default)('Checking project...').start();
    try {
        // Check if package.json exists
        if (!await fs_extra_1.default.pathExists(packageJsonPath)) {
            spinner.fail('No package.json found. Run this command from your project root.');
            return;
        }
        // Read current package.json
        const packageJson = await fs_extra_1.default.readJson(packageJsonPath);
        // Check if Deriv Quill is installed
        const derivQuillVersion = packageJson.dependencies?.['@deriv-com/quill-shadcnui-templates'] ||
            packageJson.devDependencies?.['@deriv-com/quill-shadcnui-templates'];
        if (!derivQuillVersion) {
            spinner.fail('Deriv Quill components not found in package.json');
            console.log(chalk_1.default.yellow('Run "quill-shadcn install" first to set up the components.'));
            return;
        }
        spinner.text = 'Updating package...';
        // Update the package
        await (0, execa_1.default)('npm', ['update', '@deriv-com/quill-shadcnui-templates'], {
            cwd: targetDir,
            stdio: 'pipe'
        });
        spinner.text = 'Detecting framework...';
        // Detect framework
        const framework = await (0, framework_1.detectFramework)(targetDir);
        const config = (0, framework_1.getFrameworkConfig)(framework);
        spinner.text = 'Updating configuration files...';
        // Update configuration files
        await (0, files_1.updateConfigFiles)(targetDir, framework, config);
        spinner.succeed('Package and configuration updated!');
        // Select update strategy
        let strategy = options.strategy;
        if (!strategy) {
            const { selectedStrategy } = await inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'selectedStrategy',
                    message: 'Choose update strategy:',
                    choices: Object.values(update_strategies_1.UPDATE_STRATEGIES).map(s => ({
                        name: `${s.name} - ${s.description}`,
                        value: s.name.toLowerCase()
                    }))
                }
            ]);
            strategy = selectedStrategy;
        }
        const updateStrategy = update_strategies_1.UPDATE_STRATEGIES[strategy];
        if (!updateStrategy) {
            console.error(chalk_1.default.red(`Unknown strategy: ${strategy}`));
            return;
        }
        console.log(chalk_1.default.blue(`\nUsing strategy: ${updateStrategy.name}`));
        console.log(chalk_1.default.gray(updateStrategy.description));
        // Get all existing components
        const componentsDir = path_1.default.join(targetDir, 'src/components/ui');
        const existingComponents = [];
        if (await fs_extra_1.default.pathExists(componentsDir)) {
            const files = await fs_extra_1.default.readdir(componentsDir);
            existingComponents.push(...files.filter(f => f.endsWith('.tsx')));
        }
        if (existingComponents.length === 0) {
            console.log(chalk_1.default.yellow('No components found to update.'));
            return;
        }
        console.log(chalk_1.default.blue(`\nFound ${existingComponents.length} components to update:`));
        existingComponents.forEach(comp => {
            console.log(chalk_1.default.gray(`  • ${comp}`));
        });
        // Update each component
        const updateSpinner = (0, ora_1.default)('Updating components...').start();
        const results = [];
        for (const componentFile of existingComponents) {
            const componentName = path_1.default.basename(componentFile, '.tsx');
            const componentPath = path_1.default.join(componentsDir, componentFile);
            updateSpinner.text = `Updating ${componentName}...`;
            const componentTemplate = await (0, components_1.getComponentTemplate)(componentName);
            if (componentTemplate) {
                const result = await (0, update_strategies_1.updateComponentWithStrategy)(componentPath, componentTemplate, updateStrategy);
                results.push({
                    component: componentName,
                    updated: result.updated,
                    message: result.message
                });
            }
            else {
                results.push({
                    component: componentName,
                    updated: false,
                    message: 'Template not found'
                });
            }
        }
        updateSpinner.succeed('Component updates completed!');
        // Show results
        console.log(chalk_1.default.green('\n✅ Update Results:'));
        const updated = results.filter(r => r.updated);
        const skipped = results.filter(r => !r.updated);
        if (updated.length > 0) {
            console.log(chalk_1.default.green(`\nUpdated (${updated.length}):`));
            updated.forEach(r => {
                console.log(chalk_1.default.green(`  ✅ ${r.component}`));
            });
        }
        if (skipped.length > 0) {
            console.log(chalk_1.default.yellow(`\nSkipped (${skipped.length}):`));
            skipped.forEach(r => {
                console.log(chalk_1.default.yellow(`  ⏭️  ${r.component}${r.message ? ` - ${r.message}` : ''}`));
            });
        }
        console.log(chalk_1.default.blue('\n🎉 Update process completed!'));
    }
    catch (error) {
        spinner.fail('Update failed');
        console.error(chalk_1.default.red('Error:'), error);
        process.exit(1);
    }
}
//# sourceMappingURL=update-advanced.js.map