# Weekly Priority Visualizer

**Zeigt dir die 3 wichtigsten Prioritäten der Woche – basierend auf Kalender, Reminders und Emails.**

## Features

- 🎯 **Smart Prioritization** - Importance × Urgency × Context Scoring
- 📅 **Calendar Integration** - Apple Calendar via `accli`
- ✅ **Reminders Integration** - Apple Reminders
- 📧 **Email Integration** - MS365 CLI für wichtige Emails
- ⚡ **CLI-First** - Schneller Zugriff via Terminal
- 🔒 **Privacy-First** - Lokale Integration, keine Cloud-Drittanbieter

## Installation

```bash
# Clone oder link in deinen Skills-Ordner
cd ~/melflin/skills/weekly-priority

# Global installieren (optional)
npm link
```

## Usage

### Weekly View (Standard)
```bash
node index.js --week
```

### Today's Priorities
```bash
node index.js --today
```

### Help
```bash
node index.js --help
```

## Output Example

```
╔══════════════════════════════════════════════════════════════╗
║           🗓️  Weekly Priority Visualizer                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  📌 Top 3 Priorities (KW 4 • 2026)                           ║
║  ─────────────────────────────────────────────────────────── ║
║                                                              ║
║  1. 🎯 Projekt X Deadline                                    ║
║     📅 Heute • 📧 Email • Score: 75                          ║
║     └── Wichtiges Meilimum bis Ende der Woche                ║
║                                                              ║
║  2. 📅 Team Meeting                                          ║
║     📅 Morgen • 📅 Calendar • Score: 60                      ║
║     └── Wöchentliche Sync mit dem Team                       ║
║                                                              ║
║  3. 📧 Response needed                                       ║
║     📅 Diese Woche • 📧 Email • Score: 45                    ║
║     └── Kundenanfrage bearbeiten                             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Priority Algorithm

```
Score = Importance × Urgency × Context_Match
```

### Importance (1-5)
| Score | Description |
|-------|-------------|
| 5 | Executive/C-Level Meetings, strategische Entscheidungen |
| 4 | Wichtige Deadlines, Kundentermine |
| 3 | Team Meetings, regelmäßige Syncs |
| 2 | Informelle Meetings, Follow-ups |
| 1 | Optionale Events |

### Urgency (1-5)
| Score | Description |
|-------|-------------|
| 5 | Heute/Morgen fällig |
| 4 | Diese Woche fällig |
| 3 | Nächste Woche fällig |
| 2 | Dieser Monat |
| 1 | Keine Deadline |

### Context Match (1-3)
| Score | Description |
|-------|-------------|
| 3 | Passt zu aktueller Tageszeit/Location |
| 2 | Passt thematisch zu anderen Tasks |
| 1 | Neutral |

## Integration

### Apple Calendar
```bash
accli events --from 2026-01-20 --to 2026-01-26 --json
```

### Apple Reminders
```bash
reminders list --due thisweek --json
```

### MS365 Emails
```bash
python3 ~/GitRepo/clawdbot/skills/ms365/ms365_cli.py --action unread --limit 10
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Link for CLI access
npm link
```

## Files

```
weekly-priority/
├── README.md          # Diese Datei
├── PROGRESS.md        # Entwicklungs-Fortschritt
├── index.js           # Haupt-CLI
├── package.json       # NPM Konfiguration
└── SKILL.md           # Clawdbot Integration
```

## License

MIT - Feel free to use and modify!

---

**Made with 🧙‍♂️ by Melflin**
