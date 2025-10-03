import { spawn } from 'child_process';
import { promisify } from 'util';
import ora from 'ora';

export async function installDependencies(targetDir: string, dependencies: string[]) {
  const spinner = ora('Installing dependencies...').start();
  
  try {
    // Install production dependencies
    await runCommand('npm', ['install', ...dependencies], targetDir);
    
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
    await runCommand('npm', ['install', '--save-dev', ...devDependencies], targetDir);
    
    spinner.succeed('Dev dependencies installed successfully');
  } catch (error) {
    spinner.fail('Failed to install dev dependencies');
    console.error('Error:', error);
    throw error;
  }
}

function runCommand(command: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      cwd,
      stdio: 'pipe',
      shell: true
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}
