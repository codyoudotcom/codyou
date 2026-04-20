/**
 * Rebrand Script Pass 2: Catch remaining user-facing "Bolt" mentions
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXTENSIONS = ['.ts', '.tsx', '.md', '.json', '.html', '.scss', '.css', '.yaml', '.yml', '.toml', '.mjs', '.cjs'];
const SKIP_DIRS = ['node_modules', '.git', 'dist', '.cache', 'build'];

const REPLACEMENTS = [
  // User-facing strings
  { find: /Ask Bolt/g, replace: 'Ask Codyou' },
  { find: /How can Bolt help you today\?/g, replace: 'How can Codyou help you today?' },
  { find: /Bolt Terminal/g, replace: 'Codyou Terminal' },
  { find: /Bolt Restored/g, replace: 'Codyou Restored' },
  
  // Prompts - AI identity
  { find: /You are Bolt, an expert AI assistant/g, replace: 'You are Codyou, an expert AI assistant' },
  { find: /created by StackBlitz/g, replace: 'created by Codyou' },
  
  // Prompts - "Bolt" as subject
  { find: /Bolt creates a SINGLE/g, replace: 'Codyou creates a SINGLE' },
  { find: /Bolt may create a SINGLE/g, replace: 'Codyou may create a SINGLE' },
  { find: /Bolt ALWAYS uses/g, replace: 'Codyou ALWAYS uses' },
  { find: /Bolt NEVER downloads/g, replace: 'Codyou NEVER downloads' },
  { find: /handled by Bolt/g, replace: 'handled by Codyou' },
  { find: /using Supabase with Bolt/g, replace: 'using Supabase with Codyou' },
  { find: /Bolt Expo apps/g, replace: 'Codyou Expo apps' },
  { find: /with Bolt/g, replace: 'with Codyou' },
  { find: /Bolt support resources/g, replace: 'Codyou support resources' },
  { find: /Would you like Bolt to/g, replace: 'Would you like Codyou to' },
  { find: /Bolt desktop app/g, replace: 'Codyou desktop app' },
  
  // Git commit messages
  { find: /from Bolt\.diy/g, replace: 'from Codyou' },
  { find: /from Bolt/g, replace: 'from Codyou' },
  
  // User-Agent headers
  { find: /'User-Agent': 'Bolt\.diy'/g, replace: "'User-Agent': 'Codyou'" },
  
  // Comments
  { find: /Bolt design tokens/g, replace: 'Codyou design tokens' },
  { find: /Standard Bolt format/g, replace: 'Standard Codyou format' },
  { find: /Project created from Bolt\.diy/g, replace: 'Project created from Codyou' },
  
  // Remaining standalone "Bolt" in visible strings (be careful)
  { find: /Initial commit from Bolt\.diy/g, replace: 'Initial commit from Codyou' },
  { find: /Update from Bolt\.diy/g, replace: 'Update from Codyou' },
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

walkDir(ROOT, (filePath) => {
  if (filePath.includes('rebrand')) return;
  if (filePath.includes('pnpm-lock')) return;
  
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

console.log(`\nPass 2 done! ${filesChanged} files updated.`);
