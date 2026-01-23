# PLAN: Stress Pattern Analyzer

*Entwicklungskonzept und Implementierungs-Details*

## Ziel

Analysiert Kalender, Arbeitszeiten, Benachrichtigungen und zeigt Stress-Level über Zeit als ASCII-Chart in der CLI. Hilft dem Benutzer, Stress-Muster zu erkennen und rechtzeitig gegenzusteuern.

## Warum dieser Skill?

- **Proaktive Gesundheit:** Stress frühzeitig erkennen bevor es kritisch wird
- **Datengetrieben:** Objektive Auswertung statt subjektivem Gefühl
- **CLI-First:** Schneller Zugriff ohne GUI-Overhead
- **Privat:** Alle Daten bleiben lokal auf dem Mac

## User Stories

```
Als Berufstätiger möchte ich meine Arbeitszeiten tracken, damit ich Überstunden frühzeitig erkenne
Als Kalender-Nutzer möchte ich meine Termindichte sehen, damit ich Überlastung vermeiden kann
Als Apple-Nutzer möchte ich Benachrichtigungen analysieren, damit ich Ablenkungsquellen identifizieren
Als Gesundheitsbewusster möchte ich einen Stress-Score sehen, damit ich meine Work-Life-Balance verbessern kann
```

## Tech Stack

- **Node.js** für CLI
- **accli** für Apple Calendar Integration (bereits vorhanden)
- **Terminal-Notifications** für Benachrichtigungs-Tracking
- **ASCII-Chart-Library** für Visualisierung

## Architektur

```
┌─────────────────────────────────────────────────────────┐
│                    Stress Analyzer                       │
├─────────────────────────────────────────────────────────┤
│  Data Collection Layer                                   │
│  ├── Calendar Events (accli)                            │
│  ├── Work Hours (manual + automated tracking)           │
│  └── Notification Count (terminal-notifications)        │
├─────────────────────────────────────────────────────────┤
│  Analysis Layer                                          │
│  └── Stress Score Algorithm                             │
│      ├── Event Density Calculation                      │
│      ├── Work-Life Balance Score                        │
│      └── Notification Pattern Analysis                  │
├─────────────────────────────────────────────────────────┤
│  Visualization Layer                                     │
│  └── ASCII Charts                                       │
│      ├── Daily Stress Trend                             │
│      └── Weekly Pattern Overview                        │
└─────────────────────────────────────────────────────────┘
```

## Stress-Score Algorithmus

Der Stress-Score (0-100) wird aus mehreren Faktoren berechnet:

### Faktoren:
1. **Termindichte (0-40 Punkte)**
   - < 3 Events/Tag: 0
   - 3-5 Events/Tag: 15
   - 6-8 Events/Tag: 25
   - > 8 Events/Tag: 40

2. **Arbeitszeit-Exzess (0-30 Punkte)**
   - 7-8h/Tag: 0
   - 8-10h/Tag: 15
   - 10-12h/Tag: 25
   - > 12h/Tag: 30

3. **Benachrichtigungs-Flut (0-20 Punkte)**
   - < 20/Tag: 0
   - 20-50/Tag: 8
   - 50-100/Tag: 15
   - > 100/Tag: 20

4. **Kontinuierliche Belastung (0-10 Punkte)**
   - Keine Pausen (>2h ohne Unterbrechung): 10
   - Gelegentliche Pausen: 5
   - Regelmäßige Pausen: 0

### Gesamt-Score:
```
Stress-Level:
  0-25:   🟢 Entspannt
  26-50:  🟡 Moderat
  51-75:  🟠 Belastet
  76-100: 🔴 Kritisch
```

## Milestones

### Milestone 1: MVP
- [x] Projekt-Struktur erstellen
- [x] Calendar Integration (accli)
- [x] Basic Stress Algorithm
- [x] ASCII-Chart Output
- [ ] Work Hours Tracking

### Milestone 2: Erweiterungen
- [ ] Notification Tracking
- [ ] Weekly/Daily Trend Analysis
- [ ] Configuration File
- [ ] Historical Data Export

## Testing

- [ ] Unit Tests für Stress-Score-Berechnung
- [ ] Integrationstest mit accli
- [ ] Manuelle Tests mit echten Kalender-Daten
- [ ] ASCII-Chart Rendering Tests

## Risiken und Mitigations

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| accli nicht verfügbar | Niedrig | Hoch | Fallback: Calendar-Import via calcurse |
| Notification-API limitiert | Mittel | Mittel | Manuelle Eingabe-Option anbieten |
| Stress-Score zu subjektiv | Mittel | Niedrig | Anpassbare Gewichtung |

## Dependencies

- `accli` (bereits installiert)
- `chalk` für farbige CLI-Ausgabe
- Optional: `terminal-notifications` für Mac

---

*Letzte Aktualisierung: 2026-01-23*
