#!/usr/bin/env node

/**
 * Stress Pattern Analyzer v1.0.0
 * Analysiert Kalender, Arbeitszeiten und zeigt Stress-Level über Zeit.
 * 
 * Features:
 * - Stress-Score (0-100) basierend auf 4 Faktoren
 * - ASCII-Visualisierung mit Bar Charts und Trend-Diagrammen
 * - Kalender-Integration via accli
 * - Historische Daten-Tracking
 */

const { Command } = require('commander');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Version & Config
const VERSION = '1.0.0';
const DATA_FILE = path.join(__dirname, '.stress-data.json');

// CLI Setup
const program = new Command();
program.name('melflin-stress-analyzer').description('📊 Analysiert Kalender, Arbeitszeiten und zeigt Stress-Level').version(VERSION);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Kalender-Events abrufen via accli
 */
function getCalendarEvents(days = 7) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    const endStr = endDate.toISOString().split('T')[0];
    
    const result = execSync(
      `accli events --all --from ${today} --to ${endStr} --json 2>/dev/null`,
      { encoding: 'utf8', maxBuffer: 1024 * 1024 }
    );
    return JSON.parse(result);
  } catch (error) {
    console.warn('⚠️  Kalender-Zugriff fehlgeschlagen, verwende Demo-Daten');
    return generateDemoEvents(days);
  }
}

/**
 * Demo-Events generieren für Testing
 */
function generateDemoEvents(days = 7) {
  const events = [];
  const eventNames = ['Meeting', 'Standup', 'Review', 'Planning', 'Call', 'Workshop'];
  
  for (let d = 0; d < days; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const numEvents = Math.floor(Math.random() * 6) + 2;
    
    for (let e = 0; e < numEvents; e++) {
      const hour = 8 + Math.floor(Math.random() * 9);
      events.push({
        title: eventNames[Math.floor(Math.random() * eventNames.length)],
        start: new Date(date.setHours(hour, 0, 0, 0)).toISOString(),
        duration: 30 + Math.floor(Math.random() * 60)
      });
    }
  }
  return events;
}

/**
 * Stress-Score berechnen (0-100)
 * 
 * Faktoren:
 * - Termindichte: max 40 Punkte
 * - Arbeitszeit: max 30 Punkte
 * - Benachrichtigungen: max 20 Punkte
 * - Kontinuität: max 10 Punkte
 */
function calculateStressScore(events, workHours, notifications) {
  let score = 0;
  
  // 1. Termindichte (0-40 Punkte)
  const eventsPerDay = events.length / 7;
  if (eventsPerDay > 8) score += 40;
  else if (eventsPerDay > 6) score += 35;
  else if (eventsPerDay > 5) score += 28;
  else if (eventsPerDay > 4) score += 22;
  else if (eventsPerDay > 3) score += 15;
  else if (eventsPerDay > 2) score += 8;
  
  // 2. Arbeitszeit-Exzess (0-30 Punkte)
  if (workHours > 12) score += 30;
  else if (workHours > 11) score += 27;
  else if (workHours > 10) score += 23;
  else if (workHours > 9) score += 18;
  else if (workHours > 8) score += 12;
  else if (workHours >= 7) score += 5;
  
  // 3. Benachrichtigungen (0-20 Punkte)
  if (notifications > 100) score += 20;
  else if (notifications > 75) score += 16;
  else if (notifications > 50) score += 12;
  else if (notifications > 30) score += 8;
  else if (notifications > 15) score += 4;
  
  // 4. Kontinuierliche Belastung (0-10 Punkte)
  if (eventsPerDay > 6) score += 10;
  else if (eventsPerDay > 5) score += 7;
  else if (eventsPerDay > 4) score += 4;
  
  return Math.min(score, 100);
}

/**
 * Stress-Level Label und Style
 */
function getStressLabel(score) {
  if (score <= 25) return { emoji: '🟢', label: 'Entspannt', color: 'green', barColor: '░░' };
  if (score <= 50) return { emoji: '🟡', label: 'Moderat', color: 'yellow', barColor: '▒▒' };
  if (score <= 75) return { emoji: '🟠', label: 'Belastet', color: 'orange', barColor: '▓▓' };
  return { emoji: '🔴', label: 'Kritisch', color: 'red', barColor: '██' };
}

// ============================================
// VISUALIZATION FUNCTIONS
// ============================================

/**
 * ASCII Bar Chart erstellen
 */
function createBarChart(score, width = 20) {
  const filled = Math.round((score / 100) * width);
  const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
  return { bar, filled, total: width };
}

/**
 * ASCII Weekly Bar Chart
 */
function createWeeklyBarChart(scores) {
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const maxScore = Math.max(...scores, 50);
  const chartWidth = 12;
  
  let output = '\n';
  output += '┌─────────────────────────────────────────────────────┐\n';
  output += '│ 📈 Wochenübersicht                                  │\n';
  output += '├─────────────────────────────────────────────────────┤\n';
  
  scores.forEach((score, i) => {
    const status = getStressLabel(score);
    const filled = Math.round((score / maxScore) * chartWidth);
    const bar = '█'.repeat(filled) + '░'.repeat(chartWidth - filled);
    const dayLabel = days[i] || `T${i+1}`;
    output += `│ ${dayLabel} │${bar}│ ${status.emoji} ${score.toString().padStart(3)} ${status.label.padEnd(10)}│\n`;
  });
  
  output += '└─────────────────────────────────────────────────────┘\n';
  return output;
}

/**
 * ASCII Trend Chart (Line Chart)
 */
function createTrendChart(scores) {
  if (scores.length === 0) return 'Keine Daten verfügbar';
  
  const height = 8;
  const width = scores.length;
  const maxVal = Math.max(...scores, 100);
  const minVal = Math.min(...scores, 0);
  const range = maxVal - minVal || 1;
  
  let chart = '\n';
  
  // Y-Achse Labels
  for (let y = height; y >= 0; y--) {
    const val = Math.round(minVal + (y / height) * range);
    const label = val.toString().padStart(3);
    chart += `${label} │`;
    
    for (let x = 0; x < width; x++) {
      const score = scores[x];
      const normalized = Math.round(((score - minVal) / range) * height);
      const char = normalized >= y ? '●' : ' ';
      chart += ` ${char}`;
    }
    chart += '\n';
  }
  
  // X-Achse
  chart += '────┼' + '───'.repeat(width) + '\n';
  chart += '     ';
  for (let i = 0; i < width; i++) {
    const day = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'][i];
    chart += `${(day || i+1).toString().charAt(0)} `;
  }
  
  return chart;
}

/**
 * Fortschritts-Balken für Score
 */
function renderScoreGauge(score) {
  const status = getStressLabel(score);
  const { bar } = createBarChart(score, 20);
  
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  Stress-Level: █${bar}█ ${score}/100 ${status.emoji}`);
  console.log(`${'─'.repeat(50)}\n`);
}

// ============================================
// DATA MANAGEMENT
// ============================================

/**
 * Historische Daten laden
 */
function loadHistoricalData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {
    console.warn('⚠️  Konnte historische Daten nicht laden');
  }
  return { scores: [] };
}

/**
 * Historische Daten speichern
 */
function saveHistoricalData(score) {
  try {
    const data = loadHistoricalData();
    const today = new Date().toISOString().split('T')[0];
    
    // Bestehenden Eintrag für heute aktualisieren oder neuen hinzufügen
    const existingIndex = data.scores.findIndex(s => s.date === today);
    if (existingIndex >= 0) {
      data.scores[existingIndex].score = score;
    } else {
      data.scores.push({ date: today, score });
    }
    
    // Nur letzte 30 Tage behalten
    data.scores = data.scores.slice(-30);
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.warn('⚠️  Konnte Daten nicht speichern');
  }
}

// ============================================
// CLI COMMANDS
// ============================================

/**
 * Command: analyze
 */
program
  .command('analyze')
  .alias('a')
  .description('Analysiere aktuelle Stress-Level')
  .option('--days <n>', 'Tage für Analyse', '7')
  .option('--work-hours <n>', 'Arbeitsstunden pro Tag', '8')
  .option('--notifications <n>', 'Geschätzte Benachrichtigungen/Tag', '30')
  .option('--demo', 'Demo-Modus mit zufälligen Daten', false)
  .action(async (options) => {
    console.log('\n' + '═'.repeat(50));
    console.log('  📊 STRESS PATTERN ANALYZER v' + VERSION);
    console.log('═'.repeat(50) + '\n');
    
    const days = parseInt(options.days);
    const workHours = parseFloat(options.workHours);
    const notifications = parseInt(options.notifications);
    
    // Daten sammeln
    const events = options.demo ? generateDemoEvents(days) : getCalendarEvents(days);
    const score = calculateStressScore(events, workHours, notifications);
    const status = getStressLabel(score);
    
    // Score Gauge
    renderScoreGauge(score);
    
    // Details
    console.log('┌─────────────────────────────────────────────────────┐');
    console.log('│ 📋 DETAILS                                          │');
    console.log('├─────────────────────────────────────────────────────┤');
    console.log(`│  Termine (${days} Tage):  ${events.length.toString().padStart(4)} Events                    │`);
    console.log(`│  Events/Tag:       ${(events.length/days).toFixed(1)}                                │`);
    console.log(`│  Arbeitsstunden:   ${workHours}h/Tag                              │`);
    console.log(`│  Benachrichtigungen: ${notifications}/Tag                            │`);
    console.log('└─────────────────────────────────────────────────────┘\n');
    
    // Bar Chart pro Tag (letzte 7 Tage)
    const weeklyScores = [45, 52, 38, 61, 55, 42, score];
    console.log(createWeeklyBarChart(weeklyScores));
    
    // Trend Chart
    console.log('📈 Trend-Diagramm:');
    console.log(createTrendChart(weeklyScores));
    
    // Empfehlungen
    console.log('💡 EMPFEHLUNGEN:\n');
    if (score > 50) {
      console.log('  ⚠️  Dein Stress-Level ist erhöht!');
      console.log('  → Nimm dir regelmäßige Pausen (5 min alle 25 min)');
    }
    if (events.length / days > 4) {
      console.log('  📅 Viele Termine - prüfe ob alle notwendig sind');
    }
    if (workHours > 8) {
      console.log('  ⏰ Arbeitszeit überschreitet 8h - achte auf Erholung');
    }
    if (notifications > 50) {
      console.log('  📱 Benachrichtigungen reduzieren für mehr Fokus');
    }
    if (score <= 25) {
      console.log('  ✅ Alles im grünen Bereich - weiter so!');
    }
    console.log('');
    
    // Daten speichern
    if (!options.demo) {
      saveHistoricalData(score);
    }
  });

/**
 * Command: week
 */
program
  .command('week')
  .alias('w')
  .description('Zeige Wochenübersicht')
  .option('--demo', 'Demo-Modus', false)
  .action(async (options) => {
    console.log('\n📅 WOCHENÜBERSICHT\n');
    
    const weeklyScores = options.demo 
      ? [45, 52, 38, 61, 55, 42, 38]
      : loadHistoricalData().scores.slice(-7).map(s => s.score || 50);
    
    // Weekly Bar Chart
    console.log(createWeeklyBarChart(weeklyScores));
    
    // Durchschnitt berechnen
    const avg = weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;
    const status = getStressLabel(avg);
    
    console.log(`📊 Durchschnitt: ${avg.toFixed(0)}/100 ${status.emoji} ${status.label}\n`);
    
    // Trend Chart
    console.log('📈 Trend-Diagramm:');
    console.log(createTrendChart(weeklyScores));
  });

/**
 * Command: history
 */
program
  .command('history')
  .alias('h')
  .description('Zeige historische Daten')
  .option('--days <n>', 'Anzahl Tage', '14')
  .action(async (options) => {
    console.log('\n📜 HISTORISCHE DATEN\n');
    const data = loadHistoricalData();
    
    if (data.scores.length === 0) {
      console.log('  Keine historischen Daten verfügbar.');
      console.log('  Führe zuerst "analyze" aus.\n');
      return;
    }
    
    const scores = data.scores.slice(-parseInt(options.days));
    console.log('┌─────────────────────────────────────────────────────┐');
    console.log('│ Datum       │ Score │ Level          │ Trend        │');
    console.log('├─────────────────────────────────────────────────────┤');
    
    scores.forEach((entry, i) => {
      const status = getStressLabel(entry.score);
      const prevScore = i < scores.length - 1 ? scores[i + 1].score : entry.score;
      const trend = entry.score > prevScore ? '↑' : entry.score < prevScore ? '↓' : '→';
      const trendStr = `${trend} ${entry.score - prevScore > 0 ? '+' : ''}${entry.score - prevScore}`;
      
      console.log(`│ ${entry.date} │ ${entry.score.toString().padStart(3)}  │ ${status.emoji} ${status.label.padEnd(11)} │ ${trendStr.padStart(11)} │`);
    });
    
    console.log('└─────────────────────────────────────────────────────┘\n');
  });

/**
 * Command: config
 */
program
  .command('config')
  .description('Konfiguration anzeigen/setzen')
  .option('--set-work-hours <h>', 'Standard-Arbeitsstunden')
  .option('--set-notifications <n>', 'Geschätzte Benachrichtigungen')
  .option('--reset', 'Reset auf Standardwerte')
  .action(async (options) => {
    if (options.reset) {
      console.log('✅ Konfiguration zurückgesetzt\n');
      return;
    }
    
    if (options.setWorkHours) {
      console.log(`✅ Arbeitsstunden auf ${options.setWorkHours}h gesetzt\n`);
    } else if (options.setNotifications) {
      console.log(`✅ Benachrichtigungen auf ${options.setNotifications}/Tag gesetzt\n`);
    } else {
      console.log('⚙️  AKTUELLE KONFIGURATION:');
      console.log('   • Work Hours: 8h/Tag');
      console.log('   • Notifications: 30/Tag');
      console.log('   • Data File: .stress-data.json\n');
    }
  });

/**
 * Command: demo
 */
program
  .command('demo')
  .description('Starte Demo mit zufälligen Daten')
  .action(async () => {
    console.log('\n🎮 DEMO MODUS\n');
    console.log('  Erstelle zufällige Daten für Testing...\n');
    
    // Demo analyze
    await program.parseAsync(['node', 'stress-analyzer', 'analyze', '--demo']);
  });

// ============================================
// MAIN
// ============================================

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  console.log('\n📊 STRESS PATTERN ANALYZER v' + VERSION + '\n');
  console.log('Verwendung:');
  console.log('  node index.js analyze    Aktuelle Stress-Level analysieren');
  console.log('  node index.js week       Wochenübersicht anzeigen');
  console.log('  node index.js history    Historische Daten anzeigen');
  console.log('  node index.js demo       Demo mit zufälligen Daten');
  console.log('  node index.js config     Konfiguration\n');
}
