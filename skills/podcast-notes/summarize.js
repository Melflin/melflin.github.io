#!/usr/bin/env node
import { spawn } from 'child_process';

/**
 * Summarize transcript using local Claude CLI
 */
export async function summarizeTranscript(transcript, episodeInfo = {}) {
  console.log('🤖 Generating AI summary...');

  const prompt = `Analyze this podcast transcript and provide:

1. **Main Topics** (3-5 bullet points)
2. **Key Takeaways** (5-7 actionable insights)
3. **Notable Quotes** (2-3 best quotes with context)
4. **Summary** (2-3 paragraphs overview)

Podcast: ${episodeInfo.podcast || 'Unknown'}
Episode: ${episodeInfo.title || 'Unknown'}
Duration: ${episodeInfo.duration || 'Unknown'}

Transcript (first 8000 chars):
${transcript.substring(0, 8000)}

${transcript.length > 8000 ? '\n[...transcript continues...]' : ''}

Format as markdown with clear sections.`;

  try {
    const summary = await callClaudeCLI(prompt);
    console.log('✅ Summary generated!');
    return parseSummary(summary);
  } catch (error) {
    console.warn('⚠️  AI summary failed, using fallback');
    return generateFallbackSummary(transcript, episodeInfo);
  }
}

/**
 * Call Claude CLI for AI processing
 */
async function callClaudeCLI(prompt) {
  return new Promise((resolve, reject) => {
    const process = spawn('claude', ['--model', 'minimax', '--prompt', prompt]);
    
    let output = '';
    let error = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0 && output) {
        resolve(output);
      } else {
        reject(new Error(`Claude CLI failed: ${error || 'No output'}`));
      }
    });

    // Timeout after 60 seconds
    setTimeout(() => {
      process.kill();
      reject(new Error('AI summary timeout'));
    }, 60000);
  });
}

/**
 * Parse AI response into structured format
 */
function parseSummary(text) {
  // Extract sections using markdown headers
  const sections = {
    mainTopics: extractSection(text, 'Main Topics'),
    keyTakeaways: extractSection(text, 'Key Takeaways'),
    quotes: extractSection(text, 'Notable Quotes'),
    summary: extractSection(text, 'Summary')
  };

  return {
    ...sections,
    raw: text
  };
}

/**
 * Extract section from markdown text
 */
function extractSection(text, header) {
  const regex = new RegExp(`#{1,3}\\s*\\*?\\*?${header}\\*?\\*?[:\\s]*([\\s\\S]*?)(?=#{1,3}|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * Generate fallback summary without AI
 */
function generateFallbackSummary(transcript, episodeInfo) {
  const words = transcript.split(/\s+/).length;
  const readingTime = Math.ceil(words / 200);

  return {
    mainTopics: '- Topic extraction requires AI\n- Manual review recommended',
    keyTakeaways: '- Full transcript available below\n- AI summary unavailable',
    quotes: 'No quotes extracted (AI unavailable)',
    summary: `This is a ${episodeInfo.duration || 'podcast episode'} from ${episodeInfo.podcast || 'unknown podcast'}. ` +
             `The transcript contains approximately ${words} words (${readingTime} min read). ` +
             `AI summary unavailable - please review the full transcript below.`,
    raw: '[Fallback summary - AI unavailable]'
  };
}

/**
 * Extract key statistics from transcript
 */
export function extractStats(transcript, segments = []) {
  const words = transcript.split(/\s+/).length;
  const chars = transcript.length;
  const sentences = transcript.split(/[.!?]+/).length;
  
  return {
    words,
    chars,
    sentences,
    readingTime: Math.ceil(words / 200),
    segments: segments.length,
    duration: segments.length > 0 ? segments[segments.length - 1].end : 0
  };
}
