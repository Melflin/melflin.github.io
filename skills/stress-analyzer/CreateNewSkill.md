# CreateNewSkill.md

*Vorlage für die Erstellung neuer Melflin OSS Skills*

---

## 📋 Übersicht

Dieses Dokument beschreibt den kompletten Workflow zur Erstellung eines neuen Skills von der Idee bis zur Veröffentlichung.

---

## Phase 1: Vorbereitung

### 1.1 Idee validieren

**Fragen vor dem Start:**
- Löst der Skill ein echtes, wiederkehrendes Problem?
- Gibt es bereits eine Lösung? Wie ist diese besser?
- Passt der Skill zu Melflins Ökosystem (macOS, CLI, Privacy-first)?
- Ist der Skill in 1-2 Wochen realisierbar?

**Naming-Konvention:**
- Klein geschrieben
- Bindestrich für mehrteilige Namen
- Beispiel: `smart-reminders`, `knowledge-sync`, `podcast-notes`

### 1.2 Repository-Struktur erstellen

```bash
# Im melflin-oss Repo
cd /Users/melf/GitMelflin/melflin-oss

# Neues Verzeichnis
mkdir -p skills/[skill-name]
cd skills/[skill-name]

# Verzeichnisstruktur erstellen
touch README.md
touch PLAN.md
touch PROGRESS.md
touch index.js
touch SKILL.md
```

### 1.3 Skill-Verzeichnis im Haupt-Repo

```bash
# Auch im Haupt-Repo (für clawdhub)
cd /Users/melf/melflin/skills/[skill-name]
touch index.js
touch SKILL.md
```

---

## Phase 2: Dokumentation erstellen

### 2.1 README.md (Öffentlich)

**Pflicht-Abschnitte:**
```markdown
# [Skill Name]

*Kurze, prägnante Beschreibung (1-2 Sätze)*

## Was macht dieser Skill?

[3-4 Sätze über die Funktionalität]

## Features

- ✅ [Feature 1]
- ✅ [Feature 2]
- ✅ [Feature 3]

## Installation

```bash
clawdhub install melflin/[skill-name]
```

## Usage

```bash
melflin-[skill-name] --help
```

## Beispiele

```bash
# Befehl 1
melflin-[skill-name] --option

# Befehl 2  
melflin-[skill-name] --another-option
```

## Anforderungen

- macOS
- [Tool 1]
- [Tool 2]

## Weiterführend

- [PLAN.md](./PLAN.md) - Entwicklungskonzept
- [PROGRESS.md](./PROGRESS.md) - Fortschritts-Tracking
```

### 2.2 PLAN.md (Entwicklungskonzept)

```markdown
# PLAN: [Skill Name]

*Entwicklungskonzept und Implementierungs-Details*

## Ziel

[Kurze Beschreibung was der Skill erreicht]

## Warum dieser Skill?

- [Grund 1]
- [Grund 2]
- [Grund 3]

## User Stories

```
Als [Benutzer] möchte ich [Aktion] damit [Nutzen]
```

## Tech Stack

- Node.js für CLI
- [Externe Library 1]
- [Externe Library 2]

## Architektur

```
[ Einfaches Flow-Diagramm ]
```

## Milestones

### Milestone 1: MVP
- [x] Feature A
- [ ] Feature B
- [ ] Feature C

### Milestone 2: Erweiterungen
- [ ] Feature D
- [ ] Feature E

## Testing

- [ ] Unit Tests für einzelne Funktionen
- [ ] Integrationstests für CLI
- [ ] Manuelle Tests mit echten Daten

## Risiken und Mitigations

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| [Risiko 1] | Mittel | Hoch | [Gegenmassnahme] |
```

### 2.3 PROGRESS.md (Fortschritts-Tracking)

```markdown
# PROGRESS: [Skill Name]

*Live-Tracking der Entwicklung*

## Status: 🚀 In Entwicklung

**Gestartet:** DD.MM.YYYY
**Ziel:** DD.MM.YYYY

---

## Aktueller Stand

### Done ✅
- [ ] Feature A
- [ ] Feature B

### In Progress 🔨
- [ ] Feature C

### Todo 📋
- [ ] Feature D
- [ ] Feature E

---

## Iteration [N] - DD.MM.YYYY

### Erledigt
- [Kurze Liste was diese Iteration erreicht]

### Gelernt
- [Wichtige Erkenntnisse]

### Nächste Schritte
- [Geplante Arbeiten für nächste Iteration]

---

## Changelog

### v0.1.0 - DD.MM.YYYY
- 🎉 Initial release
- ✅ Feature A
- ✅ Feature B
```

### 2.4 SKILL.md (Clawdbot Integration)

```yaml
---
name: [skill-name]
description: "[Kurze Beschreibung für Clawdbot Skill-Registry]"
metadata:
  version: 1.0.0
  tags: ["tag1", "tag2", "tag3"]
  clawdbot:
    mode:
      name: "[Name des Mode]"
      role: "[Rolle/Beschreibung]"
      emoji: "🎯"
      personality: |
        [Kurze Beschreibung der Persona wenn dieser Skill aktiviert wird]
    requires:
      bins: ["node", "jq"]
      npm: ["package1", "package2"]
    install:
      - id: "skill-install"
        kind: "skill"
        source: "clawdhub"
        slug: "melflin/[skill-name]"
        label: "Install [Skill Name]"
---

# [Skill Name] Skill

[Ausführliche Beschreibung]

## Usage

[CLI-Hilfe und Beispiele]

## Configuration

[Umgebungsvariablen, Config-Files]

## Integration

[Wie der Skill mit Clawdbot zusammenarbeitet]
```

---

## Phase 3: Code entwickeln

### 3.1 index.js Template

```javascript
#!/usr/bin/env node

/**
 * [Skill Name]
 * [Kurze Beschreibung]
 */

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

// Version aus package.json oder manuell
const VERSION = '1.0.0';

const program = new Command();

program
  .name('melflin-[skill-name]')
  .description('[Beschreibung]')
  .version(VERSION);

// --help Flag
program
  .command('list')
  .description('Liste [etwas auf]')
  .action(async () => {
    try {
      // Implementation
      console.log('✅ Fertig');
    } catch (error) {
      console.error('❌ Fehler:', error.message);
      process.exit(1);
    }
  });

// Weitere Commands...
program
  .command('add')
  .description('[Etwas hinzufügen]')
  .option('--title <title>', 'Titel')
  .option('--dry-run', 'Nur simulieren')
  .action(async (options) => {
    // Implementation
  });

// Default: help
program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
```

### 3.2 Wichtige Patterns

**Error Handling:**
```javascript
try {
  // Operation
} catch (error) {
  console.error(`❌ Fehler: ${error.message}`);
  process.exit(1);
}
```

**Dry-Run Support:**
```javascript
if (options.dryRun) {
  console.log('🔍 Dry-Run: Würde folgendes tun:');
  console.log(JSON.stringify(data, null, 2));
  return;
}
```

**Progress Output:**
```javascript
console.log('⬇️  Downloading...');
console.log('🎤  Transcribing...');
console.log('✅  Fertig');
```

**File Operations:**
```javascript
const outputPath = path.join(process.cwd(), 'output.txt');
fs.writeFileSync(outputPath, content);
```

---

## Phase 4: Testen

### 4.1 Manuelle Tests

```bash
# Hilfe anzeigen
node index.js --help

# Dry-Run
node index.js --command --dry-run

# Mit Test-Daten
node index.js --command --input test.txt

# Fehler-Szenarien testen
node index.js --command ohne-option
```

### 4.2 Test-Checkliste

- [ ] `--help` zeigt alle Commands
- [ ] `--dry-run` funktioniert
- [ ] Error-Handling bei fehlenden Dateien
- [ ] Output ist korrekt formatiert
- [ ] CLI-UX ist konsistent mit anderen Skills

---

## Phase 5: Veröffentlichen

### 5.1 Git Workflow

```bash
# Im Skills-Verzeichnis
cd /Users/melf/GitMelflin/melflin-oss/skills/[skill-name]

# Dateien hinzufügen
git add .

# Commit
git commit -m "feat([skill-name]): Initial release with MVP features

- ✅ Core functionality
- ✅ CLI interface
- ✅ Documentation"

# Push
git push
```

### 5.2 Website dokumentieren

**skills.md aktualisieren:**
```markdown
<div class="skill-card-full ready">
  <div class="skill-status ready">✅ Fertig</div>
  <div class="skill-content">
    <div class="skill-title">
      <span class="skill-icon">🔧</span>
      <h3>[Skill Name]</h3>
    </div>
    <p class="skill-desc">[Kurze Beschreibung]</p>
    <div class="skill-meta">
      <span class="meta-item">📦 melflin/[skill-name]</span>
      <span class="meta-item">⏱️ XX Min Setup</span>
    </div>
    <div class="skill-actions">
      <a href="./docs/skills/[skill-name]/README.md" class="cta-button">Dokumentation</a>
      <a href="https://github.com/Melflin/melflin.github.io/tree/master/skills/[skill-name]" class="cta-button secondary">GitHub</a>
    </div>
  </div>
</div>
```

### 5.3 Screenshots erstellen

**SVG-Terminal-Template:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#1a1a2e"/>
  <rect x="20" y="20" width="760" height="460" rx="12" fill="#0d0d1a"/>
  <text x="40" y="55" font-family="Monaco, Menlo, monospace" font-size="14" fill="#48bb78">🧙‍♂️ melflin @ [skill-name]</text>
  <text x="40" y="90" font-family="Monaco, Menlo, monospace" font-size="16" fill="#667eea">$ node index.js --help</text>
  <!-- Weitere Output-Zeilen... -->
</svg>
```

**HTML-Seite erstellen:** `screenshots/[skill-name].html`

### 5.4 ClawdHub veröffentlichen

```bash
cd /Users/melf/melflin/skills/[skill-name]

# Auf ClawdHub publishen
clawdhub publish

# Oder installierbar machen
clawdhub install melflin/[skill-name]
```

---

## Phase 6: Wartung

### 6.1 Regelmässige Tasks

- [ ] README aktuell halten
- [ ] Issues beantworten
- [ ] Security-Updates einspielen
- [ ] Feedback einarbeiten

### 6.2 Versionierung

Semantic Versioning: `MAJOR.MINOR.PATCH`

- **MAJOR:** Breaking Changes
- **MINOR:** Neue Features (backward compatible)
- **PATCH:** Bug Fixes

---

## 📁 Datei-Übersicht

| Datei | Pflicht | Beschreibung |
|-------|---------|--------------|
| `README.md` | ✅ | Öffentliche Dokumentation |
| `PLAN.md` | ✅ | Entwicklungskonzept |
| `PROGRESS.md` | ✅ | Fortschritts-Tracking |
| `index.js` | ✅ | Haupt-CLI |
| `SKILL.md` | ✅ | Clawdbot-Integration |

**Optional:**
- `package.json` - Falls externe npm-Dependencies
- `test.js` - Unit Tests
- `.gitignore` - Git Ignore-Regeln

---

## 🛠️ Tool-Empfehlungen

**CLI-Framework:**
- `commander` - Einfach, gut dokumentiert
- `yargs` - Mehr Features, flexibler

**Testing:**
- `jest` - Einfaches Unit Testing
- `inquirer` - Interaktive Prompts

**Hilfreiche npm-Packages:**
- `chalk` - Farbige CLI-Output
- `ora` - Spinner/Progress
- `figlet` - ASCII Art Headers

---

## ✅ Checkliste zur Veröffentlichung

- [ ] README.md vollständig und verständlich
- [ ] PLAN.md zeigt klare Milestones
- [ ] PROGRESS.md dokumentiert alle Features
- [ ] index.js funktioniert mit `--help`
- [ ] Error-Handling implementiert
- [ ] `--dry-run` Support (wenn sinnvoll)
- [ ] Code kommentiert
- [ ] Git Commit mit konventionellen Message
- [ ] Auf GitHub gepusht
- [ ] skills.md aktualisiert
- [ ] Screenshot erstellt (wenn visuell)
- [ ] ClawdHub veröffentlicht

---

*Letzte Aktualisierung: 2026-01-23*

**Inspiriert von:** smart-reminders, meeting-prep, knowledge-sync, podcast-notes
