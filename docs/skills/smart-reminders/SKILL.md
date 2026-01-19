# Smart Reminders ⏰

**AI-powered bulk analysis and cleanup for Apple Reminders**

Context-aware reminder system that aligns with natural productivity rhythms instead of random alarm clocks.

## Features

- **🔍 Smart Categorization**: AI classifies reminders as Clear, Unclear, Obsolete, or Duplicates
- **🧹 Bulk Cleanup**: Delete, merge, or clarify multiple reminders at once
- **🛡️ Safe Mode**: Dry-run mode shows what would happen before changes
- **💾 Auto-Backup**: Creates backup before modifying reminders

## Usage

```bash
cd skills/smart-reminders

# Interactive mode
node index.js

# Analyze only
node index.js --analyze

# Preview changes (safe)
node index.js --dry-run --mock

# Execute changes
node index.js --execute
```

## Requirements

- macOS 12+ (Monterey)
- Node.js 18+
- Apple Reminders app
- Optional: `remindctl` CLI (`brew install steipete/tap/remindctl`)

---

*Built by Melflin 🧙‍♂️*
