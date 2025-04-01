const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting project reset and diagnostics...');

// Check if package.json exists
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('package.json not found! Cannot proceed with reset.');
  process.exit(1);
}

// Read package.json
let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
} catch (error) {
  console.error('Failed to parse package.json:', error);
  process.exit(1);
}

// Ensure essential dependencies
const essentialDeps = {
  'next': '^13.4.19',
  'react': '^18.2.0',
  'react-dom': '^18.2.0',
  'ethers': '^5.7.2',
  'framer-motion': '^12.6.2',
  'zustand': '^4.4.7'
};

// Update package.json dependencies if needed
let depsChanged = false;
packageJson.dependencies = packageJson.dependencies || {};

for (const [dep, version] of Object.entries(essentialDeps)) {
  if (!packageJson.dependencies[dep] || packageJson.dependencies[dep] !== version) {
    packageJson.dependencies[dep] = version;
    depsChanged = true;
  }
}

// Update browser field for polyfills
if (!packageJson.browser) {
  packageJson.browser = {
    "fs": false,
    "net": false,
    "tls": false
  };
  depsChanged = true;
}

// Ensure scripts are defined
packageJson.scripts = packageJson.scripts || {};
packageJson.scripts = {
  ...packageJson.scripts,
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "reset": "node scripts/reset-project.js",
  "generate-svgs": "node scripts/generate-svgs.js"
};

// Save package.json if changed
if (depsChanged) {
  console.log('Updating package.json with required dependencies...');
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

// Ensure the node_modules folder exists
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('node_modules not found, running npm install...');
  execSync('npm install', { stdio: 'inherit' });
} else {
  console.log('Removing node_modules and package-lock.json for clean install...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  
  try {
    fs.rmSync(nodeModulesPath, { recursive: true, force: true });
    
    const packageLockPath = path.join(process.cwd(), 'package-lock.json');
    if (fs.existsSync(packageLockPath)) {
      fs.unlinkSync(packageLockPath);
    }
    
    console.log('Running clean npm install...');
    execSync('npm install', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error during clean install:', error);
    console.log('Attempting to continue with npm ci...');
    execSync('npm ci', { stdio: 'inherit' });
  }
}

// Create SVG images
console.log('Generating SVG images...');
try {
  const generateSvgsPath = path.join(process.cwd(), 'scripts', 'generate-svgs.js');
  if (fs.existsSync(generateSvgsPath)) {
    execSync('node scripts/generate-svgs.js', { stdio: 'inherit' });
  } else {
    console.warn('generate-svgs.js not found! SVGs will not be created.');
  }
} catch (error) {
  console.error('Error generating SVGs:', error);
}

// Diagnostics
console.log('\nRunning diagnostics...');

// Check if Header.js exists and has content
const headerPath = path.join(process.cwd(), 'components', 'Header.js');
if (fs.existsSync(headerPath)) {
  const headerContent = fs.readFileSync(headerPath, 'utf8');
  console.log(`✅ Header.js exists (${headerContent.length} bytes)`);
  
  // Check for basic functionality
  if (headerContent.includes('onClaimReward') && 
      headerContent.includes('tokenBalance')) {
    console.log('✅ Header.js appears to have claim functionality');
  } else {
    console.log('❌ Header.js may be missing claim functionality');
  }
} else {
  console.log('❌ Header.js does not exist!');
}

// Check if zustand is working
try {
  require.resolve('zustand');
  console.log('✅ zustand is properly installed');
} catch (error) {
  console.log('❌ zustand is not properly installed');
}

// Check if ethers is working
try {
  require.resolve('ethers');
  console.log('✅ ethers is properly installed');
} catch (error) {
  console.log('❌ ethers is not properly installed');
}

// Check if framer-motion is working
try {
  require.resolve('framer-motion');
  console.log('✅ framer-motion is properly installed');
} catch (error) {
  console.log('❌ framer-motion is not properly installed');
}

console.log('\nReset and diagnostics complete. Try running the app with: npm run dev');
