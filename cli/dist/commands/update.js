"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommand = updateCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const execa_1 = __importDefault(require("execa"));
const framework_1 = require("../utils/framework");
const files_1 = require("../utils/files");
async function updateCommand(options) {
    console.log(chalk_1.default.blue.bold('\n🔄 Updating Deriv Quill Components\n'));
    const targetDir = path_1.default.resolve(options.dir || '.');
    const packageJsonPath = path_1.default.join(targetDir, 'package.json');
    const spinner = (0, ora_1.default)('Checking for updates...').start();
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
        spinner.text = 'Updating package to latest version...';
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
        // Update configuration files (tailwind, postcss, components.json, etc.)
        await (0, files_1.updateConfigFiles)(targetDir, framework, config);
        spinner.text = 'Updating component files...';
        // Update all component files
        const updatedComponents = await (0, files_1.updateComponentFiles)(targetDir, config);
        spinner.succeed('Deriv Quill components updated successfully!');
        console.log(chalk_1.default.green('\n✅ Update complete!'));
        console.log(chalk_1.default.blue('\nUpdated files:'));
        if (updatedComponents.length > 0) {
            console.log(chalk_1.default.gray('Components:'));
            updatedComponents.forEach(component => {
                console.log(chalk_1.default.gray(`  • ${component}`));
            });
        }
        console.log(chalk_1.default.gray('Configuration:'));
        console.log(chalk_1.default.gray(`  • ${config.configFiles.tailwind}`));
        console.log(chalk_1.default.gray(`  • ${config.configFiles.postcss}`));
        console.log(chalk_1.default.gray(`  • ${config.configFiles.components}`));
        console.log(chalk_1.default.gray(`  • ${config.setupFiles.globals}`));
        console.log(chalk_1.default.gray(`  • ${config.setupFiles.utils}`));
        console.log(chalk_1.default.blue('\nYour components are now up to date!'));
    }
    catch (error) {
        spinner.fail('Update failed');
        console.error(chalk_1.default.red('Error:'), error);
        process.exit(1);
    }
}
//# sourceMappingURL=update.js.map