const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure SVG files are generated
require('../utils/createSvgFiles');

console.log('✨ Preparing for GitHub deployment...');

// Create .nojekyll file to prevent GitHub Pages from using Jekyll
const nojekyllPath = path.join(process.cwd(), 'out', '.nojekyll');
fs.writeFileSync(nojekyllPath, '');
console.log('✅ Created .nojekyll file');

// Copy README.md to out directory
const readmePath = path.join(process.cwd(), 'README.md');
const readmeOutPath = path.join(process.cwd(), 'out', 'README.md');
if (fs.existsSync(readmePath)) {
  fs.copyFileSync(readmePath, readmeOutPath);
  console.log('✅ Copied README.md to out directory');
}

// Optional: Measure total size
const getTotalSize = (dirPath) => {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dirPath, file.name);
    
    if (file.isDirectory()) {
      totalSize += getTotalSize(filePath);
    } else {
      totalSize += fs.statSync(filePath).size;
    }
  }
  
  return totalSize;
};

// Add export script to package.json if it doesn't exist
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = require(packageJsonPath);

if (!packageJson.scripts.export) {
  packageJson.scripts.export = 'next export';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Added export script to package.json');
}

// Run build and export
console.log('🔨 Building and exporting project...');
exec('npm run build && npm run export', (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`❌ stderr: ${stderr}`);
    return;
  }
  
  console.log(stdout);
  
  // Check the output directory size
  const outDir = path.join(process.cwd(), 'out');
  const totalSizeBytes = getTotalSize(outDir);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);
  
  console.log(`✅ Export complete! Total size: ${totalSizeMB} MB`);
  
  if (totalSizeBytes > 100 * 1024 * 1024) {
    console.warn(`⚠️ Warning: Output size (${totalSizeMB} MB) exceeds GitHub's recommended 100 MB limit`);
    console.log('Consider optimizing images or removing unnecessary files');
  } else {
    console.log('✅ Size is under GitHub\'s recommended 100 MB limit');
  }
  
  console.log('\n🚀 Ready for GitHub Pages deployment!');
  console.log('Run the following commands to deploy:');
  console.log('git add .');
  console.log('git commit -m "Deploy to GitHub Pages"');
  console.log('git push');
});
