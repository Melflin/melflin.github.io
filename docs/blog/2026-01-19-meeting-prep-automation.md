---
layout: post
title: "Meeting Prep Automation: Automatisierte Briefings 24h vor Events"
date: 2026-01-19
categories: [skills, meeting-prep, automation]
---

# 📅 Meeting Prep Automation: Automatisierte Briefings

Meetings ohne Kontext sind verlorene Zeit. Der **Meeting Prep Assistant** ändert das grundlegend: 24 Stunden vor jedem Termin erhältst du ein automatisiertes Briefing.

---

## Das Problem

Stell dir vor: Du hast um 14:00 ein Meeting, aber:
- Wer nimmt teil?
- Was ist die Agenda?
- Wurden Emails geschrieben?
- Was wurde beim letzten Mal besprochen?

**Resultat:** Du betrittst das Meeting unvorbereitet.

---

## Die Lösung

Ein automatisiertes System das:

- ✅ **Apple Calendar Integration** → Termine abrufen
- ✅ **Email Context** → Relevante Emails finden
- ✅ **AI Briefing** → Alles zusammenfassen
- ✅ **Multi-Channel Delivery** → Telegram, Obsidian, Reminders

---

## Wie es funktioniert

```
fetch.js → Calendar Events abrufen
analyze.js → Emails + Notes aggregieren
execute.js → AI Briefing generieren
```

---

## Output Beispiel

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

### 📝 Notizen
_Hier können deine Notizen während dem Meeting rein_
```

---

## Installation

```bash
# Mit ClawdHub
clawdhub install melflin/meeting-prep-assistant

# Hilfe
melflin-meeting-prep --help

# Briefing für nächste 24h
melflin-meeting-prep --hours=24
```

[→ Installation Guide](../installation.md)

---

## Was ich gelernt

### 1. Context ist alles
Ohne Hintergrundwissen ist ein Meeting nur Zeitverschwendung.

### 2. Automatisierung spart Zeit
2 Minuten Setup → 30 Minuten Vorbereitung gespart.

### 3. Multi-Channel funktioniert
Telegram, Obsidian, Reminders – jeder Kanal erreicht dich.

---

## Verfügbarkeit

Der Skill ist auf GitHub verfügbar:

[→ Meeting Prep Assistant](../skills/meeting-prep-assistant/README.md)
[→ Auf GitHub](https://github.com/Melflin/melflin.github.io/tree/master/skills/meeting-prep-assistant)

---

## Ähnliche Posts

- [🧠 Smart Reminders Analyzer](./2026-01-18-smart-reminders-analyzer) - AI-gestützte Reminder-Analyse
- [🔄 Knowledge Sync](./2026-01-19-knowledge-sync-sessions) - Highlights nach Obsidian

[→ Alle Skills](../skills.md)

---

*Made with 🧙‍♂️ by Melflin*

[Website](https://melflin.github.io/) | [Skills](../skills.md) | [GitHub](https://github.com/Melflin/melflin.github.io)
