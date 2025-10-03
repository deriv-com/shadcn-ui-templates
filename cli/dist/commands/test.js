"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCommand = testCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const execa_1 = __importDefault(require("execa"));
const inquirer_1 = __importDefault(require("inquirer"));
const components_1 = require("../utils/components");
async function testCommand(options) {
    console.log(chalk_1.default.blue.bold('\n🧪 Creating Test Project for Deriv Quill Components\n'));
    const testDir = path_1.default.resolve(options.dir || './test-project');
    const framework = options.framework || 'react';
    const port = options.port || '3000';
    const spinner = (0, ora_1.default)('Setting up test project...').start();
    try {
        // Create test project directory
        if (await fs_extra_1.default.pathExists(testDir)) {
            const { proceed } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'proceed',
                    message: `Directory ${testDir} already exists. Remove and recreate?`,
                    default: false
                }
            ]);
            if (proceed) {
                await fs_extra_1.default.remove(testDir);
            }
            else {
                spinner.fail('Test project creation cancelled');
                return;
            }
        }
        await fs_extra_1.default.ensureDir(testDir);
        spinner.text = 'Creating package.json...';
        // Create package.json based on framework
        const packageJson = getPackageJson(framework);
        await fs_extra_1.default.writeJson(path_1.default.join(testDir, 'package.json'), packageJson, { spaces: 2 });
        spinner.text = 'Setting up framework configuration...';
        // Create framework-specific files
        await createFrameworkFiles(testDir, framework);
        spinner.text = 'Copying component files...';
        // Copy all components from actual source
        const copiedComponents = await copyComponents(testDir);
        spinner.text = 'Installing dependencies...';
        // Install dependencies
        await (0, execa_1.default)('npm', ['install'], { cwd: testDir, stdio: 'pipe' });
        spinner.text = 'Creating test app...';
        // Create test app
        await createTestApp(testDir, framework);
        spinner.succeed('Test project created successfully!');
        console.log(chalk_1.default.green('\n✅ Test project ready!'));
        console.log(chalk_1.default.blue('\nNext steps:'));
        console.log(`1. cd ${testDir}`);
        console.log('2. npm start (or npm run dev)');
        console.log('3. Open browser to test components');
        if (options.open) {
            console.log(chalk_1.default.blue('\n🚀 Starting dev server...'));
            await startDevServer(testDir, framework, port);
        }
    }
    catch (error) {
        spinner.fail('Test project creation failed');
        console.error(chalk_1.default.red('Error:'), error);
        process.exit(1);
    }
}
function getPackageJson(framework) {
    const basePackage = {
        name: 'quill-test-project',
        version: '1.0.0',
        private: true,
        dependencies: {
            'class-variance-authority': '^0.7.1',
            'clsx': '^2.1.1',
            'tailwind-merge': '^1.14.0',
            'tailwindcss-animate': '^1.0.7',
            'lucide-react': '^0.263.1'
        },
        devDependencies: {
            'tailwindcss': '^3.3.0',
            'postcss': '^8.4.27',
            'autoprefixer': '^10.4.14'
        }
    };
    switch (framework) {
        case 'next':
            return {
                ...basePackage,
                scripts: {
                    dev: 'next dev',
                    build: 'next build',
                    start: 'next start'
                },
                dependencies: {
                    ...basePackage.dependencies,
                    'next': '^14.0.0',
                    'react': '^18.2.0',
                    'react-dom': '^18.2.0'
                }
            };
        case 'vite':
            return {
                ...basePackage,
                scripts: {
                    dev: 'vite',
                    build: 'vite build',
                    preview: 'vite preview'
                },
                dependencies: {
                    ...basePackage.dependencies,
                    'react': '^18.2.0',
                    'react-dom': '^18.2.0'
                },
                devDependencies: {
                    ...basePackage.devDependencies,
                    '@vitejs/plugin-react': '^4.0.3',
                    'vite': '^5.4.20'
                }
            };
        default: // react
            return {
                ...basePackage,
                scripts: {
                    start: 'react-scripts start',
                    build: 'react-scripts build',
                    test: 'react-scripts test',
                    eject: 'react-scripts eject'
                },
                dependencies: {
                    ...basePackage.dependencies,
                    'react': '^18.2.0',
                    'react-dom': '^18.2.0',
                    'react-scripts': '5.0.1'
                }
            };
    }
}
async function createFrameworkFiles(testDir, framework) {
    // Create tailwind.config.js
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
    await fs_extra_1.default.writeFile(path_1.default.join(testDir, 'tailwind.config.js'), tailwindConfig);
    // Create postcss.config.js
    const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
    await fs_extra_1.default.writeFile(path_1.default.join(testDir, 'postcss.config.js'), postcssConfig);
    // Create components.json
    const componentsJson = {
        "$schema": "https://ui.shadcn.com/schema.json",
        "style": "default",
        "rsc": true,
        "tsx": true,
        "tailwind": {
            "config": "tailwind.config.js",
            "css": "src/globals.css",
            "baseColor": "slate",
            "cssVariables": true,
            "prefix": ""
        },
        "aliases": {
            "components": "@/components",
            "utils": "@/lib/utils"
        }
    };
    await fs_extra_1.default.writeFile(path_1.default.join(testDir, 'components.json'), JSON.stringify(componentsJson, null, 2));
    // Create framework-specific files
    if (framework === 'next') {
        await createNextFiles(testDir);
    }
    else if (framework === 'vite') {
        await createViteFiles(testDir);
    }
    else {
        await createReactFiles(testDir);
    }
}
async function createNextFiles(testDir) {
    // Create next.config.js
    await fs_extra_1.default.writeFile(path_1.default.join(testDir, 'next.config.js'), `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig`);
    // Create app directory structure
    await fs_extra_1.default.ensureDir(path_1.default.join(testDir, 'app'));
    await fs_extra_1.default.ensureDir(path_1.default.join(testDir, 'lib'));
}
async function createViteFiles(testDir) {
    // Create vite.config.ts
    await fs_extra_1.default.writeFile(path_1.default.join(testDir, 'vite.config.ts'), `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`);
    // Create index.html
    await fs_extra_1.default.writeFile(path_1.default.join(testDir, 'index.html'), `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Quill Test Project</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);
}
async function createReactFiles(testDir) {
    // Create public directory
    await fs_extra_1.default.ensureDir(path_1.default.join(testDir, 'public'));
    // Create public/index.html
    await fs_extra_1.default.writeFile(path_1.default.join(testDir, 'public/index.html'), `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Quill Test Project" />
    <title>Quill Test Project</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`);
}
async function copyComponents(testDir) {
    // Copy all components from actual source
    const copiedComponents = await (0, components_1.copyAllComponents)(testDir);
    // Copy lib/utils.ts from actual source
    const sourceUtils = path_1.default.join(process.cwd(), 'src/lib/utils.ts');
    const targetUtils = path_1.default.join(testDir, 'src/lib/utils.ts');
    if (await fs_extra_1.default.pathExists(sourceUtils)) {
        await fs_extra_1.default.ensureDir(path_1.default.dirname(targetUtils));
        await fs_extra_1.default.copy(sourceUtils, targetUtils);
    }
    return copiedComponents;
}
async function createTestApp(testDir, framework) {
    const testAppContent = `import React from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import './globals.css';

function App() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        🧪 Deriv Quill Components Test
      </h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Testing all Deriv Quill components in a ${framework} project
      </p>
      
      <div style={{ display: 'grid', gap: '2rem' }}>
        
        {/* Button Test */}
        <Card>
          <CardHeader>
            <CardTitle>Button Components</CardTitle>
            <CardDescription>Testing all button variants and sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>

        {/* Input Test */}
        <Card>
          <CardHeader>
            <CardTitle>Input Components</CardTitle>
            <CardDescription>Testing form inputs and validation</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
              <Input placeholder="Enter your name" />
              <Input placeholder="Email address" type="email" />
              <Input placeholder="Password" type="password" />
              <Input placeholder="Disabled input" disabled />
            </div>
          </CardContent>
        </Card>

        {/* Badge Test */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Components</CardTitle>
            <CardDescription>Testing badge variants</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Alert Test */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Components</CardTitle>
            <CardDescription>Testing alert variants</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Alert>
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>This is a default alert message.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle>Destructive Alert</AlertTitle>
                <AlertDescription>This is a destructive alert message.</AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        <Card style={{ padding: '1rem', backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9' }}>
          <h3 style={{ color: '#0c4a6e', margin: '0 0 0.5rem 0' }}>✅ Test Project Ready!</h3>
          <p style={{ color: '#0c4a6e', margin: 0 }}>
            All Deriv Quill components are working correctly in your ${framework} project!
          </p>
        </Card>

      </div>
    </div>
  );
}

export default App;`;
    if (framework === 'next') {
        await fs_extra_1.default.writeFile(path_1.default.join(testDir, 'app/page.tsx'), testAppContent);
    }
    else if (framework === 'vite') {
        await fs_extra_1.default.writeFile(path_1.default.join(testDir, 'src/App.tsx'), testAppContent);
        await fs_extra_1.default.writeFile(path_1.default.join(testDir, 'src/main.tsx'), `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`);
    }
    else {
        await fs_extra_1.default.writeFile(path_1.default.join(testDir, 'src/App.tsx'), testAppContent);
        await fs_extra_1.default.writeFile(path_1.default.join(testDir, 'src/index.tsx'), `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`);
    }
    // Create globals.css
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
    await fs_extra_1.default.writeFile(path_1.default.join(testDir, 'src/globals.css'), globalsCss);
}
async function startDevServer(testDir, framework, port) {
    const spinner = (0, ora_1.default)('Starting dev server...').start();
    try {
        const startCommand = framework === 'next' ? 'npm run dev' :
            framework === 'vite' ? 'npm run dev' :
                'npm start';
        await (0, execa_1.default)('npm', ['run', 'dev'], {
            cwd: testDir,
            stdio: 'inherit',
            env: { ...process.env, PORT: port }
        });
    }
    catch (error) {
        spinner.fail('Failed to start dev server');
        console.error(chalk_1.default.red('Error:'), error);
    }
}
//# sourceMappingURL=test.js.map