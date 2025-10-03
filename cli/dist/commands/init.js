"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const inquirer_1 = __importDefault(require("inquirer"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const framework_1 = require("../utils/framework");
const files_1 = require("../utils/files");
const components_1 = require("../utils/components");
const dependencies_1 = require("../utils/dependencies");
async function initCommand(options) {
    console.log(chalk_1.default.blue.bold('\n🚀 Installing Deriv Quill Components\n'));
    const targetDir = path_1.default.resolve(options.dir || '.');
    // Check if directory exists and is not empty
    if (fs_extra_1.default.existsSync(targetDir) && fs_extra_1.default.readdirSync(targetDir).length > 0) {
        const { proceed } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'proceed',
                message: 'Directory is not empty. Do you want to continue?',
                default: false
            }
        ]);
        if (!proceed) {
            console.log(chalk_1.default.yellow('Operation cancelled.'));
            return;
        }
    }
    const spinner = (0, ora_1.default)('Detecting project framework...').start();
    try {
        // Detect framework if not specified
        let framework = options.framework;
        if (!framework) {
            framework = await (0, framework_1.detectFramework)(targetDir);
        }
        spinner.text = `Installing ${framework} project...`;
        // Get framework-specific configuration
        const config = (0, framework_1.getFrameworkConfig)(framework);
        // Create necessary directories
        await fs_extra_1.default.ensureDir(path_1.default.join(targetDir, 'src/components/ui'));
        await fs_extra_1.default.ensureDir(path_1.default.join(targetDir, 'src/lib'));
        await fs_extra_1.default.ensureDir(path_1.default.join(targetDir, 'src/styles'));
        spinner.text = 'Copying component files...';
        // Copy actual component files from source
        const copiedComponents = await (0, components_1.copyAllComponents)(targetDir);
        spinner.text = 'Updating configuration files...';
        // Update configuration files
        if (!options.skipConfig) {
            await (0, files_1.updateConfigFiles)(targetDir, framework, config);
        }
        spinner.text = 'Installing dependencies...';
        // Install dependencies
        if (!options.skipDeps) {
            await (0, dependencies_1.installDependencies)(targetDir, config.dependencies);
        }
        spinner.succeed('Deriv Quill components installed successfully!');
        console.log(chalk_1.default.green('\n✅ Setup complete!'));
        console.log(chalk_1.default.blue('\nNext steps:'));
        console.log('1. Import components in your React files');
        console.log('2. Import styles in your main CSS file:');
        console.log(chalk_1.default.gray('   @import "./src/styles/globals.css";'));
        console.log('3. Start building with Deriv Quill components!');
        console.log(chalk_1.default.blue('\nAvailable commands:'));
        console.log('• quill-shadcn update - Update to latest version');
    }
    catch (error) {
        spinner.fail('Installation failed');
        console.error(chalk_1.default.red('Error:'), error);
        process.exit(1);
    }
}
//# sourceMappingURL=init.js.map