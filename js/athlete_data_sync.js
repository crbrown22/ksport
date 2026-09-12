/**
 * KROME Sports Performance
 * Athlete Data Sync - Connects 30-Day Shred, Supplement Protocol & Nutrition Blueprint
 * with the Google Sheets 'Athlete Data' tab
 */

(function () {
    // Determine active authenticated email
    function getAthleteEmail() {
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email') || urlParams.get('athlete');
        if (emailParam) {
            localStorage.setItem('krome_athlete_email', emailParam.trim().toLowerCase());
            return emailParam.trim().toLowerCase();
        }
        const stored = localStorage.getItem('krome_athlete_email');
        return stored ? stored.trim().toLowerCase() : null;
    }

    // Fetch athlete record from API (which reads Athlete Data tab in Google Sheets / store)
    async function fetchAthleteData(email) {
        if (!email) return null;
        try {
            const res = await fetch(`/api/athlete/data?email=${encodeURIComponent(email)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.athlete) {
                    localStorage.setItem('krome_cached_athlete_data', JSON.stringify(data.athlete));
                    return data.athlete;
                }
            }
        } catch (err) {
            console.warn('Could not fetch remote athlete data, checking cache:', err);
        }

        // Fallback to cache if offline
        const cached = localStorage.getItem('krome_cached_athlete_data');
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (parsed.email && parsed.email.toLowerCase() === email.toLowerCase()) {
                    return parsed;
                }
            } catch (_) {}
        }

        return null;
    }

    // Save athlete updates (Shred Day, weight, etc.) back to server and Google Sheet
    async function updateAthleteData(updates) {
        const email = getAthleteEmail();
        if (!email) return false;

        try {
            const res = await fetch('/api/athlete/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, ...updates })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.athlete) {
                    localStorage.setItem('krome_cached_athlete_data', JSON.stringify(data.athlete));
                    return data.athlete;
                }
            }
        } catch (err) {
            console.error('Failed to update athlete progress:', err);
        }
        return false;
    }

    // =========================================================================
    // RENDERER 1: 30-DAY SHRED MANUAL (shred30_manual.html / 30_day_shred.html)
    // =========================================================================
    function renderShredProfile(athlete) {
        const container = document.getElementById('athlete-shred-profile-mount');
        if (!container) return;

        const shredDay = parseInt(athlete.shredDay, 10) || 1;
        const progressPct = Math.min(100, Math.round((shredDay / 30) * 100));
        const lane = athlete.shredLane || 'Lane 2 (2,000 kcal)';
        const curWeight = athlete.currentWeight || '184';
        const goalWeight = athlete.goalWeight || '175';
        const diff = (parseFloat(curWeight) && parseFloat(goalWeight)) 
            ? (parseFloat(curWeight) - parseFloat(goalWeight)).toFixed(1) 
            : null;

        container.classList.remove('d-none');
        container.innerHTML = `
            <div class="card bg-dark border border-warning shadow-lg text-light rounded-4 overflow-hidden mb-4 no-print" style="background: linear-gradient(135deg, #0b0f19 0%, #161f30 100%);">
                <div class="card-header bg-black bg-opacity-50 border-bottom border-warning border-opacity-25 py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold" style="font-size: 0.82rem;">
                            <i class="fas fa-id-badge me-1"></i> ATHLETE DASHBOARD
                        </span>
                        <span class="badge bg-success text-white px-2 py-1 rounded-pill" style="font-size: 0.72rem;">
                            <i class="fas fa-check-circle me-1"></i> Google Sheets 'Athlete Data' Synced
                        </span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="small text-secondary">Logged in as: <strong class="text-light">${athlete.email}</strong></span>
                        <button id="btn-refresh-sheet" class="btn btn-sm btn-outline-light rounded-pill px-2 py-1" style="font-size: 0.75rem;" title="Refresh Data from Google Sheet">
                            <i class="fas fa-sync-alt me-1"></i> Refresh
                        </button>
                    </div>
                </div>

                <div class="card-body p-4">
                    <div class="row g-4 align-items-center">
                        <!-- Athlete Info & Shred Day Progress -->
                        <div class="col-lg-5 border-lg-end border-secondary border-opacity-25 pe-lg-4">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <div>
                                    <h4 class="fw-bold text-white mb-0">${athlete.fullName || 'KROME Athlete'}</h4>
                                    <span class="small text-warning"><i class="fas fa-fire me-1"></i> ${athlete.program || '30-Day Shred Challenge'}</span>
                                </div>
                                <span class="badge bg-dark border border-warning text-warning fs-6 px-3 py-2 rounded-pill">
                                    Day ${shredDay} <span class="text-light fw-normal" style="font-size: 0.75rem;">/ 30</span>
                                </span>
                            </div>

                            <!-- Progress Bar -->
                            <div class="mb-3">
                                <div class="d-flex justify-content-between small text-secondary mb-1">
                                    <span>Program Completion: <strong>${progressPct}%</strong></span>
                                    <span>${30 - shredDay > 0 ? (30 - shredDay) + ' Days Left' : 'Challenge Complete!'}</span>
                                </div>
                                <div class="progress bg-black rounded-pill" style="height: 10px; border: 1px solid rgba(255,212,71,0.3);">
                                    <div class="progress-bar bg-warning text-dark fw-bold" role="progressbar" style="width: ${progressPct}%;" aria-valuenow="${progressPct}" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>

                            <!-- Day Advance / Log Buttons -->
                            <div class="d-flex gap-2">
                                <button id="btn-prev-shred-day" class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 text-light" ${shredDay <= 1 ? 'disabled' : ''}>
                                    <i class="fas fa-chevron-left me-1"></i> Day -1
                                </button>
                                <button id="btn-next-shred-day" class="btn btn-sm btn-warning text-dark fw-bold rounded-pill px-3 py-1 flex-grow-1" ${shredDay >= 30 ? 'disabled' : ''}>
                                    <i class="fas fa-check-circle me-1"></i> Log Day ${shredDay} & Advance +1
                                </button>
                            </div>
                        </div>

                        <!-- Calorie Lane & Weight Tracker -->
                        <div class="col-lg-4 border-lg-end border-secondary border-opacity-25 pe-lg-4">
                            <div class="mb-3">
                                <span class="text-secondary small text-uppercase fw-semibold d-block mb-1">Assigned Calorie Lane</span>
                                <div class="d-flex align-items-center justify-content-between">
                                    <span class="badge bg-warning bg-opacity-10 border border-warning text-warning px-3 py-2 rounded-pill fw-bold fs-6">
                                        <i class="fas fa-bullseye me-1"></i> ${lane}
                                    </span>
                                    <button id="btn-auto-highlight-lane" class="btn btn-sm btn-outline-warning rounded-pill px-2 py-1" style="font-size: 0.75rem;">
                                        <i class="fas fa-filter me-1"></i> Highlight in Recipes
                                    </button>
                                </div>
                            </div>

                            <div class="bg-black bg-opacity-40 p-3 rounded-3 border border-secondary border-opacity-25">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <span class="small text-light"><i class="fas fa-weight-scale me-1 text-warning"></i> Weight Progress</span>
                                    ${diff !== null ? `<span class="badge bg-info text-dark" style="font-size: 0.72rem;">${diff > 0 ? '-' + diff + ' lbs to target' : 'Goal Achieved!'}</span>` : ''}
                                </div>
                                <div class="d-flex align-items-center justify-content-between">
                                    <div>
                                        <span class="fs-5 fw-bold text-white">${curWeight}</span> <span class="small text-secondary">lbs</span>
                                        <span class="text-secondary mx-1">&rarr;</span>
                                        <span class="text-warning fw-bold">${goalWeight}</span> <span class="small text-secondary">lbs goal</span>
                                    </div>
                                    <button id="btn-toggle-weight-input" class="btn btn-sm btn-link text-warning p-0 text-decoration-none small">
                                        <i class="fas fa-pen me-1"></i> Update
                                    </button>
                                </div>
                                <div id="weight-input-container" class="mt-2 d-none">
                                    <div class="input-group input-group-sm">
                                        <input type="number" step="0.5" id="input-new-weight" class="form-control bg-dark text-light border-secondary" placeholder="${curWeight}">
                                        <button id="btn-save-weight" class="btn btn-warning text-dark fw-bold">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Fast Navigation to Linked E-Books -->
                        <div class="col-lg-3">
                            <span class="text-secondary small text-uppercase fw-semibold d-block mb-2">Personalized Protocols</span>
                            <div class="d-flex flex-column gap-2">
                                <a href="supplement_protocol.html" class="btn btn-sm btn-outline-info text-start rounded-3 p-2 d-flex align-items-center justify-content-between">
                                    <div>
                                        <div class="fw-bold text-info small"><i class="fas fa-pills me-1"></i> Supplement Stack</div>
                                        <div class="text-secondary" style="font-size: 0.7rem; max-width: 170px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                            ${athlete.supplementStack || 'View assigned stack'}
                                        </div>
                                    </div>
                                    <i class="fas fa-arrow-right text-info small"></i>
                                </a>

                                <a href="nutrition_blueprint.html" class="btn btn-sm btn-outline-success text-start rounded-3 p-2 d-flex align-items-center justify-content-between">
                                    <div>
                                        <div class="fw-bold text-success small"><i class="fas fa-book-open me-1"></i> Nutrition Blueprint</div>
                                        <div class="text-secondary" style="font-size: 0.7rem; max-width: 170px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                            ${athlete.nutritionMacros || 'View daily macro targets'}
                                        </div>
                                    </div>
                                    <i class="fas fa-arrow-right text-success small"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind interactive events
        setupShredEvents(athlete);
    }

    function setupShredEvents(athlete) {
        // Refresh from sheet
        const refreshBtn = document.getElementById('btn-refresh-sheet');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                refreshBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Syncing...`;
                refreshBtn.disabled = true;
                const fresh = await fetchAthleteData(athlete.email);
                if (fresh) renderShredProfile(fresh);
            });
        }

        // Advance Day
        const nextDayBtn = document.getElementById('btn-next-shred-day');
        if (nextDayBtn) {
            nextDayBtn.addEventListener('click', async () => {
                const cur = parseInt(athlete.shredDay, 10) || 1;
                const newDay = Math.min(30, cur + 1);
                nextDayBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Saving...`;
                nextDayBtn.disabled = true;
                const updated = await updateAthleteData({ shredDay: newDay });
                if (updated) renderShredProfile(updated);
            });
        }

        // Previous Day
        const prevDayBtn = document.getElementById('btn-prev-shred-day');
        if (prevDayBtn) {
            prevDayBtn.addEventListener('click', async () => {
                const cur = parseInt(athlete.shredDay, 10) || 1;
                const newDay = Math.max(1, cur - 1);
                prevDayBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Saving...`;
                prevDayBtn.disabled = true;
                const updated = await updateAthleteData({ shredDay: newDay });
                if (updated) renderShredProfile(updated);
            });
        }

        // Toggle Weight Input
        const toggleWeightBtn = document.getElementById('btn-toggle-weight-input');
        const weightBox = document.getElementById('weight-input-container');
        if (toggleWeightBtn && weightBox) {
            toggleWeightBtn.addEventListener('click', () => {
                weightBox.classList.toggle('d-none');
            });
        }

        // Save New Weight
        const saveWeightBtn = document.getElementById('btn-save-weight');
        const inputWeight = document.getElementById('input-new-weight');
        if (saveWeightBtn && inputWeight) {
            saveWeightBtn.addEventListener('click', async () => {
                const val = inputWeight.value.trim();
                if (!val) return;
                saveWeightBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`;
                saveWeightBtn.disabled = true;
                const updated = await updateAthleteData({ currentWeight: val });
                if (updated) renderShredProfile(updated);
            });
        }

        // Auto Highlight Assigned Calorie Lane in Recipes
        const highlightLaneBtn = document.getElementById('btn-auto-highlight-lane');
        if (highlightLaneBtn) {
            highlightLaneBtn.addEventListener('click', () => {
                const rawLane = (athlete.shredLane || '').toLowerCase();
                let targetLane = '2000';
                if (rawLane.includes('1,600') || rawLane.includes('1600') || rawLane.includes('lane 1')) targetLane = '1600';
                else if (rawLane.includes('2,400') || rawLane.includes('2400') || rawLane.includes('lane 3')) targetLane = '2400';
                else targetLane = '2000';

                // Locate lane toggle button on shred page
                const laneButtons = document.querySelectorAll('#lane-toggle-nav .nav-link, .lane-toggle-btn');
                laneButtons.forEach(btn => {
                    if (btn.innerText.includes(targetLane) || btn.getAttribute('onclick')?.includes(targetLane)) {
                        btn.click();
                    }
                });

                // Smooth scroll to recipe section
                const recSec = document.getElementById('sec-5');
                if (recSec) recSec.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }

    // =========================================================================
    // RENDERER 2: ATHLETE SUPPLEMENT PROTOCOL (supplement_protocol.html)
    // =========================================================================
    function renderSupplementProfile(athlete) {
        const container = document.getElementById('athlete-supp-profile-mount');
        if (!container) return;

        const rawStack = athlete.supplementStack || 'Creatine Monohydrate (5g), Whey Isolate (30g), Vitamin D3 (5,000 IU), Magnesium (400mg), Omega-3 (2,000mg)';
        const supplements = rawStack.split(',').map(s => s.trim()).filter(Boolean);

        container.classList.remove('d-none');
        container.innerHTML = `
            <div class="card bg-dark border border-info shadow-lg text-light rounded-4 overflow-hidden mb-4 no-print" style="background: linear-gradient(135deg, #09131f 0%, #102538 100%);">
                <div class="card-header bg-black bg-opacity-50 border-bottom border-info border-opacity-25 py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-info text-dark px-3 py-2 rounded-pill fw-bold" style="font-size: 0.82rem;">
                            <i class="fas fa-pills me-1"></i> ATHLETE SUPPLEMENT REGIMEN
                        </span>
                        <span class="badge bg-success text-white px-2 py-1 rounded-pill" style="font-size: 0.72rem;">
                            <i class="fas fa-check-circle me-1"></i> Google Sheets 'Athlete Data' Connected
                        </span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="small text-secondary">Athlete: <strong class="text-light">${athlete.email}</strong></span>
                        <button id="btn-supp-refresh" class="btn btn-sm btn-outline-info rounded-pill px-2 py-1" style="font-size: 0.75rem;">
                            <i class="fas fa-sync-alt me-1"></i> Refresh Sheet
                        </button>
                    </div>
                </div>

                <div class="card-body p-4">
                    <div class="row g-4 align-items-center">
                        <div class="col-lg-7">
                            <h4 class="fw-bold text-white mb-1">
                                <i class="fas fa-user-check text-info me-2"></i> ${athlete.fullName || 'KROME Athlete'}
                            </h4>
                            <p class="small text-light opacity-75 mb-3">
                                Customized athletic stack synced from your coaching profile. Click any supplement badge to jump directly to its evidence dosage, timing, and safety analysis:
                            </p>

                            <!-- Supplement Stack Badges -->
                            <div class="d-flex flex-wrap gap-2">
                                ${supplements.map(item => `
                                    <button class="btn btn-sm btn-outline-info rounded-pill px-3 py-2 fw-semibold supp-jump-btn" data-name="${item}">
                                        <i class="fas fa-capsules me-1"></i> ${item}
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Synchronized Program Cross-Reference -->
                        <div class="col-lg-5">
                            <div class="bg-black bg-opacity-40 p-3 rounded-3 border border-info border-opacity-25">
                                <span class="small text-info text-uppercase fw-bold d-block mb-2">
                                    <i class="fas fa-link me-1"></i> Synchronized 30-Day Shred Status
                                </span>
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="text-secondary small">Current Progress:</span>
                                    <span class="badge bg-warning text-dark fw-bold">Day ${athlete.shredDay || 1} of 30</span>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <span class="text-secondary small">Calorie Lane:</span>
                                    <span class="badge bg-dark border border-warning text-warning">${athlete.shredLane || 'Lane 2 (2,000 kcal)'}</span>
                                </div>
                                <div class="d-flex gap-2">
                                    <a href="shred30_manual.html" class="btn btn-sm btn-warning text-dark fw-bold rounded-pill px-3 py-1 flex-grow-1">
                                        <i class="fas fa-fire me-1"></i> Open Shred Manual
                                    </a>
                                    <a href="nutrition_blueprint.html" class="btn btn-sm btn-outline-light rounded-pill px-3 py-1">
                                        <i class="fas fa-book-open me-1"></i> Nutrition
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind Supplement jump events
        const refreshBtn = document.getElementById('btn-supp-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                refreshBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>`;
                refreshBtn.disabled = true;
                const fresh = await fetchAthleteData(athlete.email);
                if (fresh) renderSupplementProfile(fresh);
            });
        }

        document.querySelectorAll('.supp-jump-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.getAttribute('data-name').toLowerCase();
                // Find matching row or section
                const rows = document.querySelectorAll('#supp-master-table tbody tr');
                let found = false;
                rows.forEach(r => {
                    if (r.innerText.toLowerCase().includes(name.split('(')[0].trim().toLowerCase())) {
                        r.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        r.classList.add('table-warning');
                        setTimeout(() => r.classList.remove('table-warning'), 2500);
                        found = true;
                    }
                });
                if (!found) {
                    const tableSec = document.getElementById('sec-5') || document.getElementById('sec-2');
                    if (tableSec) tableSec.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // =========================================================================
    // RENDERER 3: NUTRITION BLUEPRINT (nutrition_blueprint.html)
    // =========================================================================
    function renderBlueprintProfile(athlete) {
        const container = document.getElementById('athlete-blueprint-profile-mount');
        if (!container) return;

        const macros = athlete.nutritionMacros || 'TDEE: 2,350 kcal | P: 195g | C: 220g | F: 65g';
        const curWeight = athlete.currentWeight || '184';
        const goalWeight = athlete.goalWeight || '175';

        container.classList.remove('d-none');
        container.innerHTML = `
            <div class="card bg-dark border border-success shadow-lg text-light rounded-4 overflow-hidden mb-4 no-print" style="background: linear-gradient(135deg, #091a13 0%, #112d22 100%);">
                <div class="card-header bg-black bg-opacity-50 border-bottom border-success border-opacity-25 py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-success text-white px-3 py-2 rounded-pill fw-bold" style="font-size: 0.82rem;">
                            <i class="fas fa-apple-alt me-1"></i> ATHLETE NUTRITION PROFILE
                        </span>
                        <span class="badge bg-success text-white px-2 py-1 rounded-pill" style="font-size: 0.72rem;">
                            <i class="fas fa-check-circle me-1"></i> Google Sheets 'Athlete Data' Connected
                        </span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="small text-secondary">Athlete: <strong class="text-light">${athlete.email}</strong></span>
                        <button id="btn-blueprint-refresh" class="btn btn-sm btn-outline-success rounded-pill px-2 py-1" style="font-size: 0.75rem;">
                            <i class="fas fa-sync-alt me-1"></i> Refresh Sheet
                        </button>
                    </div>
                </div>

                <div class="card-body p-4">
                    <div class="row g-4 align-items-center">
                        <div class="col-lg-7">
                            <h4 class="fw-bold text-white mb-1">
                                <i class="fas fa-user-circle text-success me-2"></i> ${athlete.fullName || 'KROME Athlete'}
                            </h4>
                            <p class="small text-light opacity-75 mb-3">
                                Enrolled in: <strong>${athlete.program || 'Nutrition Blueprint & 30-Day Shred'}</strong>. Your coach-prescribed energy balance and macronutrient targets:
                            </p>

                            <!-- Macro Breakdown Banner -->
                            <div class="p-3 bg-black bg-opacity-40 rounded-3 border border-success border-opacity-25 mb-3">
                                <div class="text-success small fw-bold text-uppercase mb-1"><i class="fas fa-chart-pie me-1"></i> Prescribed Macros from Athlete Data:</div>
                                <div class="fs-5 fw-bold text-white mb-1">${macros}</div>
                                <div class="small text-secondary">
                                    Current Bodyweight: <strong>${curWeight} lbs</strong> | Goal: <strong>${goalWeight} lbs</strong>
                                </div>
                            </div>

                            <button id="btn-populate-worksheet" class="btn btn-sm btn-success text-white fw-bold rounded-pill px-3 py-2 shadow-sm">
                                <i class="fas fa-calculator me-1"></i> Auto-Populate Worksheet with My Sheet Data
                            </button>
                        </div>

                        <!-- 30-Day Shred & Protocol Links -->
                        <div class="col-lg-5">
                            <div class="bg-black bg-opacity-40 p-3 rounded-3 border border-success border-opacity-25">
                                <span class="small text-success text-uppercase fw-bold d-block mb-2">
                                    <i class="fas fa-fire me-1"></i> Linked 30-Day Shred Program
                                </span>
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="text-secondary small">Current Shred Day:</span>
                                    <span class="badge bg-warning text-dark fw-bold">Day ${athlete.shredDay || 1} of 30</span>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <span class="text-secondary small">Shred Calorie Lane:</span>
                                    <span class="badge bg-dark border border-warning text-warning">${athlete.shredLane || 'Lane 2 (2,000 kcal)'}</span>
                                </div>
                                <div class="d-flex gap-2">
                                    <a href="shred30_manual.html" class="btn btn-sm btn-warning text-dark fw-bold rounded-pill px-3 py-1 flex-grow-1">
                                        <i class="fas fa-fire me-1"></i> Open Shred Meals
                                    </a>
                                    <a href="supplement_protocol.html" class="btn btn-sm btn-outline-info rounded-pill px-3 py-1">
                                        <i class="fas fa-pills me-1"></i> Supplements
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind Worksheet Population
        const refreshBtn = document.getElementById('btn-blueprint-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                refreshBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>`;
                refreshBtn.disabled = true;
                const fresh = await fetchAthleteData(athlete.email);
                if (fresh) renderBlueprintProfile(fresh);
            });
        }

        const populateBtn = document.getElementById('btn-populate-worksheet');
        if (populateBtn) {
            populateBtn.addEventListener('click', () => {
                // Populate inputs on worksheet if available
                const weightInput = document.getElementById('ws-weight-lb') || document.getElementById('calc-weight') || document.getElementById('ws-weight');
                if (weightInput && athlete.currentWeight) {
                    weightInput.value = parseFloat(athlete.currentWeight);
                    if (typeof window.updateWeightFromLb === 'function') window.updateWeightFromLb();
                }

                // Scroll to worksheet section
                const wsSec = document.getElementById('sec-6');
                if (wsSec) {
                    wsSec.scrollIntoView({ behavior: 'smooth' });
                    wsSec.classList.add('border-success');
                    setTimeout(() => wsSec.classList.remove('border-success'), 2000);
                }
            });
        }
    }

    // =========================================================================
    // INITIALIZATION DISPATCHER
    // =========================================================================
    async function initAthleteDataSync() {
        const email = getAthleteEmail();
        if (!email) return;

        const athlete = await fetchAthleteData(email);
        if (!athlete) return;

        window.KROME_ACTIVE_ATHLETE = athlete;

        // Dispatch to current page
        const path = window.location.pathname.toLowerCase();
        if (path.includes('shred') || path.includes('30_day_shred')) {
            renderShredProfile(athlete);
        }
        if (path.includes('supplement')) {
            renderSupplementProfile(athlete);
        }
        if (path.includes('nutrition')) {
            renderBlueprintProfile(athlete);
        }
    }

    // Athlete Logout with remote Log Out TIme Stamp recording
    async function athleteLogout() {
        const email = getAthleteEmail();
        if (email) {
            try {
                await fetch('/api/auth/athlete-logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
            } catch (_) {}
        }
        localStorage.removeItem('krome_athlete_email');
        localStorage.removeItem('krome_athlete_name');
        localStorage.removeItem('krome_auth_token');
        localStorage.removeItem('krome_bundle_unlocked');
        localStorage.removeItem('krome_shred_unlocked');
        localStorage.removeItem('krome_protocol_unlocked');
        localStorage.removeItem('krome_blueprint_unlocked');
        localStorage.removeItem('krome_portal_unlocked');
        localStorage.removeItem('krome_cached_athlete_data');
        localStorage.removeItem('krome_shred30_auth');
        window.location.reload();
    }

    // Export global helpers
    window.initAthleteDataSync = initAthleteDataSync;
    window.fetchAthleteData = fetchAthleteData;
    window.updateAthleteData = updateAthleteData;
    window.getAthleteEmail = getAthleteEmail;
    window.athleteLogout = athleteLogout;

    document.addEventListener('DOMContentLoaded', () => {
        // Slight delay to allow base page access check to run
        setTimeout(initAthleteDataSync, 200);
    });
})();
