const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const htmlFiles = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
  const filePath = path.join(frontendDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove <script src="js/config.js"></script> from wherever it is
  content = content.replace(/<script src="js\/config\.js"><\/script>\n?/g, '');

  // Add it to the <head> tag
  if (content.includes('</head>')) {
    content = content.replace('</head>', '  <script src="js/config.js"></script>\n</head>');
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
}
