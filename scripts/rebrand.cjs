/**
 * Rebrand Script: Replace visible "Bolt" text mentions with "Codyou"
 * This targets user-facing strings only, NOT CSS variable names or class names.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

// File extensions to process
const EXTENSIONS = ['.ts', '.tsx', '.md', '.json', '.html', '.scss', '.css', '.yaml', '.yml', '.toml', '.mjs', '.cjs'];

// Directories to skip
const SKIP_DIRS = ['node_modules', '.git', 'pnpm-lock.yaml', 'dist', '.cache', 'build'];

// Replacements: Only user-facing text, NOT CSS variable names
const REPLACEMENTS = [
  // Page titles / meta
  { find: "title: 'Bolt'", replace: "title: 'Codyou'" },
  { find: "content: 'Talk with Bolt, an AI assistant from StackBlitz'", replace: "content: 'Codyou — The Future of AI Software Development'" },
  
  // Comments mentioning Bolt
  { find: /\/\*\*?\s*\*?\s*Landing page component for Bolt/g, replace: '/**\n * Landing page component for Codyou' },
  
  // String literals with "Bolt" (case-sensitive, user-facing)
  { find: /(['"`])Bolt\.new\1/g, replace: '$1Codyou$1' },
  { find: /Bolt\.new/g, replace: 'Codyou' },
  
  // DB name
  { find: "'boltHistory'", replace: "'codyouHistory'" },
  { find: '"boltHistory"', replace: '"codyouHistory"' },

  // Theme storage key  
  { find: "'bolt_theme'", replace: "'codyou_theme'" },
  { find: '"bolt_theme"', replace: '"codyou_theme"' },
  
  // Bug report / user facing strings
  { find: /Bolt DIY/g, replace: 'Codyou' },
  { find: /bolt\.diy/g, replace: 'codyou' },
  { find: /bolt\.new/g, replace: 'codyou' },
  
  // Console logs, error messages, user-facing strings
  { find: /['"]Bolt['"]/g, replace: (match) => match[0] + 'Codyou' + match[match.length-1] },
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
      if (EXTENSIONS.includes(ext)) {
        callback(fullPath);
      }
    }
  }
}

let filesChanged = 0;
let totalReplacements = 0;

walkDir(ROOT, (filePath) => {
  // Skip this script itself
  if (filePath.includes('rebrand.cjs')) return;
  // Skip lock files
  if (filePath.includes('pnpm-lock')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  for (const { find, replace } of REPLACEMENTS) {
    if (typeof find === 'string') {
      content = content.split(find).join(replace);
    } else {
      content = content.replace(find, replace);
    }
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesChanged++;
    console.log(`  Updated: ${path.relative(ROOT, filePath)}`);
  }
});

console.log(`\nDone! ${filesChanged} files updated.`);
