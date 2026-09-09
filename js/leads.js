/**
 * KROME Sports Performance
 * Lead Tracker & Google Sheets / Gmail Webhook Integration
 */

const KROME_GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxvJxiPMNYhn4Yo9obWfDaiHtNghefuQ7hXbOiwPMjuZvoPbRrmtTO6qv70TtJDsFH9/exec';
const KROME_CALENDAR_BOOKING_URL = 'https://calendar.app.google/ikECphRQVZif3yUZ8';

/**
 * Dispatches a lead submission payload to Google Apps Script (Sheets + Gmail)
 * and backs up to localStorage.
 *
 * @param {Object} leadData
 * @returns {Promise<boolean>}
 */
async function sendLeadToGoogle(leadData) {
    const timestamp = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    const payload = {
        name: leadData.name || leadData.fullName || '',
        fullName: leadData.name || leadData.fullName || '',
        email: leadData.email || '',
        phone: leadData.phone || '',
        program: leadData.program || leadData.programInterest || leadData.goal || '',
        programInterest: leadData.program || leadData.programInterest || leadData.goal || '',
        preferredContact: leadData.preferredContact || leadData.contactMethod || 'Email',
        experience: leadData.experience || leadData.athleteLevel || leadData.level || '',
        athleteLevel: leadData.experience || leadData.athleteLevel || leadData.level || '',
        message: leadData.message || leadData.goals || '',
        source: leadData.source || window.location.pathname || 'KROME Website',
        timestamp: timestamp
    };

    // 1. Backup to browser local storage
    try {
        const saved = JSON.parse(localStorage.getItem('krome_leads') || '[]');
        saved.unshift({ ...payload, loggedAt: new Date().toISOString() });
        localStorage.setItem('krome_leads', JSON.stringify(saved.slice(0, 100)));
    } catch (e) {
        console.warn('Could not save lead to localStorage:', e);
    }

    // 2. Dispatch to Google Apps Script Webhook
    // Appending query params supports both JSON body parsing (e.postData) and query param parsing (e.parameter)
    try {
        let postUrl = KROME_GOOGLE_SCRIPT_URL;
        try {
            const urlObj = new URL(KROME_GOOGLE_SCRIPT_URL);
            Object.keys(payload).forEach(key => {
                if (payload[key]) {
                    urlObj.searchParams.append(key, payload[key]);
                }
            });
            postUrl = urlObj.toString();
        } catch (_) {
            // Keep default postUrl if URL parsing fails
        }

        // Mode 'no-cors' allows sending to Google Apps Script without CORS blocking in the browser
        await fetch(postUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        return true;
    } catch (err) {
        console.error('Error dispatching lead to Google Sheets webhook:', err);
        return false;
    }
}

window.sendLeadToGoogle = sendLeadToGoogle;
window.KROME_GOOGLE_SCRIPT_URL = KROME_GOOGLE_SCRIPT_URL;
window.KROME_CALENDAR_BOOKING_URL = KROME_CALENDAR_BOOKING_URL;
