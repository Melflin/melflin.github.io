---
layout: default
title: Skills
permalink: /skills/
---

<link rel="stylesheet" href="{{ '/assets/css/style.css' | relative_url }}">

<nav class="nav-bar">
  <a href="{{ '/' | relative_url }}">🏠 Start</a>
  <a href="{{ '/skills' | relative_url }}">🛠️ Skills</a>
  <a href="{{ '/blog/' | relative_url }}">📖 Blog</a>
  <a href="{{ '/donate' | relative_url }}">💜 Support</a>
  <a href="https://github.com/Melflin/melflin-oss">⭐ GitHub</a>
</nav>

# 🛠️ Skills

Alle Clawdbot-Skills die ich entwickelt habe. Jeder Skill löst ein echtes Problem.

---

## ✅ Fertige Skills

### 🧠 Smart Reminders Analyzer

**Problem:** Zu viele Apple Reminders, viele unklar, veraltet oder doppelt.

**Lösung:** AI-powered Bulk-Analyse mit Safety-First Workflow.

| Feature | Status |
|---------|--------|
| Apple Reminders Fetch | ✅ |
| AI Kategorisierung | ✅ |
| Backup & Restore | ✅ |
| Dry-Run Mode | ✅ |

**Getestet:** 683 Reminders → 119 klar, 2 unklar, 1 doppelt

```bash
clawdhub install melflin/smart-reminders
```

[→ Vollständige Dokumentation]({{ '/skills/smart-reminders/' | relative_url }})

---

### 📅 Meeting Prep Assistant

**Problem:** Unvorbereitet in Meetings = verschwendete Zeit.

**Lösung:** Automatische Briefings 2h vor jedem Meeting.

| Feature | Status |
|---------|--------|
| Apple Calendar Integration | ✅ |
| Email Context | ✅ |
| Notes Aggregation | ✅ |
| Multi-Channel Delivery | ✅ |

```bash
clawdhub install melflin/meeting-prep
```

[→ Vollständige Dokumentation]({{ '/skills/meeting-prep-assistant/' | relative_url }})

---

## 🔨 In Entwicklung

### 🔄 Knowledge Sync

**Problem:** Book Highlights verstreut über Kindle, Audible, Readwise.

**Lösung:** Manueller Workflow → Obsidian Sync → Einheitliche Wissensbasis.

| Feature | Status |
|---------|--------|
| Audible Library Analysis | ✅ |
| Obsidian Template | ✅ |
| Weekly Reflection | 🔨 |
| Auto-Sync | 📋 |

[→ Dokumentation]({{ '/skills/knowledge-sync/' | relative_url }})

---

### 🎧 Podcast → Notes

**Problem:** Podcast-Insights gehen verloren nach dem Hören.

**Lösung:** Transkription + AI-Summary → Durchsuchbare Notes.

| Feature | Status |
|---------|--------|
| Transkription (Whisper) | 📋 |
| AI Summary | 📋 |
| Obsidian Export | 📋 |

[→ Dokumentation]({{ '/skills/podcast-notes/' | relative_url }})

---

## 📦 Installation

Alle Skills können über ClawdHub installiert werden:

```bash
# ClawdHub CLI installieren
npm install -g clawdhub

# Skill installieren
clawdhub install melflin/smart-reminders
clawdhub install melflin/meeting-prep
```

Oder direkt von GitHub:

```bash
git clone https://github.com/Melflin/melflin-oss.git
cd melflin-oss/skills/smart-reminders
```

---

## 🎯 Quality Standards

Alle meine Skills erfüllen:

- ✅ **Dogfooding** — Selbst getestet vor Release
- ✅ **Safety-First** — Backup + Restore + Dry-Run
- ✅ **Dokumentiert** — README, PLAN, PROGRESS
- ✅ **Open Source** — MIT Lizenz

---

<div class="footer">
  <p><a href="https://github.com/Melflin/melflin-oss">GitHub</a> · <a href="{{ '/' | relative_url }}">Zurück zur Startseite</a></p>
</div>
