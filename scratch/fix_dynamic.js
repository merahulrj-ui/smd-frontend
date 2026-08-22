const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes("export const dynamic = 'force-dynamic';")) {
        content = content.replace("export const dynamic = 'force-dynamic';", "export const revalidate = 3600;");
        fs.writeFileSync(fullPath, content);
        console.log('Fixed:', fullPath);
      }
    }
  }
}

replaceInDir(path.join(__dirname, '..', 'src', 'app', '(shop)'));
console.log('Done!');
