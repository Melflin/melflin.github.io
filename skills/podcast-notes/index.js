#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parsePodcastFeed, downloadAudio, getLatestEpisode, sanitizeFilename } from './fetch.js';
import { transcribeAudio, formatTranscriptWithTimestamps } from './transcribe.js';
import { summarizeTranscript, extractStats } from './summarize.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const AUDIO_DIR = path.join(DATA_DIR, 'audio');
const TRANSCRIPTS_DIR = path.join(DATA_DIR, 'transcripts');
const NOTES_DIR = path.join(DATA_DIR, 'notes');

// Ensure directories exist
[DATA_DIR, AUDIO_DIR, TRANSCRIPTS_DIR, NOTES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const program = new Command();

program
  .name('podcast-notes')
  .description('Download, transcribe, and summarize podcast episodes')
  .version('0.1.0');

/**
 * Add podcast episode
 */
program
  .command('add')
  .description('Add and process a podcast episode')
  .requiredOption('-u, --url <url>', 'RSS feed URL')
  .option('-e, --episode <number>', 'Episode index (default: latest)', '0')
  .option('-m, --model <model>', 'Whisper model (tiny/base/small/medium/large)', 'base')
  .option('-l, --language <lang>', 'Language code (auto/en/de/fr/etc)', 'auto')
  .option('--no-download', 'Skip audio download (use existing)')
  .option('--no-transcribe', 'Skip transcription')
  .option('--no-summarize', 'Skip AI summary')
  .action(async (options) => {
    try {
      console.log('🎙️  podcast-notes v0.1.0\n');

      // 1. Parse RSS feed
      console.log('📡 Fetching podcast feed...');
      const { podcast, episodes } = await parsePodcastFeed(options.url);
      const episodeIndex = parseInt(options.episode);
      
      if (episodeIndex >= episodes.length) {
        throw new Error(`Episode ${episodeIndex} not found (feed has ${episodes.length} episodes)`);
      }

      const episode = episodes[episodeIndex];
      console.log(`✅ Found: ${episode.title}\n`);

      // 2. Download audio
      let audioPath;
      const safeTitle = sanitizeFilename(episode.title);
      const audioFile = path.join(AUDIO_DIR, `${safeTitle}.mp3`);

      if (options.download) {
        if (!episode.audioUrl) {
          throw new Error('No audio URL found in episode');
        }
        audioPath = await downloadAudio(episode.audioUrl, audioFile);
      } else {
        audioPath = audioFile;
        if (!fs.existsSync(audioPath)) {
          throw new Error(`Audio file not found: ${audioPath}`);
        }
        console.log(`📁 Using existing audio: ${audioPath}`);
      }

      // 3. Transcribe
      let transcript = '';
      let segments = [];
      const transcriptFile = path.join(TRANSCRIPTS_DIR, `${safeTitle}.json`);

      if (options.transcribe) {
        const result = await transcribeAudio(audioPath, {
          model: options.model,
          language: options.language
        });
        transcript = result.text;
        segments = result.segments;

        // Save transcript
        fs.writeFileSync(transcriptFile, JSON.stringify(result, null, 2));
        console.log(`💾 Transcript saved: ${transcriptFile}\n`);
      } else if (fs.existsSync(transcriptFile)) {
        // Use existing transcript if available
        const data = JSON.parse(fs.readFileSync(transcriptFile, 'utf-8'));
        transcript = data.text;
        segments = data.segments;
        console.log(`📁 Using existing transcript: ${transcriptFile}\n`);
      } else {
        console.log(`⏭️  Skipping transcription (no existing transcript found)\n`);
      }

      // 4. Summarize
      let summary;
      if (options.summarize) {
        summary = await summarizeTranscript(transcript, {
          podcast: podcast.title,
          title: episode.title,
          duration: episode.duration
        });
      } else {
        summary = {
          mainTopics: '[Skipped]',
          keyTakeaways: '[Skipped]',
          quotes: '[Skipped]',
          summary: '[Skipped]'
        };
      }

      // 5. Generate note
      const stats = extractStats(transcript, segments);
      const formattedTranscript = transcript 
        ? (formatTranscriptWithTimestamps(segments) || transcript)
        : '[Transcript not available - use --transcribe to generate]';
      
      const note = generateNote({
        title: episode.title,
        podcast: podcast.title,
        date: episode.published,
        duration: episode.duration,
        url: episode.url,
        mainTopics: summary.mainTopics,
        keyTakeaways: summary.keyTakeaways,
        quotes: summary.quotes,
        summary: summary.summary,
        transcript: formattedTranscript,
        stats
      });

      const noteFile = path.join(NOTES_DIR, `${safeTitle}.md`);
      fs.writeFileSync(noteFile, note);

      console.log('\n✅ Done!\n');
      console.log(`📝 Note: ${noteFile}`);
      console.log(`🎙️  Transcript: ${transcriptFile}`);
      console.log(`🔊 Audio: ${audioPath}\n`);

    } catch (error) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  });

/**
 * List available episodes from feed
 */
program
  .command('list')
  .description('List episodes from a podcast feed')
  .requiredOption('-u, --url <url>', 'RSS feed URL')
  .option('-n, --number <count>', 'Number of episodes to show', '10')
  .action(async (options) => {
    try {
      const { podcast, episodes } = await parsePodcastFeed(options.url);
      const count = Math.min(parseInt(options.number), episodes.length);

      console.log(`\n🎙️  ${podcast.title}\n`);
      console.log(`Found ${episodes.length} episodes:\n`);

      episodes.slice(0, count).forEach((ep, i) => {
        console.log(`[${i}] ${ep.title}`);
        console.log(`    ${ep.published} | ${ep.duration || 'Unknown duration'}`);
        if (ep.audioUrl) {
          console.log(`    🔊 ${ep.audioUrl}`);
        }
        console.log('');
      });

    } catch (error) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  });

/**
 * Show recent processed notes
 */
program
  .command('recent')
  .description('Show recently processed podcast notes')
  .option('-n, --number <count>', 'Number of notes to show', '5')
  .action((options) => {
    try {
      const files = fs.readdirSync(NOTES_DIR)
        .filter(f => f.endsWith('.md'))
        .map(f => ({
          name: f,
          path: path.join(NOTES_DIR, f),
          mtime: fs.statSync(path.join(NOTES_DIR, f)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime)
        .slice(0, parseInt(options.number));

      if (files.length === 0) {
        console.log('\nNo notes found yet. Use `podcast-notes add` to create one.\n');
        return;
      }

      console.log(`\n📝 Recent podcast notes:\n`);
      files.forEach(file => {
        const date = file.mtime.toISOString().split('T')[0];
        console.log(`[${date}] ${file.name}`);
        console.log(`    ${file.path}\n`);
      });

    } catch (error) {
      console.error(`\n❌ Error: ${error.message}\n`);
      process.exit(1);
    }
  });

/**
 * Generate markdown note from template
 */
function generateNote(data) {
  const template = fs.readFileSync(
    path.join(__dirname, 'templates', 'podcast-note.md'),
    'utf-8'
  );

  let note = template;
  
  // Replace all placeholders
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'object') {
      // Handle nested objects (like stats)
      Object.entries(value).forEach(([subKey, subValue]) => {
        note = note.replace(new RegExp(`{{${key}\\.${subKey}}}`, 'g'), subValue || '');
      });
    } else {
      // Handle triple braces for URLs (no escaping)
      note = note.replace(new RegExp(`{{{${key}}}}`, 'g'), value || '');
      // Handle normal placeholders
      note = note.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
    }
  });

  // Add generation date
  note = note.replace(/{{generatedDate}}/g, new Date().toISOString().split('T')[0]);

  return note;
}

program.parse();
