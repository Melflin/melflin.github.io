# 🎯 Verbesserungs-Plan: knowledge-sync

**Status:** ✅ Fertig + Getestet | **Priorität:** Mittel | **Aufwand:** 2 Stunden

## 📦 Current State

✅ Funktioniert:
- `index.js add` - Bücher hinzufügen (mit Rating, Source, Format)
- `index.js list` - Alle Bücher anzeigen (--quiet support)
- `index.js review` - Bücher der letzten 30 Tage (--quiet support)
- `weekly-review.sh` - Cron-Job (Sonntag 10:00)
- Obsidian Template funktioniert (inkl. source field)

## ✅ Completed Features

### Phase 1: CLI-UX Verbesserungen
- ✅ `index.js --help` zeigt alle Commands
- ✅ `index.js <command> --help` für jeden Command
- ✅ Bessere Error-Messages (Validation errors, missing files)
- ✅ `--quiet` mode für alle Commands
- ✅ `--dry-run` support für add

### Phase 2: Feature Additions
- ✅ `--rating` Support (1-5 Sterne, mit Validierung)
- ✅ `--source` Support (Audible, Kindle, Apple Books, Physical, Library, Other)
- ✅ `--format` erweitert (audiobook, ebook, physical)
- ✅ `--tags` Support
- ✅ Auto-derive source from format
- ✅ Bessere Filename-Sanitization

### Phase 3: Optional (später)
- [ ] Audible API Integration
- [ ] Export-Funktion (JSON/CSV)

## 🎯 Ziele

### Phase 1: CLI-UX Verbesserungen (1h)
1. `--help` für alle Commands
2. Bessere Error-Messages
3. `--quiet` mode für Scripts
4. `--json` output für Integration

### Phase 2: Feature Additions (1-2h)
1. `--rating` beim Add (1-5 Sterne)
2. `--format` erweitern (ebook, physical, audiobook)
3. `--source` (Audible, Kindle, etc.)
4. `--update` für existierende Bücher

### Phase 3: Optional (später)
1. Audible API Integration
2. Export-Funktion (JSON/CSV)

## 📝 Tasks

### CLI-UX Verbesserungen
```bash
# 1. Help implementieren
node index.js --help
node index.js add --help
node index.js list --help
node index.js review --help

# 2. Neue Flags
node index.js add --title "..." --author "..." --rating 4 --format audiobook --source audible
node index.js add --title "..." --update --rating 5

# 3. Quiet mode
node index.js add --title "..." --author "..." --quiet
```

## 🔧 Code-Änderungen

### index.js Erweiterung
```javascript
const { spawn } = require('child_process');
const path = require('path');

const COMMANDS = {
  add: {
    desc: 'Add a new book/notes to Obsidian',
    module: 'fetch.js',
    args: ['--title', '--author', '--format', '--tags', '--rating', '--source', '--dry-run', '--quiet', '--help']
  },
  // ... existing
};
```

### fetch.js Erweiterung
- `--rating` Support
- `--source` Support
- Besseres Error-Handling
- `--quiet` mode

## ✅ Definition of Done

- [x] `index.js --help` zeigt alle Commands
- [x] Jeder Command hat `--help`
- [x] `--rating` funktioniert beim Add (mit Validierung 1-5)
- [x] `--source` funktioniert beim Add
- [x] `--quiet` unterdrückt nicht-kritische Output
- [x] Tests mit mehreren Büchern verschiedener Formate
- [x] Bessere Error-Messages bei fehlenden Argumenten
- [x] --dry-run Preview funktioniert

## 📁 Files to Modify

- `/Users/melf/melflin/skills/knowledge-sync/index.js`
- `/Users/melf/melflin/skills/knowledge-sync/fetch.js`
- `/Users/melf/melflin/skills/knowledge-sync/templates/book-note.md`

---

*Erstellt: 2026-01-23 | Target: Worker execution*
