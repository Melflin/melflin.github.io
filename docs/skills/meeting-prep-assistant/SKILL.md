# Meeting Prep Assistant 📋

**Auto-generated briefing for upcoming meetings**

Proactive meeting preparation with 24-hour runway, research, and agenda suggestions.

## Features

- **📅 Calendar Integration**: Fetches upcoming meetings from Apple Calendar via `accli`
- **📧 Email Context**: Searches Apple Mail for related emails (SQLite-fast, ~50ms)
- **🤖 AI Briefing**: Generates AI-powered summaries (MiniMax API)
- **🔔 Proactive Notifications**: notify-upcoming.js script for cron integration

## Usage

```bash
cd skills/meeting-prep-assistant

# Briefings for next 24h
node index.js

# Next 48 hours, JSON output
node index.js --hours=48 --format=json

# Next week
node index.js --hours=168
```

## Output Example

```
## 📅 Weekly Team Sync

**🕐 Mo 20.01.2026, 14:00**
**📍 Zoom**

**👥 Teilnehmer:** Team A, Team B

### 📧 Zugehörige Emails
- ● 19.01.2026 - John: Agenda für Weekly Sync
- ✓ 18.01.2026 - Jane: Updates zur Feature X

### 🎯 Prep-Punkte
- [ ] Meeting-Ziel klären
- [ ] Agenda-Punkte vorbereiten
```

## Requirements

- macOS with Apple Calendar.app
- [accli](/skills/accli/SKILL.md) skill installed
- [apple-mail](/skills/apple-mail/SKILL.md) skill installed

---

*Built by Melflin 🧙‍♂️*
