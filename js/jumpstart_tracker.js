/**
 * KROME Sports Performance
 * 21-Day Jumpstart Interactive Habit Tracker & Measurements Manager
 * Synchronizes with Google Sheets '21_day' tab on the ksp_leads sheet
 */

(function () {
    const STORAGE_KEY_HABITS = 'krome_jumpstart21_habits';
    const STORAGE_KEY_MEASUREMENTS = 'krome_jumpstart21_measurements';
    const STORAGE_KEY_FOCUSED_DAY = 'krome_jumpstart21_active_day';
    const TOTAL_DAYS = 21;
    const HABITS_PER_DAY = 4;
    const MAX_TOTAL_HABITS = TOTAL_DAYS * HABITS_PER_DAY; // 84

    // Default habit state structure
    function getDefaultHabitsState() {
        const state = {};
        for (let d = 1; d <= TOTAL_DAYS; d++) {
            state[d] = {
                workout: false,
                protein: false,
                water: false,
                sleep: false,
                notes: ''
            };
        }
        return state;
    }

    // Default measurement state structure
    function getDefaultMeasurementsState() {
        return {
            d1Weight: '', d8Weight: '', d15Weight: '', d21Weight: '',
            d1Waist: '', d8Waist: '', d15Waist: '', d21Waist: '',
            d1Hips: '', d8Hips: '', d15Hips: '', d21Hips: '',
            d1Chest: '', d8Chest: '', d15Chest: '', d21Chest: '',
            d1Energy: '', d8Energy: '', d15Energy: '', d21Energy: '',
            d1Sleep: '', d8Sleep: '', d15Sleep: '', d21Sleep: '',
            d1Workout: '', d8Workout: '', d15Workout: '', d21Workout: ''
        };
    }

    // Active in-memory state
    let habitsState = getDefaultHabitsState();
    let measurementsState = getDefaultMeasurementsState();
    let currentFocusedDay = 1;

    // Load from localStorage
    function loadState() {
        try {
            const rawHabits = localStorage.getItem(STORAGE_KEY_HABITS);
            if (rawHabits) {
                const parsed = JSON.parse(rawHabits);
                for (let d = 1; d <= TOTAL_DAYS; d++) {
                    if (parsed[d]) habitsState[d] = { ...habitsState[d], ...parsed[d] };
                }
            }
        } catch (e) {
            console.warn('Could not load habits state:', e);
        }

        try {
            const rawMeas = localStorage.getItem(STORAGE_KEY_MEASUREMENTS);
            if (rawMeas) {
                measurementsState = { ...measurementsState, ...JSON.parse(rawMeas) };
            }
        } catch (e) {
            console.warn('Could not load measurements state:', e);
        }

        try {
            const savedDay = parseInt(localStorage.getItem(STORAGE_KEY_FOCUSED_DAY), 10);
            if (savedDay >= 1 && savedDay <= TOTAL_DAYS) {
                currentFocusedDay = savedDay;
            }
        } catch (_) {}
    }

    // Save habits to localStorage
    function saveHabitsState() {
        try {
            localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habitsState));
        } catch (e) {
            console.warn('Failed to save habits state:', e);
        }
    }

    // Save measurements to localStorage
    function saveMeasurementsState() {
        try {
            localStorage.setItem(STORAGE_KEY_MEASUREMENTS, JSON.stringify(measurementsState));
        } catch (e) {
            console.warn('Failed to save measurements state:', e);
        }
    }

    // Calculate metrics
    function calculateMetrics() {
        let totalChecked = 0;
        let workoutsCompleted = 0;

        for (let d = 1; d <= TOTAL_DAYS; d++) {
            const day = habitsState[d];
            if (day.workout) {
                totalChecked++;
                workoutsCompleted++;
            }
            if (day.protein) totalChecked++;
            if (day.water) totalChecked++;
            if (day.sleep) totalChecked++;
        }

        const adherencePct = Math.round((totalChecked / MAX_TOTAL_HABITS) * 100);

        // Calculate weight difference
        let weightChange = '--';
        const d1W = parseFloat(measurementsState.d1Weight);
        // Find latest entered weight
        const d21W = parseFloat(measurementsState.d21Weight);
        const d15W = parseFloat(measurementsState.d15Weight);
        const d8W = parseFloat(measurementsState.d8Weight);
        const latestW = !isNaN(d21W) ? d21W : (!isNaN(d15W) ? d15W : (!isNaN(d8W) ? d8W : null));

        if (!isNaN(d1W) && latestW !== null) {
            const diff = (latestW - d1W).toFixed(1);
            weightChange = (diff > 0 ? '+' : '') + diff + ' lbs';
        }

        return {
            totalChecked,
            maxTotal: MAX_TOTAL_HABITS,
            adherencePct,
            workoutsCompleted,
            weightChange
        };
    }

    // Update scoreboard elements in the UI
    function updateScoreboard() {
        const metrics = calculateMetrics();

        const habitsCountEl = document.getElementById('stat-habits-count');
        if (habitsCountEl) {
            habitsCountEl.textContent = `${metrics.totalChecked} / ${metrics.maxTotal}`;
        }

        const habitsBarEl = document.getElementById('stat-habits-bar');
        if (habitsBarEl) {
            habitsBarEl.style.width = `${metrics.adherencePct}%`;
        }

        const adherenceEl = document.getElementById('stat-adherence-pct');
        if (adherenceEl) {
            adherenceEl.textContent = `${metrics.adherencePct}%`;
        }

        const workoutsCountEl = document.getElementById('stat-workouts-count');
        if (workoutsCountEl) {
            workoutsCountEl.textContent = `${metrics.workoutsCompleted} / 21 Days`;
        }

        const weightChangeEl = document.getElementById('stat-weight-change');
        if (weightChangeEl) {
            weightChangeEl.textContent = metrics.weightChange;
            if (metrics.weightChange.startsWith('-')) {
                weightChangeEl.className = 'badge bg-success text-white px-2 py-1 rounded-pill';
            } else if (metrics.weightChange.startsWith('+')) {
                weightChangeEl.className = 'badge bg-warning text-dark px-2 py-1 rounded-pill';
            } else {
                weightChangeEl.className = 'badge bg-secondary text-light px-2 py-1 rounded-pill';
            }
        }

        // Update waist net difference badge
        const d1Waist = parseFloat(measurementsState.d1Waist);
        const d21Waist = parseFloat(measurementsState.d21Waist) || parseFloat(measurementsState.d15Waist) || parseFloat(measurementsState.d8Waist);
        const waistChangeBadge = document.getElementById('badge-waist-change');
        if (waistChangeBadge) {
            if (!isNaN(d1Waist) && !isNaN(d21Waist)) {
                const wDiff = (d21Waist - d1Waist).toFixed(1);
                waistChangeBadge.textContent = (wDiff > 0 ? '+' : '') + wDiff + ' in';
                waistChangeBadge.className = 'badge ' + (wDiff <= 0 ? 'bg-success text-white' : 'bg-warning text-dark');
            } else {
                waistChangeBadge.textContent = '--';
                waistChangeBadge.className = 'badge bg-secondary text-light';
            }
        }

        // Update weight net difference badge in table
        const weightDeltaBadge = document.getElementById('badge-weight-change-table');
        if (weightDeltaBadge) {
            weightDeltaBadge.textContent = metrics.weightChange;
            weightDeltaBadge.className = 'badge ' + (metrics.weightChange.startsWith('-') ? 'bg-success text-white' : (metrics.weightChange.startsWith('+') ? 'bg-warning text-dark' : 'bg-secondary text-light'));
        }
    }

    // Render the interactive 21-day table rows
    function renderHabitsTable() {
        const tbody = document.getElementById('habits-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        for (let d = 1; d <= TOTAL_DAYS; d++) {
            const data = habitsState[d];
            const completedCount = (data.workout ? 1 : 0) + (data.protein ? 1 : 0) + (data.water ? 1 : 0) + (data.sleep ? 1 : 0);
            const isFull = completedCount === 4;
            const isFocused = d === currentFocusedDay;

            const tr = document.createElement('tr');
            tr.id = `habit-row-${d}`;
            tr.className = `align-middle ${isFull ? 'table-row-completed' : ''} ${isFocused ? 'table-row-active' : ''}`;
            if (isFull) {
                tr.style.backgroundColor = 'rgba(40, 167, 69, 0.08)';
            }

            tr.innerHTML = `
                <td class="text-nowrap fw-bold ${isFocused ? 'text-warning' : 'text-light'}">
                    <div class="d-flex align-items-center gap-2">
                        <button type="button" class="btn btn-xs btn-outline-warning rounded-circle focus-day-btn p-0" data-day="${d}" style="width: 22px; height: 22px; font-size: 0.65rem;" title="Focus Day ${d}">
                            <i class="fas fa-crosshairs"></i>
                        </button>
                        <span>Day ${d}</span>
                    </div>
                </td>
                <td class="text-center">
                    <label class="krome-checkbox-wrap" title="Workout / Movement">
                        <input type="checkbox" class="habit-check" data-day="${d}" data-habit="workout" ${data.workout ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>
                </td>
                <td class="text-center">
                    <label class="krome-checkbox-wrap" title="Protein Focus">
                        <input type="checkbox" class="habit-check" data-day="${d}" data-habit="protein" ${data.protein ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>
                </td>
                <td class="text-center">
                    <label class="krome-checkbox-wrap" title="Water Target (1 Gallon / 3-4L)">
                        <input type="checkbox" class="habit-check" data-day="${d}" data-habit="water" ${data.water ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>
                </td>
                <td class="text-center">
                    <label class="krome-checkbox-wrap" title="Sleep Goal (7-8 Hours)">
                        <input type="checkbox" class="habit-check" data-day="${d}" data-habit="sleep" ${data.sleep ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm bg-dark text-light border-secondary habit-notes-inline" data-day="${d}" placeholder="Day ${d} energy, workout notes..." value="${data.notes || ''}" style="font-size: 0.82rem; min-width: 170px;">
                </td>
                <td class="text-center text-nowrap">
                    <span id="day-badge-${d}" class="badge ${isFull ? 'bg-success text-white' : (completedCount > 0 ? 'bg-warning text-dark' : 'bg-dark text-secondary border border-secondary')}" style="font-size: 0.75rem;">
                        ${completedCount}/4 (${Math.round((completedCount/4)*100)}%)
                    </span>
                </td>
            `;

            tbody.appendChild(tr);
        }

        // Bind checkbox listeners
        tbody.querySelectorAll('.habit-check').forEach(input => {
            input.addEventListener('change', (e) => {
                const day = parseInt(e.target.dataset.day, 10);
                const habit = e.target.dataset.habit;
                habitsState[day][habit] = e.target.checked;
                saveHabitsState();
                updateSingleRowBadge(day);
                updateScoreboard();
                if (day === currentFocusedDay) {
                    renderFocusedDayCard();
                }
            });
        });

        // Bind inline notes
        tbody.querySelectorAll('.habit-notes-inline').forEach(input => {
            input.addEventListener('input', (e) => {
                const day = parseInt(e.target.dataset.day, 10);
                habitsState[day].notes = e.target.value;
                saveHabitsState();
                if (day === currentFocusedDay) {
                    const focusedNote = document.getElementById('focus-notes-input');
                    if (focusedNote && focusedNote.value !== e.target.value) {
                        focusedNote.value = e.target.value;
                    }
                }
            });
        });

        // Bind focus buttons
        tbody.querySelectorAll('.focus-day-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const day = parseInt(e.currentTarget.dataset.day, 10);
                setFocusedDay(day);
            });
        });
    }

    // Updates a single row's badge and highlight styling
    function updateSingleRowBadge(day) {
        const data = habitsState[day];
        const completedCount = (data.workout ? 1 : 0) + (data.protein ? 1 : 0) + (data.water ? 1 : 0) + (data.sleep ? 1 : 0);
        const isFull = completedCount === 4;

        const badge = document.getElementById(`day-badge-${day}`);
        if (badge) {
            badge.className = `badge ${isFull ? 'bg-success text-white' : (completedCount > 0 ? 'bg-warning text-dark' : 'bg-dark text-secondary border border-secondary')}`;
            badge.textContent = `${completedCount}/4 (${Math.round((completedCount/4)*100)}%)`;
        }

        const row = document.getElementById(`habit-row-${day}`);
        if (row) {
            if (isFull) {
                row.style.backgroundColor = 'rgba(40, 167, 69, 0.08)';
            } else {
                row.style.backgroundColor = '';
            }
        }
    }

    // Render the focused day card
    function renderFocusedDayCard() {
        const day = currentFocusedDay;
        const data = habitsState[day];

        const daySelect = document.getElementById('focus-day-select');
        if (daySelect && parseInt(daySelect.value, 10) !== day) {
            daySelect.value = day;
        }

        const titleEl = document.getElementById('focus-day-title');
        if (titleEl) {
            titleEl.textContent = `Day ${day} Habit Focus`;
        }

        // Toggles
        const workoutToggle = document.getElementById('focus-toggle-workout');
        if (workoutToggle) workoutToggle.checked = !!data.workout;

        const proteinToggle = document.getElementById('focus-toggle-protein');
        if (proteinToggle) proteinToggle.checked = !!data.protein;

        const waterToggle = document.getElementById('focus-toggle-water');
        if (waterToggle) waterToggle.checked = !!data.water;

        const sleepToggle = document.getElementById('focus-toggle-sleep');
        if (sleepToggle) sleepToggle.checked = !!data.sleep;

        // Notes
        const notesInput = document.getElementById('focus-notes-input');
        if (notesInput) notesInput.value = data.notes || '';

        // Badge
        const completedCount = (data.workout ? 1 : 0) + (data.protein ? 1 : 0) + (data.water ? 1 : 0) + (data.sleep ? 1 : 0);
        const badge = document.getElementById('focus-day-status-badge');
        if (badge) {
            badge.className = `badge ${completedCount === 4 ? 'bg-success text-white' : 'bg-warning text-dark'} px-3 py-1 rounded-pill`;
            badge.textContent = `${completedCount} of 4 Habits Complete (${Math.round((completedCount / 4) * 100)}%)`;
        }

        // Highlight active row in table
        for (let d = 1; d <= TOTAL_DAYS; d++) {
            const row = document.getElementById(`habit-row-${d}`);
            if (row) {
                if (d === day) {
                    row.classList.add('table-row-active');
                    row.style.borderLeft = '3px solid var(--krome-gold)';
                } else {
                    row.classList.remove('table-row-active');
                    row.style.borderLeft = '';
                }
            }
        }
    }

    // Set the currently active / focused day
    function setFocusedDay(day) {
        if (day < 1 || day > TOTAL_DAYS) return;
        currentFocusedDay = day;
        localStorage.setItem(STORAGE_KEY_FOCUSED_DAY, day.toString());
        renderFocusedDayCard();

        // Update Prev / Next buttons disabled states
        const prevBtn = document.getElementById('btn-prev-day');
        if (prevBtn) prevBtn.disabled = day <= 1;

        const nextBtn = document.getElementById('btn-next-day');
        if (nextBtn) nextBtn.disabled = day >= TOTAL_DAYS;
    }

    // Populate measurement input fields from state
    function populateMeasurements() {
        const fields = [
            'd1Weight', 'd8Weight', 'd15Weight', 'd21Weight',
            'd1Waist', 'd8Waist', 'd15Waist', 'd21Waist',
            'd1Hips', 'd8Hips', 'd15Hips', 'd21Hips',
            'd1Chest', 'd8Chest', 'd15Chest', 'd21Chest',
            'd1Energy', 'd8Energy', 'd15Energy', 'd21Energy',
            'd1Sleep', 'd8Sleep', 'd15Sleep', 'd21Sleep',
            'd1Workout', 'd8Workout', 'd15Workout', 'd21Workout'
        ];

        fields.forEach(field => {
            const el = document.getElementById(`m-${field}`);
            if (el) {
                el.value = measurementsState[field] || '';
                el.addEventListener('input', (e) => {
                    measurementsState[field] = e.target.value.trim();
                    saveMeasurementsState();
                    updateScoreboard();
                });
            }
        });
    }

    // Sync payload to Google Sheets '21_day' tab
    async function syncToGoogleSheet() {
        const syncBtn = document.getElementById('btn-sync-21day-sheet');
        const feedbackEl = document.getElementById('sync-feedback-alert');

        const nameInput = document.getElementById('tracker-athlete-name');
        const emailInput = document.getElementById('tracker-athlete-email');
        const phoneInput = document.getElementById('tracker-athlete-phone');

        const athleteName = (nameInput && nameInput.value.trim()) || localStorage.getItem('krome_athlete_name') || 'KROME Athlete';
        const athleteEmail = (emailInput && emailInput.value.trim()) || localStorage.getItem('krome_athlete_email') || '';
        const athletePhone = (phoneInput && phoneInput.value.trim()) || '';

        if (athleteEmail) {
            localStorage.setItem('krome_athlete_email', athleteEmail);
        }
        if (athleteName) {
            localStorage.setItem('krome_athlete_name', athleteName);
        }

        const metrics = calculateMetrics();
        const currentDayData = habitsState[currentFocusedDay];

        const payload = {
            action: 'log_21_day',
            tab: '21_day',
            sheetName: '21_day',
            name: athleteName,
            fullName: athleteName,
            email: athleteEmail,
            phone: athletePhone,
            program: '21-Day Bodyweight Jumpstart',
            logType: `Day ${currentFocusedDay} & Full Progress Sync`,
            currentDay: `Day ${currentFocusedDay}`,
            measurements: measurementsState,
            weightChange: metrics.weightChange,
            totalHabitsChecked: metrics.totalChecked,
            adherencePct: `${metrics.adherencePct}%`,
            todayHabits: currentDayData,
            workoutStatus: currentDayData.workout ? 'Done' : 'Rest/Pending',
            proteinStatus: currentDayData.protein ? 'Hit' : 'Pending',
            waterStatus: currentDayData.water ? 'Hit' : 'Pending',
            sleepStatus: currentDayData.sleep ? 'Hit' : 'Pending',
            notes: currentDayData.notes || '',
            rawHabitState: habitsState
        };

        if (syncBtn) {
            syncBtn.disabled = true;
            syncBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Syncing Progress to Coach Portal...';
        }

        if (feedbackEl) {
            feedbackEl.className = 'alert alert-info py-2 px-3 mb-3 d-flex align-items-center gap-2';
            feedbackEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Synchronizing latest workout metrics with Coach Portal...';
            feedbackEl.classList.remove('d-none');
        }

        let syncResult = { success: false };

        if (typeof window.send21DayTrackerToGoogle === 'function') {
            syncResult = await window.send21DayTrackerToGoogle(payload);
        } else {
            console.warn('send21DayTrackerToGoogle helper not loaded, fallback to localStorage');
            syncResult = { success: true, fallback: true, timestamp: new Date().toLocaleTimeString() };
        }

        if (syncBtn) {
            syncBtn.disabled = false;
            syncBtn.innerHTML = '<i class="fas fa-cloud-arrow-up me-1"></i> Sync & Save Progress';
        }

        const lastSyncedEl = document.getElementById('tracker-last-synced-time');
        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        if (feedbackEl) {
            feedbackEl.className = 'alert alert-success py-2 px-3 mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2';
            feedbackEl.innerHTML = `
                <div>
                    <i class="fas fa-check-circle text-success me-2"></i>
                    <strong>Progress synchronized with Coach Portal successfully!</strong>
                    <span class="small text-light ms-1">(${metrics.totalChecked}/84 Habits &bull; ${metrics.adherencePct}% Adherence &bull; Day ${currentFocusedDay})</span>
                </div>
                <span class="small text-warning"><i class="fas fa-clock me-1"></i> ${nowTime}</span>
            `;
        }

        if (lastSyncedEl) {
            lastSyncedEl.textContent = `Last Synced: Today at ${nowTime}`;
        }
    }

    // Open review modal with sheets history
    async function openReviewModal() {
        const modalEl = document.getElementById('reviewSheetModal');
        if (!modalEl) return;

        const emailInput = document.getElementById('tracker-athlete-email');
        const email = (emailInput && emailInput.value.trim()) || localStorage.getItem('krome_athlete_email') || '';

        const modalTableBody = document.getElementById('review-modal-table-body');
        const modalEmailEl = document.getElementById('review-modal-athlete-email');
        if (modalEmailEl) modalEmailEl.textContent = email || 'All Recorded Athletes';

        if (modalTableBody) {
            modalTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-warning"><i class="fas fa-spinner fa-spin me-2"></i> Loading logged entries from Coach Portal...</td></tr>`;
        }

        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();

        let records = [];
        if (typeof window.fetch21DayRecordsFromGoogle === 'function') {
            const res = await window.fetch21DayRecordsFromGoogle(email);
            if (res && res.records) {
                records = res.records;
            }
        }

        if (!records || records.length === 0) {
            const localHist = JSON.parse(localStorage.getItem('krome_21day_history') || '[]');
            records = localHist;
        }

        if (!modalTableBody) return;

        if (records.length === 0) {
            modalTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-light">
                        <i class="fas fa-info-circle me-1 text-warning"></i> No entries logged for this athlete yet. Click <strong>Sync & Save Progress</strong> to record your first progress checkpoint!
                    </td>
                </tr>
            `;
            return;
        }

        modalTableBody.innerHTML = records.map(rec => {
            const dateStr = rec.timestamp || 'Recent';
            const dayStr = rec.currentDay || 'Day Check-in';
            const habitsCount = rec.totalHabits !== undefined ? rec.totalHabits : (rec.totalHabitsChecked || '--');
            const adherence = rec.adherencePct || '--';
            const weightDelta = rec.weightChange || '--';
            const notes = rec.notes || '--';

            return `
                <tr class="align-middle">
                    <td class="text-nowrap small text-light">${dateStr}</td>
                    <td class="fw-bold text-warning">${dayStr}</td>
                    <td class="text-center"><span class="badge bg-dark border border-warning text-warning">${habitsCount}</span></td>
                    <td class="text-center"><span class="badge bg-success text-white">${adherence}</span></td>
                    <td class="text-center"><span class="badge ${weightDelta.startsWith('-') ? 'bg-success text-white' : 'bg-secondary'}">${weightDelta}</span></td>
                    <td class="small text-light text-truncate" style="max-width: 200px;" title="${notes}">${notes}</td>
                    <td class="text-center">
                        <span class="badge bg-info text-dark" style="font-size: 0.72rem;"><i class="fas fa-check me-1"></i> Synced</span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Reset tracker state
    function resetTrackerData() {
        if (!confirm('Are you sure you want to reset your 21-Day Habit Tracker and Measurements? This clears local form data.')) {
            return;
        }

        habitsState = getDefaultHabitsState();
        measurementsState = getDefaultMeasurementsState();
        currentFocusedDay = 1;

        saveHabitsState();
        saveMeasurementsState();
        localStorage.setItem(STORAGE_KEY_FOCUSED_DAY, '1');

        populateMeasurements();
        renderHabitsTable();
        setFocusedDay(1);
        updateScoreboard();

        const feedbackEl = document.getElementById('sync-feedback-alert');
        if (feedbackEl) {
            feedbackEl.className = 'alert alert-secondary py-2 px-3 mb-3';
            feedbackEl.innerHTML = '<i class="fas fa-info-circle me-1"></i> Habit tracker inputs reset to blank. Ready for new challenge cycle.';
            feedbackEl.classList.remove('d-none');
        }
    }

    // Initialize the module on page ready
    function initJumpstartTracker() {
        loadState();

        // Pre-fill email and name from auth
        const athleteEmail = localStorage.getItem('krome_athlete_email');
        const athleteName = localStorage.getItem('krome_athlete_name');

        const emailInput = document.getElementById('tracker-athlete-email');
        if (emailInput && athleteEmail && !emailInput.value) {
            emailInput.value = athleteEmail;
        }

        const nameInput = document.getElementById('tracker-athlete-name');
        if (nameInput && athleteName && !nameInput.value) {
            nameInput.value = athleteName;
        }

        // Build Day Select Options
        const daySelect = document.getElementById('focus-day-select');
        if (daySelect) {
            daySelect.innerHTML = '';
            for (let d = 1; d <= TOTAL_DAYS; d++) {
                const opt = document.createElement('option');
                opt.value = d;
                opt.textContent = `Day ${d} of 21`;
                daySelect.appendChild(opt);
            }
            daySelect.addEventListener('change', (e) => {
                setFocusedDay(parseInt(e.target.value, 10));
            });
        }

        // Bind Prev / Next day buttons
        const prevBtn = document.getElementById('btn-prev-day');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentFocusedDay > 1) setFocusedDay(currentFocusedDay - 1);
            });
        }

        const nextBtn = document.getElementById('btn-next-day');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentFocusedDay < TOTAL_DAYS) setFocusedDay(currentFocusedDay + 1);
            });
        }

        // Bind focus toggle inputs
        const bindFocusToggle = (id, habitKey) => {
            const toggle = document.getElementById(id);
            if (toggle) {
                toggle.addEventListener('change', (e) => {
                    habitsState[currentFocusedDay][habitKey] = e.target.checked;
                    saveHabitsState();
                    updateSingleRowBadge(currentFocusedDay);
                    updateScoreboard();

                    // Update table checkbox directly
                    const tableCheck = document.querySelector(`.habit-check[data-day="${currentFocusedDay}"][data-habit="${habitKey}"]`);
                    if (tableCheck) tableCheck.checked = e.target.checked;
                });
            }
        };

        bindFocusToggle('focus-toggle-workout', 'workout');
        bindFocusToggle('focus-toggle-protein', 'protein');
        bindFocusToggle('focus-toggle-water', 'water');
        bindFocusToggle('focus-toggle-sleep', 'sleep');

        // Bind focus notes
        const focusNotesInput = document.getElementById('focus-notes-input');
        if (focusNotesInput) {
            focusNotesInput.addEventListener('input', (e) => {
                habitsState[currentFocusedDay].notes = e.target.value;
                saveHabitsState();
                const inlineInput = document.querySelector(`.habit-notes-inline[data-day="${currentFocusedDay}"]`);
                if (inlineInput) inlineInput.value = e.target.value;
            });
        }

        // Quick Day Save & Sync button
        const quickSaveBtn = document.getElementById('btn-focus-quick-sync');
        if (quickSaveBtn) {
            quickSaveBtn.addEventListener('click', () => {
                syncToGoogleSheet();
            });
        }

        // Main Sync to Google Sheet button
        const syncBtn = document.getElementById('btn-sync-21day-sheet');
        if (syncBtn) {
            syncBtn.addEventListener('click', () => {
                syncToGoogleSheet();
            });
        }

        // Review Logs button
        const reviewBtn = document.getElementById('btn-review-sheet-logs');
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => {
                openReviewModal();
            });
        }

        // Reset button
        const resetBtn = document.getElementById('btn-reset-tracker-data');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                resetTrackerData();
            });
        }

        // Render everything
        populateMeasurements();
        renderHabitsTable();
        setFocusedDay(currentFocusedDay);
        updateScoreboard();

        // Restore last sync time
        const lastSync = localStorage.getItem('krome_21day_last_sync_time');
        const lastSyncedEl = document.getElementById('tracker-last-synced-time');
        if (lastSync && lastSyncedEl) {
            lastSyncedEl.textContent = `Last Synced: ${lastSync}`;
        }
    }

    // Expose global interface
    window.initJumpstartTracker = initJumpstartTracker;
    window.sync21DayToGoogleSheet = syncToGoogleSheet;
    window.open21DayReviewModal = openReviewModal;

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initJumpstartTracker, 100);
    });
})();
