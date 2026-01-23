# CreateNewSkill.md - Reading Recommendations Skill

## Skill Metadata
- **Name:** Reading Recommendation Engine
- **Version:** 1.0.0
- **Author:** Melflin
- **Created:** 2026-01-23
- **Category:** Productivity / Reading

## Description
Generiert personalisierte Buchempfehlungen basierend auf gelesenen Büchern aus dem Knowledge Sync. Kombiniert Collaborative Filtering mit Content-Based Filtering für optimale Vorschläge.

## Features
- Knowledge Sync Integration (liest gelesene Bücher)
- Genre & Theme Extraction
- Content-Based Filtering (ähnliche Bücher basierend auf Genre/Thema)
- Collaborative Filtering (ähnliche Leserprofile)
- CLI Command: `empfehlung`

## Dependencies
- Knowledge Sync System
- Book Database (JSON/SQLite)

## Installation
```bash
# Via Clawdbot Skill Manager
clawdbot skill install reading-recommendations
```

## Usage
```bash
# Empfehlungen generieren
clawdbot empfehlung

# Empfehlungen für spezifisches Genre
clawdbot empfehlung --genre "Science Fiction"

# Top 10 Empfehlungen
clawdbot empfehlung --limit 10
```

## File Structure
```
reading-recommendations/
├── CreateNewSkill.md
├── PLAN.md
├── PROGRESS.md
├── README.md
├── SKILL.md
├── index.js
├── lib/
│   ├── recommendation-engine.js
│   ├── knowledge-sync.js
│   ├── genre-analyzer.js
│   └── cli.js
├── data/
│   └── books.json
└── tests/
    └── recommendation.test.js
```

## Changelog
- **1.0.0** (2026-01-23): Initial release
