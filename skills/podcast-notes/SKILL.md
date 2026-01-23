# Podcast Notes 🎙️

**Structured note-taking for podcasts with timestamps, quotes, and summaries**

## Status: 🔮 Future (Planned Feb-Mar 2026)

## Problem

Stefan listens to lots of podcasts/audiobooks:
- Great insights while listening
- But: Can't search or reference later
- No transcript = insights lost
- No way to find "that one thing they said"

## Solution

**Auto-transcribe & Summarize:**
1. Give URL (YouTube, Spotify, Apple Podcasts)
2. Auto-download audio
3. Transcribe with Whisper (local or API)
4. AI summary (key points, quotes, themes)
5. Save to notes (searchable, taggable)

## Planned Architecture

```
URL → Audio Download → Whisper → Transcript → AI Summary → Notes
       (yt-dlp)        (OpenAI)              (Claude)       (Obsidian)
```

## Example Output

```markdown
# Podcast Title

**Published:** 2026-01-18  
**Duration:** 2h 30m  
**Source:** YouTube  
**Tags:** #podcast #topic

## 🎯 Key Insights

1. First key point...
2. Second key point...

## 📝 Notable Quotes

> "Quote from the podcast..."

## 🧠 Summary

AI-generated summary of the main topics discussed.
```

## Dependencies

- `yt-dlp` (YouTube audio download)
- Whisper (OpenAI API or local)
- AI model for summarization
- Obsidian for storage

---

*Built by Melflin 🧙‍♂️ | Coming soon*
