import fs from 'fs-extra';
import path from 'path';

export interface FrameworkConfig {
  name: string;
  dependencies: string[];
  devDependencies: string[];
  configFiles: {
    tailwind: string;
    postcss: string;
    components: string;
  };
  setupFiles: {
    globals: string;
    utils: string;
  };
  aliases: {
    components: string;
    utils: string;
  };
}

export async function detectFramework(targetDir: string): Promise<string> {
  const packageJsonPath = path.join(targetDir, 'package.json');
  
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (deps.next) return 'next';
    if (deps.vite) return 'vite';
    if (deps.react) return 'react';
  }
  
  // Check for framework-specific files
  if (await fs.pathExists(path.join(targetDir, 'next.config.js'))) return 'next';
  if (await fs.pathExists(path.join(targetDir, 'vite.config.js'))) return 'vite';
  if (await fs.pathExists(path.join(targetDir, 'src'))) return 'react';
  
  return 'react'; // Default to React
}

export function getFrameworkConfig(framework: string): FrameworkConfig {
  const configs: Record<string, FrameworkConfig> = {
    react: {
      name: 'React',
      dependencies: [
        '@deriv-com/quill-shadcnui-templates',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'tailwindcss-animate'
      ],
      devDependencies: [
        'tailwindcss',
        'postcss',
        'autoprefixer'
      ],
      configFiles: {
        tailwind: 'tailwind.config.js',
        postcss: 'postcss.config.js',
        components: 'components.json'
      },
      setupFiles: {
        globals: 'src/styles/globals.css',
        utils: 'src/lib/utils.ts'
      },
      aliases: {
        components: '@/components',
        utils: '@/lib/utils'
      }
    },
    next: {
      name: 'Next.js',
      dependencies: [
        '@deriv-com/quill-shadcnui-templates',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'tailwindcss-animate'
      ],
      devDependencies: [
        'tailwindcss',
        'postcss',
        'autoprefixer'
      ],
      configFiles: {
        tailwind: 'tailwind.config.js',
        postcss: 'postcss.config.js',
        components: 'components.json'
      },
      setupFiles: {
        globals: 'app/globals.css',
        utils: 'lib/utils.ts'
      },
      aliases: {
        components: '@/components',
        utils: '@/lib/utils'
      }
    },
    vite: {
      name: 'Vite',
      dependencies: [
        '@deriv-com/quill-shadcnui-templates',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'tailwindcss-animate'
      ],
      devDependencies: [
        'tailwindcss',
        'postcss',
        'autoprefixer'
      ],
      configFiles: {
        tailwind: 'tailwind.config.js',
        postcss: 'postcss.config.js',
        components: 'components.json'
      },
      setupFiles: {
        globals: 'src/styles/globals.css',
        utils: 'src/lib/utils.ts'
      },
      aliases: {
        components: '@/components',
        utils: '@/lib/utils'
      }
    }
  };
  
  return configs[framework] || configs.react;
}
