#!/usr/bin/env node

/**
 * Weekly Priority Visualizer
 * Shows your top 3 priorities based on Calendar, Reminders, and Emails
 * 
 * Usage:
 *   node index.js --week    # Show this week's priorities
 *   node index.js --today   # Show today's priorities
 *   node index.js --help    # Show help
 */

const { execSync } = require('child_process');
const path = require('path');

// ANSI Colors for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
  }
};

// Priority Scoring Constants
const IMPORTANCE = {
  CRITICAL: 5,    // Executive/C-Level, strategic decisions
  HIGH: 4,        // Important deadlines, customer meetings
  MEDIUM: 3,      // Team meetings, regular syncs
  LOW: 2,         // Informal meetings, follow-ups
  MINIMAL: 1      // Optional events
};

const URGENCY = {
  TODAY: 5,       // Due today/tomorrow
  THIS_WEEK: 4,   // Due this week
  NEXT_WEEK: 3,   // Due next week
  THIS_MONTH: 2,  // Due this month
  NO_DEADLINE: 1  // No deadline
};

const CONTEXT = {
  PERFECT: 3,     // Fits current time/location
  PARTIAL: 2,     // Thematic match
  NEUTRAL: 1      // No special context
};

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  return {
    help: args.includes('--help') || args.includes('-h'),
    week: args.includes('--week'),
    today: args.includes('--today'),
    json: args.includes('--json'),
    verbose: args.includes('--verbose') || args.includes('-v')
  };
}

/**
 * Execute shell command and return result
 */
function execCommand(cmd, verbose = false) {
  try {
    const result = execSync(cmd, { encoding: 'utf-8', timeout: 10000 });
    if (verbose) console.log(`[CMD] ${cmd}`);
    return result.trim();
  } catch (error) {
    console.error(`[WARN] Command failed: ${cmd}`);
    return null;
  }
}

/**
 * Fetch calendar events
 */
function fetchCalendarEvents(startDate, endDate, useMock = false) {
  if (useMock) {
    return [
      { id: '1', title: 'Projekt X Deadline', description: 'Wichtiges Meilimum', startDate: new Date().toISOString() },
      { id: '2', title: 'Team Meeting', description: 'Wöchentliche Sync', startDate: new Date(Date.now() + 86400000).toISOString() },
      { id: '3', title: 'Kunden Call', description: 'Q1 Review', startDate: new Date(Date.now() + 172800000).toISOString() }
    ];
  }
  try {
    const result = execCommand(`accli events --from ${startDate} --to ${endDate} --json`);
    if (!result) return [];
    return JSON.parse(result);
  } catch (error) {
    console.error('[WARN] Could not fetch calendar events');
    return [];
  }
}

/**
 * Fetch reminders
 */
function fetchReminders(weekFilter = true, useMock = false) {
  if (useMock) {
    return [
      { id: '10', title: 'Email an Kunden beantworten', notes: 'Dringend', dueDate: new Date().toISOString(), priority: 'high' },
      { id: '11', title: 'Rechnungen freigeben', notes: 'Monatliche Routine', dueDate: new Date(Date.now() + 259200000).toISOString(), priority: 'medium' },
      { id: '12', title: 'Dokumentation aktualisieren', notes: 'Technische Docs', dueDate: new Date(Date.now() + 604800000).toISOString(), priority: 'low' }
    ];
  }
  try {
    const cmd = weekFilter 
      ? 'reminders list --due thisweek --json'
      : 'reminders list --json';
    const result = execCommand(cmd);
    if (!result) return [];
    return JSON.parse(result);
  } catch (error) {
    console.error('[WARN] Could not fetch reminders');
    return [];
  }
}

/**
 * Fetch important emails
 */
function fetchEmails(useMock = false) {
  if (useMock) {
    return [
      { id: '20', subject: 'Projekt Update benötigt', from: 'Manager', receivedDate: new Date().toISOString(), isUrgent: true },
      { id: '21', subject: 'Meeting morgen', from: 'Kollege', receivedDate: new Date(Date.now() - 3600000).toISOString(), isUrgent: false },
      { id: '22', subject: 'Newsletter: Neue Features', from: 'Company', receivedDate: new Date(Date.now() - 86400000).toISOString(), isUrgent: false }
    ];
  }
  try {
    const ms365Path = path.join(process.env.HOME || '', 'GitRepo/clawdbot/skills/ms365/ms365_cli.py');
    const result = execCommand(`python3 ${ms365Path} --action unread --limit 10`);
    if (!result) return [];
    return JSON.parse(result);
  } catch (error) {
    console.error('[WARN] Could not fetch emails');
    return [];
  }
}

/**
 * Calculate priority score for an item
 */
function calculateScore(item, type) {
  let importance = IMPORTANCE.MEDIUM;
  let urgency = URGENCY.THIS_WEEK;
  let context = CONTEXT.NEUTRAL;
  
  // Type-based scoring adjustments
  if (type === 'calendar') {
    // Check event title/description for keywords
    const title = (item.title || item.summary || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const text = title + ' ' + desc;
    
    if (text.includes('deadline') || text.includes('due') || text.includes('critical')) {
      importance = IMPORTANCE.CRITICAL;
    } else if (text.includes('important') || text.includes('customer') || text.includes('client')) {
      importance = IMPORTANCE.HIGH;
    } else if (text.includes('team') || text.includes('sync') || text.includes('meeting')) {
      importance = IMPORTANCE.MEDIUM;
    }
    
    // Check if event is today
    if (item.isAllDay) {
      urgency = URGENCY.TODAY;
    }
  } else if (type === 'reminder') {
    if (item.priority === 'high' || item.priority === 'critical') {
      importance = IMPORTANCE.HIGH;
    }
    if (item.dueDate) {
      const dueDate = new Date(item.dueDate);
      const now = new Date();
      const daysDiff = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 0) urgency = URGENCY.TODAY;
      else if (daysDiff <= 7) urgency = URGENCY.THIS_WEEK;
      else if (daysDiff <= 14) urgency = URGENCY.NEXT_WEEK;
    }
  } else if (type === 'email') {
    importance = IMPORTANCE.MEDIUM;
    if (item.isUrgent || item.fromManager) {
      importance = IMPORTANCE.HIGH;
    }
    urgency = URGENCY.THIS_WEEK;
  }
  
  return importance * urgency * context;
}

/**
 * Normalize and score all items
 */
function scoreItems(calendarEvents, reminders, emails) {
  const items = [];
  
  // Process calendar events
  calendarEvents.forEach(event => {
    items.push({
      id: event.id,
      type: 'calendar',
      title: event.title || event.summary,
      description: event.description || '',
      date: event.startDate || event.start,
      score: calculateScore(event, 'calendar'),
      source: '📅 Calendar'
    });
  });
  
  // Process reminders
  reminders.forEach(reminder => {
    items.push({
      id: reminder.id,
      type: 'reminder',
      title: reminder.title,
      description: reminder.notes || '',
      date: reminder.dueDate,
      score: calculateScore(reminder, 'reminder'),
      source: '✅ Reminder'
    });
  });
  
  // Process emails
  emails.forEach(email => {
    items.push({
      id: email.id,
      type: 'email',
      title: email.subject,
      description: email.from || '',
      date: email.receivedDate,
      score: calculateScore(email, 'email'),
      source: '📧 Email'
    });
  });
  
  // Sort by score descending and return top 3
  return items
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
  if (!dateStr) return 'Kein Datum';
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-CH', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  });
}

/**
 * Draw the ASCII box with priorities
 */
function drawBox(priorities, title) {
  const width = 60;
  const border = '═'.repeat(width - 2);
  const corner = '╔';
  const cornerEnd = '╗';
  const side = '║';
  
  let output = '';
  output += `${colors.fg.cyan}${corner}${border}${cornerEnd}${colors.reset}\n`;
  output += `${colors.fg.cyan}${side} ${colors.fg.yellow}${colors.bright}${title.padEnd(width - 4)}${colors.reset} ${colors.fg.cyan}${side}${colors.reset}\n`;
  output += `${colors.fg.cyan}${side} ${'─'.repeat(width - 4)} ${colors.fg.cyan}${side}${colors.reset}\n`;
  
  if (priorities.length === 0) {
    output += `${colors.fg.cyan}${side} ${colors.fg.gray}Keine Prioritäten gefunden${' '.repeat(width - 29)}${colors.fg.cyan}${side}${colors.reset}\n`;
  } else {
    priorities.forEach((p, index) => {
      const num = `${index + 1}.`;
      const title = p.title.substring(0, 25).padEnd(25);
      const date = formatDate(p.date).substring(0, 15);
      const score = `Score: ${p.score}`.substring(0, 10);
      
      output += `${colors.fg.cyan}${side} ${colors.fg.green}${colors.bright}${num}${colors.reset} ${colors.fg.white}${colors.bright}${title}${colors.reset}\n`;
      output += `${colors.fg.cyan}${side}   ${colors.fg.magenta}${p.source}${colors.reset} • ${colors.fg.yellow}${date}${colors.reset} • ${colors.fg.cyan}${score}${colors.reset.padEnd(17)}\n`;
      output += `${colors.fg.cyan}${side}   ${colors.fg.gray}${p.description ? p.description.substring(0, 40) : 'Keine Beschreibung'}${colors.reset}${' '.repeat(width - 47)}${colors.fg.cyan}${side}${colors.reset}\n`;
      output += `${colors.fg.cyan}${side} ${' '.repeat(width - 4)} ${colors.fg.cyan}${side}${colors.reset}\n`;
    });
  }
  
  output += `${colors.fg.cyan}${corner}${border}${cornerEnd}${colors.reset}\n`;
  
  return output;
}

/**
 * Main function
 */
function main() {
  const args = parseArgs();
  
  if (args.help) {
    console.log(`
${colors.fg.cyan}${colors.bright}Weekly Priority Visualizer${colors.reset}

${colors.fg.white}Zeigt deine Top 3 Prioritäten basierend auf Kalender, Reminders und Emails.${colors.reset}

${colors.fg.yellow}Usage:${colors.reset}
  node index.js --week    Diese Woche anzeigen (Standard)
  node index.js --today   Heute anzeigen
  node index.js --json    JSON Output
  node index.js --help    Diese Hilfe anzeigen

${colors.fg.yellow}Options:${colors.reset}
  -w, --week     Weekly View (Standard)
  -t, --today    Today's Priorities
  -j, --json     Output als JSON
  -v, --verbose  Verbose Output
  -h, --help     Hilfe anzeigen

${colors.fg.cyan}Made with 🧙‍♂️ by Melflin${colors.reset}
`);
    return;
  }
  
  // Calculate date range
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
  
  const startDate = startOfWeek.toISOString().split('T')[0];
  const endDate = endOfWeek.toISOString().split('T')[0];
  
  const kw = getWeekNumber(now);
  const title = `📌 Top 3 Priorities (KW ${kw} • ${now.getFullYear()})`;
  
  // Fetch data
  if (args.verbose) console.log('[INFO] Fetching data...');
  
  // Use mock data if external commands fail (for demo/testing)
  const useMock = args.verbose;
  const calendarEvents = fetchCalendarEvents(startDate, endDate, useMock);
  const reminders = fetchReminders(args.today, useMock);
  const emails = fetchEmails(useMock);
  
  if (args.verbose) {
    console.log(`[INFO] Calendar: ${calendarEvents.length} events`);
    console.log(`[INFO] Reminders: ${reminders.length} items`);
    console.log(`[INFO] Emails: ${emails.length} unread`);
  }
  
  // Score and rank
  const priorities = scoreItems(calendarEvents, reminders, emails);
  
  if (args.json) {
    console.log(JSON.stringify(priorities, null, 2));
  } else {
    console.log('');
    console.log(drawBox(priorities, title));
    console.log('');
  }
}

/**
 * Get ISO week number
 */
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Run main function
main();
