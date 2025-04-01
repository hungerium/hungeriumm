node reset-dependencies.jsconst { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting dependency installation for CoffyLapse...');

// Create directories if they don't exist
const dirs = [
  './public',
  './public/images',
  './components',
  './hooks',
  './data',
  './pages',
  './utils',
  './styles'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Install dependencies
try {
  console.log('Installing npm dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Installing framer-motion...');
  execSync('npm install framer-motion@latest', { stdio: 'inherit' });
  
  console.log('Installing tailwind forms plugin...');
  execSync('npm install @tailwindcss/forms', { stdio: 'inherit' });
  
  console.log('All dependencies installed successfully!');
  console.log('You can now run the application with: npm run dev');
} catch (error) {
  console.error('Error installing dependencies:', error.message);
  console.log('Please try installing them manually:');
  console.log('npm install');
  console.log('npm install framer-motion@latest');
  console.log('npm install @tailwindcss/forms');
}
