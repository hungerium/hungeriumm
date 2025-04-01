const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Checking dependencies...');

// Define critical dependencies
const criticalDeps = {
  'ethers': '^5.7.2', // Ensure we have ethers.js version 5
  'framer-motion': '^12.6.2',
  'zustand': '^4.4.7'
};

// Define recommended browser polyfills (not critical)
const browserPolyfills = [
  'crypto-browserify',
  'stream-browserify',
  'stream-http',
  'https-browserify',
  'os-browserify',
  'path-browserify'
];

let needsInstall = false;
const packageJsonPath = path.join(__dirname, '..', 'package.json');

try {
  // Check if package.json exists
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = packageJson.dependencies || {};
    
    // Check if we're missing any critical dependencies
    for (const [dep, version] of Object.entries(criticalDeps)) {
      if (!deps[dep]) {
        console.log(`Missing critical dependency: ${dep}`);
        needsInstall = true;
      }
    }
    
    // Check polyfills - these are not critical, just informational
    const missingPolyfills = browserPolyfills.filter(polyfill => !deps[polyfill]);
    if (missingPolyfills.length > 0) {
      console.log(`Missing browser polyfills: ${missingPolyfills.join(', ')}`);
      console.log('You can install them with: npm run fix-polyfills');
      
      // Ensure we update next.config.js for compatibility without polyfills
      const nextConfigPath = path.join(__dirname, '..', 'next.config.js');
      if (fs.existsSync(nextConfigPath)) {
        let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
        
        // Make sure we're using the simple fallback configuration
        const simpleConfig = nextConfig.includes('crypto: false');
        if (!simpleConfig) {
          console.log('Updating next.config.js to use simple fallbacks...');
          // This is a simple approach - in a real scenario, we'd want to parse and modify properly
          nextConfig = nextConfig.replace(/crypto: require\.resolve\('crypto-browserify'\)/g, 'crypto: false');
          nextConfig = nextConfig.replace(/stream: require\.resolve\('stream-browserify'\)/g, 'stream: false');
          // Similarly replace other polyfills
          fs.writeFileSync(nextConfigPath, nextConfig);
        }
      }
    }
  } else {
    console.log('package.json not found, cannot check dependencies');
  }

  // Check if modules are actually installed
  try {
    require.resolve('ethers');
    console.log('ethers.js is properly installed');
  } catch (e) {
    console.log('ethers.js is not properly installed');
    needsInstall = true;
  }
  
  try {
    require.resolve('zustand');
    console.log('zustand is properly installed');
  } catch (e) {
    console.log('zustand is not properly installed');
    needsInstall = true;
  }
  
  // Install critical dependencies if needed
  if (needsInstall) {
    console.log('Installing missing critical dependencies...');
    execSync('npm install ethers@^5.7.2 zustand@^4.4.7 --save', { stdio: 'inherit' });
    console.log('Dependencies installed successfully');
  } else {
    console.log('All critical dependencies are present');
  }
} catch (error) {
  console.error('Error checking dependencies:', error.message);
}
