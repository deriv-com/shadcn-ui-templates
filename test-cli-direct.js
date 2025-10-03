const { exec } = require('child_process');
const path = require('path');

console.log('Testing CLI directly from source...');

// Test the CLI source directly
const cliSourcePath = path.join(__dirname, 'cli/src/index.ts');
console.log('CLI source path:', cliSourcePath);

// Try to run with ts-node or similar
exec(`npx tsx "${cliSourcePath}" -v`, (error, stdout, stderr) => {
  if (error) {
    console.log('Error:', error.message);
    console.log('Stderr:', stderr);
  } else {
    console.log('Success:', stdout);
  }
});
