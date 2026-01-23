#!/usr/bin/env node
import Parser from 'rss-parser';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';

const streamPipeline = promisify(pipeline);

/**
 * Parse RSS feed and return podcast episodes
 */
export async function parsePodcastFeed(feedUrl) {
  const parser = new Parser({
    customFields: {
      item: [
        ['itunes:duration', 'duration'],
        ['itunes:author', 'author'],
        ['enclosure', 'enclosure']
      ]
    }
  });

  try {
    const feed = await parser.parseURL(feedUrl);
    
    return {
      podcast: {
        title: feed.title,
        description: feed.description,
        link: feed.link,
        image: feed.image?.url || feed.itunes?.image
      },
      episodes: feed.items.map(item => ({
        title: item.title,
        description: item.contentSnippet || item.content,
        url: item.link,
        audioUrl: item.enclosure?.url,
        published: item.pubDate,
        duration: item.duration,
        author: item.author || feed.title
      }))
    };
  } catch (error) {
    throw new Error(`Failed to parse RSS feed: ${error.message}`);
  }
}

/**
 * Download audio file from URL
 */
export async function downloadAudio(audioUrl, outputPath) {
  try {
    console.log(`📥 Downloading audio from ${audioUrl}...`);
    
    const response = await fetch(audioUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Stream download to file
    await streamPipeline(response.body, fs.createWriteStream(outputPath));
    
    const stats = fs.statSync(outputPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`✅ Downloaded ${sizeMB} MB to ${outputPath}`);
    
    return outputPath;
  } catch (error) {
    throw new Error(`Failed to download audio: ${error.message}`);
  }
}

/**
 * Get latest episode from feed
 */
export async function getLatestEpisode(feedUrl) {
  const { podcast, episodes } = await parsePodcastFeed(feedUrl);
  
  if (episodes.length === 0) {
    throw new Error('No episodes found in feed');
  }

  return {
    podcast,
    episode: episodes[0]
  };
}

/**
 * Generate safe filename from title
 */
export function sanitizeFilename(title) {
  return title
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .substring(0, 100);
}
