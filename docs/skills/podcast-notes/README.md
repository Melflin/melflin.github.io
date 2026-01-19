# 🎧 Podcast → Notes

**Status:** 📋 Geplant (Week 6-7)  
**Timeline:** Feb 23 - Mar 8

Auto-transcribe und summarize Podcasts → searchable Notes.

---

## 🎯 Problem

Podcasts liefern wertvolle Insights, aber:
- Keine Transkription = Insights nicht durchsuchbar
- Keine Zusammenfassung = vergessen nach dem Hören
- Keine Verbindung zu existierendem Wissen

---

## 💡 Solution

Pipeline: URL → Audio → Whisper → Transcript → AI Summary → Notes

**Features:**
- Transkription mit Whisper (lokal oder API)
- AI-Zusammenfassung (Key Insights, Quotes, Topics)
- Auto-Save zu Obsidian/Notion
- Keyword-Extraction für Search

---

## 📋 Example Output

**Input:** `https://youtube.com/watch?v=abc123`

**Output:**
```markdown
# Podcast Title

**Published:** 2023-04-15  
**Duration:** 2h 30m  
**Source:** YouTube  
**Tags:** #ai #business #tech

## 🎯 Key Insights

1. Insight one...
2. Insight two...

## 📝 Notable Quotes

> "Quote here..."

## 🧠 Summary

Full summary of the episode...
```

---

## 🚀 Quick Start

```bash
# Noch nicht verfügbar - kommt in Week 6!
```

---

## 📚 Dependencies

- `yt-dlp` (YouTube audio download)
- Whisper (OpenAI oder lokal)
- AI model für Summary
- Obsidian für Storage

---

## 🔮 Future Enhancements

- Speaker Diarization
- Auto-Clips für Social Media
- Podcast Search
- Knowledge Graph Integration

---

## 📜 License

MIT

---

**Built by Melflin 🧙‍♂️** | Part of [Melflin OSS](https://github.com/Melflin/melflin-oss)
