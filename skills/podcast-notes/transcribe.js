#!/usr/bin/env node
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Transcribe audio file using local Whisper
 * Requires: whisper.cpp or openai-whisper installed
 */
export async function transcribeAudio(audioPath, options = {}) {
  const {
    model = 'base',
    language = 'auto',
    outputFormat = 'json'
  } = options;

  console.log(`🎙️  Transcribing ${audioPath}...`);
  console.log(`   Model: ${model}, Language: ${language}`);

  try {
    // Check if whisper is available
    await checkWhisperInstalled();

    // Run whisper
    const outputDir = path.dirname(audioPath);
    const basename = path.basename(audioPath, path.extname(audioPath));
    
    const args = [
      audioPath,
      '--model', model,
      '--output_format', outputFormat,
      '--output_dir', outputDir
    ];

    if (language !== 'auto') {
      args.push('--language', language);
    }

    const { stdout, stderr } = await runCommand('whisper', args);
    
    // Read the output file
    const outputFile = path.join(outputDir, `${basename}.json`);
    
    if (!fs.existsSync(outputFile)) {
      // Try alternative formats
      const txtFile = path.join(outputDir, `${basename}.txt`);
      if (fs.existsSync(txtFile)) {
        const text = fs.readFileSync(txtFile, 'utf-8');
        return {
          text,
          segments: [],
          language: language === 'auto' ? 'unknown' : language
        };
      }
      throw new Error(`Transcription output not found: ${outputFile}`);
    }

    const result = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
    
    console.log(`✅ Transcription complete! (${result.text?.length || 0} chars)`);
    
    return {
      text: result.text,
      segments: result.segments || [],
      language: result.language || language
    };

  } catch (error) {
    throw new Error(`Transcription failed: ${error.message}`);
  }
}

/**
 * Check if Whisper is installed
 */
async function checkWhisperInstalled() {
  try {
    await runCommand('which', ['whisper']);
  } catch (error) {
    throw new Error(
      'Whisper not found! Install with: pip install openai-whisper\n' +
      'Or install whisper.cpp: https://github.com/ggerganov/whisper.cpp'
    );
  }
}

/**
 * Run shell command and return output
 */
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args);
    
    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
      // Show progress
      if (data.toString().includes('%')) {
        process.stdout.write('.');
      }
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Format transcript with timestamps
 */
export function formatTranscriptWithTimestamps(segments) {
  if (!segments || segments.length === 0) {
    return '';
  }

  return segments.map(seg => {
    const time = formatTimestamp(seg.start);
    return `[${time}] ${seg.text.trim()}`;
  }).join('\n\n');
}

/**
 * Format seconds to HH:MM:SS
 */
function formatTimestamp(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}
