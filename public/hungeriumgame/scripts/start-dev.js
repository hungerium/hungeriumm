const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Preparing the development environment...');

// Check for essential files
const essentialFiles = [
  'components/Header.js',
  'components/ImageWithFallback.js',
  'store/gameStore.js',
  'store/walletStore.js'
];

let missingFiles = false;
essentialFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing essential file: ${file}`);
    missingFiles = true;
  }
});

if (missingFiles) {
  console.error('Some essential files are missing. Please restore them before continuing.');
  process.exit(1);
}

// Ensure public directories exist
const publicDirs = [
  'public/images',
  'public/images/wallets',
  'public/images/characters'
];

publicDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Generate SVG files if needed
try {
  console.log('Checking SVG files...');
  const svgFiles = [
    'public/images/wallets/metamask.svg',
    'public/images/wallets/trustwallet.svg',
    'public/images/wallets/binance.svg',
    'public/images/placeholder.svg'
  ];
  
  const missingSvgs = svgFiles.some(file => !fs.existsSync(path.join(__dirname, '..', file)));
  
  if (missingSvgs) {
    console.log('Some SVG files are missing. Generating them...');
    execSync('node scripts/generate-svgs.js', { stdio: 'inherit' });
  } else {
    console.log('All SVG files exist');
  }
} catch (error) {
  console.error('Error checking SVG files:', error);
}

// Check for needed packages
try {
  console.log('Checking essential packages...');
  execSync('node scripts/check-dependencies.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error checking dependencies:', error);
}

// Start the development server
console.log('Starting the development server...');
execSync('next dev', { stdio: 'inherit' });
