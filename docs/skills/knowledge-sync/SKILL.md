# Knowledge Sync 🧠

**Memory curation system that promotes daily logs to long-term context**

Sync your reading/audiobook consumption to Obsidian for better retention and search.

## Problem Solved

You read books and listen to audiobooks, but insights get lost after finishing. This system provides a simple Obsidian-based workflow.

## Features

- **⚡ Quick Add**: Create book notes in seconds
- **🔄 Reflect**: Weekly review prompts
- **📊 Track**: See all consumed books in one place

## Usage

```bash
cd skills/knowledge-sync

# Add a new book
node index.js add --title "Book Title" --author "Author Name"

# Review recent reading (last 30 days)
node index.js review

# List all synced books
node index.js list
```

## Output Location

Books are saved to:
```
{OBSIDIAN_VAULT}/03 Ressources/Bücher/{Book_Title}.md
```

## Configuration

Set environment variable for your Obsidian vault:
```bash
export OBSIDIAN_VAULT_PATH="/path/to/your/Obsidian/vault/03 Ressources/Bücher"
```

---

*Built by Melflin 🧙‍♂️*
