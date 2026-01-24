# 📊 Stress Pattern Analyzer

Live-Tracking deiner Stress-Level basierend auf Kalender, Arbeitszeiten und Benachrichtigungen.

## Features

- **Stress-Score (0-100)**: Vier-Faktoren-Modell für präzise Analyse
- **Wochenübersicht**: Historische Daten und Trends
- **CLI-Interface**: Einfache Bedienung über Terminal
- **Kalender-Integration**: Automatische Termindichte-Berechnung
- **ASCII-Visualisierung**: Schnelle Übersicht ohne externe Abhängigkeiten

## Installation

```bash
cd /Users/melf/melflin/skills/stress-analyzer
npm install
```

## Verwendung

### Stress-Level analysieren
```bash
node index.js analyze
node index.js a
```

Mit Optionen:
```bash
node index.js analyze --days 14 --work-hours 10 --notifications 50
```

### Wochenübersicht
```bash
node index.js week
node index.js w
```

### Konfiguration
```bash
node index.js config --set-work-hours 8
node index.js config --set-notifications 30
```

## Stress-Score Algorithmus

Der Score basiert auf 4 Faktoren (max. 100 Punkte):

| Faktor | Max. Punkte | Beschreibung |
|--------|-------------|--------------|
| Termindichte | 40 | Events pro Tag über 7 Tage |
| Arbeitszeit | 30 | Überschreitung von 8h/Tag |
| Benachrichtigungen | 20 | Volume an Push-Nachrichten |
| Kontinuität | 10 | Durchgehende Belastung |

### Score-Levels

| Score | Level | Emoji |
|-------|-------|-------|
| 0-25 | Entspannt | 🟢 |
| 26-50 | Moderat | 🟡 |
| 51-75 | Belastet | 🟠 |
| 76-100 | Kritisch | 🔴 |

## Visualisierung

### ASCII Bar Chart
```
Stress-Level: ████████░░ 68/100 🟠 Belastet

Letzte 7 Tage:
Mo ██████░░░░░░ 45
Di ████████░░░░ 52
Mi ████░░░░░░░░ 38
Do █████████░░░ 61
Fr █████████░░░ 55
Sa ██████░░░░░░ 42
So ██████░░░░░░ 38
```

### ASCII Trend Chart
```
100 │                                    
 75 │        ●         ●     ●           
 50 │   ●    │    ●    │     │           
 25 │   │    │    │    │     │     ●     
  0 │   └────┴────┴────┴────┴────┴─────  
      Mo  Di  Mi  Do  Fr  Sa  So
```

## Dateien

```
stress-analyzer/
├── index.js          # Hauptanwendung
├── SKILL.md          # Clawdbot Integration
├── PROGRESS.md       # Entwicklungsfortschritt
├── PLAN.md           # Projektplan
└── README.md         # Diese Datei
```

## Integration in Clawdbot

Siehe `SKILL.md` für Details zur Nutzung in Clawdbot.

## Entwicklungsfortschritt

| Iteration | Status | Datum |
|-----------|--------|-------|
| 1 | ✅ Abgeschlossen | 23.01.2026 |
| 2 | ✅ Abgeschlossen | 23.01.2026 |
| 3 | ✅ Abgeschlossen | 23.01.2026 |
| 4 | ✅ Abgeschlossen | 23.01.2026 |
| 5 | ✅ Abgeschlossen | 23.01.2026 |

## Todo

- [x] Projekt-Struktur
- [x] Stress-Score Algorithmus
- [x] ASCII-Visualisierung
- [x] README-Dokumentation
- [x] Testing
- [ ] SVG-Chart-Export
- [ ] Historische Daten persistenz
- [ ] Benachrichtigungen bei kritischem Stress

## Screenshots

### analyze command
![Analyze Output](docs/screenshot-analyze.png)

### week command  
![Week Output](docs/screenshot-week.png)

---

*Entwickelt für das Melflin-Ökosystem | v1.0.0*
