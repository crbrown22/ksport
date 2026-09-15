/**
 * KROME Sports Performance
 * Strength & Power E-Book Blueprint Interactive App Controller
 * Tracks:
 *  1) Athletic Force & Speed Track (Olympic, Plyometrics, Speed Mechanics)
 *  2) Ryan Brown Hypertrophy Protocol (Developed by Ryan Brown, Owner & Founder of KROME Sports Performance: 
 *     2 Working Sets to Failure, 4-2-4 Cadence, KSP Strength Pillars, Dedicated Recovery Week, No Speed/Plyo, Olympic Optional)
 */

let currentTrackId = 'athletic';
let activeDayId = 1;
let restTimerInterval = null;
let restSecondsRemaining = 0;
let restTimerTotal = 60;
let completedChecklist = {};

// Cadence Pacer State (Ryan Brown 4-2-4 Hypertrophy Protocol)
let cadenceInterval = null;
let cadenceRunning = false;
let cadencePhase = 'idle'; // 'concentric', 'hold', 'eccentric'
let cadenceSecondsInPhase = 0;
let cadenceRepCount = 0;

// Load saved preferences & checklists
try {
    const savedTrack = localStorage.getItem('krome_strength_track_v3') || localStorage.getItem('krome_strength_track_v2');
    if (savedTrack) {
        if (savedTrack === 'athletic') {
            currentTrackId = 'athletic';
        } else if (savedTrack === 'ryan_brown_heavy_duty' || savedTrack === 'mentzer_hit') {
            currentTrackId = 'ryan_brown_heavy_duty';
        }
    }
    const saved = localStorage.getItem('krome_strength_completed_v3') || localStorage.getItem('krome_strength_completed_v2');
    if (saved) {
        completedChecklist = JSON.parse(saved);
    }
} catch (e) {
    completedChecklist = {};
}

function getActiveTrack() {
    if (KROME_STRENGTH_BLUEPRINT.tracks) {
        if (KROME_STRENGTH_BLUEPRINT.tracks[currentTrackId]) {
            return KROME_STRENGTH_BLUEPRINT.tracks[currentTrackId];
        }
        if (currentTrackId === 'ryan_brown_heavy_duty' && KROME_STRENGTH_BLUEPRINT.tracks.mentzer_hit) {
            return KROME_STRENGTH_BLUEPRINT.tracks.mentzer_hit;
        }
    }
    return {
        id: 'athletic',
        name: 'Athletic Force Track',
        badge: 'Athletic Curriculum',
        days: KROME_STRENGTH_BLUEPRINT.days || []
    };
}

function switchTrack(trackId) {
    if (trackId === 'mentzer_hit' || trackId === 'ryan_brown_heavy_duty') {
        currentTrackId = 'ryan_brown_heavy_duty';
    } else {
        currentTrackId = 'athletic';
    }
    activeDayId = 1;
    try {
        localStorage.setItem('krome_strength_track_v3', currentTrackId);
    } catch (e) {}

    if (typeof window.updateAthleteData === 'function') {
        window.updateAthleteData({ strengthTrack: currentTrackId });
    }

    renderTrackSwitcherUI();
    renderDayNavPills();
    renderDay(1);
    updateSidebarTrackInfo();
}

function get1RMValues() {
    const squatInput = parseFloat(document.getElementById('rm-squat')?.value);
    const benchInput = parseFloat(document.getElementById('rm-bench')?.value);
    const deadliftInput = parseFloat(document.getElementById('rm-deadlift')?.value);

    const squat = !isNaN(squatInput) ? squatInput : parseFloat(localStorage.getItem('krome_metric_squat_pr') || '315');
    const bench = !isNaN(benchInput) ? benchInput : parseFloat(localStorage.getItem('krome_metric_bench_pr') || '225');
    const deadlift = !isNaN(deadliftInput) ? deadliftInput : parseFloat(localStorage.getItem('krome_metric_deadlift_pr') || '405');
    const row = Math.round(bench * 0.85);
    return { squat, bench, deadlift, row };
}

function calculateDynamicLoad(item, rms) {
    if (!item.is1RMCalc || !item.wave) return item.load;
    const base = rms[item.calcType] || 0;
    const loads = item.wave.map(pct => `${Math.round(base * pct)} lbs (${Math.round(pct * 100)}%)`);
    return loads.join(' / ');
}

function renderTrackSwitcherUI() {
    const btnAthletic = document.getElementById('btn-track-athletic');
    const btnHeavyDuty = document.getElementById('btn-track-ryan-brown') || document.getElementById('btn-track-hit');
    const badgeAthletic = document.getElementById('track-active-badge');

    if (btnAthletic && btnHeavyDuty) {
        if (currentTrackId === 'athletic') {
            btnAthletic.classList.add('active');
            btnHeavyDuty.classList.remove('active');
            if (badgeAthletic) {
                badgeAthletic.className = 'badge bg-warning text-dark px-3 py-1.5 rounded-pill fw-bold text-uppercase small';
                badgeAthletic.innerHTML = '<i class="fas fa-bolt me-1"></i> Athletic Force Track';
            }
        } else {
            btnHeavyDuty.classList.add('active');
            btnAthletic.classList.remove('active');
            if (badgeAthletic) {
                badgeAthletic.className = 'badge bg-danger text-light px-3 py-1.5 rounded-pill fw-bold text-uppercase small';
                badgeAthletic.innerHTML = '<i class="fas fa-shield-alt me-1"></i> Ryan Brown Hypertrophy Protocol';
            }
        }
    }
}

function renderDayNavPills() {
    const navContainer = document.getElementById('day-nav-pills-container');
    if (!navContainer) return;

    const track = getActiveTrack();
    let html = '';

    track.days.forEach(d => {
        const isActive = d.id === activeDayId;
        const iconClass = getDayIcon(d.id, currentTrackId, d.name);
        const isRecovery = d.id === 5 || d.name.toLowerCase().includes('recovery');
        html += `
            <button class="day-nav-btn ${isActive ? 'active' : ''} ${isRecovery ? 'border-success text-success fw-bold' : ''}" data-day="${d.id}" onclick="renderDay(${d.id})">
                <i class="${iconClass} me-1 ${isRecovery ? 'text-success' : (currentTrackId === 'ryan_brown_heavy_duty' ? 'text-danger' : 'text-warning')}"></i> 
                ${d.name}: ${getShortDayTitle(d.title, currentTrackId, d.name)}
            </button>
        `;
    });

    navContainer.innerHTML = html;
}

function getDayIcon(dayId, trackId, dayName = '') {
    if (dayName.toLowerCase().includes('recovery') || dayId === 5) {
        return 'fas fa-heartbeat';
    }
    if (trackId === 'ryan_brown_heavy_duty' || trackId === 'mentzer_hit') {
        if (dayId === 1) return 'fas fa-dumbbell';
        if (dayId === 2) return 'fas fa-walking';
        if (dayId === 3) return 'fas fa-fist-raised';
        if (dayId === 4) return 'fas fa-fire';
        return 'fas fa-spa';
    }
    if (dayId === 1) return 'fas fa-dumbbell';
    if (dayId === 2) return 'fas fa-bolt';
    if (dayId === 3) return 'fas fa-fire';
    return 'fas fa-running';
}

function getShortDayTitle(fullTitle, trackId, dayName = '') {
    if (dayName.toLowerCase().includes('recovery') || fullTitle.toLowerCase().includes('regeneration')) {
        return 'Active Recovery & Tissue Reset';
    }
    if (trackId === 'ryan_brown_heavy_duty' || trackId === 'mentzer_hit') {
        if (fullTitle.includes('Upper Torso') || fullTitle.includes('Chest')) return 'Upper Torso & KSP Pull';
        if (fullTitle.includes('Lower Body') || fullTitle.includes('Quadriceps')) return 'Lower Body & Nordics';
        if (fullTitle.includes('Deltoids')) return 'Delts & Upper Arms';
        if (fullTitle.includes('Big-4') || fullTitle.includes('Consolidated')) return 'Consolidated Big-4 Heavy Overload';
    }
    if (fullTitle.includes('Lower Body')) return 'Lower Strength & Olympic';
    if (fullTitle.includes('Speed')) return 'Speed & Plyometrics';
    if (fullTitle.includes('Push/Pull')) return 'Upper Push/Pull & Cleans';
    if (fullTitle.includes('Hypertrophy')) return 'Speed Skill & Hypertrophy';
    return fullTitle.substring(0, 24);
}

function renderDay(dayId) {
    activeDayId = dayId;
    const container = document.getElementById('curriculum-container');
    if (!container) return;

    const track = getActiveTrack();
    const day = track.days.find(d => d.id === dayId) || track.days[0];
    if (!day) return;

    // Highlight active nav pill
    document.querySelectorAll('.day-nav-btn').forEach(btn => {
        const id = parseInt(btn.getAttribute('data-day'));
        if (id === dayId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const rms = get1RMValues();
    let totalItems = 0;
    let completedItems = 0;

    // Count day completion with track-scoped keys
    day.modules.forEach(mod => {
        mod.items.forEach(it => {
            totalItems++;
            const key = `${currentTrackId}_day_${day.id}_${it.name.replace(/\s+/g, '_')}`;
            if (completedChecklist[key]) completedItems++;
        });
    });

    const pctComplete = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    const isRecoveryDay = day.id === 5 || day.name.toLowerCase().includes('recovery');

    let html = `
        <div class="day-header-card p-4 rounded-4 mb-4 ${isRecoveryDay ? 'border-success' : ''}">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                    <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                        <span class="badge ${isRecoveryDay ? 'bg-success text-dark' : (currentTrackId === 'ryan_brown_heavy_duty' ? 'bg-danger text-light' : 'bg-warning text-dark')} px-3 py-1.5 rounded-pill fw-bold text-uppercase small">
                            ${track.name} • ${day.name}
                        </span>
                        ${currentTrackId === 'ryan_brown_heavy_duty' ? `
                            <span class="badge bg-dark text-warning border border-warning border-opacity-50 px-2.5 py-1 rounded-pill small">
                                <i class="fas fa-check-circle me-1"></i> 2 Working Sets to Failure • KSP Strength Pillars • Zero Speed/Plyo
                            </span>
                        ` : ''}
                        ${isRecoveryDay ? `
                            <span class="badge bg-dark text-success border border-success border-opacity-50 px-2.5 py-1 rounded-pill small">
                                <i class="fas fa-heartbeat me-1"></i> Deload / Supercompensation Week (Cycle Every 4-6 Weeks)
                            </span>
                        ` : ''}
                    </div>
                    <h2 class="fw-black ${isRecoveryDay ? 'text-success' : 'text-warning'} mt-1 mb-1">${day.title}</h2>
                    <p class="text-secondary small mb-1">${day.focus}</p>
                    ${day.recoveryRecommendation ? `
                        <p class="${isRecoveryDay ? 'text-success' : 'text-info'} small mb-0"><i class="fas fa-bed me-1"></i><strong>Recovery Protocol:</strong> ${day.recoveryRecommendation}</p>
                    ` : ''}
                </div>
                <div class="text-end">
                    <div class="small text-light fw-bold mb-1">Session Progress: <span class="${isRecoveryDay ? 'text-success' : 'text-warning'}">${pctComplete}%</span></div>
                    <div class="progress" style="width: 140px; height: 8px; background: rgba(255,255,255,0.1);">
                        <div class="progress-bar ${isRecoveryDay ? 'bg-success' : (currentTrackId === 'ryan_brown_heavy_duty' ? 'bg-danger' : 'bg-warning')}" role="progressbar" style="width: ${pctComplete}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Special banner if in Ryan Brown Hypertrophy Protocol
    if (currentTrackId === 'ryan_brown_heavy_duty') {
        html += `
            <div class="card bg-dark border-danger border-opacity-50 p-3 mb-4 rounded-3 text-light shadow-sm">
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div class="d-flex align-items-start gap-3">
                        <div class="fs-2 text-danger"><i class="fas fa-shield-alt"></i></div>
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-1">
                                <h6 class="fw-bold text-danger mb-0 text-uppercase" style="letter-spacing: 0.5px;">
                                    The Ryan Brown Hypertrophy Protocol™
                                </h6>
                                <span class="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 px-2 py-0.5 rounded-pill small" style="font-size: 0.7rem;">
                                    KROME Founder Curriculum
                                </span>
                            </div>
                            <p class="text-secondary small mb-0" style="max-width: 720px;">
                                <strong>2 Working Sets to Absolute Failure:</strong> Perform 1-2 light feeder sets to groove the joint, then exactly <strong>TWO all-out working sets</strong> pushed to momentary concentric muscular failure (rest 90–120s between sets). 
                                Adhere to strict <strong>4-2-4 Cadence</strong> (4s eccentric, 2s peak contraction squeeze, 2s concentric lift). Seamlessly blends KSP strength staples (Nordics, Contralateral Step-Ups, Heavy Barbell Rows, RDLs) with zero speed recoil or box plyometrics. Cycle into the <strong>Recovery Week</strong> every 4–6 weeks for total tissue regeneration.
                            </p>
                        </div>
                    </div>
                    <div class="d-flex flex-column gap-2">
                        <button class="btn btn-sm btn-outline-danger rounded-pill fw-bold text-nowrap" onclick="toggleCadencePacerWidget()">
                            <i class="fas fa-stopwatch me-1"></i> 4-2-4 Cadence Metronome
                        </button>
                        <button class="btn btn-sm btn-outline-success rounded-pill fw-bold text-nowrap" onclick="renderDay(5)">
                            <i class="fas fa-heartbeat me-1"></i> View Recovery Week
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    day.modules.forEach((mod) => {
        const catBadgeClass = getCategoryBadgeColor(mod.category);
        const isOptionalModule = mod.category.toLowerCase().includes('optional');
        const isPreExhaustion = mod.category.toLowerCase().includes('pre-exhaustion');
        const isRecoveryModule = mod.category.toLowerCase().includes('cns') || mod.category.toLowerCase().includes('fascial') || mod.category.toLowerCase().includes('parasympathetic') || mod.category.toLowerCase().includes('readiness');

        let moduleRowsHtml = ``;
        let moduleCardsMobileHtml = ``;

        mod.items.forEach((item) => {
            const key = `${currentTrackId}_day_${day.id}_${item.name.replace(/\s+/g, '_')}`;
            const isDone = !!completedChecklist[key];
            const loadDisplay = calculateDynamicLoad(item, rms);
            const isOptionalItem = item.name.includes('[OPTIONAL');

            moduleRowsHtml += `
                <tr class="${isDone ? 'table-row-completed' : ''} ${isOptionalItem ? 'table-row-optional' : ''}">
                    <td class="text-center">
                        <input type="checkbox" class="form-check-input exercise-checkbox" 
                                id="chk_${key}" 
                                data-key="${key}" 
                                ${isDone ? 'checked' : ''} 
                                onchange="toggleExerciseDone('${key}', this.checked)">
                    </td>
                    <td>
                        <label for="chk_${key}" class="fw-bold text-light mb-0 cursor-pointer d-block">
                            ${item.name}
                        </label>
                        ${isOptionalItem ? `
                            <span class="badge bg-secondary text-warning border border-warning border-opacity-50 px-2 py-0.5 rounded-pill small mt-1" style="font-size: 0.7rem;">
                                OPTIONAL TECHNIQUE LIFT
                            </span>
                        ` : ''}
                    </td>
                    <td>
                        <span class="badge ${currentTrackId === 'ryan_brown_heavy_duty' ? 'bg-dark text-danger border border-danger border-opacity-25' : 'bg-dark text-warning border border-warning border-opacity-25'} px-2.5 py-1">
                            ${item.setsReps || mod.defaultSetsReps || 'Prescribed'}
                        </span>
                    </td>
                    <td>
                        <span class="${item.is1RMCalc ? 'text-info fw-bold' : 'text-light'}">
                            ${loadDisplay || 'Bodyweight / Load Match'}
                        </span>
                    </td>
                    <td>
                        <span class="text-secondary small">
                            ${item.notes ? `<i class="fas fa-bullseye me-1 ${currentTrackId === 'ryan_brown_heavy_duty' ? 'text-danger' : 'text-warning'}"></i>${item.notes}` : '<span class="text-muted">—</span>'}
                        </span>
                    </td>
                </tr>
            `;

            moduleCardsMobileHtml += `
                <div class="card bg-black bg-opacity-60 border ${isDone ? 'border-success bg-success bg-opacity-10' : 'border-secondary border-opacity-25'} p-3 mb-2.5 rounded-3 text-start shadow-sm">
                    <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
                        <div class="d-flex align-items-start gap-2.5">
                            <div class="form-check mt-0.5 mb-0">
                                <input type="checkbox" class="form-check-input exercise-checkbox" 
                                        id="chk_mob_${key}" 
                                        data-key="${key}" 
                                        ${isDone ? 'checked' : ''} 
                                        onchange="toggleExerciseDone('${key}', this.checked)" style="transform: scale(1.15);">
                            </div>
                            <div>
                                <label for="chk_mob_${key}" class="fw-bold text-light mb-0 cursor-pointer d-block ${isDone ? 'text-decoration-line-through opacity-75' : ''}" style="font-size: 0.95rem;">
                                    ${item.name}
                                </label>
                                ${isOptionalItem ? `
                                    <span class="badge bg-secondary text-warning border border-warning border-opacity-50 px-2 py-0.5 rounded-pill small mt-1" style="font-size: 0.68rem;">
                                        OPTIONAL TECHNIQUE LIFT
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-wrap gap-2 mb-2">
                        <span class="badge ${currentTrackId === 'ryan_brown_heavy_duty' ? 'bg-dark text-danger border border-danger border-opacity-25' : 'bg-dark text-warning border border-warning border-opacity-25'} px-2.5 py-1 fw-bold" style="font-size: 0.78rem;">
                            <i class="fas fa-layer-group me-1"></i>${item.setsReps || mod.defaultSetsReps || 'Prescribed'}
                        </span>
                        <span class="badge bg-dark ${item.is1RMCalc ? 'text-info border border-info border-opacity-25' : 'text-light border border-secondary border-opacity-25'} px-2.5 py-1" style="font-size: 0.78rem;">
                            <i class="fas fa-weight-hanging me-1"></i>${loadDisplay || 'Bodyweight'}
                        </span>
                    </div>
                    ${item.notes ? `
                        <div class="small text-secondary border-top border-secondary border-opacity-25 pt-2 mt-1">
                            <strong class="${currentTrackId === 'ryan_brown_heavy_duty' ? 'text-danger' : 'text-warning'} small"><i class="fas fa-bullseye me-1"></i>Cue:</strong> ${item.notes}
                        </div>
                    ` : ''}
                </div>
            `;
        });

        html += `
            <div class="curriculum-module-card mb-4 ${isOptionalModule ? 'border-warning border-opacity-50' : (isRecoveryModule ? 'border-success border-opacity-40' : '')}">
                <div class="module-header d-flex align-items-center justify-content-between p-3 flex-wrap gap-2">
                    <div class="d-flex align-items-center gap-2 flex-wrap">
                        <span class="badge ${catBadgeClass} px-3 py-1.5 rounded-pill fw-bold text-uppercase" style="font-size: 0.78rem;">
                            ${mod.category}
                        </span>
                        ${isPreExhaustion ? `
                            <span class="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50 px-2.5 py-1 rounded-pill small">
                                <i class="fas fa-bolt me-1"></i> 0-Second Rest Pre-Exhaustion Superset
                            </span>
                        ` : ''}
                        ${mod.defaultSetsReps ? `<span class="text-light small fw-bold">Prescription: <span class="text-info">${mod.defaultSetsReps}</span></span>` : ''}
                    </div>
                    <span class="text-secondary small d-none d-md-inline">${mod.items.length} movement${mod.items.length > 1 ? 's' : ''}</span>
                </div>
                <!-- Desktop Table -->
                <div class="table-responsive d-none d-md-block">
                    <table class="table table-dark table-hover align-middle mb-0 custom-curriculum-table">
                        <thead>
                            <tr class="table-subheading text-secondary small text-uppercase">
                                <th style="width: 44px;" class="text-center">Done</th>
                                <th>Exercise / Movement</th>
                                <th>Sets & Volume</th>
                                <th>Intensity / Load</th>
                                <th>Ryan Brown Coaching Notes & Cues</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${moduleRowsHtml}
                        </tbody>
                    </table>
                </div>
                <!-- Mobile Stacked Cards (Zero Horizontal Scroll) -->
                <div class="d-block d-md-none p-3">
                    ${moduleCardsMobileHtml}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function getCategoryBadgeColor(cat) {
    const c = cat.toLowerCase();
    if (c.includes('recovery') || c.includes('cns') || c.includes('fascial') || c.includes('parasympathetic') || c.includes('readiness')) return 'bg-success text-dark';
    if (c.includes('pre-exhaustion')) return 'bg-danger text-light';
    if (c.includes('optional')) return 'bg-secondary text-warning';
    if (c.includes('mobility') || c.includes('flexibility') || c.includes('stretch')) return 'bg-success text-dark';
    if (c.includes('prep') || c.includes('warm') || c.includes('acclimation') || c.includes('activation')) return 'bg-info text-dark';
    if (c.includes('power') || c.includes('plyo') || c.includes('olympic') || c.includes('clean')) return 'bg-danger text-light';
    if (c.includes('push') || c.includes('pull') || c.includes('strength') || c.includes('squat') || c.includes('compound') || c.includes('deltoid') || c.includes('quadriceps') || c.includes('hamstrings')) return 'bg-warning text-dark';
    if (c.includes('speed')) return 'bg-primary text-light';
    if (c.includes('esd') || c.includes('core') || c.includes('calves')) return 'bg-warning text-dark';
    return 'bg-secondary text-light';
}

function toggleExerciseDone(key, isChecked) {
    completedChecklist[key] = isChecked;
    try {
        localStorage.setItem('krome_strength_completed_v3', JSON.stringify(completedChecklist));
    } catch (e) {}
    renderDay(activeDayId);
}

function resetDayProgress() {
    const track = getActiveTrack();
    const day = track.days.find(d => d.id === activeDayId);
    if (!day) return;
    if (!confirm(`Reset checkmarks for ${track.name} - ${day.name}?`)) return;

    day.modules.forEach(mod => {
        mod.items.forEach(it => {
            const key = `${currentTrackId}_day_${day.id}_${it.name.replace(/\s+/g, '_')}`;
            delete completedChecklist[key];
        });
    });
    try {
        localStorage.setItem('krome_strength_completed_v3', JSON.stringify(completedChecklist));
    } catch (e) {}
    renderDay(activeDayId);
}

function on1RMChange() {
    const rms = get1RMValues();
    try {
        localStorage.setItem('krome_metric_squat_pr', rms.squat);
        localStorage.setItem('krome_metric_bench_pr', rms.bench);
        localStorage.setItem('krome_metric_deadlift_pr', rms.deadlift);

        // Update metric history log if changed
        const historyStr = localStorage.getItem('krome_metrics_history');
        let historyList = historyStr ? JSON.parse(historyStr) : [];
        const cleanDateStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
        historyList.unshift({ date: cleanDateStr, type: 'Squat PR (lbs)', value: rms.squat });
        historyList.unshift({ date: cleanDateStr, type: 'Bench Press PR (lbs)', value: rms.bench });
        historyList.unshift({ date: cleanDateStr, type: 'Deadlift PR (lbs)', value: rms.deadlift });
        if (historyList.length > 50) historyList = historyList.slice(0, 50);
        localStorage.setItem('krome_metrics_history', JSON.stringify(historyList));
    } catch (e) {}

    if (typeof window.updateAthleteData === 'function') {
        window.updateAthleteData({
            squatPR: rms.squat,
            benchPR: rms.bench,
            deadliftPR: rms.deadlift
        });
    }

    const sqPrev = document.getElementById('sq-preview');
    if (sqPrev) sqPrev.textContent = `65%: ${Math.round(rms.squat * 0.65)} | 75%: ${Math.round(rms.squat * 0.75)}`;
    const bpPrev = document.getElementById('bp-preview');
    if (bpPrev) bpPrev.textContent = `65%: ${Math.round(rms.bench * 0.65)} | 75%: ${Math.round(rms.bench * 0.75)}`;
    const dlPrev = document.getElementById('dl-preview');
    if (dlPrev) dlPrev.textContent = `65%: ${Math.round(rms.deadlift * 0.65)} | 75%: ${Math.round(rms.deadlift * 0.75)}`;

    renderDay(activeDayId);
}

// ----------------------------------------------------
// RYAN BROWN 4-2-4 CADENCE PACER (METRONOME)
// ----------------------------------------------------
function toggleCadencePacerWidget() {
    const el = document.getElementById('cadence-pacer-card');
    if (!el) return;
    if (el.classList.contains('d-none')) {
        el.classList.remove('d-none');
        el.scrollIntoView({ behavior: 'smooth' });
    } else {
        el.classList.add('d-none');
        stopCadencePacer();
    }
}

function startCadencePacer() {
    if (cadenceRunning) return;
    cadenceRunning = true;
    cadencePhase = 'concentric';
    cadenceSecondsInPhase = 2; // 2 sec positive
    updateCadenceUI();

    clearInterval(cadenceInterval);
    cadenceInterval = setInterval(() => {
        cadenceSecondsInPhase--;

        if (cadenceSecondsInPhase <= 0) {
            transitionCadencePhase();
        } else {
            playCadenceClick(440, 0.05);
        }
        updateCadenceUI();
    }, 1000);

    playCadenceClick(880, 0.15); // Start alert
}

function transitionCadencePhase() {
    if (cadencePhase === 'concentric') {
        // Move to Static Hold (2s)
        cadencePhase = 'hold';
        cadenceSecondsInPhase = 2;
        playCadenceClick(660, 0.12);
    } else if (cadencePhase === 'hold') {
        // Move to Eccentric (4s)
        cadencePhase = 'eccentric';
        cadenceSecondsInPhase = 4;
        playCadenceClick(520, 0.12);
    } else if (cadencePhase === 'eccentric') {
        // Completed 1 full rep cycle!
        cadenceRepCount++;
        cadencePhase = 'concentric';
        cadenceSecondsInPhase = 2;
        playCadenceClick(990, 0.2);
    }
}

function pauseCadencePacer() {
    cadenceRunning = false;
    clearInterval(cadenceInterval);
    updateCadenceUI();
}

function stopCadencePacer() {
    cadenceRunning = false;
    clearInterval(cadenceInterval);
    cadencePhase = 'idle';
    cadenceSecondsInPhase = 0;
    cadenceRepCount = 0;
    updateCadenceUI();
}

function resetCadenceRepCount() {
    cadenceRepCount = 0;
    updateCadenceUI();
}

function updateCadenceUI() {
    const phaseLabel = document.getElementById('cadence-phase-label');
    const timerDisplay = document.getElementById('cadence-seconds-display');
    const repCountEl = document.getElementById('cadence-rep-count');
    const startBtn = document.getElementById('cadence-start-btn');
    const pauseBtn = document.getElementById('cadence-pause-btn');
    const bar = document.getElementById('cadence-progress-bar');

    if (!phaseLabel || !timerDisplay) return;

    repCountEl.innerText = cadenceRepCount;

    if (!cadenceRunning && cadencePhase === 'idle') {
        phaseLabel.innerText = "Ready • Press Start to begin Ryan Brown 4-2-4 tempo";
        phaseLabel.className = "text-secondary fw-bold small text-uppercase";
        timerDisplay.innerText = "4-2-4";
        timerDisplay.className = "fs-2 fw-black text-warning font-monospace";
        if (bar) bar.style.width = '0%';
        if (startBtn) startBtn.classList.remove('d-none');
        if (pauseBtn) pauseBtn.classList.add('d-none');
        return;
    }

    if (startBtn && pauseBtn) {
        if (cadenceRunning) {
            startBtn.classList.add('d-none');
            pauseBtn.classList.remove('d-none');
        } else {
            startBtn.classList.remove('d-none');
            pauseBtn.classList.add('d-none');
        }
    }

    if (cadencePhase === 'concentric') {
        phaseLabel.innerText = "▲ LIFT CONCENTRIC (2 SECONDS)";
        phaseLabel.className = "text-info fw-black small text-uppercase";
        timerDisplay.innerText = `${cadenceSecondsInPhase}s`;
        timerDisplay.className = "fs-2 fw-black text-info font-monospace";
        if (bar) {
            bar.className = "progress-bar bg-info progress-bar-striped progress-bar-animated";
            bar.style.width = `${((2 - cadenceSecondsInPhase + 1) / 2) * 100}%`;
        }
    } else if (cadencePhase === 'hold') {
        phaseLabel.innerText = "● STATIC SQUEEZE HOLD (2 SECONDS)";
        phaseLabel.className = "text-warning fw-black small text-uppercase";
        timerDisplay.innerText = `${cadenceSecondsInPhase}s`;
        timerDisplay.className = "fs-2 fw-black text-warning font-monospace";
        if (bar) {
            bar.className = "progress-bar bg-warning progress-bar-striped progress-bar-animated";
            bar.style.width = `${((2 - cadenceSecondsInPhase + 1) / 2) * 100}%`;
        }
    } else if (cadencePhase === 'eccentric') {
        phaseLabel.innerText = "▼ LOWER SLOWLY ECCENTRIC (4 SECONDS)";
        phaseLabel.className = "text-danger fw-black small text-uppercase";
        timerDisplay.innerText = `${cadenceSecondsInPhase}s`;
        timerDisplay.className = "fs-2 fw-black text-danger font-monospace";
        if (bar) {
            bar.className = "progress-bar bg-danger progress-bar-striped progress-bar-animated";
            bar.style.width = `${((4 - cadenceSecondsInPhase + 1) / 4) * 100}%`;
        }
    }
}

function playCadenceClick(freq = 440, duration = 0.05) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {}
}

// ----------------------------------------------------
// REST TIMER
// ----------------------------------------------------
function startRestTimer(seconds) {
    clearInterval(restTimerInterval);
    restTimerTotal = seconds;
    restSecondsRemaining = seconds;
    updateRestTimerUI();

    const display = document.getElementById('rest-timer-wrapper');
    if (display) display.classList.remove('d-none');

    restTimerInterval = setInterval(() => {
        restSecondsRemaining--;
        updateRestTimerUI();

        if (restSecondsRemaining <= 0) {
            clearInterval(restTimerInterval);
            playRestChime();
        }
    }, 1000);
}

function pauseRestTimer() {
    clearInterval(restTimerInterval);
}

function resetRestTimer() {
    clearInterval(restTimerInterval);
    restSecondsRemaining = restTimerTotal;
    updateRestTimerUI();
}

function updateRestTimerUI() {
    const min = Math.floor(restSecondsRemaining / 60);
    const sec = restSecondsRemaining % 60;
    const str = `${min}:${sec < 10 ? '0' : ''}${sec}`;
    const txt = document.getElementById('rest-timer-display');
    if (txt) {
        txt.innerText = str;
        if (restSecondsRemaining <= 5 && restSecondsRemaining > 0) {
            txt.classList.add('text-danger');
            txt.classList.remove('text-warning');
        } else if (restSecondsRemaining === 0) {
            txt.innerText = "GO!";
            txt.classList.add('text-success');
            txt.classList.remove('text-warning', 'text-danger');
        } else {
            txt.classList.remove('text-danger', 'text-success');
            txt.classList.add('text-warning');
        }
    }
}

function playRestChime() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
}

function printCurriculum() {
    window.print();
}

function updateSidebarTrackInfo() {
    const infoContainer = document.getElementById('sidebar-track-principles');
    if (!infoContainer) return;

    if (currentTrackId === 'ryan_brown_heavy_duty' || currentTrackId === 'mentzer_hit') {
        infoContainer.innerHTML = `
            <div class="card bg-dark border-danger border-opacity-25 p-3 rounded-3 mb-3 text-light">
                <div class="d-flex align-items-center gap-2 mb-2">
                    <i class="fas fa-shield-alt text-danger"></i>
                    <h6 class="fw-bold text-danger mb-0 small text-uppercase">The Ryan Brown Hypertrophy Protocol</h6>
                </div>
                <div class="badge bg-danger bg-opacity-20 text-danger border border-danger border-opacity-40 mb-2 px-2 py-1 rounded small">
                    Founder: Ryan Brown (KROME Sports Performance)
                </div>
                <p class="text-secondary small mb-2">
                    Ryan Brown's high-intensity strength & bodybuilding system: Muscle hypertrophy and density are triggered by the <em>intensity</em> of the stimulus, not junk volume.
                </p>
                <ul class="text-light small ps-3 mb-0" style="font-size: 0.82rem;">
                    <li class="mb-1"><strong>2 Working Sets to Failure:</strong> 1-2 light feeder sets, then 2 all-out sets to positive muscular failure.</li>
                    <li class="mb-1"><strong>4-2-4 Cadence:</strong> 4s eccentric down, 2s static squeeze hold, 2s concentric lift.</li>
                    <li class="mb-1"><strong>Pre-Exhaustion Supersets:</strong> Isolation directly into compound with 0 seconds rest.</li>
                    <li class="mb-1"><strong>KSP Strength Pillars:</strong> Integrates Nordic Hamstring Curls, Contralateral Step-Ups, Heavy Rows, and RDLs.</li>
                    <li class="mb-1"><strong>Zero Speed / Plyo:</strong> Directs 100% of adaptive energy into muscle repair.</li>
                    <li class="mb-1"><strong>Mandatory Recovery Week:</strong> Cycle every 4-6 weeks for complete tissue supercompensation.</li>
                </ul>
            </div>
        `;
    } else {
        infoContainer.innerHTML = `
            <div class="card bg-dark border-warning border-opacity-25 p-3 rounded-3 mb-3 text-light">
                <div class="d-flex align-items-center gap-2 mb-2">
                    <i class="fas fa-bolt text-warning"></i>
                    <h6 class="fw-bold text-warning mb-0 small text-uppercase">Athletic Force Principles</h6>
                </div>
                <p class="text-secondary small mb-0">
                    Olympic bar mechanics, wave loading (65-75%), rate of force development (RFD), high-velocity plyometrics, and rotational ESD intervals.
                </p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderTrackSwitcherUI();
    renderDayNavPills();
    renderDay(activeDayId);
    updateSidebarTrackInfo();
});

