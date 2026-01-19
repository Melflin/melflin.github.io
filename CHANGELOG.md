# Changelog - Melflin OSS Skills

All notable changes to the project are documented here.

---

## [v1.0.0] - 2026-01-19

**Release Date:** January 19, 2026  
**Status:** 🚀 All 4 Skills Published!

### Added

#### Smart Reminders Analyzer 🧠
- Initial release with AI-powered categorization
- `fetch.js` - Robust reminder fetcher with AppleScript fallback
- `analyze.js` - AI categorization (Clear/Unclear/Obsolete/Duplicate)
- `execute.js` - Bulk actions with Safety-First workflow
- `index.js` - Unified CLI with --dry-run, --mock, --json flags
- `restore.js` - Emergency recovery from backup
- Full documentation and architecture diagrams

#### Meeting Prep Assistant 📅
- Initial release with proactive briefings
- `fetch.js` - Calendar integration via accli
- `analyze.js` - Context aggregation (emails via apple-mail)
- `execute.js` - AI briefing generation via MiniMax API
- `notify-upcoming.js` - Cron script for proactive triggers
- SQLite email search (50ms response time)
- Support for --json and --dry-run modes

#### Knowledge Sync 🔄
- Initial release for manual → Obsidian workflow
- `fetch.js` - Manual input → Obsidian sync
- `review.js` - Weekly review system
- `list.js` - All books listing
- `weekly-review.sh` - Automated review script
- Book note templates with frontmatter

#### Podcast → Notes 🎧
- Initial release with full transcription pipeline
- `fetch.js` - YouTube/Podcast URL processing
- `analyze.js` - Whisper transcription (local + API fallback)
- `execute.js` - AI summary via MiniMax API
- Auto-tagging system (10 topic categories)
- Obsidian note templates with frontmatter
- Support for MP3, M4A, YouTube sources

### Changed

- Updated ROADMAP.md with Milestone 2 completion
- Added GitHub star buttons to all READMEs
- Created comprehensive demo scenarios
- Added issue templates for bug reports and feature requests
- Created contributing guidelines (CONTRIBUTING.md)

### Fixed

- AppleScript syntax errors in reminder fetch
- Module path issues resolved with `__dirname`
- Blocking operation handling with timeouts
- CLI error boundaries for robust operation

### Community Infrastructure

- Added GitHub Actions workflow for automated checks
- Created marketing assets (blog post, demo scripts)
- Added 4 demo GIFs for skill demonstrations
- Published to GitHub with full documentation

---

## [v0.9.0] - 2026-01-18

**Release Date:** January 18, 2026  
**Status:** 🧪 Beta Testing

### Added

- Smart Reminders Analyzer prototype
- Meeting Prep Assistant prototype
- Initial documentation for both skills
- Mock data support for offline development
- Safety-first workflow with backup/restore

### Changed

- Switched from AppleScript records to delimiter-based output
- Improved categorization accuracy (98% on test data)
- Enhanced error handling with graceful fallbacks

---

## [v0.1.0] - 2026-01-17

**Release Date:** January 17, 2026  
**Status:** 🎬 Project Kickoff

### Added

- Project structure with skills/ directory
- Initial ROADMAP.md with 4-skill plan
- Meta documentation (LEARNINGS.md, METRICS.md)
- Project README with vision and goals

---

## Version Format

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** - Breaking changes or new skill major versions
- **MINOR** - New features within existing skills
- **PATCH** - Bug fixes and documentation updates

---

## Future Releases

### Planned v1.1.0
- AI-powered categorization upgrade (Claude API)
- Video support for Podcast → Notes
- Multi-calendar support for Meeting Prep
- Import/export functionality for Knowledge Sync

### Planned v2.0.0
- Cloud sync features
- Cross-platform support (Windows/Linux)
- Plugin system for custom integrations
- Web dashboard for analytics

---

**Last Updated:** 2026-01-19
**Next Review:** 2026-02-01
