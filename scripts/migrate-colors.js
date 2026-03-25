import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..', 'src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const colorMap = [
    // Red/Dark theme mappings
    { regex: /rgba\(\s*8\s*,\s*0\s*,\s*0\s*,\s*0\.88\s*\)/g, variable: 'var(--bg-nav)' },
    { regex: /rgba\(\s*8\s*,\s*0\s*,\s*0\s*,\s*0\.90\s*\)/g, variable: 'var(--bg-nav)' },
    { regex: /rgba\(\s*8\s*,\s*0\s*,\s*0\s*,\s*0\.92\s*\)/g, variable: 'var(--bg-nav)' },
    { regex: /rgba\(\s*22\s*,\s*5\s*,\s*5\s*,\s*0\.80\s*\)/g, variable: 'var(--bg-card)' },
    { regex: /rgba\(\s*25\s*,\s*5\s*,\s*5\s*,\s*0\.85\s*\)/g, variable: 'var(--bg-card-hover)' },
    { regex: /rgba\(\s*25\s*,\s*5\s*,\s*5\s*,\s*0\.6\s*\)/g, variable: 'var(--bg-card)' }, // Approximation for cards
    { regex: /rgba\(\s*204\s*,\s*34\s*,\s*0\s*,\s*0\.35\s*\)/g, variable: 'var(--border-hover)' },
    { regex: /rgba\(\s*204\s*,\s*34\s*,\s*0\s*,\s*0\.8\s*\)/g, variable: 'var(--accent-primary)' },
    { regex: /rgba\(\s*204\s*,\s*34\s*,\s*0\s*,\s*0\.7\s*\)/g, variable: 'var(--accent-primary)' },
    { regex: /#cc2200/gi, variable: 'var(--accent-primary)' },
    { regex: /#f1e8e8/gi, variable: 'var(--text-primary)' },
    { regex: /rgba\(\s*168\s*,\s*144\s*,\s*144\s*,\s*0\.7\s*\)/g, variable: 'var(--text-muted)' },
    { regex: /rgba\(\s*168\s*,\s*144\s*,\s*144\s*,\s*0\.8\s*\)/g, variable: 'var(--text-muted)' },
    { regex: /rgba\(\s*168\s*,\s*144\s*,\s*144\s*,\s*0\.6\s*\)/g, variable: 'var(--text-muted)' },
    { regex: /rgba\(\s*180\s*,\s*30\s*,\s*20\s*,\s*0\.25\s*\)/g, variable: 'var(--border-color)' },
    { regex: /rgba\(\s*180\s*,\s*30\s*,\s*20\s*,\s*0\.20\s*\)/g, variable: 'var(--border-color)' },
    { regex: /rgba\(\s*180\s*,\s*30\s*,\s*20\s*,\s*0\.18\s*\)/g, variable: 'var(--border-color)' },
    { regex: /rgba\(\s*180\s*,\s*30\s*,\s*20\s*,\s*0\.15\s*\)/g, variable: 'var(--border-color)' },
];

walkDir(srcDir, function (filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;
        colorMap.forEach(({ regex, variable }) => {
            content = content.replace(regex, variable);
        });
        // Replace text color inline styles that conflict with theme
        content = content.replace(/color:\s*'(.*?)'/g, (match, color) => {
            if (color.includes('#cc2200') || color.includes('#CC2200')) {
                return `color: var(--accent-primary)`;
            }
            return match;
        });

        if (content !== original) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated ${filePath}`);
        }
    }
});
