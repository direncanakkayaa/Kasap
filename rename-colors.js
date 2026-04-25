const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

const replacements = [
  { from: /charcoal-lighter/g, to: 'taupe-light' },
  { from: /charcoal-light/g, to: 'taupe-surface' },
  { from: /charcoal/g, to: 'deep-espresso' },
  { from: /gold-dark/g, to: 'antique-gold-dark' },
  { from: /gold-light/g, to: 'antique-gold-light' },
  { from: /gold/g, to: 'antique-gold' },
  { from: /cream-dark/g, to: 'ivory-dark' },
  { from: /cream/g, to: 'ivory' }
];

function processDir(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      replacements.forEach(({ from, to }) => {
        content = content.replace(from, to);
      });
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated ${fullPath}`);
    }
  }
}

processDir(dir);
console.log('Renaming done');
