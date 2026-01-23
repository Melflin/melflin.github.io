#!/usr/bin/env node
/**
 * Knowledge Sync - Unified CLI
 * 
 * Sync highlights and notes from reading/audiobook consumption to Obsidian.
 * 
 * Usage:
 *   node index.js add --title "Book Title" --author "Author" [--format audiobook] [--tags "tag1,tag2"]
 *   node index.js review      # Review highlights from last week
 *   node index.js list        # List all synced books
 */

const { spawn } = require('child_process');
const path = require('path');

const COMMANDS = {
  add: {
    desc: 'Add a new book/notes to Obsidian',
    module: 'fetch.js',
    args: ['--title', '--author', '--format', '--tags', '--rating', '--source', '--dry-run', '--quiet', '--help'],
    help: `
Usage: node index.js add [options]

Add a new book to Obsidian vault with metadata.

Options:
  --title <string>      Book title (required)
  --author <string>     Author name (required)
  --format <format>     audiobook|ebook|physical (default: audiobook)
  --tags <tags>         Comma-separated tags
  --rating <1-5>        Rating from 1-5 stars
  --source <source>     Audible|Kindle|Apple Books|Physical
  --dry-run             Preview without creating file
  --quiet               Suppress non-error output
  --help                Show this help

Examples:
  node index.js add --title "Atomic Habits" --author "James Clear" --rating 5
  node index.js add --title "Deep Work" --author "Cal Newport" --format ebook --source Kindle
  node index.js add --title "The Hobbit" --author "J.R.R. Tolkien" --format physical --tags "fantasy,adventure"
`
  },
  review: {
    desc: 'Show books read in last 30 days',
    module: 'review.js',
    args: ['--help', '--quiet'],
    help: `
Usage: node index.js review [options]

Show books read in the last 30 days.

Options:
  --quiet    Suppress headers and formatting
  --help     Show this help
`
  },
  list: {
    desc: 'List all synced books',
    module: 'list.js',
    args: ['--help', '--quiet'],
    help: `
Usage: node index.js list [options]

List all books synced to Obsidian.

Options:
  --quiet    Suppress headers and formatting
  --help     Show this help
`
  },
  help: {
    desc: 'Show this help',
    module: null,
    args: []
  }
};

async function main() {
  const command = process.argv[2] || 'help';
  
  // Check for --help flag
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    if (command !== 'help' && COMMANDS[command]) {
      console.log(COMMANDS[command].help || 'No help available for this command.');
      return;
    }
    showHelp();
    return;
  }
  
  if (command === 'help' || !COMMANDS[command]) {
    if (command !== 'help' && !COMMANDS[command]) {
      console.error(`❌ Error: Unknown command '${command}'`);
      console.error('');
    }
    showHelp();
    process.exit(command === 'help' ? 0 : 1);
  }
  
  const cmd = COMMANDS[command];
  const scriptPath = path.join(__dirname, cmd.module);
  
  // Pass through remaining args
  const childArgs = process.argv.slice(3);
  
  // Check for quiet mode
  const isQuiet = childArgs.includes('--quiet');
  
  if (!isQuiet) {
    console.log(`📚 Knowledge Sync: ${command}`);
    console.log('');
  }
  
  if (cmd.module) {
    await runScript(scriptPath, childArgs);
  }
}

function showHelp() {
  console.log('📚 Knowledge Sync CLI');
  console.log('');
  console.log('Usage: node index.js <command> [options]');
  console.log('');
  console.log('Commands:');
  
  for (const [name, cmd] of Object.entries(COMMANDS)) {
    if (name === 'help') continue;
    console.log(`  ${name.padEnd(10)} ${cmd.desc}`);
  }
  
  console.log('');
  console.log('Global Options:');
  console.log('  --help, -h    Show command-specific help');
  console.log('  --quiet       Suppress non-error output');
  console.log('');
  console.log('Examples:');
  console.log('  node index.js add --title "Atomic Habits" --author "James Clear" --rating 5');
  console.log('  node index.js add --help');
  console.log('  node index.js review');
  console.log('  node index.js list');
  console.log('');
  console.log('For more information on a command, run: node index.js <command> --help');
}

function runScript(scriptPath, args) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath, ...args], { stdio: 'inherit' });
    
    child.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Script exited with code ${code}`));
    });
    
    child.on('error', err => {
      reject(new Error(`Failed to run script: ${err.message}`));
    });
  });
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
