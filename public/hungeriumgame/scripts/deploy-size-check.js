const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Try to use chalk for colored output, fallback to console if not available
const log = {
  info: (msg) => console.log(chalk?.blue(msg) || `INFO: ${msg}`),
  success: (msg) => console.log(chalk?.green(msg) || `SUCCESS: ${msg}`),
  warning: (msg) => console.log(chalk?.yellow(msg) || `WARNING: ${msg}`),
  error: (msg) => console.log(chalk?.red(msg) || `ERROR: ${msg}`)
};

console.log('📊 Analyzing build output size...');

// Get total size of a directory recursively
const getTotalSize = (dirPath) => {
  let totalSize = 0;
  
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(dirPath, file.name);
      
      if (file.isDirectory()) {
        totalSize += getTotalSize(filePath);
      } else {
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      }
    }
  } catch (err) {
    log.error(`Error reading directory ${dirPath}: ${err.message}`);
  }
  
  return totalSize;
};

// Get size of largest files
const getLargestFiles = (dirPath, topCount = 10, fileList = [], basePath = '') => {
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(dirPath, file.name);
      const relativePath = path.join(basePath, file.name);
      
      if (file.isDirectory()) {
        getLargestFiles(filePath, topCount, fileList, relativePath);
      } else {
        const stats = fs.statSync(filePath);
        fileList.push({
          path: relativePath,
          size: stats.size
        });
      }
    }
  } catch (err) {
    log.error(`Error analyzing files in ${dirPath}: ${err.message}`);
  }
  
  return fileList.sort((a, b) => b.size - a.size).slice(0, topCount);
};

// Format bytes to human-readable format
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Main function
const analyzeDeployment = () => {
  const outDir = path.join(process.cwd(), 'out');
  
  // Ensure the out directory exists
  if (!fs.existsSync(outDir)) {
    log.error(`The "out" directory does not exist. Run "npm run build && npm run export" first.`);
    process.exit(1);
  }
  
  // Calculate total size
  const totalSizeBytes = getTotalSize(outDir);
  const totalSizeMB = totalSizeBytes / (1024 * 1024);
  
  log.info(`\n========= DEPLOYMENT ANALYSIS =========`);
  log.info(`📦 Total output size: ${formatBytes(totalSizeBytes)}`);
  
  // GitHub Pages size guidance
  const githubSizeLimit = 1024 * 1024 * 1024; // 1GB
  const recommendedLimit = 100 * 1024 * 1024; // 100MB
  
  if (totalSizeBytes > githubSizeLimit) {
    log.error(`⛔ Size exceeds GitHub Pages hard limit of 1GB!`);
    log.error(`   You must reduce the size before deployment.`);
  } else if (totalSizeBytes > recommendedLimit) {
    log.warning(`⚠️ Size exceeds GitHub's recommended limit of 100MB!`);
    log.warning(`   Large repositories may have slower performance.`);
  } else {
    log.success(`✅ Size is under GitHub's recommended 100MB limit!`);
  }
  
  // Get and display the largest files
  log.info(`\n📊 Largest files:`);
  const largestFiles = getLargestFiles(outDir);
  
  largestFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file.path} (${formatBytes(file.size)})`);
  });
  
  log.info(`\n🚀 Ready for GitHub Pages deployment!`);
  
  // Provide deployment instructions
  log.info(`\nTo deploy to GitHub Pages manually:`);
  console.log(`1. Create a gh-pages branch with the contents of the out folder`);
  console.log(`2. Push the gh-pages branch to your repository`);
  console.log(`3. Configure your repository to serve from the gh-pages branch`);
  
  // Return summary for programmatic use
  return {
    totalSize: totalSizeBytes,
    totalSizeFormatted: formatBytes(totalSizeBytes),
    largestFiles,
    isWithinRecommendedLimit: totalSizeBytes <= recommendedLimit,
    isWithinHardLimit: totalSizeBytes <= githubSizeLimit
  };
};

// Run the analysis
const result = analyzeDeployment();

// Exit with error code if size exceeds hard limit
if (!result.isWithinHardLimit) {
  process.exit(1);
}
