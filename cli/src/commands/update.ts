import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import inquirer from 'inquirer';
import { detectFramework, getFrameworkConfig } from '../utils/framework';
import { updateComponentFiles, updateConfigFiles } from '../utils/files';
import { getAvailableComponents } from '../utils/components';

interface UpdateOptions {
  dir?: string;
}

export async function updateCommand(options: UpdateOptions) {
  console.log(chalk.blue.bold('\n🔄 Updating Deriv Quill Components\n'));

  const targetDir = path.resolve(options.dir || '.');
  const packageJsonPath = path.join(targetDir, 'package.json');
  
  const spinner = ora('Checking for updates...').start();
  
  try {
    // Check if package.json exists
    if (!await fs.pathExists(packageJsonPath)) {
      spinner.fail('No package.json found. Run this command from your project root.');
      return;
    }

    // Check if components directory exists (indicates installation)
    const componentsDir = path.join(targetDir, 'src/components/ui');
    if (!await fs.pathExists(componentsDir)) {
      spinner.fail('Deriv Quill components not found. Run "quill-shadcn install" first to set up the components.');
      return;
    }

    spinner.text = 'Detecting framework...';
    
    // Detect framework
    const framework = await detectFramework(targetDir);
    const config = getFrameworkConfig(framework);
    
    spinner.text = 'Updating configuration files...';
    
    // Update configuration files (tailwind, postcss, components.json, etc.)
    await updateConfigFiles(targetDir, framework, config);
    
    spinner.text = 'Updating component files...';
    
    // Update all component files
    const updatedComponents = await updateComponentFiles(targetDir, config);
    
    spinner.succeed('Deriv Quill components updated successfully!');
    
    console.log(chalk.green('\n✅ Update complete!'));
    console.log(chalk.blue('\nUpdated files:'));
    
    if (updatedComponents.length > 0) {
      console.log(chalk.gray('Components:'));
      updatedComponents.forEach(component => {
        console.log(chalk.gray(`  • ${component}`));
      });
    }
    
    console.log(chalk.gray('Configuration:'));
    console.log(chalk.gray(`  • ${config.configFiles.tailwind}`));
    console.log(chalk.gray(`  • ${config.configFiles.postcss}`));
    console.log(chalk.gray(`  • ${config.configFiles.components}`));
    console.log(chalk.gray(`  • ${config.setupFiles.globals}`));
    console.log(chalk.gray(`  • ${config.setupFiles.utils}`));
    
    console.log(chalk.blue('\nYour components are now up to date!'));
    
  } catch (error) {
    spinner.fail('Update failed');
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}
