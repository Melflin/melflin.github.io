# PLAN: Weekly Priority Visualizer

*Entwicklungskonzept und Implementierungs-Details*

## Ziel

Zeigt die 3 wichtigsten Prioritäten der Woche basierend auf:
- Apple Calendar Events
- Apple Reminders
- Emails (via MS365 CLI)

## Warum dieser Skill?

- **Fokus schaffen:** Reduziert Noise und zeigt echte Prioritäten
- **Zeitersparnis:** Kein manuelles Durchsuchen von Kalender/Reminders
- **Privacy-first:** Lokale Integration, keine Cloud-Drittanbieter
- **CLI-First:** Schneller Zugriff via Terminal

## User Stories

```
Als Berufstätiger möchte ich morgens schnell sehen, was diese Woche wirklich wichtig ist, damit ich meine Zeit optimal plane.

Als Projektmanager möchte ich basierend auf Deadlines und Meetings meine Top-Prioritäten sehen, damit ich nichts Wichtiges vergesse.

Als vielbeschäftigte Person möchte ich eine priorisierte Liste basierend auf Importance × Urgency × Context, damit ich fokussiert arbeiten kann.
```

## Tech Stack

- **Node.js** für CLI
- **commander** für CLI-Interface
- **AppleScript** für Reminders/Calendar Integration
- **accli** für Apple Calendar (existierend)
- **reminders** Script (existierend)
- **MS365 CLI** für Emails (existierend)

## Architektur

```
┌─────────────────────────────────────────────────┐
│            weekly-priority CLI                   │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐  │
│  │ Calendar    │  │ Reminders   │  │ Emails  │  │
│  │ Integration │  │ Integration │  │ (MS365) │  │
│  └──────┬──────┘  └──────┬──────┘  └────┬────┘  │
│         │                │              │       │
│         └────────────────┼──────────────┘       │
│                          ▼                       │
│              ┌─────────────────────┐            │
│              │ Priority Algorithm  │            │
│              │ Importance × Urgency│            │
│              │ × Context           │            │
│              └──────────┬──────────┘            │
│                         ▼                        │
│              ┌─────────────────────┐            │
│              │   Top 3 Priorities  │            │
│              │   Visualizer        │            │
│              └─────────────────────┘            │
└─────────────────────────────────────────────────┘
```

## Priority Scoring Algorithm

### Formel
```
Score = Importance × Urgency × Context_Match
```

### Importance (1-5)
- **5:** Executive/C-Level Meetings, strategische Entscheidungen
- **4:** Wichtige Deadlines, Kundentermine
- **3:** Team Meetings, regelmäßige Syncs
- **2:** Informelle Meetings, Follow-ups
- **1:** Optionale Events

### Urgency (1-5)
- **5:** Heute/ Morgen fällig
- **4:** Diese Woche fällig
- **3:** Nächste Woche fällig
- **2:** Dieser Monat
- **1:** Keine Deadline

### Context Match (1-3)
- **3:** Passt zu aktueller Tageszeit/Location
- **2:** Passt thematisch zu anderen Tasks
- **1:** Neutral

## Milestones

### Milestone 1: MVP (Iteration 2)
- [x] Projektstruktur
- [ ] README.md
- [ ] index.js mit Basis-CLI
- [ ] Priority Algorithm MVP

### Milestone 2: CLI Features (Iteration 3)
- [ ] --today Flag
- [ ] --week Flag
- [ ] Output-Formatierung

### Milestone 3: Testing & Release (Iteration 4)
- [ ] Manuelle Tests
- [ ] Integrationstests
- [ ] Git Commit & Push
- [ ] Veröffentlichung

### Milestone 4: Abschluss (Iteration 5)
- [ ] Screenshots
- [ ] Dokumentation finalisieren

## API/Integration Points

### Apple Calendar (via accli)
```bash
accli events --from 2026-01-20 --to 2026-01-26 --json
```

### Apple Reminders (via reminders script)
```bash
reminders list --due thisweek --json
```

### Emails (via MS365 CLI)
```bash
python3 ms365_cli.py --action unread --limit 10
```

## Testing

### Test-Checkliste
- [ ] `--help` zeigt alle Commands
- [ ] --today zeigt Prioritäten für heute
- [ ] --week zeigt Prioritäten für diese Woche
- [ ] Priority Scoring funktioniert korrekt
- [ ] Error-Handling bei fehlenden Daten

### Manuelle Tests
```bash
# Hilfe anzeigen
node index.js --help

# Weekly View
node index.js --week

# Today's Priorities
node index.js --today
```

## Risiken und Mitigations

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Calendar API Limitierungen | Mittel | Niedrig | Fallback auf accli |
| Reminders Integration komplex | Niedrig | Mittel | Bestehendes Script nutzen |
| Priority Algorithm zu simpel | Hoch | Mittel | Iterative Verbesserung |

## Weiterführend

- [README.md](./README.md) - Öffentliche Dokumentation
- [PROGRESS.md](./PROGRESS.md) - Fortschritts-Tracking
- [SKILL.md](./SKILL.md) - Clawdbot Integration
