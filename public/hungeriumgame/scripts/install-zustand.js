const { execSync } = require('child_process');

console.log('Installing zustand dependency...');

try {
  // Force install zustand
  execSync('npm install zustand@latest --save', { stdio: 'inherit' });
  console.log('Zustand installed successfully!');

  // Check if persist middleware is working
  try {
    require.resolve('zustand/middleware');
    console.log('Zustand middleware is properly installed');
  } catch (e) {
    console.log('Installing specific version of zustand that includes middleware...');
    execSync('npm install zustand@4.4.7 --save', { stdio: 'inherit' });
  }

  console.log('All dependencies installed successfully');
} catch (error) {
  console.error('Error installing zustand:', error.message);
  process.exit(1);
}
