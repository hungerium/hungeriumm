const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const directories = [
  './public/images',
  './public/images/wallets',
  './public/images/characters'
];

directories.forEach(dir => {
  if (!fs.existsSync(path.join(process.cwd(), dir))) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(path.join(process.cwd(), dir), { recursive: true });
  }
});

// SVG content for wallets
const metamaskSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <!-- MetaMask Logo -->
  <path d="M85 15 L50 35 L60 10 Z" fill="#E2761B" />
  <path d="M15 15 L50 35 L40 10 Z" fill="#E4761B" />
  <path d="M75 65 L65 80 L85 85 L90 65 Z" fill="#E4761B" />
  <path d="M10 65 L15 85 L35 80 L25 65 Z" fill="#E4761B" />
  <path d="M35 50 L25 65 L45 65 L45 50 Z" fill="#E4761B" />
  <path d="M65 50 L65 65 L75 65 L55 50 Z" fill="#E4761B" />
  <path d="M35 80 L45 65 L25 65 Z" fill="#D7C1B3" />
  <path d="M65 80 L75 65 L55 65 Z" fill="#D7C1B3" />
  <path d="M40 35 L35 50 L45 50 L45 35 Z" fill="#233447" />
  <path d="M60 35 L60 50 L65 50 L65 35 Z" fill="#233447" />
  <path d="M25 65 L35 80 L35 65 Z" fill="#CD6116" />
  <path d="M65 65 L65 80 L75 65 Z" fill="#CD6116" />
  <path d="M15 15 L35 50 L40 35 L50 35 L60 35 L65 50 L85 15 L50 10 Z" fill="#F6851B" />
  <path d="M40 35 L35 50 L45 50 Z" fill="#E4751F" />
  <path d="M60 35 L55 50 L65 50 Z" fill="#E4751F" />
  <path d="M65 50 L55 65 L65 65 L75 65 Z" fill="#F6851B" />
  <path d="M35 50 L35 65 L45 65 L45 50 Z" fill="#F6851B" />
  <path d="M35 65 L35 80 L45 65 Z" fill="#E4751F" />
  <path d="M65 65 L55 80 L65 80 Z" fill="#E4751F" />
</svg>`;

const trustwalletSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <!-- TrustWallet Logo -->
  <rect x="10" y="10" width="80" height="80" rx="20" fill="#0077fe" />
  <path d="M50 20 C30 30 25 40 25 60 C25 65 30 70 50 80 C70 70 75 65 75 60 C75 40 70 30 50 20 Z" fill="white" />
  <circle cx="50" cy="50" r="12" fill="#0077fe" />
</svg>`;

const binanceSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <!-- Binance Wallet Logo -->
  <rect x="10" y="10" width="80" height="80" rx="15" fill="#F3BA2F" />
  <path d="M50 30 L35 45 L30 40 L50 20 L70 40 L65 45 Z" fill="white" />
  <path d="M30 50 L35 45 L30 40 L25 45 Z" fill="white" />
  <path d="M70 50 L65 45 L70 40 L75 45 Z" fill="white" />
  <path d="M50 70 L35 55 L30 60 L50 80 L70 60 L65 55 Z" fill="white" />
  <path d="M50 50 L40 40 L50 30 L60 40 Z" fill="white" />
</svg>`;

// SVG content for placeholder
const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" fill="#F0F0F0" />
  <path d="M20 20 L80 80 M80 20 L20 80" stroke="#AAAAAA" stroke-width="4" />
  <text x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="#888888">Image</text>
</svg>`;

// Write SVG files
fs.writeFileSync(path.join(process.cwd(), 'public/images/wallets/metamask.svg'), metamaskSvg);
fs.writeFileSync(path.join(process.cwd(), 'public/images/wallets/trustwallet.svg'), trustwalletSvg);
fs.writeFileSync(path.join(process.cwd(), 'public/images/wallets/binance.svg'), binanceSvg);
fs.writeFileSync(path.join(process.cwd(), 'public/images/placeholder.svg'), placeholderSvg);

console.log('SVG files generated successfully!');
