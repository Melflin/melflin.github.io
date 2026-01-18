/**
 * fetch.js - Calendar Integration for Meeting Prep Assistant
 * 
 * Fetches upcoming meetings from Apple Calendar using accli
 */

const { execSync, exec } = require('child_process');
const path = require('path');

const ACCLI_PATH = path.join(__dirname, '..', '..', 'GitRepo', 'clawdbot', 'skills', 'accli', 'cli.py');

/**
 * Fetch meetings for the next N hours
 * @param {number} hours - Look ahead period
 * @returns {Array} List of meetings
 */
function fetchMeetings(hours = 24) {
    try {
        const from = new Date().toISOString().split('T')[0];
        const to = new Date(Date.now() + hours * 60 * 60 * 1000)
            .toISOString().split('T')[0];
        
        // Try primary method: accli Python script
        try {
            const output = execSync(
                `python3 "${ACLI_PATH}" events "Kalender" --from ${from} --to ${to} --json`,
                { encoding: 'utf8', timeout: 30000 }
            );
            const meetings = JSON.parse(output);
            return Array.isArray(meetings) ? meetings : [];
        } catch (acliError) {
            // Fallback: accli command
            const output = execSync(
                `accli events "Kalender" --from ${from} --to ${to} --json`,
                { encoding: 'utf8', timeout: 30000 }
            );
            const meetings = JSON.parse(output);
            return Array.isArray(meetings) ? meetings : [];
        }
    } catch (error) {
        // Non-fatal: return empty array, let caller handle it
        console.warn('⚠️  fetchMeetings warning:', error.message);
        return [];
    }
}

/**
 * Get meeting by ID
 * @param {string} meetingId 
 * @returns {Object|null}
 */
function getMeetingById(meetingId) {
    // Placeholder: accli doesn't support ID-based lookup
    // Will implement when needed
    return null;
}

/**
 * Check if calendar access is available
 * @returns {boolean}
 */
function checkCalendarAccess() {
    try {
        const from = new Date().toISOString().split('T')[0];
        execSync(
            `python3 "${ACLI_PATH}" events "Kalender" --from ${from} --to ${from} --json`,
            { encoding: 'utf8', timeout: 10000 }
        );
        return true;
    } catch (error) {
        console.warn('⚠️  Calendar access check failed:', error.message);
        return false;
    }
}

module.exports = { fetchMeetings, getMeetingById, checkCalendarAccess };
