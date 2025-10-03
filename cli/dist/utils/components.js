"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComponentTemplate = getComponentTemplate;
exports.getAvailableComponents = getAvailableComponents;
exports.copyAllComponents = copyAllComponents;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function getComponentTemplate(componentName) {
    // First try to read from bundled components (in CLI dist)
    const bundledComponentsDir = path_1.default.join(__dirname, '../components');
    const bundledComponentFile = path_1.default.join(bundledComponentsDir, `${componentName}.tsx`);
    if (await fs_extra_1.default.pathExists(bundledComponentFile)) {
        return await fs_extra_1.default.readFile(bundledComponentFile, 'utf-8');
    }
    // Fallback: try to read from local development source (for CLI development)
    const localSourceDir = path_1.default.join(__dirname, '../../../src/components/ui');
    const localComponentFile = path_1.default.join(localSourceDir, `${componentName}.tsx`);
    if (await fs_extra_1.default.pathExists(localComponentFile)) {
        return await fs_extra_1.default.readFile(localComponentFile, 'utf-8');
    }
    // Fallback: try to read from the published package
    const packageSourceDir = path_1.default.join(process.cwd(), 'node_modules/@deriv-com/quill-shadcnui-templates/src/components/ui');
    const packageComponentFile = path_1.default.join(packageSourceDir, `${componentName}.tsx`);
    if (await fs_extra_1.default.pathExists(packageComponentFile)) {
        return await fs_extra_1.default.readFile(packageComponentFile, 'utf-8');
    }
    return null;
}
async function getAvailableComponents() {
    // First try to read from bundled components (in CLI dist)
    const bundledComponentsDir = path_1.default.join(__dirname, '../components');
    if (await fs_extra_1.default.pathExists(bundledComponentsDir)) {
        const files = await fs_extra_1.default.readdir(bundledComponentsDir);
        return files
            .filter(file => file.endsWith('.tsx'))
            .map(file => path_1.default.basename(file, '.tsx'));
    }
    // Fallback: try to read from local development source (for CLI development)
    const localSourceDir = path_1.default.join(__dirname, '../../../src/components/ui');
    if (await fs_extra_1.default.pathExists(localSourceDir)) {
        const files = await fs_extra_1.default.readdir(localSourceDir);
        return files
            .filter(file => file.endsWith('.tsx'))
            .map(file => path_1.default.basename(file, '.tsx'));
    }
    // Fallback: try to read from the published package
    const packageSourceDir = path_1.default.join(process.cwd(), 'node_modules/@deriv-com/quill-shadcnui-templates/src/components/ui');
    if (await fs_extra_1.default.pathExists(packageSourceDir)) {
        const files = await fs_extra_1.default.readdir(packageSourceDir);
        return files
            .filter(file => file.endsWith('.tsx'))
            .map(file => path_1.default.basename(file, '.tsx'));
    }
    return [];
}
async function copyAllComponents(targetDir) {
    // First try to copy from local development source (for CLI development)
    // Look in the parent directory of the CLI (where the main project is)
    const localSourceDir = path_1.default.join(__dirname, '../../../src/components/ui');
    const targetComponentsDir = path_1.default.join(targetDir, 'src/components/ui');
    const copiedComponents = [];
    let sourceDir = localSourceDir;
    // If local source doesn't exist, try the published package
    if (!await fs_extra_1.default.pathExists(localSourceDir)) {
        sourceDir = path_1.default.join(process.cwd(), 'node_modules/@deriv-com/quill-shadcnui-templates/src/components/ui');
    }
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
//# sourceMappingURL=components.js.map