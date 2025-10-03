import fs from 'fs-extra';
import path from 'path';
import { FrameworkConfig } from './framework';
import { getComponentTemplate, getAvailableComponents } from './components';


export async function updateConfigFiles(
  targetDir: string, 
  framework: string, 
  config: FrameworkConfig
) {
  // Update tailwind.config.js
  await updateTailwindConfig(targetDir, config);
  
  // Update postcss.config.js
  await updatePostcssConfig(targetDir, config);
  
  // Update components.json
  await updateComponentsJson(targetDir, config);
  
  // Update globals.css
  await updateGlobalsCss(targetDir, config);
  
  // Update utils.ts
  await updateUtilsTs(targetDir, config);
}

export async function updateComponentFiles(
  targetDir: string, 
  config: FrameworkConfig
): Promise<string[]> {
  const componentsDir = path.join(targetDir, 'src/components/ui');
  const updatedComponents: string[] = [];
  
  // Ensure components directory exists
  await fs.ensureDir(componentsDir);
  
  // Get all available components from actual source
  const availableComponents = await getAvailableComponents();
  
  // Update each component that exists in the project
  for (const componentName of availableComponents) {
    const componentFile = path.join(componentsDir, `${componentName}.tsx`);
    
    // Check if component exists in the project
    const componentExists = await fs.pathExists(componentFile);
    
    if (componentExists) {
      // Always update existing components to latest version from source
      const componentTemplate = await getComponentTemplate(componentName);
      if (componentTemplate) {
        await fs.writeFile(componentFile, componentTemplate);
        updatedComponents.push(componentName);
      }
    }
    // Note: We don't create new components automatically during update
    // Users should use `quill-shadcn add <component>` for that
  }
  
  return updatedComponents;
}

async function updateTailwindConfig(targetDir: string, config: FrameworkConfig) {
  const tailwindConfigPath = path.join(targetDir, config.configFiles.tailwind);
  
  // Try to read from bundled config first
  const bundledConfigPath = path.join(__dirname, '../config/tailwind.config.js');
  
  if (await fs.pathExists(bundledConfigPath)) {
    await fs.copy(bundledConfigPath, tailwindConfigPath);
    return;
  }
  
  // Fallback to default config
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
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

  await fs.writeFile(tailwindConfigPath, tailwindConfig);
}

async function updatePostcssConfig(targetDir: string, config: FrameworkConfig) {
  const postcssConfigPath = path.join(targetDir, config.configFiles.postcss);
  
  // Try to read from bundled config first
  const bundledConfigPath = path.join(__dirname, '../config/postcss.config.js');
  
  if (await fs.pathExists(bundledConfigPath)) {
    await fs.copy(bundledConfigPath, postcssConfigPath);
    return;
  }
  
  // Fallback to default config
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

  await fs.writeFile(postcssConfigPath, postcssConfig);
}

async function updateComponentsJson(targetDir: string, config: FrameworkConfig) {
  const componentsJsonPath = path.join(targetDir, config.configFiles.components);
  
  // Try to read from bundled config first
  const bundledConfigPath = path.join(__dirname, '../config/components.json');
  
  if (await fs.pathExists(bundledConfigPath)) {
    const bundledConfig = await fs.readJson(bundledConfigPath);
    // Update paths for the target project
    bundledConfig.tailwind.config = config.configFiles.tailwind;
    bundledConfig.tailwind.css = config.setupFiles.globals;
    bundledConfig.aliases.components = config.aliases.components;
    bundledConfig.aliases.utils = config.aliases.utils;
    
    await fs.writeFile(componentsJsonPath, JSON.stringify(bundledConfig, null, 2));
    return;
  }
  
  // Fallback to default config
  const componentsJson = {
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "default",
    "rsc": true,
    "tsx": true,
    "tailwind": {
      "config": config.configFiles.tailwind,
      "css": config.setupFiles.globals,
      "baseColor": "slate",
      "cssVariables": true,
      "prefix": ""
    },
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils"
    },
    "registry": "@deriv-com/quill-shadcnui-templates/components.json"
  };

  await fs.writeFile(componentsJsonPath, JSON.stringify(componentsJson, null, 2));
}

async function updateGlobalsCss(targetDir: string, config: FrameworkConfig) {
  const globalsCssPath = path.join(targetDir, config.setupFiles.globals);
  
  // Try to read from bundled styles first
  const bundledStylesPath = path.join(__dirname, '../styles/globals.css');
  
  if (await fs.pathExists(bundledStylesPath)) {
    await fs.copy(bundledStylesPath, globalsCssPath);
    return;
  }
  
  // Fallback to default styles
  const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
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

  await fs.writeFile(globalsCssPath, globalsCss);
}

async function updateUtilsTs(targetDir: string, config: FrameworkConfig) {
  const utilsTsPath = path.join(targetDir, config.setupFiles.utils);
  
  const utilsTs = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;

  await fs.writeFile(utilsTsPath, utilsTs);
}
