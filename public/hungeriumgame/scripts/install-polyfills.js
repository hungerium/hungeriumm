const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing browser polyfills for Web3 compatibility...');

// Define required polyfills
const polyfills = [
  'crypto-browserify',
  'stream-browserify',
  'stream-http',
  'https-browserify',
  'os-browserify',
  'path-browserify'
];

// Check which ones need to be installed
const missingPolyfills = [];

try {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    polyfills.forEach(polyfill => {
      if (!deps[polyfill]) {
        missingPolyfills.push(polyfill);
      }
    });
  }
  
  // Install missing polyfills
  if (missingPolyfills.length > 0) {
    console.log(`Installing missing polyfills: ${missingPolyfills.join(', ')}`);
    execSync(`npm install --save ${missingPolyfills.join(' ')}`, { stdio: 'inherit' });
    console.log('Polyfills installed successfully');
  } else {
    console.log('All polyfills are already installed');
  }
  
  // Update Next.js configuration if needed
  const nextConfigPath = path.join(__dirname, '..', 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Only update if all polyfills are installed
    if (missingPolyfills.length === 0) {
      let updated = false;
      
      // Look for fallback configuration
      if (nextConfig.includes('crypto: false') && !nextConfig.includes('crypto-browserify')) {
        nextConfig = nextConfig.replace(
          'crypto: false',
          "crypto: require.resolve('crypto-browserify')"
        );
        updated = true;
      }
      
      if (nextConfig.includes('stream: false') && !nextConfig.includes('stream-browserify')) {
        nextConfig = nextConfig.replace(
          'stream: false',
          "stream: require.resolve('stream-browserify')"
        );
        updated = true;
      }
      
      // Add more replacements for other polyfills as needed
      
      if (updated) {
        fs.writeFileSync(nextConfigPath, nextConfig);
        console.log('Updated next.config.js with polyfill configurations');
      }
    }
  }
  
  console.log('Browser polyfill setup complete');
} catch (error) {
  console.error('Error installing polyfills:', error);
}
