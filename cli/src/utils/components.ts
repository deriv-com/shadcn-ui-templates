import fs from 'fs-extra';
import path from 'path';

export async function getComponentTemplate(componentName: string): Promise<string | null> {
  // First try to read from bundled components (in CLI dist)
  const bundledComponentsDir = path.join(__dirname, '../components');
  const bundledComponentFile = path.join(bundledComponentsDir, `${componentName}.tsx`);
  
  if (await fs.pathExists(bundledComponentFile)) {
    return await fs.readFile(bundledComponentFile, 'utf-8');
  }
  
  // Fallback: try to read from local development source (for CLI development)
  const localSourceDir = path.join(__dirname, '../../../src/components/ui');
  const localComponentFile = path.join(localSourceDir, `${componentName}.tsx`);
  
  if (await fs.pathExists(localComponentFile)) {
    return await fs.readFile(localComponentFile, 'utf-8');
  }
  
  // Fallback: try to read from the published package
  const packageSourceDir = path.join(process.cwd(), 'node_modules/@deriv-com/quill-shadcnui-templates/src/components/ui');
  const packageComponentFile = path.join(packageSourceDir, `${componentName}.tsx`);
  
  if (await fs.pathExists(packageComponentFile)) {
    return await fs.readFile(packageComponentFile, 'utf-8');
  }
  
  return null;
}

export async function getAvailableComponents(): Promise<string[]> {
  // First try to read from bundled components (in CLI dist)
  const bundledComponentsDir = path.join(__dirname, '../components');
  
  if (await fs.pathExists(bundledComponentsDir)) {
    const files = await fs.readdir(bundledComponentsDir);
    return files
      .filter(file => file.endsWith('.tsx'))
      .map(file => path.basename(file, '.tsx'));
  }
  
  // Fallback: try to read from local development source (for CLI development)
  const localSourceDir = path.join(__dirname, '../../../src/components/ui');
  
  if (await fs.pathExists(localSourceDir)) {
    const files = await fs.readdir(localSourceDir);
    return files
      .filter(file => file.endsWith('.tsx'))
      .map(file => path.basename(file, '.tsx'));
  }
  
  // Fallback: try to read from the published package
  const packageSourceDir = path.join(process.cwd(), 'node_modules/@deriv-com/quill-shadcnui-templates/src/components/ui');
  
  if (await fs.pathExists(packageSourceDir)) {
    const files = await fs.readdir(packageSourceDir);
    return files
      .filter(file => file.endsWith('.tsx'))
      .map(file => path.basename(file, '.tsx'));
  }
  
  return [];
}

export async function copyAllComponents(targetDir: string): Promise<string[]> {
  const targetComponentsDir = path.join(targetDir, 'src/components/ui');
  const copiedComponents: string[] = [];
  
  // Ensure target directory exists
  await fs.ensureDir(targetComponentsDir);
  
  // Try multiple possible locations for bundled components
  const possibleSourceDirs = [
    // Bundled components in CLI dist (when CLI is installed globally)
    path.join(__dirname, '../components'),
    // Alternative path for global installation
    path.join(__dirname, '../../components'),
    // Local development source (for CLI development)
    path.join(__dirname, '../../../src/components/ui'),
    // Published package fallback (should be avoided)
    path.join(process.cwd(), 'node_modules/@deriv-com/quill-shadcnui-templates/src/components/ui')
  ];
  
  let sourceDir: string | null = null;
  
  // Find the first valid source directory
  for (const dir of possibleSourceDirs) {
    if (await fs.pathExists(dir)) {
      const files = await fs.readdir(dir);
      const hasComponents = files.some(file => file.endsWith('.tsx'));
      if (hasComponents) {
        sourceDir = dir;
        break;
      }
    }
  }
  
  if (!sourceDir) {
    console.log('⚠️  No component source found. Components may not be copied.');
    return copiedComponents;
  }
  
  console.log(`📦 Copying components from: ${sourceDir}`);
  
  // Copy all component files
  const files = await fs.readdir(sourceDir);
  for (const file of files) {
    if (file.endsWith('.tsx')) {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetComponentsDir, file);
      
      await fs.copy(sourceFile, targetFile);
      copiedComponents.push(path.basename(file, '.tsx'));
    }
  }
  
  return copiedComponents;
}
