/**
 * Rebrand Script Pass 3: Replace purple utility classes with blue equivalents
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXTENSIONS = ['.ts', '.tsx', '.scss', '.css'];
const SKIP_DIRS = ['node_modules', '.git', 'dist', '.cache', 'build'];

// Replace all purple-* utility classes with blue-* equivalents
const REPLACEMENTS = [
  // Purple to blue utility classes
  { find: /purple-50/g, replace: 'blue-50' },
  { find: /purple-100/g, replace: 'blue-100' },
  { find: /purple-200/g, replace: 'blue-200' },
  { find: /purple-300/g, replace: 'blue-300' },
  { find: /purple-400/g, replace: 'blue-400' },
  { find: /purple-500/g, replace: 'blue-500' },
  { find: /purple-600/g, replace: 'blue-600' },
  { find: /purple-700/g, replace: 'blue-700' },
  { find: /purple-800/g, replace: 'blue-800' },
  { find: /purple-900/g, replace: 'blue-900' },
  
  // Purple hex codes
  { find: /#8a5fff/gi, replace: '#3B82F6' },
  { find: /#8A5FFF/gi, replace: '#3B82F6' },
  { find: /#9E7FFF/gi, replace: '#3B82F6' },
  { find: /#7645E8/gi, replace: '#0070F3' },
  { find: /#6234BB/gi, replace: '#005BC4' },
];

function walkDir(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (EXTENSIONS.includes(ext)) callback(fullPath);
    }
  }
}

let filesChanged = 0;

walkDir(path.join(ROOT, 'app'), (filePath) => {
  if (filePath.includes('rebrand')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  for (const { find, replace } of REPLACEMENTS) {
    content = content.replace(find, replace);
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesChanged++;
    console.log(`  Updated: ${path.relative(ROOT, filePath)}`);
  }
});

console.log(`\nPass 3 done! ${filesChanged} files updated.`);
