/**
 * This script helps reset the installation when there are issues with 
 * Next.js SWC dependencies or lockfile conflicts.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting dependency cleanup and reinstallation for CoffyLapse...');

try {
  // Remove problematic files/folders
  const toRemove = [
    'node_modules',
    '.next',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml'
  ];
  
  toRemove.forEach(item => {
    if (fs.existsSync(item)) {
      console.log(`Removing ${item}...`);
      if (fs.lstatSync(item).isDirectory()) {
        fs.rmSync(item, { recursive: true, force: true });
      } else {
        fs.unlinkSync(item);
      }
    }
  });
  
  // Install dependencies fresh
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\nClean installation complete! You can now run the app with:');
  console.log('npm run dev');
} catch (error) {
  console.error('Error during cleanup:', error.message);
  console.log('\nManual steps:');
  console.log('1. Delete node_modules folder');
  console.log('2. Delete .next folder');
  console.log('3. Delete package-lock.json file');
  console.log('4. Run: npm install');
  console.log('5. Run: npm run dev');
}
