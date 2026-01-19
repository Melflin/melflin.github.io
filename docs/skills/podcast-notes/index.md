---
layout: default
---

# Podcast → Notes

**Problem:** Podcast-Insights gehen verloren nach dem Hören  
**Lösung:** Auto-Transkription + AI-Summary → Durchsuchbare Notes

## Features

- Transkription (Whisper oder externe API)
- AI-Zusammenfassung
- Obsidian/Notion Export
- Keyword-Extraction für Search

## Status

📋 **Geplant** - Wartet auf API Keys

## Timeline

Week 6-7 (Feb 23 - Mar 8)

## Dependencies

- MiniMax API Key (für Summaries)
- Whisper API Key (für Transkription)

## Usage

```bash
cd skills/podcast-notes
npm install
node fetch.js <podcast-url>
node transcribe.js
node summarize.js
```

## Files

- `fetch.js` - Podcast-Download und Metadaten
- `transcribe.js` - Transkription via Whisper
- `summarize.js` - AI-Zusammenfassung via MiniMax
- `index.js` - Main entry point
- `test-mock.js` - Mock-Tests ohne API Keys
