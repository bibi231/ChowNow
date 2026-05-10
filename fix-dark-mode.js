const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/app', function(filePath) {
  if (filePath.endsWith('.tsx') && filePath !== 'page.tsx') { // skip page.tsx which we will rewrite completely
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace text-dark with text-body (except where specifically meant for badges inside light zones)
    content = content.replace(/text-dark/g, 'text-body');
    // Replace bg-white with bg-body
    content = content.replace(/bg-white/g, 'bg-body');
    // Replace bg-light with bg-body-tertiary
    content = content.replace(/bg-light/g, 'bg-body-tertiary');
    
    // Exception: the cart payment borders needed a specific light border which might be bg-light.
    content = content.replace(/border-light bg-body-tertiary/g, 'border-secondary-subtle bg-body-tertiary');
    
    // Replace text-muted in areas where it stays too dark in dark mode? Actually Bootstrap 5 text-muted adapts fine.
    
    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
