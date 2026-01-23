# PLAN.md - Reading Recommendation Engine

## Ziel
Personalisierte Buchempfehlungen basierend auf gelesenen Büchern aus dem Knowledge Sync System generieren.

## Hintergrund
Der User möchte einen Skill, der:
- Bereits gelesene Bücher aus Knowledge Sync ausliest
- Genre und Themen extrahiert
- Ähnliche Bücher empfiehlt (Content-Based)
- Von ähnlichen Lesern gelesene Bücher vorschlägt (Collaborative)
- Einfach über CLI Command `empfehlung` bedienbar ist

## Technische Architektur

### 1. Knowledge Sync Integration
```
- Lesen aus: ~/melflin/data/knowledge-sync/books.json
- Oder: ~/melflin/.knowledge-sync/read-books/
- Struktur: { title, author, genre, themes, rating, dateRead }
```

### 2. Genre/Theme Extraction
```
- Vordefinierte Genre-Liste (Fiction, Non-Fiction, Sci-Fi, etc.)
- NLP-basierte Themen-Extraktion (einfache Keyword-Analyse)
- Tag-System für Bücher
```

### 3. Recommendation Logic
```
Content-Based Filtering:
- Bücher mit ähnlichen Genres/Themen vorschlagen
- Gewichtung nach User-Rating

Collaborative Filtering:
- "Ähnliche Leser" simulieren (basierend auf Genre-Präferenzen)
- Bücher vorschlagen, die ähnliche Leser mochten
```

### 4. CLI Interface
```bash
clawdbot empfehlung [--genre X] [--limit N] [--hybrid]
```

## Iterations-Plan

### Iteration 1 (jetzt)
- [x] CreateNewSkill.md Template
- [x] PLAN.md

### Iteration 2 (in 3 min)
- README.md
- index.js MVP (Recommendation Algorithm Grundgerüst)

### Iteration 3 (in 6 min)
- PROGRESS.md updaten
- Genre/Theme Analysis Modul

### Iteration 4 (in 9 min)
- Testing
- Git Commit & Push
- Veröffentlichung

### Iteration 5 (in 12 min)
- Screenshots
- Abschluss & Zusammenfassung

## Deliverables
- `/Users/melf/melflin/skills/reading-recommendations/`
- `/Users/melf/GitMelflin/melflin-oss/skills/reading-recommendations/`

## Success Criteria
- Skill ist installierbar
- Liest gelesene Bücher aus Knowledge Sync
- Generiert relevante Empfehlungen
- CLI Command funktioniert
- Code ist dokumentiert und getestet

## Risiken & Mitigation
| Risiko | Mitigation |
|--------|------------|
| Keine Knowledge Sync Daten | Dummy-Daten für Testing |
| Schlechte Empfehlungen | Hybrid-Ansatz (Content + Collaborative) |
| Performance bei vielen Büchern | Caching, limitierte Results |

## Nächste Schritte
Iteration 1 starten → README.md + index.js MVP in Iteration 2
