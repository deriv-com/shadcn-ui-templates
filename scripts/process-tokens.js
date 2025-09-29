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
      
      if (!fs.existsSync(filepath)) {
        log.warning(`Token file not found: ${filepath}`);
        continue;
      }
      
      try {
        const content = fs.readFileSync(filepath, 'utf8');
        this.tokens[type] = JSON.parse(content);
        log.success(`Loaded ${type} tokens (${this.getFileSize(filepath)})`);
      } catch (error) {
        log.error(`Failed to load ${type} tokens: ${error.message}`);
      }
    }
  }

  // Convert Figma color values to CSS/Tailwind format
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
      const hue = Math.round(h * 360);
      const saturation = Math.round(s * 100);
      const lightness = Math.round(l * 100);
      
      if (a === 1) {
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      } else {
        return `hsla(${hue}, ${saturation}%, ${lightness}%, ${a})`;
      }
    }
    
    return hslValue;
  }

  // Extract colors from tokens for Tailwind config
  extractTailwindColors() {
    log.subtitle('🎨 Processing Tailwind Colors');
    
    const colors = {};
    
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
    
    return colors;
  }

  // Extract semantic colors for CSS variables
  extractSemanticColors() {
    log.subtitle('🎯 Processing Semantic Colors');
    
    const semanticColors = {
      light: {},
      dark: {}
    };
    
    if (this.tokens.mode && this.tokens.mode.variables) {
      this.tokens.mode.variables.forEach(variable => {
        const name = variable.name.replace('base/', '');
        const lightValue = variable.resolvedValuesByMode['1:7']?.resolvedValue;
        const darkValue = variable.resolvedValuesByMode['28:0']?.resolvedValue;
        
        if (lightValue) {
          semanticColors.light[name] = this.convertColor(lightValue);
        }
        if (darkValue) {
          semanticColors.dark[name] = this.convertColor(darkValue);
        }
      });
    }
    
    return semanticColors;
  }

  // Extract typography tokens
  extractTypography() {
    log.subtitle('📝 Processing Typography');
    
    const typography = {};
    
    // Process custom responsive typography
    if (this.tokens.custom && this.tokens.custom.variables) {
      this.tokens.custom.variables.forEach(variable => {
        const name = variable.name;
        
        if (name.includes('heading-')) {
          const [heading, property] = name.split('/');
          const desktopValue = variable.resolvedValuesByMode['17548:0']?.resolvedValue;
          const mobileValue = variable.resolvedValuesByMode['17548:1']?.resolvedValue;
          
          if (!typography[heading]) typography[heading] = {};
          
          typography[heading][property] = {
            desktop: desktopValue,
            mobile: mobileValue
          };
        }
      });
    }
    
    // Process theme typography
    if (this.tokens.theme && this.tokens.theme.variables) {
      this.tokens.theme.variables.forEach(variable => {
        if (variable.name.includes('text/') || variable.name.includes('font/')) {
          const name = variable.name.replace('text/', '').replace('font/', '');
          const value = variable.resolvedValuesByMode['1:1']?.resolvedValue;
          
          if (value !== undefined) {
            if (!typography.base) typography.base = {};
            typography.base[name] = value;
          }
        }
      });
    }
    
    return typography;
  }

  // Extract spacing tokens
  extractSpacing() {
    log.subtitle('📏 Processing Spacing');
    
    const spacing = {};
    
    if (this.tokens.tailwind && this.tokens.tailwind.variables) {
      this.tokens.tailwind.variables.forEach(variable => {
        if (variable.name.includes('spacing/') && variable.type === 'FLOAT') {
          const name = variable.name.replace('spacing/', '');
          const value = variable.resolvedValuesByMode['1:0']?.resolvedValue;
          
          if (value !== undefined) {
            spacing[name] = `${value}px`;
          }
        }
      });
    }
    
    return spacing;
  }

  // Generate updated Tailwind config
  generateTailwindConfig() {
    log.subtitle('⚙️  Generating Tailwind Config');
    
    const colors = this.extractTailwindColors();
    const spacing = this.extractSpacing();
    
    const config = `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
             colors: {
         border: "rgb(var(--border) / <alpha-value>)",
         input: "rgb(var(--input) / <alpha-value>)",
         ring: "rgb(var(--ring) / <alpha-value>)",
         background: "rgb(var(--background) / <alpha-value>)",
         foreground: "rgb(var(--foreground) / <alpha-value>)",
         primary: {
           DEFAULT: "rgb(var(--primary) / <alpha-value>)",
           foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
         },
         secondary: {
           DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
           foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
         },
         destructive: {
           DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
           foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
         },
         muted: {
           DEFAULT: "rgb(var(--muted) / <alpha-value>)",
           foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
         },
         accent: {
           DEFAULT: "rgb(var(--accent) / <alpha-value>)",
           foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
         },
         popover: {
           DEFAULT: "rgb(var(--popover) / <alpha-value>)",
           foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
         },
         card: {
           DEFAULT: "rgb(var(--card) / <alpha-value>)",
           foreground: "rgb(var(--card-foreground) / <alpha-value>)",
         },
                    // Enhanced color palette from design tokens
            ${Object.entries(colors).map(([colorName, colorShades]) => {
              if (typeof colorShades === 'object' && colorShades !== null) {
                return `${colorName}: ${JSON.stringify(colorShades, null, 10)},`;
              } else {
                return `"${colorName}": "${colorShades}",`;
              }
            }).join('\n        ')}
      },
                spacing: ${JSON.stringify(spacing, null, 8)},
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}`;
    
    return config;
  }

  // Sanitize CSS variable names
  sanitizeVariableName(name) {
    return name
      .replace(/[^a-zA-Z0-9-_]/g, '-')  // Replace invalid chars with hyphens
      .replace(/-+/g, '-')              // Collapse multiple hyphens
      .replace(/^-|-$/g, '')            // Remove leading/trailing hyphens
      .toLowerCase();
  }

  // Generate CSS variables for globals.css
  generateCSSVariables() {
    log.subtitle('🎨 Generating CSS Variables');
    
    const semanticColors = this.extractSemanticColors();
    
          const lightVars = Object.entries(semanticColors.light)
        .map(([name, value]) => {
          const sanitizedName = this.sanitizeVariableName(name);
          // Convert RGB/RGBA values to space-separated format for modern CSS
          if (typeof value === 'string' && value.startsWith('rgb')) {
            const cleanValue = value.replace('rgb(', '').replace('rgba(', '').replace(')', '');
            // Convert comma-separated to space-separated for modern CSS rgb() syntax
            const spaceSeparated = cleanValue.replace(/,\s*/g, ' ');
            return `  --${sanitizedName}: ${spaceSeparated};`;
          }
          return `  --${sanitizedName}: ${value};`;
        })
        .join('\n');
      
      const darkVars = Object.entries(semanticColors.dark)
        .map(([name, value]) => {
          const sanitizedName = this.sanitizeVariableName(name);
          if (typeof value === 'string' && value.startsWith('rgb')) {
            const cleanValue = value.replace('rgb(', '').replace('rgba(', '').replace(')', '');
            // Convert comma-separated to space-separated for modern CSS rgb() syntax
            const spaceSeparated = cleanValue.replace(/,\s*/g, ' ');
            return `  --${sanitizedName}: ${spaceSeparated};`;
          }
          return `  --${sanitizedName}: ${value};`;
        })
        .join('\n');
    
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
${lightVars}
    --radius: 0.5rem;
  }
 
  .dark {
${darkVars}
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;
  }

  // Generate TypeScript types for design tokens
  generateTypes() {
    log.subtitle('📝 Generating TypeScript Types');
    
    const colors = this.extractTailwindColors();
    const typography = this.extractTypography();
    
    let types = `// Auto-generated design token types
export interface DesignTokens {
  colors: {
`;
    
    // Add color types
    Object.entries(colors).forEach(([colorName, colorShades]) => {
      if (typeof colorShades === 'object' && colorShades !== null) {
        types += `    ${colorName}: {\n`;
        Object.keys(colorShades).forEach(shade => {
          types += `      "${shade}": string;\n`;
        });
        types += `    };\n`;
      } else {
        types += `    ${colorName}: string;\n`;
      }
    });
    
    types += `  };
  typography: {
`;
    
    // Add typography types
    Object.entries(typography).forEach(([typeName, typeProps]) => {
      types += `    "${typeName}": {\n`;
      if (typeof typeProps === 'object') {
        Object.keys(typeProps).forEach(prop => {
          types += `      "${prop}": any;\n`;
        });
      }
      types += `    };\n`;
    });
    
    types += `  };
}

export type ColorName = keyof DesignTokens['colors'];
export type TypographyName = keyof DesignTokens['typography'];
`;
    
    return types;
  }

  // Apply tokens to project files
  async applyTokens() {
    log.title('🚀 Applying Design Tokens');
    
    try {
      // Generate and write Tailwind config
      const tailwindConfig = this.generateTailwindConfig();
      fs.writeFileSync(path.join(this.outputDir, 'tailwind.config.js'), tailwindConfig);
      log.success('Updated tailwind.config.js');
      
      // Generate and write CSS variables
      const cssVariables = this.generateCSSVariables();
      const stylesDir = path.join(this.outputDir, 'src', 'styles');
      if (!fs.existsSync(stylesDir)) {
        fs.mkdirSync(stylesDir, { recursive: true });
      }
      fs.writeFileSync(path.join(stylesDir, 'globals.css'), cssVariables);
      log.success('Updated src/styles/globals.css');
      
      // Generate and write TypeScript types
      const types = this.generateTypes();
      const typesDir = path.join(this.outputDir, 'src', 'types');
      if (!fs.existsSync(typesDir)) {
        fs.mkdirSync(typesDir, { recursive: true });
      }
      fs.writeFileSync(path.join(typesDir, 'design-tokens.ts'), types);
      log.success('Generated src/types/design-tokens.ts');
      
      log.title('✅ Design tokens successfully applied!');
      
    } catch (error) {
      log.error(`Failed to apply tokens: ${error.message}`);
      throw error;
    }
  }

  // Utility methods
  getFileSize(filepath) {
    const stats = fs.statSync(filepath);
    const sizeInBytes = stats.size;
    if (sizeInBytes < 1024) return `${sizeInBytes}B`;
    if (sizeInBytes < 1048576) return `${(sizeInBytes / 1024).toFixed(1)}KB`;
    return `${(sizeInBytes / 1048576).toFixed(1)}MB`;
  }

  // Main processing method
  async process() {
    try {
      await this.loadTokens();
      await this.applyTokens();
      
      log.title('🎉 Token processing completed successfully!');
      log.info('Your shadcn-ui project has been updated with the new design tokens.');
      log.info('Run `npm run dev` to see the changes.');
      
    } catch (error) {
      log.error(`Token processing failed: ${error.message}`);
      process.exit(1);
    }
  }

  // Generate summary report
  generateReport() {
    log.title('📊 Design Token Summary');
    
    const colors = this.extractTailwindColors();
    const typography = this.extractTypography();
    const spacing = this.extractSpacing();
    
    log.info(`Colors: ${Object.keys(colors).length} color families`);
    log.info(`Spacing: ${Object.keys(spacing).length} spacing values`);
    log.info(`Typography: ${Object.keys(typography).length} type styles`);
    
    // Show sample colors
    if (Object.keys(colors).length > 0) {
      log.subtitle('Sample Colors:');
      Object.entries(colors).slice(0, 3).forEach(([name, value]) => {
        if (typeof value === 'object') {
          log.info(`  ${name}: ${Object.keys(value).length} shades`);
        } else {
          log.info(`  ${name}: ${value}`);
        }
      });
    }
  }
}

// CLI Setup
const program = new Command();

program
  .name('process-tokens')
  .description('Process Figma design tokens and apply them to shadcn-ui project')
  .version('1.0.0');

program
  .command('apply')
  .description('Apply design tokens to the project')
  .option('-t, --tokens-dir <dir>', 'Directory containing token files', 'override')
  .option('-o, --output-dir <dir>', 'Output directory for processed files', '.')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (options) => {
    const processor = new TokenProcessor(options);
    await processor.process();
  });

program
  .command('report')
  .description('Generate a summary report of design tokens')
  .option('-t, --tokens-dir <dir>', 'Directory containing token files', 'override')
  .option('-v, --verbose', 'Enable verbose logging')
  .action((options) => {
    const processor = new TokenProcessor(options);
    processor.loadTokens().then(() => {
      processor.generateReport();
    });
  });

program
  .command('validate')
  .description('Validate design token files')
  .option('-t, --tokens-dir <dir>', 'Directory containing token files', 'override')
  .action((options) => {
    const processor = new TokenProcessor(options);
    processor.loadTokens().then(() => {
      log.success('All token files are valid!');
    }).catch((error) => {
      log.error(`Validation failed: ${error.message}`);
      process.exit(1);
    });
  });

// Run CLI
if (require.main === module) {
  program.parse();
}

module.exports = TokenProcessor; 