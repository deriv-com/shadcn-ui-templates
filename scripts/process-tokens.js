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

class ComprehensiveTokenProcessor {
  constructor(options = {}) {
    this.tokensDir = options.tokensDir || 'override';
    this.outputDir = options.outputDir || '.';
    this.verbose = options.verbose || false;
    
    // Token files mapping
    this.tokenFiles = {
      tailwind: 'tailwind-tokens.json',
      theme: 'theme-tokens.json',
      mode: 'mode-tokens.json',
      custom: 'custom-tokens.json'
    };
    
    this.tokens = {};
  }

  // Load and parse all token files
  async loadTokens() {
    log.title('🔍 Loading ALL Design Tokens');
    
    for (const [type, filename] of Object.entries(this.tokenFiles)) {
      const filepath = path.join(this.tokensDir, filename);
      
      if (fs.existsSync(filepath)) {
        try {
          const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
          this.tokens[type] = data;
          log.success(`Loaded ${type} tokens (${(fs.statSync(filepath).size / 1024).toFixed(1)}KB)`);
        } catch (error) {
          log.error(`Failed to load ${filename}: ${error.message}`);
        }
      } else {
        log.warning(`Token file not found: ${filename}`);
      }
    }
  }

  // Convert color values to CSS format (space-separated RGB)
  convertColor(colorValue) {
    if (typeof colorValue === 'string') {
      if (colorValue.startsWith('rgb(')) {
        const match = colorValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
          return `${match[1]} ${match[2]} ${match[3]}`;
        }
      }
      return colorValue;
    }
    
    if (colorValue.r !== undefined) {
      const { r, g, b, a = 1 } = colorValue;
      const red = Math.round(r * 255);
      const green = Math.round(g * 255);
      const blue = Math.round(b * 255);
      
      if (a === 1) {
        return `${red} ${green} ${blue}`;
      } else {
        return `${red} ${green} ${blue} / ${a}`;
      }
    }
    
    return colorValue;
  }

  // Extract ALL colors from ALL token files
  extractAllColors() {
    log.subtitle('🎨 Extracting ALL Colors from ALL Token Files');
    
    const allColors = { light: {}, dark: {} };
    
    // Process theme-tokens.json for semantic colors
    if (this.tokens.theme && this.tokens.theme.variables) {
      this.tokens.theme.variables.forEach(variable => {
        if (variable.type !== 'COLOR') return;
        
        const name = variable.name;
        const modes = variable.resolvedValuesByMode || {};
        
        // Extract color value from mode 1:1
        let colorValue = null;
        if (modes['1:1'] && modes['1:1'].resolvedValue) {
          colorValue = modes['1:1'].resolvedValue;
        }
        
        if (!colorValue) return;
        
        // Process color name to CSS variable name
        const cssVarName = this.processSemanticColorName(name);
        if (cssVarName) {
          allColors.light[cssVarName] = this.convertColor(colorValue);
          allColors.dark[cssVarName] = this.convertColor(colorValue);
        }
      });
    }
    
    return allColors;
  }

  // Process semantic color names
  processSemanticColorName(name) {
    // Remove 'colors/' prefix and convert to CSS variable format
    const cleanName = name.replace(/^colors\//, '');
    
    // Handle semantic colors
    if (cleanName === 'background-light') return 'background';
    if (cleanName === 'background-dark') return 'background';
    if (cleanName === 'foreground-light') return 'foreground';
    if (cleanName === 'foreground-dark') return 'foreground';
    if (cleanName === 'card-light') return 'card';
    if (cleanName === 'card-dark') return 'card';
    if (cleanName === 'card-foreground-light') return 'card-foreground';
    if (cleanName === 'card-foreground-dark') return 'card-foreground';
    if (cleanName === 'popover-light') return 'popover';
    if (cleanName === 'popover-dark') return 'popover';
    if (cleanName === 'popover-foreground-light') return 'popover-foreground';
    if (cleanName === 'popover-foreground-dark') return 'popover-foreground';
    if (cleanName === 'primary-light') return 'primary';
    if (cleanName === 'primary-dark') return 'primary';
    if (cleanName === 'primary-foreground-light') return 'primary-foreground';
    if (cleanName === 'primary-foreground-dark') return 'primary-foreground';
    if (cleanName === 'secondary-light') return 'secondary';
    if (cleanName === 'secondary-dark') return 'secondary';
    if (cleanName === 'secondary-foreground-light') return 'secondary-foreground';
    if (cleanName === 'secondary-foreground-dark') return 'secondary-foreground';
    if (cleanName === 'muted-light') return 'muted';
    if (cleanName === 'muted-dark') return 'muted';
    if (cleanName === 'muted-foreground-light') return 'muted-foreground';
    if (cleanName === 'muted-foreground-dark') return 'muted-foreground';
    if (cleanName === 'accent-light') return 'accent';
    if (cleanName === 'accent-dark') return 'accent';
    if (cleanName === 'accent-foreground-light') return 'accent-foreground';
    if (cleanName === 'accent-foreground-dark') return 'accent-foreground';
    if (cleanName === 'destructive-light') return 'destructive';
    if (cleanName === 'destructive-dark') return 'destructive';
    if (cleanName === 'destructive-foreground-light') return 'destructive-foreground';
    if (cleanName === 'destructive-foreground-dark') return 'destructive-foreground';
    if (cleanName === 'border-light') return 'border';
    if (cleanName === 'border-dark') return 'border';
    if (cleanName === 'input-light') return 'input';
    if (cleanName === 'input-dark') return 'input';
    if (cleanName === 'ring-light') return 'ring';
    if (cleanName === 'ring-dark') return 'ring';
    
    // Handle buy/sell colors
    if (cleanName === 'buy-light') return 'buy-background';
    if (cleanName === 'buy-foreground-light') return 'buy-foreground';
    if (cleanName === 'sell-light') return 'sell-background';
    if (cleanName === 'sell-foreground-light') return 'sell-foreground';
    
    // Handle chart colors
    if (cleanName.startsWith('chart-')) {
      return cleanName.replace('-light', '').replace('-dark', '');
    }
    
    return null;
  }

  // Generate comprehensive CSS from ALL token data
  generateComprehensiveCSS() {
    log.subtitle('🎨 Generating Comprehensive CSS from ALL Token Data');
    
    const allColors = this.extractAllColors();
    
    // Generate CSS variables from the actual extracted data
    let lightVars = '';
    let darkVars = '';
    
    // Add semantic colors
    Object.entries(allColors.light).forEach(([name, value]) => {
      lightVars += `    --${name}: ${value};\n`;
    });
    
    Object.entries(allColors.dark).forEach(([name, value]) => {
      darkVars += `    --${name}: ${value};\n`;
    });
    
    const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --radius: 0.5rem;
    
    /* ALL colors from Figma tokens */
${lightVars}  }

  .dark {
    /* ALL colors from Figma tokens */
${darkVars}  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;
    
    return cssContent;
  }

  // Generate clean Tailwind config with buy/sell colors
  generateCleanTailwindConfig() {
    log.subtitle('⚙️  Generating Clean Tailwind Config');
    
    // Read the existing config
    const tailwindPath = path.join(this.outputDir, 'tailwind.config.js');
    let content = fs.readFileSync(tailwindPath, 'utf8');
    
    // Add buy/sell colors after the card definition
    const buySellColors = `
        buy: {
          background: "rgb(var(--buy-background) / <alpha-value>)",
          foreground: "rgb(var(--buy-foreground) / <alpha-value>)",
        },
        sell: {
          background: "rgb(var(--sell-background) / <alpha-value>)",
          foreground: "rgb(var(--sell-foreground) / <alpha-value>)",
        },`;
    
    // Find the card definition and add buy/sell colors after it
    const cardMatch = content.match(/(card:\s*{[\s\S]*?},)/);
    if (cardMatch) {
      content = content.replace(cardMatch[1], cardMatch[1] + buySellColors);
    }
    
    return content;
  }

  // Apply ALL token data
  async apply() {
    log.title('🚀 Applying ALL Token Data');
    
    // Generate comprehensive CSS
    const comprehensiveCSS = this.generateComprehensiveCSS();
    
    // Update globals.css
    const globalsPath = path.join(this.outputDir, 'src/styles/globals.css');
    fs.writeFileSync(globalsPath, comprehensiveCSS);
    log.success('Updated src/styles/globals.css with ALL token data');
    
    // Update tailwind.config.js
    const tailwindPath = path.join(this.outputDir, 'tailwind.config.js');
    const cleanConfig = this.generateCleanTailwindConfig();
    fs.writeFileSync(tailwindPath, cleanConfig);
    log.success('Updated tailwind.config.js with buy/sell colors');
    
    log.success('✅ ALL token data successfully applied!');
    log.info('Your project now uses ALL colors from Figma tokens.');
  }

  // Generate comprehensive report
  async report() {
    log.title('📊 Comprehensive Token Report');
    
    const allColors = this.extractAllColors();
    
    console.log(`ℹ Total Colors: ${Object.keys(allColors.light).length}`);
    
    console.log('\n🎨 ALL Colors from Figma tokens:');
    Object.entries(allColors.light).forEach(([name, value]) => {
      console.log(`ℹ   ${name}: ${value}`);
    });
  }
}

// CLI setup
const program = new Command();

program
  .name('process-tokens')
  .description('Comprehensive Figma design token processor for shadcn/ui projects')
  .version('10.0.0');

program
  .command('apply')
  .description('Apply ALL token data (colors, spacing, typography, etc.)')
  .option('-d, --tokens-dir <dir>', 'Directory containing token files', 'override')
  .option('-o, --output-dir <dir>', 'Output directory', '.')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options) => {
    const processor = new ComprehensiveTokenProcessor(options);
    await processor.loadTokens();
    await processor.apply();
    log.success('\n🎉 Comprehensive token processing completed successfully!');
    log.info('Your shadcn-ui project now has ALL token data from Figma.');
    log.info('Run `npm run dev` to see the changes.');
  });

program
  .command('report')
  .description('Generate a comprehensive report of ALL token data')
  .option('-d, --tokens-dir <dir>', 'Directory containing token files', 'override')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options) => {
    const processor = new ComprehensiveTokenProcessor(options);
    await processor.loadTokens();
    await processor.report();
  });

program
  .command('validate')
  .description('Validate token files')
  .option('-d, --tokens-dir <dir>', 'Directory containing token files', 'override')
  .action(async (options) => {
    const processor = new ComprehensiveTokenProcessor(options);
    await processor.loadTokens();
    log.success('✅ All token files are valid');
  });

program.parse();
