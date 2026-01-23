#!/usr/bin/env node
/**
 * Knowledge Sync - Review Module
 * 
 * Show books read in the last 30 days for weekly review.
 */

const fs = require('fs');
const path = require('path');

const OBSIDIAN_VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH || 
  '/Users/melf/Library/Mobile Documents/iCloud~md~obsidian/Documents/Melf2025/03 Ressources/Bücher';

function parseArgs() {
  const args = { days: 30, quiet: false, help: false };
  const argv = process.argv.slice(2);
  
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--quiet') {
      args.quiet = true;
    } else if (arg === '--days') {
      args.days = parseInt(argv[i + 1], 10) || 30;
      i++;
    } else if (!arg.startsWith('--')) {
      // Support positional argument for days
      args.days = parseInt(arg, 10) || 30;
    }
  }
  
  return args;
}

function showHelp() {
  console.log('📚 Knowledge Sync - Review');
  console.log('');
  console.log('Usage: node review.js [days] [options]');
  console.log('');
  console.log('Show books read in the last N days (default: 30).');
  console.log('');
  console.log('Options:');
  console.log('  --days <number>    Number of days to look back (default: 30)');
  console.log('  --quiet            Suppress headers and formatting');
  console.log('  --help, -h         Show this help');
  console.log('');
  console.log('Examples:');
  console.log('  node review.js              # Last 30 days');
  console.log('  node review.js 7            # Last 7 days');
  console.log('  node review.js --days 14    # Last 14 days');
  console.log('  node review.js --quiet      # Minimal output');
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
      console.log('   Run "node index.js add" to add your first book!');
    }
    return;
  }
  
  const files = fs.readdirSync(OBSIDIAN_VAULT_PATH).filter(f => f.endsWith('.md'));
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - args.days);
  
  if (!args.quiet) {
    console.log(`📚 Books read in the last ${args.days} days:`);
    console.log('');
  }
  
  let recentBooks = [];
  
  for (const file of files) {
    const filePath = path.join(OBSIDIAN_VAULT_PATH, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) continue;
    
    const frontmatter = parseFrontmatter(frontmatterMatch[1]);
    const addedDate = new Date(frontmatter.date_added);
    
    if (addedDate >= cutoffDate) {
      recentBooks.push({
        file,
        title: frontmatter.title,
        author: frontmatter.author,
        date: frontmatter.date_added,
        rating: frontmatter.rating,
        source: frontmatter.source
      });
    }
  }
  
  if (recentBooks.length === 0) {
    if (!args.quiet) {
      console.log('   No books added recently.');
      console.log('   Add a book: node index.js add --title "Book Title" --author "Author"');
    }
  } else {
    for (const book of recentBooks) {
      if (args.quiet) {
        // Minimal output in quiet mode
        console.log(`${book.title} - ${book.author} (${book.date})`);
      } else {
        const stars = book.rating ? '★'.repeat(parseInt(book.rating.toString().split('/')[0])) : '☆';
        console.log(`  📖 ${book.title} - ${book.author}`);
        console.log(`     ${book.date} | ${book.source || 'N/A'} | ${stars}`);
        console.log('');
      }
    }
  }
  
  if (!args.quiet) {
    console.log('💡 Tip: Add highlights and notes in Obsidian!');
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
