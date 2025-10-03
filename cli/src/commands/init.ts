import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import execa from 'execa';
import { detectFramework, getFrameworkConfig } from '../utils/framework';
import { updateConfigFiles } from '../utils/files';
import { copyAllComponents } from '../utils/components';
import { installDependencies } from '../utils/dependencies';

interface InitOptions {
  framework?: string;
  dir?: string;
  skipDeps?: boolean;
  skipConfig?: boolean;
}

export async function initCommand(options: InitOptions) {
  console.log(chalk.blue.bold('\n🚀 Installing Deriv Quill Components\n'));

  const targetDir = path.resolve(options.dir || '.');
  
  // Check if directory exists and is not empty
  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Directory is not empty. Do you want to continue?',
        default: false
      }
    ]);
    
    if (!proceed) {
      console.log(chalk.yellow('Operation cancelled.'));
      return;
    }
  }

  const spinner = ora('Detecting project framework...').start();
  
  try {
    // Detect framework if not specified
    let framework = options.framework;
    if (!framework) {
      framework = await detectFramework(targetDir);
    }

    spinner.text = `Installing ${framework} project...`;
    
    // Get framework-specific configuration
    const config = getFrameworkConfig(framework);
    
    // Create necessary directories
    await fs.ensureDir(path.join(targetDir, 'src/components/ui'));
    await fs.ensureDir(path.join(targetDir, 'src/lib'));
    await fs.ensureDir(path.join(targetDir, 'src/styles'));

    spinner.text = 'Copying component files...';
    
    // Copy actual component files from source
    const copiedComponents = await copyAllComponents(targetDir);
    
    spinner.text = 'Updating configuration files...';
    
    // Update configuration files
    if (!options.skipConfig) {
      await updateConfigFiles(targetDir, framework, config);
    }
    
    spinner.text = 'Installing dependencies...';
    
    // Install dependencies
    if (!options.skipDeps) {
      await installDependencies(targetDir, config.dependencies);
    }

    spinner.succeed('Deriv Quill components installed successfully!');
    
    console.log(chalk.green('\n✅ Setup complete!'));
    console.log(chalk.blue('\nNext steps:'));
    console.log('1. Import components in your React files');
    console.log('2. Import styles in your main CSS file:');
    console.log(chalk.gray('   @import "./src/styles/globals.css";'));
    console.log('3. Start building with Deriv Quill components!');
    
    console.log(chalk.blue('\nAvailable commands:'));
    console.log('• quill-shadcn update - Update to latest version');
    
  } catch (error) {
    spinner.fail('Installation failed');
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}
