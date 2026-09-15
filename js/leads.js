/**
 * KROME Sports Performance
 * Lead Tracker & Google Sheets / Gmail Webhook Integration
 */

const KROME_GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQDH6HW0SN1mEBoQxcHH2A1zHBe1yppOyBvyd4XsFQSGSJ9pDDijrvSt-pcGRxH1BC/exec';
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
        appUrl: leadData.appUrl || '',
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
        try {
            await fetch(postUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            });
        } catch (scriptErr) {
            console.warn('Apps script direct post notice:', scriptErr);
        }

        // Also sync with local portal server
        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (_) {}

        return true;
    } catch (err) {
        console.error('Error dispatching lead to Google Sheets webhook:', err);
        return false;
    }
}

/**
 * Dispatches 21-Day Jumpstart habit tracker & measurement data
 * to the '21_day' tab on the ksp_leads Google Sheet.
 *
 * @param {Object} trackerData
 * @returns {Promise<{success: boolean, message?: string}>}
 */
async function send21DayTrackerToGoogle(trackerData) {
    const timestamp = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    const payload = {
        action: 'log_21_day',
        tab: '21_day',
        sheetName: '21_day',
        name: trackerData.name || trackerData.fullName || localStorage.getItem('krome_athlete_name') || 'KROME Athlete',
        fullName: trackerData.name || trackerData.fullName || localStorage.getItem('krome_athlete_name') || 'KROME Athlete',
        email: trackerData.email || localStorage.getItem('krome_athlete_email') || '',
        phone: trackerData.phone || '',
        program: '21-Day Bodyweight Jumpstart',
        logType: trackerData.logType || 'Full Habit & Progress Sync',
        currentDay: trackerData.currentDay || 'Day 1-21',
        measurements: trackerData.measurements || {},
        d1Weight: trackerData.measurements ? trackerData.measurements.d1Weight : '',
        d8Weight: trackerData.measurements ? trackerData.measurements.d8Weight : '',
        d15Weight: trackerData.measurements ? trackerData.measurements.d15Weight : '',
        d21Weight: trackerData.measurements ? trackerData.measurements.d21Weight : '',
        weightChange: trackerData.weightChange || '',
        d1Waist: trackerData.measurements ? trackerData.measurements.d1Waist : '',
        d8Waist: trackerData.measurements ? trackerData.measurements.d8Waist : '',
        d15Waist: trackerData.measurements ? trackerData.measurements.d15Waist : '',
        d21Waist: trackerData.measurements ? trackerData.measurements.d21Waist : '',
        d1Hips: trackerData.measurements ? trackerData.measurements.d1Hips : '',
        d21Hips: trackerData.measurements ? trackerData.measurements.d21Hips : '',
        d1Chest: trackerData.measurements ? trackerData.measurements.d1Chest : '',
        d21Chest: trackerData.measurements ? trackerData.measurements.d21Chest : '',
        energy: trackerData.measurements ? trackerData.measurements.energy : '',
        sleep: trackerData.measurements ? trackerData.measurements.sleep : '',
        workoutPct: trackerData.measurements ? trackerData.measurements.workoutPct : '',
        totalHabitsChecked: trackerData.totalHabitsChecked !== undefined ? trackerData.totalHabitsChecked : 0,
        adherencePct: trackerData.adherencePct || '0%',
        todayHabits: trackerData.todayHabits || {},
        notes: trackerData.notes || '',
        rawHabitState: trackerData.rawHabitState || {},
        timestamp: timestamp
    };

    // 1. Local backup
    try {
        const history = JSON.parse(localStorage.getItem('krome_21day_history') || '[]');
        history.unshift({
            timestamp,
            email: payload.email,
            currentDay: payload.currentDay,
            totalHabitsChecked: payload.totalHabitsChecked,
            adherencePct: payload.adherencePct,
            d1Weight: payload.d1Weight,
            d21Weight: payload.d21Weight,
            weightChange: payload.weightChange,
            notes: payload.notes
        });
        localStorage.setItem('krome_21day_history', JSON.stringify(history.slice(0, 50)));
        localStorage.setItem('krome_21day_last_sync_time', timestamp);
    } catch (_) {}

    // 2. Dispatch to Google Apps Script Webhook
    try {
        let postUrl = KROME_GOOGLE_SCRIPT_URL;
        try {
            const urlObj = new URL(KROME_GOOGLE_SCRIPT_URL);
            urlObj.searchParams.append('action', 'log_21_day');
            urlObj.searchParams.append('tab', '21_day');
            if (payload.email) urlObj.searchParams.append('email', payload.email);
            if (payload.name) urlObj.searchParams.append('name', payload.name);
            postUrl = urlObj.toString();
        } catch (_) {}

        await fetch(postUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });

        return { success: true, timestamp, message: 'Logged successfully!' };
    } catch (err) {
        console.warn('Sync notice:', err);
        return { success: false, error: err.toString() };
    }
}

/**
 * Fetches recent 21_day records from Google Sheets for the given email
 */
async function fetch21DayRecordsFromGoogle(email) {
    if (!email) return { success: false, records: [] };
    try {
        const url = `${KROME_GOOGLE_SCRIPT_URL}?action=get_21_day&email=${encodeURIComponent(email.trim().toLowerCase())}`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            return data;
        }
    } catch (err) {
        console.warn('Could not fetch 21_day records directly, checking local cache:', err);
    }

    const local = JSON.parse(localStorage.getItem('krome_21day_history') || '[]');
    return { success: true, records: local, cached: true };
}

window.sendLeadToGoogle = sendLeadToGoogle;
window.send21DayTrackerToGoogle = send21DayTrackerToGoogle;
window.fetch21DayRecordsFromGoogle = fetch21DayRecordsFromGoogle;
window.KROME_GOOGLE_SCRIPT_URL = KROME_GOOGLE_SCRIPT_URL;
window.KROME_CALENDAR_BOOKING_URL = KROME_CALENDAR_BOOKING_URL;
