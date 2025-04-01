const fs = require('fs');
const path = require('path');

// Ensure directory exists
const svgDir = path.join(process.cwd(), 'public', 'images', 'characters', 'svg');
if (!fs.existsSync(svgDir)) {
  fs.mkdirSync(svgDir, { recursive: true });
  console.log(`Created directory: ${svgDir}`);
}

// SVG content for each character
const svgFiles = {
  'weatherman.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="40" r="25" fill="#6fa8dc" />
    <circle cx="50" cy="40" r="20" fill="#a4c2f4" />
    <!-- Face -->
    <circle cx="50" cy="40" r="18" fill="#ffcc99" />
    <!-- Hair -->
    <path d="M30,30 Q40,25 50,25 Q60,25 70,30 Q70,15 50,15 Q30,15 30,30" fill="#4a4a4a" />
    <!-- Glasses -->
    <rect x="40" y="37" width="8" height="5" rx="2" fill="#333" />
    <rect x="52" y="37" width="8" height="5" rx="2" fill="#333" />
    <line x1="48" y1="39" x2="52" y2="39" stroke="#333" stroke-width="1" />
    <line x1="40" y1="39" x2="35" y2="37" stroke="#333" stroke-width="1" />
    <line x1="60" y1="39" x2="65" y2="37" stroke="#333" stroke-width="1" />
    <!-- Mouth -->
    <path d="M45,45 Q50,48 55,45" fill="none" stroke="#333" stroke-width="1.5" />
    <!-- Eyes -->
    <circle cx="44" cy="39" r="1.5" fill="#333" />
    <circle cx="56" cy="39" r="1.5" fill="#333" />
    <!-- Weather symbols -->
    <circle cx="35" cy="22" r="5" fill="#ffdd55" />
    <path d="M65,20 L70,15 M65,20 L70,20 M65,20 L70,25" stroke="#6fa8dc" stroke-width="2" />
    <path d="M50,70 Q60,75 65,70 Q70,65 65,60" fill="none" stroke="#6fa8dc" stroke-width="2" />
    <!-- Weather outfit -->
    <path d="M38,58 Q50,63 62,58 L65,85 L35,85 Z" fill="#cfe2f3" />
    <path d="M45,58 L45,75 M55,58 L55,75" stroke="#a4c2f4" stroke-width="1.5" />
    <path d="M35,85 Q40,90 50,90 Q60,90 65,85" fill="#cfe2f3" />
  </svg>`,
  
  'supplier.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="40" r="25" fill="#a0522d" />
    <circle cx="50" cy="40" r="20" fill="#cd853f" />
    <!-- Face -->
    <circle cx="50" cy="40" r="18" fill="#deb887" />
    <!-- Hair -->
    <path d="M35,25 Q40,20 50,20 Q60,20 65,25 Q65,15 50,15 Q35,15 35,25" fill="#5e3200" />
    <!-- Eyes -->
    <ellipse cx="43" cy="38" rx="2" ry="2.5" fill="#5e3200" />
    <ellipse cx="57" cy="38" rx="2" ry="2.5" fill="#5e3200" />
    <!-- Eyebrows -->
    <path d="M40,35 Q43,33 46,35" fill="none" stroke="#5e3200" stroke-width="1.5" />
    <path d="M54,35 Q57,33 60,35" fill="none" stroke="#5e3200" stroke-width="1.5" />
    <!-- Nose -->
    <path d="M50,40 Q52,43 50,46" fill="none" stroke="#5e3200" stroke-width="1" />
    <!-- Mouth/Smile -->
    <path d="M43,48 Q50,52 57,48" fill="none" stroke="#5e3200" stroke-width="1.5" />
    <!-- Beard/stubble -->
    <path d="M40,48 Q40,55 50,57 Q60,55 60,48" fill="none" stroke="#8b4513" stroke-width="0.5" stroke-dasharray="1,1" />
    <!-- Supplier outfit -->
    <rect x="40" y="65" width="20" height="25" fill="#996633" />
    <path d="M35,65 Q40,60 50,60 Q60,60 65,65 L65,85 L35,85 Z" fill="#996633" />
    <!-- Apron -->
    <path d="M40,65 L40,85 M60,65 L60,85" stroke="#734d26" stroke-width="1" />
    <path d="M45,65 L45,70 Q50,72 55,70 L55,65" fill="#734d26" />
    <!-- Coffee bag -->
    <rect x="60" y="70" width="12" height="15" rx="2" fill="#8b4513" />
    <path d="M60,75 L72,75" stroke="#5e3200" stroke-width="1" />
    <text x="63" y="82" font-family="Arial" font-size="4" fill="#fff">COFFEE</text>
    <!-- Coffee beans scattered -->
    <ellipse cx="32" cy="80" rx="2" ry="1" transform="rotate(45,32,80)" fill="#5e3200" />
    <ellipse cx="36" cy="76" rx="2" ry="1" transform="rotate(-30,36,76)" fill="#5e3200" />
    <ellipse cx="30" cy="74" rx="2" ry="1" transform="rotate(60,30,74)" fill="#5e3200" />
  </svg>`,
  
  'technician.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="40" r="25" fill="#4a4a4a" />
    <circle cx="50" cy="40" r="20" fill="#666666" />
    <!-- Face -->
    <circle cx="50" cy="40" r="18" fill="#f1c27d" />
    <!-- Hard hat -->
    <path d="M30,34 Q40,20 60,20 Q70,20 70,34" fill="#ffcc00" />
    <path d="M30,34 L70,34" fill="none" stroke="#e6b800" stroke-width="2" />
    <!-- Face features -->
    <ellipse cx="43" cy="38" rx="2" ry="2.5" fill="#333" />
    <ellipse cx="57" cy="38" rx="2" ry="2.5" fill="#333" />
    <path d="M43,45 Q50,49 57,45" fill="none" stroke="#333" stroke-width="1.5" />
    <!-- Mustache -->
    <path d="M45,44 Q50,46 55,44" fill="#333" />
    <!-- Technician uniform -->
    <path d="M40,58 L45,70 L35,85 L65,85 L55,70 L60,58" fill="#4682b4" />
    <rect x="45" y="70" width="10" height="15" fill="#4682b4" />
    <!-- Pockets & details -->
    <rect x="42" y="65" width="5" height="7" rx="1" fill="#3a6a8c" />
    <rect x="53" y="65" width="5" height="7" rx="1" fill="#3a6a8c" />
    <path d="M45,58 L45,63 M55,58 L55,63" stroke="#3a6a8c" stroke-width="1.5" />
    <!-- Tools -->
    <path d="M67,60 L73,55 L73,58 L70,60 Z" fill="#c0c0c0" />
    <rect x="37" y="75" width="4" height="10" fill="#c0c0c0" />
    <rect x="38.5" y="70" width="1" height="5" fill="#666" />
    <!-- Coffee machine part -->
    <path d="M25,80 Q20,75 25,70 L30,70 L30,80 Z" fill="#c0c0c0" />
    <circle cx="27.5" cy="73" r="1" fill="#333" />
    <circle cx="27.5" cy="77" r="1" fill="#333" />
  </svg>`,
  
  'influencer.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="40" r="25" fill="#ffb6c1" />
    <circle cx="50" cy="40" r="20" fill="#ffc0cb" />
    <!-- Face -->
    <circle cx="50" cy="40" r="18" fill="#ffddca" />
    <!-- Stylish hair -->
    <path d="M30,35 Q35,20 50,18 Q65,20 70,35 Q70,15 50,12 Q30,15 30,35" fill="#9966cc" />
    <!-- Trendy glasses -->
    <path d="M38,38 L46,38 Q47,38 47,39 L47,41 Q47,42 46,42 L38,42 Q37,42 37,41 L37,39 Q37,38 38,38 Z" fill="none" stroke="#ff66cc" stroke-width="1" />
    <path d="M54,38 L62,38 Q63,38 63,39 L63,41 Q63,42 62,42 L54,42 Q53,42 53,41 L53,39 Q53,38 54,38 Z" fill="none" stroke="#ff66cc" stroke-width="1" />
    <path d="M47,40 L53,40" fill="none" stroke="#ff66cc" stroke-width="1" />
    <!-- Eyes (behind glasses) -->
    <circle cx="42" cy="40" r="1.5" fill="#663399" />
    <circle cx="58" cy="40" r="1.5" fill="#663399" />
    <!-- Eyelashes -->
    <path d="M40,38 L38,36 M42,38 L42,36 M44,38 L46,36" stroke="#663399" stroke-width="0.5" />
    <path d="M56,38 L54,36 M58,38 L58,36 M60,38 L62,36" stroke="#663399" stroke-width="0.5" />
    <!-- Lips -->
    <path d="M45,46 Q50,48 55,46" fill="#ff66cc" />
    <!-- Smartphone -->
    <rect x="30" y="70" width="10" height="18" rx="1" fill="#333" />
    <rect x="31" y="72" width="8" height="14" rx="0.5" fill="#6fa8dc" />
    <circle cx="35" cy="88" r="0.8" fill="#f1f1f1" />
    <!-- Fashionable outfit -->
    <path d="M38,58 L62,58 L65,85 L35,85 Z" fill="#cc99ff" />
    <path d="M38,58 L45,65 L55,65 L62,58" fill="#cc66ff" />
    <!-- Accessories -->
    <path d="M30,55 Q40,50 50,55 Q60,50 70,55" fill="none" stroke="#ff9900" stroke-width="1.5" />
    <circle cx="50" cy="55" r="1.5" fill="#ff9900" />
    <!-- Social media icons -->
    <circle cx="65" cy="70" r="3" fill="#3b5998" />
    <circle cx="65" cy="78" r="3" fill="#c13584" />
    <circle cx="65" cy="86" r="3" fill="#1da1f2" />
  </svg>`,
  
  'inspector.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="40" r="25" fill="#4a4a4a" />
    <circle cx="50" cy="40" r="20" fill="#666666" />
    <!-- Face -->
    <circle cx="50" cy="40" r="18" fill="#e6b89c" />
    <!-- Hair -->
    <path d="M30,40 Q35,25 50,25 Q65,25 70,40 L70,40 Q65,20 50,18 Q35,20 30,40" fill="#594639" />
    <path d="M35,42 L40,45 M60,42 L65,45" stroke="#594639" stroke-width="1" />
    <!-- Eyes -->
    <ellipse cx="43" cy="38" rx="2" ry="2.5" fill="#594639" />
    <ellipse cx="57" cy="38" rx="2" ry="2.5" fill="#594639" />
    <path d="M40,35 Q43,33 46,35" fill="none" stroke="#594639" stroke-width="1.5" />
    <path d="M54,35 Q57,33 60,35" fill="none" stroke="#594639" stroke-width="1.5" />
    <!-- Nose -->
    <path d="M50,40 L50,44" fill="none" stroke="#594639" stroke-width="1" />
    <!-- Mouth (stern expression) -->
    <path d="M44,46 L56,46" fill="none" stroke="#594639" stroke-width="1.5" />
    <!-- Clipboard -->
    <rect x="28" y="65" width="15" height="20" rx="1" fill="#f1f1f1" />
    <rect x="30" y="69" width="11" height="1" fill="#999" />
    <rect x="30" y="73" width="11" height="1" fill="#999" />
    <rect x="30" y="77" width="11" height="1" fill="#999" />
    <rect x="30" y="81" width="6" height="1" fill="#999" />
    <rect x="28" y="65" width="15" height="3" rx="1" fill="#a52a2a" />
    <!-- Pencil -->
    <rect x="45" y="70" width="8" height="1" fill="#ffcc00" transform="rotate(45,45,70)" />
    <path d="M52,67 L54,65" stroke="#666" stroke-width="1" transform="rotate(45,52,67)" />
    <!-- Inspection uniform -->
    <path d="M38,58 L62,58 L65,85 L35,85 Z" fill="#003366" />
    <path d="M38,58 Q45,65 50,60 Q55,65 62,58" fill="#004080" />
    <!-- Badge -->
    <circle cx="55" cy="65" r="4" fill="#ffd700" />
    <circle cx="55" cy="65" r="3" fill="#fff" />
    <path d="M54,62 L56,62 L56,68 L55,67 L54,68 Z" fill="#ffd700" />
    <!-- Pen in pocket -->
    <rect x="45" y="62" width="1" height="5" fill="#333" />
    <!-- Identification tag -->
    <rect x="40" y="67" width="7" height="5" fill="#fff" />
    <path d="M41,69 L46,69" stroke="#333" stroke-width="0.5" />
    <path d="M41,71 L44,71" stroke="#333" stroke-width="0.5" />
  </svg>`,
  
  'official.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="40" r="25" fill="#4a4a4a" />
    <circle cx="50" cy="40" r="20" fill="#666666" />
    <!-- Face -->
    <circle cx="50" cy="40" r="18" fill="#ffe0bd" />
    <!-- Professional hairstyle -->
    <path d="M32,35 Q40,25 50,25 Q60,25 68,35" fill="#1a1a1a" />
    <path d="M32,35 Q40,30 50,30 Q60,30 68,35" fill="#1a1a1a" />
    <!-- Eyes -->
    <ellipse cx="43" cy="38" rx="2" ry="2.5" fill="#1a1a1a" />
    <ellipse cx="57" cy="38" rx="2" ry="2.5" fill="#1a1a1a" />
    <!-- Nose -->
    <path d="M50,40 L50,44" fill="none" stroke="#1a1a1a" stroke-width="1" />
    <!-- Mouth (professional smile) -->
    <path d="M45,46 Q50,48 55,46" fill="none" stroke="#1a1a1a" stroke-width="1" />
    <!-- Suit -->
    <path d="M35,58 Q40,55 50,55 Q60,55 65,58 L68,85 L32,85 Z" fill="#1f3864" />
    <path d="M45,55 L45,85 M55,55 L55,85" fill="none" stroke="#19325a" stroke-width="1" />
    <!-- Shirt and tie -->
    <path d="M45,55 L45,85 L55,85 L55,55 Z" fill="#ffffff" />
    <path d="M49,55 L51,55 L52,75 L50,80 L48,75 L49,55 Z" fill="#bf9000" />
    <!-- Official document -->
    <rect x="60" y="70" width="15" height="20" rx="1" fill="#f1f1f1" />
    <rect x="61" y="72" width="13" height="2" fill="#999" />
    <rect x="61" y="76" width="13" height="1" fill="#999" />
    <rect x="61" y="79" width="13" height="1" fill="#999" />
    <rect x="61" y="82" width="13" height="1" fill="#999" />
    <rect x="61" y="85" width="8" height="1" fill="#999" />
    <!-- City emblem -->
    <circle cx="35" cy="70" r="5" fill="#bf9000" />
    <path d="M33,68 L37,68 L35,65 Z" fill="#fff" />
    <path d="M32,71 L38,71 L38,73 L32,73 Z" fill="#fff" />
    <!-- Glasses -->
    <rect x="40" y="37" width="6" height="4" rx="1" fill="none" stroke="#333" stroke-width="0.5" />
    <rect x="54" y="37" width="6" height="4" rx="1" fill="none" stroke="#333" stroke-width="0.5" />
    <path d="M46,39 L54,39" fill="none" stroke="#333" stroke-width="0.5" />
  </svg>`
};

// Create placeholder SVG
svgFiles['placeholder.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <!-- Background circle -->
  <circle cx="50" cy="50" r="48" fill="#eaeaea" />
  
  <!-- Person silhouette -->
  <circle cx="50" cy="35" r="15" fill="#aaa" />
  <path d="M30,85 L70,85 L65,55 C65,45 55,40 50,40 C45,40 35,45 35,55 Z" fill="#aaa" />
  
  <!-- Question mark -->
  <text x="50" y="55" font-family="Arial" font-size="30" text-anchor="middle" fill="#666">?</text>
</svg>`;

// Write files
Object.entries(svgFiles).forEach(([filename, content]) => {
  const filePath = path.join(svgDir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created: ${filePath}`);
});

// Create placeholder in main directory
const placeholderPath = path.join(process.cwd(), 'public', 'images', 'placeholder.svg');
fs.writeFileSync(placeholderPath, svgFiles['placeholder.svg'], 'utf8');
console.log(`Created: ${placeholderPath}`);

console.log('All SVG files created successfully!');
