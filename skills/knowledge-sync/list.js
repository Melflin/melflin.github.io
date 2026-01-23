#!/usr/bin/env node
/**
 * Knowledge Sync - List Module
 * 
 * List all synced books in Obsidian.
 */

const fs = require('fs');
const path = require('path');

const OBSIDIAN_VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH || 
  '/Users/melf/Library/Mobile Documents/iCloud~md~obsidian/Documents/Melf2025/03 Ressources/Bücher';

function parseArgs() {
  const args = { quiet: false, help: false };
  const argv = process.argv.slice(2);
  
  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--quiet') {
      args.quiet = true;
    }
  }
  
  return args;
}

function showHelp() {
  console.log('📚 Knowledge Sync - List');
  console.log('');
  console.log('Usage: node list.js [options]');
  console.log('');
  console.log('List all books synced to Obsidian, sorted by date added (newest first).');
  console.log('');
  console.log('Options:');
  console.log('  --quiet        Suppress headers and formatting');
  console.log('  --help, -h     Show this help');
  console.log('');
  console.log('Examples:');
  console.log('  node list.js');
  console.log('  node list.js --quiet');
}

function main() {
  const args = parseArgs();
  
  if (args.help) {
    showHelp();
    return;
  }
  
  if (!fs.existsSync(OBSIDIAN_VAULT_PATH)) {
    if (!args.quiet) {
      console.log(`📚 No books directory found: ${OBSIDIAN_VAULT_PATH}`);
    }
    return;
  }
  
  const files = fs.readdirSync(OBSIDIAN_VAULT_PATH).filter(f => f.endsWith('.md'));
  
  if (!args.quiet) {
    console.log(`📚 All synced books (${files.length} total):`);
    console.log('');
  }
  
  if (files.length === 0) {
    if (!args.quiet) {
      console.log('   No books yet. Add your first!');
      console.log('   node index.js add --title "Book Title" --author "Author"');
    }
    return;
  }
  
  // Read all files and extract metadata
  const books = [];
  
  for (const file of files) {
    const filePath = path.join(OBSIDIAN_VAULT_PATH, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const frontmatter = parseFrontmatter(frontmatterMatch[1]);
      books.push({
        title: frontmatter.title || file.replace('.md', ''),
        author: frontmatter.author || 'Unknown',
        rating: frontmatter.rating,
        date: frontmatter.date_added,
        source: frontmatter.source
      });
    } else {
      books.push({
        title: file.replace('.md', ''),
        author: 'Unknown',
        rating: null,
        date: null,
        source: null
      });
    }
  }
  
  // Sort by date (newest first)
  books.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });
  
  // Display
  for (const book of books) {
    if (args.quiet) {
      // Minimal output in quiet mode
      console.log(`${book.title} - ${book.author}`);
    } else {
      const ratingNum = book.rating ? parseInt(book.rating.toString().split('/')[0]) : 0;
      const stars = ratingNum > 0 ? '★'.repeat(Math.min(ratingNum, 5)) : '?';
      const dateStr = book.date ? `(${book.date})` : '';
      console.log(`  📖 ${book.title} - ${book.author} ${stars} ${dateStr}`);
    }
  }
  
  if (!args.quiet) {
    console.log('');
    console.log(`Total: ${books.length} books`);
  }
}

function parseFrontmatter(yaml) {
  const result = {};
  const lines = yaml.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      result[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
  
  return result;
}

main();
