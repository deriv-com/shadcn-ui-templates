"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommand = createCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
async function createCommand(componentName, options) {
    console.log(chalk_1.default.blue.bold(`\n➕ Creating New Component: ${componentName}\n`));
    const targetDir = path_1.default.resolve(options.dir || 'src/components/ui');
    const componentFile = path_1.default.join(targetDir, `${componentName}.tsx`);
    const spinner = (0, ora_1.default)(`Creating ${componentName} component...`).start();
    try {
        // Check if component already exists
        if (await fs_extra_1.default.pathExists(componentFile)) {
            const { overwrite } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: `Component ${componentName} already exists. Overwrite?`,
                    default: false
                }
            ]);
            if (!overwrite) {
                spinner.fail('Component creation cancelled');
                return;
            }
        }
        // Ensure directory exists
        await fs_extra_1.default.ensureDir(targetDir);
        // Get template based on type
        const template = getComponentTemplate(componentName, options.template || 'basic');
        // Write component file
        await fs_extra_1.default.writeFile(componentFile, template);
        spinner.succeed(`${componentName} component created successfully!`);
        console.log(chalk_1.default.green(`\n✅ ${componentName} component created at ${componentFile}`));
        console.log(chalk_1.default.blue('\nNext steps:'));
        console.log('1. Customize the component as needed');
        console.log('2. Add it to your project');
        console.log('3. Test the component');
    }
    catch (error) {
        spinner.fail('Failed to create component');
        console.error(chalk_1.default.red('Error:'), error);
        process.exit(1);
    }
}
function getComponentTemplate(componentName, template) {
    const componentNamePascal = componentName.charAt(0).toUpperCase() + componentName.slice(1);
    switch (template) {
        case 'form':
            return `import * as React from "react"
import { cn } from "@/lib/utils"

export interface ${componentNamePascal}Props
  extends React.HTMLAttributes<HTMLDivElement> {}

const ${componentNamePascal} = React.forwardRef<HTMLDivElement, ${componentNamePascal}Props>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "space-y-2",
          className
        )}
        {...props}
      />
    )
  }
)
${componentNamePascal}.displayName = "${componentNamePascal}"

export { ${componentNamePascal} }`;
        case 'layout':
            return `import * as React from "react"
import { cn } from "@/lib/utils"

export interface ${componentNamePascal}Props
  extends React.HTMLAttributes<HTMLDivElement> {}

const ${componentNamePascal} = React.forwardRef<HTMLDivElement, ${componentNamePascal}Props>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-4",
          className
        )}
        {...props}
      />
    )
  }
)
${componentNamePascal}.displayName = "${componentNamePascal}"

export { ${componentNamePascal} }`;
        default: // basic
            return `import * as React from "react"
import { cn } from "@/lib/utils"

export interface ${componentNamePascal}Props
  extends React.HTMLAttributes<HTMLDivElement> {}

const ${componentNamePascal} = React.forwardRef<HTMLDivElement, ${componentNamePascal}Props>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          className
        )}
        {...props}
      />
    )
  }
)
${componentNamePascal}.displayName = "${componentNamePascal}"

export { ${componentNamePascal} }`;
    }
}
//# sourceMappingURL=create.js.map