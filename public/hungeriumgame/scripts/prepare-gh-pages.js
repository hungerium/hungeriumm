const fs = require('fs');
const path = require('path');

console.log('📝 Preparing files for GitHub Pages...');

const outDir = path.join(process.cwd(), 'out');

// Ensure the out directory exists
if (!fs.existsSync(outDir)) {
  console.error('The "out" directory does not exist. Run "npm run build && npm run export" first.');
  process.exit(1);
}

// 1. Create .nojekyll file (prevents GitHub from ignoring files that start with underscore)
const nojekyllPath = path.join(outDir, '.nojekyll');
fs.writeFileSync(nojekyllPath, '');
console.log('✅ Created .nojekyll file');

// 2. Create a CNAME file if you have a custom domain
// Uncomment and modify if you have a custom domain
// const cnamePath = path.join(outDir, 'CNAME');
// fs.writeFileSync(cnamePath, 'your-domain.com');
// console.log('✅ Created CNAME file');

// 3. Create a robots.txt file
const robotsPath = path.join(outDir, 'robots.txt');
fs.writeFileSync(robotsPath, 'User-agent: *\nAllow: /');
console.log('✅ Created robots.txt file');

// 4. Ensure _next directory is properly named (GitHub Pages sometimes has issues with _next)
const nextDir = path.join(outDir, '_next');
if (fs.existsSync(nextDir)) {
  console.log('✓ _next directory exists');
}

// 5. Create a 404.html page that matches your app's style
// This can be more sophisticated, but this is a basic example
const notFoundHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found - CoffyLapse</title>
  <link rel="stylesheet" href="/_next/static/css/app.css">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      background-color: #2d1a0f;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    .container {
      max-width: 500px;
      background-color: #3d2a1f;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 20px;
      color: #e7c8a0;
    }
    p {
      margin-bottom: 30px;
      font-size: 1.1rem;
      line-height: 1.5;
      color: #d9b38c;
    }
    .button {
      background-color: #c17f4e;
      color: white;
      padding: 10px 25px;
      border-radius: 5px;
      font-weight: bold;
      text-decoration: none;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: #a6683b;
    }
    .coffee-emoji {
      font-size: 4rem;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="coffee-emoji">☕</div>
    <h1>Page Not Found</h1>
    <p>Oops! It looks like you've ventured into uncharted coffee territory. This page doesn't exist in the CoffyLapse universe.</p>
    <a href="/" class="button">Back to Coffee Shop</a>
  </div>
</body>
</html>
`;

const notFoundPath = path.join(outDir, '404.html');
fs.writeFileSync(notFoundPath, notFoundHtml);
console.log('✅ Created custom 404.html page');

console.log('✨ GitHub Pages preparation complete!');
console.log('🚀 Your project is ready to be deployed to GitHub Pages.');
