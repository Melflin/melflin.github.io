# 🎯 Verbesserungs-Plan: podcast-notes

**Status:** Nur Planung - KEIN Code | **Priorität:** Niedrig | **Aufwand:** 4-6 Stunden

## 📦 Current State

❌ Problem: Nur PLAN.md existiert, kein funktionierender Code!

✅ Was existiert:
- `PLAN.md` - Detaillierte Planung
- `PROGRESS.md` - Fortschritts-Tracking
- `SKILL.md` - Skill-Dokumentation

❌ Was fehlt:
- `index.js` - Keine CLI
- `fetch.js` - Kein RSS/Download
- `transcribe.js` - Keine Whisper-Integration
- `summarize.js` - Keine AI-Zusammenfassung
- `templates/` - Keine Templates
- `scripts/` - Keine Hilfsscripts

## 🎯 Ziele

### Phase 1: MVP Core (3h)
1. RSS-Feed Parser erstellen
2. Download-Script für Audio
3. Whisper-Transkription (lokal)
4. Index.js CLI bauen

### Phase 2: AI Integration (2h)
5. Zusammenfassung mit AI generieren
6. Key-Takeaways extrahieren
7. Speaker-Identifikation

### Phase 3: Export + Polish (1h)
8. Obsidian-Export
9. Timestamp-Links
10. Verbessertes UI

## 📝 Tasks

### index.js - Unified CLI
```bash
# Commands
node index.js add --url "https://podcast.com/episode"
node index.js list
node index.js recent --days 7
node index.js export --format obsidian
```

### fetch.js - RSS + Download
```javascript
// RSS Parser
function parsePodcastFeed(url) {
  return fetch(url)
    .then(res => res.text())
    .then(xml => parseXML(xml))
    .then(items => items.map(item => ({
      title: item.title,
      url: item.enclosure.url,
      published: item.pubDate,
      duration: item['itunes:duration']
    })));
}

// Audio Download
async function downloadAudio(url, outputPath) {
  const stream = await fetch(url);
  const file = createWriteStream(outputPath);
  stream.body.pipe(file);
  return new Promise(resolve => file.on('finish', resolve));
}
```

### transcribe.js - Whisper Integration
```javascript
// Local Whisper via o whisper.cpp
async function transcribeAudio(audioPath) {
  const result = await spawn('whisper', [
    audioPath,
    '--model', 'base',
    '--output_format', 'json'
  ]);
  return parseWhisperOutput(result);
}
```

### summarize.js - AI Summary
```javascript
async function summarizeTranscript(transcript) {
  const response = await callAI({
    model: 'minimax',
    prompt: `Summarize this podcast transcript. Extract:
1. Main topics discussed
2. Key takeaways (bullet points)
3. Notable quotes
4. Guest/A speaker info

Transcript: ${transcript.substring(0, 10000)}`
  });
  return response;
}
```

### templates/podcast-note.md
```markdown
---
title: "{{title}}"
podcast: "{{podcast_name}}"
date: "{{published}}"
duration: "{{duration}}"
---

# {{title}}

## 📊 Quick Info
- **Podcast:** {{podcast_name}}
- **Published:** {{date}}
- **Duration:** {{duration}}

## 🎯 Key Takeaways
- 

## 📝 Detailed Notes
{{transcript}}

## 🔗 Timestamps
- [00:00] Introduction
- [15:30] Main topic starts
- [45:00] Key insight
```

## 🔧 Dependencies

```json
{
  "dependencies": {
    "rss-parser": "^3.13.0",
    "openai-whisper": "^20231117"
  }
}
```

## ✅ Definition of Done

- [ ] `index.js add --url` funktioniert
- [ ] Podcast wird heruntergeladen
- [ ] Transkription mit Whisper funktioniert
- [ ] AI-Zusammenfassung wird generiert
- [ ] Obsidian-Note wird erstellt
- [ ] Test mit 1 Podcast

## 📁 Files to Create

- `/Users/melf/melflin/skills/podcast-notes/index.js`
- `/Users/melf/melflin/skills/podcast-notes/fetch.js`
- `/Users/melf/melflin/skills/podcast-notes/transcribe.js`
- `/Users/melf/melflin/skills/podcast-notes/summarize.js`
- `/Users/melf/melflin/skills/podcast-notes/templates/podcast-note.md`

## 📁 Files to Modify

- `/Users/melf/melflin/skills/podcast-notes/PROGRESS.md` - Update status

---

*Erstellt: 2026-01-23 | Target: Worker execution*
