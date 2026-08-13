const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = walk('c:/wamp64/www/smd-frontend/src').filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('smdmedicare.com')) {
        content = content.replace(/smdmedicare\.com/g, 'smdmedicare.in');
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated: ${file}`);
        changedFiles++;
    }
});

console.log(`\nSuccess! Replaced smdmedicare.com with smdmedicare.in in ${changedFiles} files.`);
