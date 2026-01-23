#!/usr/bin/env node
/**
 * Knowledge Sync - Fetch Module
 * 
 * For manual workflow: Creates a new book note from template
 * 
 * Usage:
 *   node fetch.js --title "Book Title" --author "Author Name" [--format audiobook] [--tags "tag1,tag2"]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TEMPLATE_PATH = path.join(__dirname, 'templates', 'book-note.md');
const OBSIDIAN_VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH || 
  '/Users/melf/Library/Mobile Documents/iCloud~md~obsidian/Documents/Melf2025/03 Ressources/Bücher';

// Valid options
const VALID_FORMATS = ['audiobook', 'ebook', 'physical'];
const VALID_SOURCES = ['Audible', 'Kindle', 'Apple Books', 'Physical', 'Library', 'Other'];

async function main() {
  const args = parseArgs();
  
  // Check for help flag
  if (args.help) {
    showHelp();
    process.exit(0);
  }
  
  // Validate required arguments
  const errors = [];
  if (!args.title) errors.push('Missing required argument: --title');
  if (!args.author) errors.push('Missing required argument: --author');
  
  // Validate rating if provided
  if (args.rating) {
    const rating = parseInt(args.rating, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      errors.push('Rating must be a number between 1 and 5');
    } else {
      args.rating = rating;
    }
  }
  
  // Validate format if provided
  if (args.format && !VALID_FORMATS.includes(args.format)) {
    errors.push(`Invalid format '${args.format}'. Must be one of: ${VALID_FORMATS.join(', ')}`);
  }
  
  if (errors.length > 0) {
    console.error('❌ Validation Errors:');
    errors.forEach(err => console.error(`   - ${err}`));
    console.error('');
    console.error('Run "node fetch.js --help" for usage information.');
    process.exit(1);
  }
  
  const isQuiet = args.quiet;
  
  // Ensure vault path exists
  if (!fs.existsSync(OBSIDIAN_VAULT_PATH)) {
    try {
      fs.mkdirSync(OBSIDIAN_VAULT_PATH, { recursive: true });
      if (!isQuiet) console.log(`✅ Created directory: ${OBSIDIAN_VAULT_PATH}`);
    } catch (err) {
      console.error(`❌ Error: Failed to create directory: ${OBSIDIAN_VAULT_PATH}`);
      console.error(`   ${err.message}`);
      process.exit(1);
    }
  }
  
  // Load template
  let template;
  try {
    template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  } catch (err) {
    console.error(`❌ Error: Failed to read template file: ${TEMPLATE_PATH}`);
    console.error(`   ${err.message}`);
    process.exit(1);
  }
  
  // Replace placeholders
  const today = new Date().toISOString().split('T')[0];
  const format = args.format || 'audiobook';
  const source = args.source || deriveSource(format);
  const rating = args.rating ? `${args.rating}/5` : '?/5';
  
  const content = template
    .replace(/\{\{title\}\}/g, args.title)
    .replace(/\{\{author\}\}/g, args.author)
    .replace(/\{\{date\}\}/g, today)
    .replace(/\{\{date_finished\}\}/g, args.dateFinished || today)
    .replace(/\{\{rating\}\}/g, rating)
    .replace(/\{\{tags\}\}/g, args.tags || '')
    .replace(/\{\{format\}\}/g, format)
    .replace(/\{\{source\}\}/g, source);
  
  // Generate filename
  const safeTitle = args.title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_').substring(0, 50);
  const filename = `${safeTitle}.md`;
  const filePath = path.join(OBSIDIAN_VAULT_PATH, filename);
  
  // Check if file already exists
  if (!args.dryRun && fs.existsSync(filePath)) {
    console.error(`❌ Error: File already exists: ${filePath}`);
    console.error('   Use --dry-run to preview or delete the existing file first.');
    process.exit(1);
  }
  
  if (args.dryRun) {
    if (!isQuiet) {
      console.log('🔍 DRY RUN - Preview');
      console.log('─'.repeat(50));
      console.log(`Filename: ${filename}`);
      console.log(`Path: ${filePath}`);
      console.log('─'.repeat(50));
      console.log(content);
    } else {
      // In quiet mode, just output the path
      console.log(filePath);
    }
  } else {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      if (!isQuiet) {
        console.log(`✅ Created: ${filePath}`);
        console.log(`📝 Open in Obsidian to add notes and highlights`);
      } else {
        console.log(filePath);
      }
    } catch (err) {
      console.error(`❌ Error: Failed to write file: ${filePath}`);
      console.error(`   ${err.message}`);
      process.exit(1);
    }
  }
}

function deriveSource(format) {
  switch (format) {
    case 'audiobook': return 'Audible';
    case 'ebook': return 'Kindle';
    case 'physical': return 'Physical';
    default: return 'Other';
  }
}

function showHelp() {
  console.log('📚 Knowledge Sync - Add Book');
  console.log('');
  console.log('Usage: node fetch.js --title <title> --author <author> [options]');
  console.log('');
  console.log('Required Options:');
  console.log('  --title <string>      Book title');
  console.log('  --author <string>     Author name');
  console.log('');
  console.log('Optional:');
  console.log('  --format <format>     audiobook|ebook|physical (default: audiobook)');
  console.log('  --source <source>     Audible|Kindle|Apple Books|Physical|Library|Other');
  console.log('  --rating <1-5>        Rating from 1 to 5 stars');
  console.log('  --tags <tags>         Comma-separated tags');
  console.log('  --dry-run             Preview without creating file');
  console.log('  --quiet               Suppress non-error output (only print file path)');
  console.log('  --help                Show this help');
  console.log('');
  console.log('Examples:');
  console.log('  node fetch.js --title "Atomic Habits" --author "James Clear" --rating 5');
  console.log('  node fetch.js --title "Deep Work" --author "Cal Newport" --format ebook --source Kindle');
  console.log('  node fetch.js --title "The Hobbit" --author "Tolkien" --format physical --tags "fantasy,adventure"');
  console.log('  node fetch.js --title "Some Book" --author "Author" --dry-run');
}

function parseArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      // Convert kebab-case to camelCase (e.g., dry-run -> dryRun)
      const key = arg.slice(2).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  
  return args;
}

main().catch(err => {
  console.error('❌ Unexpected error:', err.message);
  process.exit(1);
});
