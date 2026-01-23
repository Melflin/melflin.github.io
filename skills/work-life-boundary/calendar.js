/**
 * Apple Calendar Integration für Work-Life Boundary
 * 
 * Nutzt AppleScript für Calendar.app Kommunikation
 */

const { execSync } = require('child_process');

/**
 * Alle Events von heute abrufen
 * @returns {Array} Array von Event-Objekten
 */
function getTodayEvents() {
  const script = `
    tell application "Calendar"
      tell calendar "Familie"
        set todayEvents to every event whose start date ≥ (current date) and start date < (current date + 1 * days)
        set eventList to {}
        repeat with anEvent in todayEvents
          set eventTitle to summary of anEvent
          set startTime to start date of anEvent
          set endTime to end date of anEvent
          set eventInfo to {title:eventTitle, start:startTime, end:endTime}
          copy eventInfo to end of eventList
        end repeat
        return eventList
      end tell
    end tell
  `;
  
  try {
    const result = execSync(`osascript -e '${script}'`).toString().trim();
    if (!result || result === '{}') return [];
    return JSON.parse(result);
  } catch (e) {
    console.log('📅 Keine Events gefunden oder Calendar nicht verfügbar');
    return [];
  }
}

/**
 * Konflikte zwischen Arbeit und Familien-Zeit finden
 * @param {Object} config - Work-Life Boundary Konfiguration
 * @returns {Array} Array von Konflikten
 */
function findBoundaryConflicts(config) {
  const [hours, minutes] = config.boundaryTime.split(':');
  const boundaryTime = new Date();
  boundaryTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  // Prüfen ob es noch Events nach der Boundary-Zeit gibt
  const script = `
    tell application "Calendar"
      set conflictList to {}
      repeat with aCal in {${config.workCalendars.map(c => `"${c}"`).join(', ')}}
        try
          tell calendar aCal
            set workEvents to every event whose start date ≥ (current date) and start date < (current date + 1 * days)
            repeat with anEvent in workEvents
              set startDt to start date of anEvent
              if startDt ≥ (current date) then
                set eventTitle to summary of anEvent
                set endDt to end date of anEvent
                set eventInfo to {title:eventTitle, start:startDt, end:endDt, calendar:aCal}
                copy eventInfo to end of conflictList
              end if
            end repeat
          end tell
        on error
          -- Calendar nicht gefunden, überspringen
        end try
      end repeat
      return conflictList
    end tell
  `;
  
  try {
    const result = execSync(`osascript -e '${script.replace(/'/g, "\\'")}'`).toString().trim();
    if (!result || result === '{}') return [];
    return JSON.parse(result);
  } catch (e) {
    return [];
  }
}

/**
 * Familien-Zeit schützen - Arbeits-Termine nach Boundary vorschlagen zu löschen
 * @param {Object} config - Work-Life Boundary Konfiguration
 */
function protectFamilyTime(config) {
  const conflicts = findBoundaryConflicts(config);
  if (conflicts.length === 0) {
    return { protected: true, conflicts: [], message: 'Keine Konflikte gefunden' };
  }
  
  const [hours, minutes] = config.boundaryTime.split(':');
  const boundaryTime = new Date();
  boundaryTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  const afterBoundary = conflicts.filter(e => new Date(e.start) > boundaryTime);
  
  if (afterBoundary.length > 0) {
    console.log(`⚠️  ${afterBoundary.length} Arbeits-Termine nach ${config.boundaryTime} gefunden:`);
    afterBoundary.forEach((e, i) => {
      const start = new Date(e.start).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
      console.log(`   ${i+1}. ${start} - ${e.title} (${e.calendar})`);
    });
    
    return {
      protected: false,
      conflicts: afterBoundary,
      message: `${afterBoundary.length} Termine nach Boundary-Zeit`
    };
  }
  
  return { protected: true, conflicts: [], message: 'Familien-Zeit geschützt' };
}

/**
 * Nächsten Familien-Event anzeigen
 * @returns {Object|null} Nächster Familien-Event oder null
 */
function getNextFamilyEvent() {
  const script = `
    tell application "Calendar"
      tell calendar "Familie"
        set futureEvents to every event whose start date > (current date)
        if count of futureEvents > 0 then
          set nextEvent to item 1 of futureEvents
          set eventTitle to summary of nextEvent
          set startTime to start date of nextEvent
          return {title:eventTitle, start:startTime}
        end if
      end tell
    end tell
  `;
  
  try {
    const result = execSync(`osascript -e '${script}'`).toString().trim();
    if (!result || result === '{}') return null;
    return JSON.parse(result);
  } catch (e) {
    return null;
  }
}

module.exports = {
  getTodayEvents,
  findBoundaryConflicts,
  protectFamilyTime,
  getNextFamilyEvent
};
