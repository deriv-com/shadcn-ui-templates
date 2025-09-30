#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}`),
  subtitle: (msg) => console.log(`${colors.magenta}${msg}${colors.reset}`)
};

class RegistrySyncer {
  constructor(options = {}) {
    this.sourceDir = options.sourceDir || 'src/components/ui';
    this.registryDir = options.registryDir || 'registry';
    this.libDir = options.libDir || 'src/lib';
    this.hooksDir = options.hooksDir || 'src/hooks';
    this.verbose = options.verbose || false;
  }

  // Get all component files from source directory
  getComponentFiles() {
    const components = [];
    const sourcePath = path.resolve(this.sourceDir);
    
    if (!fs.existsSync(sourcePath)) {
      log.error(`Source directory not found: ${sourcePath}`);
      return components;
    }

    const files = fs.readdirSync(sourcePath);
    
    files.forEach(file => {
      if (file.endsWith('.tsx') && !file.includes('.stories.') && !file.includes('.test.')) {
        const componentName = file.replace('.tsx', '');
        const filePath = path.join(sourcePath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract dependencies from imports
        const dependencies = this.extractDependencies(content);
        
        components.push({
          name: componentName,
          file: file,
          path: `ui/${file}`,
          dependencies: dependencies,
          content: content
        });
      }
    });

    return components;
  }

  // Extract dependencies from component content
  extractDependencies(content) {
    const dependencies = [];
    const importRegex = /import\s+.*?\s+from\s+["']([^"']+)["']/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      
      // Only include relative imports that are likely dependencies
      if (importPath.startsWith('@/') || importPath.startsWith('./') || importPath.startsWith('../')) {
        dependencies.push(importPath);
      }
    }

    return dependencies;
  }

  // Get utility files
  getUtilityFiles() {
    const utils = [];
    const libPath = path.resolve(this.libDir);
    
    if (fs.existsSync(libPath)) {
      const files = fs.readdirSync(libPath);
      
      files.forEach(file => {
        if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          utils.push({
            name: file.replace(/\.(ts|tsx)$/, ''),
            file: file,
            path: `lib/${file}`,
            content: fs.readFileSync(path.join(libPath, file), 'utf8')
          });
        }
      });
    }

    return utils;
  }

  // Get hook files
  getHookFiles() {
    const hooks = [];
    const hooksPath = path.resolve(this.hooksDir);
    
    if (fs.existsSync(hooksPath)) {
      const files = fs.readdirSync(hooksPath);
      
      files.forEach(file => {
        if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          hooks.push({
            name: file.replace(/\.(ts|tsx)$/, ''),
            file: file,
            path: `hooks/${file}`,
            content: fs.readFileSync(path.join(hooksPath, file), 'utf8')
          });
        }
      });
    }

    return hooks;
  }

  // Create registry directory structure
  createRegistryStructure() {
    const registryPath = path.resolve(this.registryDir);
    const uiPath = path.join(registryPath, 'ui');
    const libPath = path.join(registryPath, 'lib');
    const hooksPath = path.join(registryPath, 'hooks');

    // Create directories
    [registryPath, uiPath, libPath, hooksPath].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        log.success(`Created directory: ${dir}`);
      }
    });
  }

  // Copy component files to registry
  copyComponents() {
    log.subtitle('📦 Copying Components to Registry');
    
    const components = this.getComponentFiles();
    const sourcePath = path.resolve(this.sourceDir);
    const targetPath = path.join(this.registryDir, 'ui');

    components.forEach(component => {
      const sourceFile = path.join(sourcePath, component.file);
      const targetFile = path.join(targetPath, component.file);
      
      fs.copyFileSync(sourceFile, targetFile);
      log.success(`Copied ${component.name} → registry/ui/${component.file}`);
    });

    return components;
  }

  // Copy utility files to registry
  copyUtilities() {
    log.subtitle('🔧 Copying Utilities to Registry');
    
    const utils = this.getUtilityFiles();
    const sourcePath = path.resolve(this.libDir);
    const targetPath = path.join(this.registryDir, 'lib');

    utils.forEach(util => {
      const sourceFile = path.join(sourcePath, util.file);
      const targetFile = path.join(targetPath, util.file);
      
      fs.copyFileSync(sourceFile, targetFile);
      log.success(`Copied ${util.name} → registry/lib/${util.file}`);
    });

    return utils;
  }

  // Copy hook files to registry
  copyHooks() {
    log.subtitle('🪝 Copying Hooks to Registry');
    
    const hooks = this.getHookFiles();
    const sourcePath = path.resolve(this.hooksDir);
    const targetPath = path.join(this.registryDir, 'hooks');

    hooks.forEach(hook => {
      const sourceFile = path.join(sourcePath, hook.file);
      const targetFile = path.join(targetPath, hook.file);
      
      fs.copyFileSync(sourceFile, targetFile);
      log.success(`Copied ${hook.name} → registry/hooks/${hook.file}`);
    });

    return hooks;
  }

  // Generate registry index.json
  generateRegistryIndex(components, utils, hooks) {
    log.subtitle('📋 Generating Registry Index');
    
    const registry = {
      name: "deriv-shadcn-ui-templates",
      description: "Comprehensive shadcn/ui component templates with Figma design token integration",
      version: "1.0.0",
      registry: "https://raw.githubusercontent.com/deriv-com/shadcn-ui-templates/master/registry/index.json",
      components: {},
      utilities: {},
      hooks: {}
    };

    // Add components
    components.forEach(component => {
      registry.components[component.name] = {
        name: component.name,
        type: "components:ui",
        files: [
          {
            name: component.file,
            content: component.content
          }
        ],
        dependencies: component.dependencies,
        registryDependencies: [],
        files: [
          {
            name: component.file,
            content: component.content
          }
        ]
      };
    });

    // Add utilities
    utils.forEach(util => {
      registry.utilities[util.name] = {
        name: util.name,
        type: "lib:utils",
        files: [
          {
            name: util.file,
            content: util.content
          }
        ]
      };
    });

    // Add hooks
    hooks.forEach(hook => {
      registry.hooks[hook.name] = {
        name: hook.name,
        type: "lib:hooks",
        files: [
          {
            name: hook.file,
            content: hook.content
          }
        ]
      };
    });

    // Write registry index
    const indexPath = path.join(this.registryDir, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(registry, null, 2));
    log.success(`Generated registry index: ${indexPath}`);

    return registry;
  }

  // Sync everything
  async sync() {
    log.title('🔄 Syncing Registry with Source Components');
    
    // Create registry structure
    this.createRegistryStructure();
    
    // Copy all files
    const components = this.copyComponents();
    const utils = this.copyUtilities();
    const hooks = this.copyHooks();
    
    // Generate registry index
    const registry = this.generateRegistryIndex(components, utils, hooks);
    
    log.success('✅ Registry sync completed successfully!');
    log.info(`📊 Summary:`);
    log.info(`   Components: ${components.length}`);
    log.info(`   Utilities: ${utils.length}`);
    log.info(`   Hooks: ${hooks.length}`);
    log.info(`   Registry: ${this.registryDir}/index.json`);
    
    return {
      components: components.length,
      utils: utils.length,
      hooks: hooks.length,
      registry: registry
    };
  }

  // Generate report
  async report() {
    log.title('📊 Registry Sync Report');
    
    const components = this.getComponentFiles();
    const utils = this.getUtilityFiles();
    const hooks = this.getHookFiles();
    
    console.log(`ℹ Components: ${components.length}`);
    components.forEach(comp => {
      console.log(`   - ${comp.name} (${comp.file})`);
    });
    
    console.log(`\nℹ Utilities: ${utils.length}`);
    utils.forEach(util => {
      console.log(`   - ${util.name} (${util.file})`);
    });
    
    console.log(`\nℹ Hooks: ${hooks.length}`);
    hooks.forEach(hook => {
      console.log(`   - ${hook.name} (${hook.file})`);
    });
  }
}

// CLI setup
const program = new Command();

program
  .name('sync-registry')
  .description('Sync registry with source components')
  .version('1.0.0');

program
  .command('sync')
  .description('Sync registry with current components')
  .option('-s, --source-dir <dir>', 'Source components directory', 'src/components/ui')
  .option('-r, --registry-dir <dir>', 'Registry directory', 'registry')
  .option('-l, --lib-dir <dir>', 'Lib directory', 'src/lib')
  .option('-h, --hooks-dir <dir>', 'Hooks directory', 'src/hooks')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options) => {
    const syncer = new RegistrySyncer(options);
    await syncer.sync();
    log.success('\n🎉 Registry sync completed successfully!');
    log.info('Your registry is now up to date with all components.');
  });

program
  .command('report')
  .description('Generate a report of what will be synced')
  .option('-s, --source-dir <dir>', 'Source components directory', 'src/components/ui')
  .option('-r, --registry-dir <dir>', 'Registry directory', 'registry')
  .option('-l, --lib-dir <dir>', 'Lib directory', 'src/lib')
  .option('-h, --hooks-dir <dir>', 'Hooks directory', 'src/hooks')
  .action(async (options) => {
    const syncer = new RegistrySyncer(options);
    await syncer.report();
  });

program.parse();
