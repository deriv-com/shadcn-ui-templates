"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFramework = detectFramework;
exports.getFrameworkConfig = getFrameworkConfig;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function detectFramework(targetDir) {
    const packageJsonPath = path_1.default.join(targetDir, 'package.json');
    if (await fs_extra_1.default.pathExists(packageJsonPath)) {
        const packageJson = await fs_extra_1.default.readJson(packageJsonPath);
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        if (deps.next)
            return 'next';
        if (deps.vite)
            return 'vite';
        if (deps.react)
            return 'react';
    }
    // Check for framework-specific files
    if (await fs_extra_1.default.pathExists(path_1.default.join(targetDir, 'next.config.js')))
        return 'next';
    if (await fs_extra_1.default.pathExists(path_1.default.join(targetDir, 'vite.config.js')))
        return 'vite';
    if (await fs_extra_1.default.pathExists(path_1.default.join(targetDir, 'src')))
        return 'react';
    return 'react'; // Default to React
}
function getFrameworkConfig(framework) {
    const configs = {
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
//# sourceMappingURL=framework.js.map