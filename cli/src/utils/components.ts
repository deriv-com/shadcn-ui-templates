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
  // First try to copy from bundled components (in CLI dist)
  const bundledComponentsDir = path.join(__dirname, '../components');
  const targetComponentsDir = path.join(targetDir, 'src/components/ui');
  const copiedComponents: string[] = [];
  
  let sourceDir = bundledComponentsDir;
  
  // If bundled components don't exist, try local development source
  if (!await fs.pathExists(bundledComponentsDir)) {
    sourceDir = path.join(__dirname, '../../../src/components/ui');
  }
  
  // If local source doesn't exist, try the published package
  if (!await fs.pathExists(sourceDir)) {
    sourceDir = path.join(process.cwd(), 'node_modules/@deriv-com/quill-shadcnui-templates/src/components/ui');
  }
  
  if (!await fs.pathExists(sourceDir)) {
    return copiedComponents;
  }
  
  // Ensure target directory exists
  await fs.ensureDir(targetComponentsDir);
  
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
