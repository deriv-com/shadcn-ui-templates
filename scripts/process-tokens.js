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

class TokenProcessor {
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
    log.title('🔍 Loading Design Tokens');
    
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

  // Convert color values to CSS format
  convertColor(colorValue) {
    if (typeof colorValue === 'string') return colorValue;
    
    if (colorValue.r !== undefined) {
      const { r, g, b, a = 1 } = colorValue;
      const red = Math.round(r * 255);
      const green = Math.round(g * 255);
      const blue = Math.round(b * 255);
      
      if (a === 1) {
        return `rgb(${red}, ${green}, ${blue})`;
      } else {
        return `rgba(${red}, ${green}, ${blue}, ${a})`;
      }
    }
    
    return colorValue;
  }

  // Convert HSL values to CSS format
  convertHSL(hslValue) {
    if (hslValue.h !== undefined) {
      const { h, s, l, a = 1 } = hslValue;
      return a === 1 ? `hsl(${h}, ${s}%, ${l}%)` : `hsla(${h}, ${s}%, ${l}%, ${a})`;
    }
    return hslValue;
  }

  // Extract colors from tokens for Tailwind config
  extractTailwindColors() {
    log.subtitle('�� Processing Tailwind Colors');
    
    const colors = {};
    
    // Process tailwind colors
    if (this.tokens.tailwind && this.tokens.tailwind.variables) {
      this.tokens.tailwind.variables.forEach(variable => {
        if (variable.type === 'COLOR') {
          const name = variable.name.replace('tailwind colors/', '');
          const colorValue = variable.resolvedValuesByMode['1:0']?.resolvedValue;
          
          if (colorValue) {
            // Create nested color object (e.g., blue/500 -> blue.500)
            const parts = name.split('/');
            if (parts.length === 2) {
              const [colorName, shade] = parts;
              if (!colors[colorName]) colors[colorName] = {};
              colors[colorName][shade] = this.convertColor(colorValue);
            } else {
              colors[name] = this.convertColor(colorValue);
            }
          }
        }
      });
    }

    // Process theme colors (buy/sell colors)
    if (this.tokens.theme && this.tokens.theme.variables) {
      this.tokens.theme.variables.forEach(variable => {
        if (variable.type === 'COLOR' && variable.name.includes('colors/')) {
          const name = variable.name.replace('colors/', '');
          const colorValue = variable.resolvedValuesByMode['1:1']?.resolvedValue;
          
          if (colorValue) {
            // Handle buy/sell colors
            if (name.includes('buy') || name.includes('sell')) {
              const baseName = name.includes('buy') ? 'buy' : 'sell';
              const variant = name.includes('background') ? 'background' : 'foreground';
              
              if (!colors[baseName]) colors[baseName] = {};
              colors[baseName][variant] = this.convertColor(colorValue);
            } else {
              colors[name] = this.convertColor(colorValue);
            }
          }
        }
      });
    }
    
    return colors;
  }

  // Extract semantic colors for CSS variables
  extractSemanticColors() {
    log.subtitle('🎯 Processing Semantic Colors');
    
    const semanticColors = {
      light: {},
      dark: {}
    };
    
    // Process mode tokens (light/dark variants)
    if (this.tokens.mode && this.tokens.mode.variables) {
      this.tokens.mode.variables.forEach(variable => {
        const name = variable.name.replace('base/', '');
        
        // Handle special buy/sell tokens that contain both light and dark values
        if (name.includes('buy') || name.includes('sell')) {
          const lightValue = variable.resolvedValuesByMode['1:7']?.resolvedValue;
          const darkValue = variable.resolvedValuesByMode['28:0']?.resolvedValue;
          
          // Extract the base color name (buy or sell)
          const baseName = name.includes('buy') ? 'buy' : 'sell';
          
          if (lightValue) {
            semanticColors.light[`${baseName}-20`] = this.convertColor(lightValue);
          }
          if (darkValue) {
            semanticColors.dark[`${baseName}-20`] = this.convertColor(lightValue);
            semanticColors.dark[`${baseName}-40`] = this.convertColor(darkValue);
          }
        } else {
          // Handle regular tokens
          const lightValue = variable.resolvedValuesByMode['1:7']?.resolvedValue;
          const darkValue = variable.resolvedValuesByMode['28:0']?.resolvedValue;
          
          if (lightValue) {
            semanticColors.light[name] = this.convertColor(lightValue);
          }
          if (darkValue) {
            semanticColors.dark[name] = this.convertColor(darkValue);
          }
        }
      });
    }

    // Process theme colors for CSS variables
    if (this.tokens.theme && this.tokens.theme.variables) {
      this.tokens.theme.variables.forEach(variable => {
        if (variable.type === 'COLOR' && variable.name.includes('colors/')) {
          const name = variable.name.replace('colors/', '');
          const colorValue = variable.resolvedValuesByMode['1:1']?.resolvedValue;
          
          if (colorValue) {
            // Handle buy/sell colors
            if (name.includes('buy') || name.includes('sell')) {
              const baseName = name.includes('buy') ? 'buy' : 'sell';
              const variant = name.includes('background') ? 'background' : 'foreground';
              
              semanticColors.light[`${baseName}-${variant}`] = this.convertColor(colorValue);
              semanticColors.dark[`${baseName}-${variant}`] = this.convertColor(colorValue);
            } else {
              semanticColors.light[name] = this.convertColor(colorValue);
              semanticColors.dark[name] = this.convertColor(colorValue);
            }
          }
        }
      });
    }
    
    return semanticColors;
  }

  // Generate CSS variables
  generateCSSVariables() {
    log.subtitle('🎨 Generating CSS Variables');
    
    const semanticColors = this.extractSemanticColors();
    let cssContent = '';
    
    // Light mode variables
    cssContent += '  :root {\n';
    Object.entries(semanticColors.light).forEach(([name, value]) => {
      const cssVarName = `--${name.replace(/\//g, '-')}`;
      cssContent += `  ${cssVarName}: ${value};\n`;
    });
    cssContent += '  }\n\n';
    
    // Dark mode variables
    cssContent += '  .dark {\n';
    Object.entries(semanticColors.dark).forEach(([name, value]) => {
      const cssVarName = `--${name.replace(/\//g, '-')}`;
      cssContent += `  ${cssVarName}: ${value};\n`;
    });
    cssContent += '  }\n';
    
    return cssContent;
  }

  // Format Tailwind config with proper indentation
  formatTailwindConfig(content) {
    // Split into lines and process
    const lines = content.split('\n');
    const formattedLines = [];
    let indentLevel = 0;
    const indentSize = 2;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) {
        formattedLines.push('');
        continue;
      }
      
      // Decrease indent before closing braces
      if (trimmedLine.startsWith('}') || trimmedLine.startsWith('],')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      // Add proper indentation
      const indent = ' '.repeat(indentLevel * indentSize);
      formattedLines.push(indent + trimmedLine);
      
      // Increase indent after opening braces
      if (trimmedLine.endsWith('{') || trimmedLine.endsWith('[')) {
        indentLevel++;
      }
    }
    
    return formattedLines.join('\n');
  }

  // Generate properly formatted Tailwind config
  generateTailwindConfig() {
    log.subtitle('⚙️  Generating Tailwind Config');
    
    const colors = this.extractTailwindColors();
    
    // Read the existing config
    const tailwindPath = path.join(this.outputDir, 'tailwind.config.js');
    let content = fs.readFileSync(tailwindPath, 'utf8');
    
    // Generate buy and sell colors section
    let buySellColors = '';
    if (colors.buy) {
      buySellColors = `         buy: {
           background: "rgb(var(--buy-background) / <alpha-value>)",
           foreground: "rgb(var(--buy-foreground) / <alpha-value>)",
         },
         sell: {
           background: "rgb(var(--sell-background) / <alpha-value>)",
           foreground: "rgb(var(--sell-foreground) / <alpha-value>)",
         },`;
    }
    
    // Find and replace the colors section
    const colorsMatch = content.match(/(colors:\s*{[\s\S]*?)(},\s*spacing:)/);
    if (colorsMatch && buySellColors) {
      const beforeColors = colorsMatch[1];
      const afterColors = colorsMatch[2];
      content = content.replace(colorsMatch[0], beforeColors + buySellColors + '\n' + afterColors);
    }
    
    // Format the entire config
    content = this.formatTailwindConfig(content);
    
    return content;
  }

  // Apply tokens to project
  async apply() {
    log.title('🚀 Applying Design Tokens');
    
    // Generate CSS variables
    const cssVariables = this.generateCSSVariables();
    
    // Update globals.css
    const globalsPath = path.join(this.outputDir, 'src/styles/globals.css');
    if (fs.existsSync(globalsPath)) {
      let content = fs.readFileSync(globalsPath, 'utf8');
      
      // Remove existing custom variables
      content = content.replace(/--custom-buy-20-dark-buy-40:.*?\n/g, '');
      content = content.replace(/--custom-sell-20-dark-sell-40:.*?\n/g, '');
      
      // Add new variables
      content = content.replace('  :root {', `  :root {\n${cssVariables.split('  :root {')[1]}`);
      
      fs.writeFileSync(globalsPath, content);
      log.success('Updated src/styles/globals.css');
    }
    
    // Update tailwind.config.js with proper formatting
    const tailwindPath = path.join(this.outputDir, 'tailwind.config.js');
    const formattedConfig = this.generateTailwindConfig();
    fs.writeFileSync(tailwindPath, formattedConfig);
    log.success('Updated tailwind.config.js');
    
    log.success('✅ Design tokens successfully applied!');
  }

  // Generate report
  async report() {
    log.title('📊 Design Token Summary');
    
    const colors = this.extractTailwindColors();
    const semanticColors = this.extractSemanticColors();
    
    console.log(`ℹ Colors: ${Object.keys(colors).length} color families`);
    console.log(`ℹ Semantic Colors: ${Object.keys(semanticColors.light).length} semantic colors`);
    console.log('Sample Colors:');
    Object.keys(colors).slice(0, 5).forEach(name => {
      if (typeof colors[name] === 'object') {
        console.log(`ℹ   ${name}: ${Object.keys(colors[name]).length} variants`);
      } else {
        console.log(`ℹ   ${name}: ${colors[name]}`);
      }
    });
  }
}

// CLI setup
const program = new Command();

program
  .name('process-tokens')
  .description('Process Figma design tokens and apply them to shadcn/ui project')
  .version('1.0.0');

program
  .command('apply')
  .description('Apply design tokens to the project')
  .option('-d, --tokens-dir <dir>', 'Directory containing token files', 'override')
  .option('-o, --output-dir <dir>', 'Output directory', '.')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options) => {
    const processor = new TokenProcessor(options);
    await processor.loadTokens();
    await processor.apply();
    log.success('\n🎉 Token processing completed successfully!');
    log.info('Your shadcn-ui project has been updated with the new design tokens.');
    log.info('Run `npm run dev` to see the changes.');
  });

program
  .command('report')
  .description('Generate a report of available tokens')
  .option('-d, --tokens-dir <dir>', 'Directory containing token files', 'override')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options) => {
    const processor = new TokenProcessor(options);
    await processor.loadTokens();
    await processor.report();
  });

program
  .command('validate')
  .description('Validate token files')
  .option('-d, --tokens-dir <dir>', 'Directory containing token files', 'override')
  .action(async (options) => {
    const processor = new TokenProcessor(options);
    await processor.loadTokens();
    log.success('✅ All token files are valid');
  });

program.parse();
