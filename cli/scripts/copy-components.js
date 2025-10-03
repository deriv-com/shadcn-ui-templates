const fs = require('fs-extra');
const path = require('path');

async function copyComponents() {
  console.log('📦 Copying component files to CLI dist...');
  
  try {
    // Source directory (parent project's components)
    const sourceDir = path.join(__dirname, '../../src/components/ui');
    const targetDir = path.join(__dirname, '../dist/components');
    
    // Check if source exists
    if (!await fs.pathExists(sourceDir)) {
      console.log('⚠️  Source components directory not found, skipping...');
      return;
    }
    
    // Ensure target directory exists
    await fs.ensureDir(targetDir);
    
    // Copy all component files
    const files = await fs.readdir(sourceDir);
    let copiedCount = 0;
    
    for (const file of files) {
      if (file.endsWith('.tsx')) {
        const sourceFile = path.join(sourceDir, file);
        const targetFile = path.join(targetDir, file);
        
        await fs.copy(sourceFile, targetFile);
        copiedCount++;
        console.log(`  ✅ Copied ${file}`);
      }
    }
    
    // Also copy lib/utils.ts
    const sourceUtils = path.join(__dirname, '../../src/lib/utils.ts');
    const targetUtils = path.join(__dirname, '../dist/lib/utils.ts');
    
    if (await fs.pathExists(sourceUtils)) {
      await fs.ensureDir(path.dirname(targetUtils));
      await fs.copy(sourceUtils, targetUtils);
      console.log('  ✅ Copied lib/utils.ts');
    }
    
    // Copy configuration files
    console.log('\n📋 Copying configuration files...');
    const configFiles = [
      'components.json',
      'tailwind.config.js',
      'postcss.config.js'
    ];
    
    for (const file of configFiles) {
      const sourcePath = path.join(__dirname, '../../', file);
      const destPath = path.join(__dirname, '../dist/config', file);
      
      if (await fs.pathExists(sourcePath)) {
        await fs.ensureDir(path.dirname(destPath));
        await fs.copy(sourcePath, destPath);
        console.log(`  ✅ Copied ${file}`);
      }
    }
    
    // Copy styles
    console.log('\n🎨 Copying styles...');
    const sourceStyles = path.join(__dirname, '../../src/styles/globals.css');
    const targetStyles = path.join(__dirname, '../dist/styles/globals.css');
    
    if (await fs.pathExists(sourceStyles)) {
      await fs.ensureDir(path.dirname(targetStyles));
      await fs.copy(sourceStyles, targetStyles);
      console.log('  ✅ Copied globals.css');
    }
    
    // Copy design tokens
    console.log('\n🎯 Copying design tokens...');
    const sourceTokens = path.join(__dirname, '../../override');
    const targetTokens = path.join(__dirname, '../dist/override');
    
    if (await fs.pathExists(sourceTokens)) {
      await fs.copy(sourceTokens, targetTokens);
      console.log('  ✅ Copied design tokens');
    }
    
    console.log(`\n🎉 Successfully copied ${copiedCount} components and all config files to CLI dist!`);
    
  } catch (error) {
    console.error('❌ Error copying components:', error);
    process.exit(1);
  }
}

copyComponents();
