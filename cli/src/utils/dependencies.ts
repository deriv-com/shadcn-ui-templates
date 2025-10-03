import { execa } from 'execa';
import ora from 'ora';

export async function installDependencies(targetDir: string, dependencies: string[]) {
  const spinner = ora('Installing dependencies...').start();
  
  try {
    // Install production dependencies
    await execa('npm', ['install', ...dependencies], {
      cwd: targetDir,
      stdio: 'pipe'
    });
    
    spinner.succeed('Dependencies installed successfully');
  } catch (error) {
    spinner.fail('Failed to install dependencies');
    console.error('Error:', error);
    throw error;
  }
}

export async function installDevDependencies(targetDir: string, devDependencies: string[]) {
  const spinner = ora('Installing dev dependencies...').start();
  
  try {
    // Install dev dependencies
    await execa('npm', ['install', '--save-dev', ...devDependencies], {
      cwd: targetDir,
      stdio: 'pipe'
    });
    
    spinner.succeed('Dev dependencies installed successfully');
  } catch (error) {
    spinner.fail('Failed to install dev dependencies');
    console.error('Error:', error);
    throw error;
  }
}
