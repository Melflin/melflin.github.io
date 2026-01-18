/**
 * index.js - Meeting Prep Assistant CLI
 * 
 * Auto-generated briefing for upcoming meetings
 */

const { fetchMeetings } = require('./fetch');
const { analyzeContext } = require('./analyze');
const { generateBriefing } = require('./execute');

// CLI Arguments
const args = process.argv.slice(2);
const hoursArg = args.find(a => a.startsWith('--hours='));
const hours = hoursArg ? parseInt(hoursArg.split('=')[1]) : 24;

const formatArg = args.find(a => a.startsWith('--format='));
const format = formatArg ? formatArg.split('=')[1] : 'brief';

const notifyArg = args.find(a => a.startsWith('--notify='));
const notifyTarget = notifyArg ? notifyArg.split('=')[1] : null;

async function main() {
    console.log('📅 Meeting Prep Assistant');
    console.log('=========================\n');
    
    let meetings = [];
    
    try {
        // Fetch upcoming meetings
        meetings = fetchMeetings(hours);
    } catch (error) {
        console.error('❌ Error fetching meetings:', error.message);
        if (notifyTarget) {
            console.log(`[NOTIFY:${notifyTarget}] Fehler beim Abrufen der Meetings: ${error.message}`);
        }
        return;
    }
    
    // ERROR HANDLING: No meetings found
    if (!meetings || meetings.length === 0) {
        const msg = `📅 Keine bevorstehenden Meetings in den nächsten ${hours}h.`;
        console.log(msg);
        if (notifyTarget) {
            console.log(`[NOTIFY:${notifyTarget}] ${msg}`);
        }
        return;
    }
    
    console.log(`✅ Found ${meetings.length} meeting(s) in the next ${hours}h:\n`);
    
    // Process each meeting
    for (let i = 0; i < meetings.length; i++) {
        const meeting = meetings[i];
        
        console.log(`📌 [${i+1}/${meetings.length}] ${meeting.title || 'Untitled'}`);
        console.log(`   Time: ${meeting.start || 'TBD'}`);
        console.log(`   Location: ${meeting.location || 'TBD'}`);
        console.log('');
        
        let context = null;
        try {
            // Analyze context with error handling
            context = await analyzeContext(meeting);
        } catch (error) {
            console.error(`   ⚠️  Error analyzing context for meeting: ${error.message}`);
            context = { emails: [], notes: [], pastMeetings: [], error: error.message };
        }
        
        // Check if context has any useful data
        const hasContext = context && (
            (context.emails && context.emails.length > 0) ||
            (context.notes && context.notes.length > 0) ||
            (context.pastMeetings && context.pastMeetings.length > 0)
        );
        
        if (!hasContext) {
            console.log('   ℹ️  Kein zusätzlicher Context gefunden (keine zugehörigen Emails/Notizen)');
        }
        
        let briefing = null;
        try {
            // Generate briefing (async for AI)
            briefing = await generateBriefing(meeting, context, format);
        } catch (error) {
            console.error(`   ⚠️  Error generating briefing: ${error.message}`);
            briefing = `## 📅 ${meeting.title || 'Untitled Meeting'}\n\n**Fehler bei der Briefing-Generierung**\n\nBitte versuche es erneut oder prüfe die Logs.`;
        }
        
        if (briefing) {
            console.log(briefing);
        }
        
        // Separator between meetings
        if (i < meetings.length - 1) {
            console.log('\n---\n');
        }
    }
    
    console.log('\n✅ Alle Briefings generiert.');
}

main().catch(error => {
    console.error('💥 Unhandled error:', error.message);
    process.exit(1);
});
