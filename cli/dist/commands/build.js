"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCommand = buildCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function buildCommand(options) {
    console.log(chalk_1.default.blue.bold('\n🔨 Building Deriv Quill Components\n'));
    const outputDir = path_1.default.resolve(options.output || 'dist');
    const spinner = (0, ora_1.default)('Building components...').start();
    try {
        // Clean output directory
        if (await fs_extra_1.default.pathExists(outputDir)) {
            await fs_extra_1.default.remove(outputDir);
        }
        await fs_extra_1.default.ensureDir(outputDir);
        spinner.text = 'Copying component files...';
        // Copy all components
        const copiedComponents = await copyAllComponents(outputDir);
        spinner.text = 'Copying configuration files...';
        // Copy configuration files
        await copyConfigFiles(outputDir);
        spinner.succeed('Build completed successfully!');
        console.log(chalk_1.default.green('\n✅ Build complete!'));
        console.log(chalk_1.default.blue('\nBuilt files:'));
        console.log(chalk_1.default.gray(`📁 ${outputDir}/`));
        console.log(chalk_1.default.gray(`  ├── components/ (${copiedComponents.length} components)`));
        console.log(chalk_1.default.gray(`  ├── lib/`));
        console.log(chalk_1.default.gray(`  ├── styles/`));
        console.log(chalk_1.default.gray(`  └── config files`));
    }
    catch (error) {
        spinner.fail('Build failed');
        console.error(chalk_1.default.red('Error:'), error);
        process.exit(1);
    }
}
async function copyAllComponents(outputDir) {
    const sourceDir = path_1.default.join(process.cwd(), 'src/components/ui');
    const targetComponentsDir = path_1.default.join(outputDir, 'components');
    const copiedComponents = [];
    if (!await fs_extra_1.default.pathExists(sourceDir)) {
        return copiedComponents;
    }
    // Ensure target directory exists
    await fs_extra_1.default.ensureDir(targetComponentsDir);
    // Copy all component files
    const files = await fs_extra_1.default.readdir(sourceDir);
    for (const file of files) {
        if (file.endsWith('.tsx')) {
            const sourceFile = path_1.default.join(sourceDir, file);
            const targetFile = path_1.default.join(targetComponentsDir, file);
            await fs_extra_1.default.copy(sourceFile, targetFile);
            copiedComponents.push(path_1.default.basename(file, '.tsx'));
        }
    }
    return copiedComponents;
}
async function copyConfigFiles(outputDir) {
    const configFiles = [
        'components.json',
        'tailwind.config.js',
        'postcss.config.js'
    ];
    for (const file of configFiles) {
        const sourcePath = path_1.default.join(process.cwd(), file);
        const destPath = path_1.default.join(outputDir, file);
        if (await fs_extra_1.default.pathExists(sourcePath)) {
            await fs_extra_1.default.copy(sourcePath, destPath);
        }
    }
}
//# sourceMappingURL=build.js.map