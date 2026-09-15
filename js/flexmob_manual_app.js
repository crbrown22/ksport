/**
 * KROME Sports Performance - Flexibility & Mobility E-Book Manual App Logic
 * Handles interactive workouts, dual tracks, mobile stacked cards, breath pacer, rest timer, and progress persistence.
 */

let currentTrackId = 'athletic_prep';
let currentPhaseNum = 1;
let restTimerInterval = null;
let restTimerSeconds = 0;
let pacerInterval = null;
let pacerSeconds = 4;
let pacerState = 'inhale'; // inhale, hold, exhale

// Initialize App on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
    // Restore saved track preference
    const savedTrack = localStorage.getItem('krome_flexmob_track');
    if (savedTrack && FLEXMOB_TRACKS[savedTrack]) {
        currentTrackId = savedTrack;
    }

    const savedPhase = parseInt(localStorage.getItem('krome_flexmob_phase'), 10);
    if (savedPhase && savedPhase >= 1 && savedPhase <= 4) {
        currentPhaseNum = savedPhase;
    }

    renderApp();
    loadAssessmentScores();
});

function switchTrack(trackId) {
    if (!FLEXMOB_TRACKS[trackId]) return;
    currentTrackId = trackId;
    currentPhaseNum = 1;
    localStorage.setItem('krome_flexmob_track', trackId);
    localStorage.setItem('krome_flexmob_phase', '1');

    // Update button active state UI
    document.querySelectorAll('.track-toggle-btn').forEach(btn => btn.classList.remove('active', 'bg-warning', 'text-dark'));
    const activeBtn = document.getElementById(`btn-track-${trackId}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    renderApp();
}

function selectPhase(phaseNum) {
    currentPhaseNum = phaseNum;
    localStorage.setItem('krome_flexmob_phase', phaseNum.toString());
    renderApp();
}

function renderApp() {
    const track = FLEXMOB_TRACKS[currentTrackId];
    if (!track) return;

    // Update track header labels if present
    const trackTitleEl = document.getElementById('active-track-title');
    if (trackTitleEl) trackTitleEl.textContent = track.title;

    const trackTaglineEl = document.getElementById('active-track-tagline');
    if (trackTaglineEl) trackTaglineEl.textContent = track.tagline;

    // Render Phase Navigation Pills
    renderPhasePills(track);

    // Render Current Phase Days & Workouts
    renderPhaseContent(track);

    // Update Progress Stats
    updateProgressStats();
}

function renderPhasePills(track) {
    const container = document.getElementById('phase-pills-container');
    if (!container) return;

    let html = ``;
    track.phases.forEach(p => {
        const isActive = p.phaseNum === currentPhaseNum;
        html += `
            <button class="btn btn-sm ${isActive ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'} rounded-pill px-3 py-1.5 flex-fill mb-1 text-nowrap"
                    onclick="selectPhase(${p.phaseNum})">
                <i class="fas ${isActive ? 'fa-check-circle' : 'fa-circle'} me-1"></i> Phase ${p.phaseNum}
            </button>
        `;
    });
    container.innerHTML = html;
}

function renderPhaseContent(track) {
    const container = document.getElementById('phase-content-area');
    if (!container) return;

    const phase = track.phases.find(p => p.phaseNum === currentPhaseNum) || track.phases[0];
    if (!phase) return;

    let html = `
        <div class="card bg-dark border-warning border-opacity-25 rounded-4 p-4 mb-4 shadow-lg text-start">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div>
                    <span class="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold text-uppercase small" style="letter-spacing: 0.5px;">
                        Phase ${phase.phaseNum} of 4
                    </span>
                    <h3 class="fw-bold text-warning mb-0 mt-1">${phase.title}</h3>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-warning rounded-pill px-3" onclick="resetActivePhase('${track.id}_p${phase.phaseNum}')">
                        <i class="fas fa-undo me-1"></i> Reset Phase Logs
                    </button>
                </div>
            </div>
            <p class="text-secondary small mb-0 border-start border-warning border-3 ps-3">
                <strong>Phase Protocol Focus:</strong> ${phase.focus}
            </p>
        </div>
    `;

    phase.days.forEach(day => {
        html += `
            <div class="day-card card bg-black bg-opacity-40 border border-secondary border-opacity-25 rounded-4 mb-4 p-3 p-md-4 text-start">
                <div class="day-header border-bottom border-secondary border-opacity-25 pb-3 mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div>
                        <h4 class="fw-bold text-light mb-1">
                            <i class="fas fa-spa me-2 text-warning"></i>${day.dayName}
                        </h4>
                        <div class="text-secondary small">${day.subtitle}</div>
                    </div>
                </div>
        `;

        day.modules.forEach(mod => {
            let moduleRowsHtml = ``;
            let moduleCardsMobileHtml = ``;

            mod.items.forEach(item => {
                const key = `${track.id}_p${phase.phaseNum}_${day.id}_${item.name.replace(/\s+/g, '_')}`;
                const isDone = localStorage.getItem(key) === 'true';

                // Desktop Table Row
                moduleRowsHtml += `
                    <tr class="${isDone ? 'table-success bg-success bg-opacity-10' : ''}">
                        <td class="text-center" style="width: 44px;">
                            <input type="checkbox" class="form-check-input exercise-checkbox" 
                                   id="chk_desk_${key}" 
                                   data-key="${key}" 
                                   ${isDone ? 'checked' : ''} 
                                   onchange="toggleExerciseDone('${key}', this.checked)" style="transform: scale(1.2);">
                        </td>
                        <td>
                            <label for="chk_desk_${key}" class="fw-bold text-light mb-0 cursor-pointer ${isDone ? 'text-decoration-line-through opacity-75' : ''}">
                                ${item.name}
                            </label>
                        </td>
                        <td>
                            <span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2.5 py-1 fw-bold">
                                ${item.setsReps}
                            </span>
                        </td>
                        <td>
                            <span class="badge bg-dark text-info border border-info border-opacity-25 px-2.5 py-1">
                                <i class="fas fa-stopwatch me-1"></i>Rest: ${item.rest || '30s'}
                            </span>
                        </td>
                        <td>
                            <span class="small text-light opacity-90">${item.notes || ''}</span>
                        </td>
                    </tr>
                `;

                // Mobile Stacked Card (Zero Horizontal Scrolling)
                moduleCardsMobileHtml += `
                    <div class="card bg-black bg-opacity-60 border ${isDone ? 'border-success bg-success bg-opacity-10' : 'border-secondary border-opacity-25'} p-3 mb-2.5 rounded-3 text-start shadow-sm">
                        <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
                            <div class="d-flex align-items-start gap-2.5">
                                <div class="form-check mt-0.5 mb-0">
                                    <input type="checkbox" class="form-check-input exercise-checkbox" 
                                           id="chk_mob_${key}" 
                                           data-key="${key}" 
                                           ${isDone ? 'checked' : ''} 
                                           onchange="toggleExerciseDone('${key}', this.checked)" style="transform: scale(1.25);">
                                </div>
                                <div>
                                    <label for="chk_mob_${key}" class="fw-bold text-light mb-0 cursor-pointer d-block ${isDone ? 'text-decoration-line-through opacity-75' : ''}" style="font-size: 0.95rem;">
                                        ${item.name}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex flex-wrap gap-2 mb-2">
                            <span class="badge bg-dark text-warning border border-warning border-opacity-25 px-2.5 py-1 fw-bold" style="font-size: 0.78rem;">
                                <i class="fas fa-clock me-1"></i>${item.setsReps}
                            </span>
                            <span class="badge bg-dark text-info border border-info border-opacity-25 px-2.5 py-1" style="font-size: 0.78rem;">
                                <i class="fas fa-stopwatch me-1"></i>Rest: ${item.rest || '30s'}
                            </span>
                        </div>
                        ${item.notes ? `
                            <div class="small text-secondary border-top border-secondary border-opacity-25 pt-2 mt-1">
                                <strong class="text-warning small"><i class="fas fa-bullseye me-1"></i>Cue:</strong> ${item.notes}
                            </div>
                        ` : ''}
                    </div>
                `;
            });

            html += `
                <div class="module-block mb-4">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="badge bg-dark text-warning border border-warning border-opacity-25 px-3 py-1 rounded-pill fw-bold text-uppercase" style="font-size: 0.78rem;">
                            <i class="fas fa-dumbbell me-1"></i> ${mod.category}
                        </span>
                        <span class="text-secondary small">${mod.items.length} drill${mod.items.length > 1 ? 's' : ''}</span>
                    </div>

                    <!-- Desktop Table -->
                    <div class="table-responsive d-none d-md-block">
                        <table class="table table-dark table-striped align-middle border border-secondary border-opacity-25 rounded mb-0">
                            <thead>
                                <tr class="text-warning small" style="font-size: 0.8rem;">
                                    <th style="width: 44px;" class="text-center">Done</th>
                                    <th>Mobility Drill / Pose</th>
                                    <th>Hold / Prescription</th>
                                    <th>Rest Interval</th>
                                    <th>Coaching Cues & Execution Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${moduleRowsHtml}
                            </tbody>
                        </table>
                    </div>

                    <!-- Mobile Stacked Cards (Zero Horizontal Scroll) -->
                    <div class="d-block d-md-none">
                        ${moduleCardsMobileHtml}
                    </div>
                </div>
            `;
        });

        html += `</div>`;
    });

    container.innerHTML = html;
}

function toggleExerciseDone(key, isDone) {
    if (isDone) {
        localStorage.setItem(key, 'true');
    } else {
        localStorage.removeItem(key);
    }

    // Sync state between mobile & desktop checkboxes with same key
    document.querySelectorAll(`input[data-key="${key}"]`).forEach(input => {
        input.checked = isDone;
    });

    updateProgressStats();

    // Trigger athlete data sync if available
    if (typeof window.updateAthleteData === 'function') {
        const completedCount = getCompletedCount();
        window.updateAthleteData({ flexmob_progress_count: completedCount }).catch(() => {});
    }
}

function getCompletedCount() {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.includes('_p') && localStorage.getItem(k) === 'true') {
            count++;
        }
    }
    return count;
}

function updateProgressStats() {
    const totalCount = 42; // Estimated benchmark drills across phase curriculum
    const doneCount = getCompletedCount();
    const percent = Math.min(100, Math.round((doneCount / totalCount) * 100));

    const countEl = document.getElementById('stat-completed-drills');
    if (countEl) countEl.textContent = doneCount.toString();

    const percentEl = document.getElementById('stat-completion-percent');
    if (percentEl) percentEl.textContent = `${percent}%`;

    const barEl = document.getElementById('stat-progress-bar');
    if (barEl) {
        barEl.style.width = `${percent}%`;
        barEl.setAttribute('aria-valuenow', percent);
    }
}

function resetActivePhase(prefixKey) {
    if (!confirm("Are you sure you want to reset all completed checkboxes for this phase?")) return;

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefixKey)) {
            keysToRemove.push(k);
        }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    renderApp();
}

// REST TIMERS
function startRestTimer(seconds) {
    if (restTimerInterval) clearInterval(restTimerInterval);
    restTimerSeconds = seconds;
    updateRestTimerDisplay();

    const displayContainer = document.getElementById('rest-timer-box');
    if (displayContainer) displayContainer.classList.remove('d-none');

    restTimerInterval = setInterval(() => {
        restTimerSeconds--;
        if (restTimerSeconds <= 0) {
            clearInterval(restTimerInterval);
            restTimerInterval = null;
            restTimerSeconds = 0;
            updateRestTimerDisplay();
            playTimerSound();
        } else {
            updateRestTimerDisplay();
        }
    }, 1000);
}

function updateRestTimerDisplay() {
    const el = document.getElementById('rest-timer-seconds');
    if (!el) return;
    const mins = Math.floor(restTimerSeconds / 60);
    const secs = restTimerSeconds % 60;
    el.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function stopRestTimer() {
    if (restTimerInterval) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;
    }
    restTimerSeconds = 0;
    updateRestTimerDisplay();
}

function playTimerSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
    } catch (_) {}
}

// PARASYMPATHETIC BREATH PACER LOGIC
function togglePacer() {
    const btn = document.getElementById('btn-pacer-toggle');
    if (pacerInterval) {
        clearInterval(pacerInterval);
        pacerInterval = null;
        if (btn) btn.innerHTML = `<i class="fas fa-play me-1"></i> Start Breath Pacer`;
        const circle = document.getElementById('pacer-circle');
        if (circle) circle.innerText = 'PAUSED';
    } else {
        if (btn) btn.innerHTML = `<i class="fas fa-pause me-1"></i> Pause Breath Pacer`;
        runPacerLoop();
    }
}

function runPacerLoop() {
    pacerInterval = setInterval(() => {
        const circle = document.getElementById('pacer-circle');
        const phaseLabel = document.getElementById('pacer-phase');

        if (pacerSeconds > 1) {
            pacerSeconds--;
            if (circle) circle.innerText = pacerSeconds;
        } else {
            if (pacerState === 'inhale') {
                pacerState = 'hold';
                pacerSeconds = 4;
                if (circle) {
                    circle.innerText = '4';
                    circle.className = 'breath-pacer hold';
                }
                if (phaseLabel) phaseLabel.innerText = 'HOLD BREATH IN';
            } else if (pacerState === 'hold') {
                pacerState = 'exhale';
                pacerSeconds = 8;
                if (circle) {
                    circle.innerText = '8';
                    circle.className = 'breath-pacer';
                }
                if (phaseLabel) phaseLabel.innerText = 'SLOW PARASYMPATHETIC EXHALE';
            } else {
                pacerState = 'inhale';
                pacerSeconds = 4;
                if (circle) {
                    circle.innerText = '4';
                    circle.className = 'breath-pacer inhale';
                }
                if (phaseLabel) phaseLabel.innerText = 'DEEP NASAL INHALE';
            }
        }
    }, 1000);
}

function resetPacer() {
    if (pacerInterval) {
        clearInterval(pacerInterval);
        pacerInterval = null;
    }
    pacerState = 'inhale';
    pacerSeconds = 4;
    const btn = document.getElementById('btn-pacer-toggle');
    if (btn) btn.innerHTML = `<i class="fas fa-play me-1"></i> Start Breath Pacer`;
    const circle = document.getElementById('pacer-circle');
    if (circle) {
        circle.innerText = 'READY';
        circle.className = 'breath-pacer';
    }
    const phaseLabel = document.getElementById('pacer-phase');
    if (phaseLabel) phaseLabel.innerText = 'TAP START TO BEGIN LOOP';
}

// MOBILITY ROM ASSESSMENTS LOGIC
function loadAssessmentScores() {
    const container = document.getElementById('assessment-list-container');
    if (!container || typeof FLEXMOB_ASSESSMENTS === 'undefined') return;

    let html = ``;
    FLEXMOB_ASSESSMENTS.forEach(a => {
        const savedVal = localStorage.getItem(`krome_assess_${a.id}`) || '';
        html += `
            <div class="card bg-black bg-opacity-60 border border-secondary border-opacity-25 p-3 mb-3 rounded-3 text-start">
                <div class="d-flex align-items-center justify-content-between mb-1">
                    <h6 class="fw-bold text-warning mb-0">${a.name}</h6>
                    <span class="badge bg-dark text-info border border-info border-opacity-25 px-2 py-0.5 rounded-pill" style="font-size: 0.7rem;">${a.target}</span>
                </div>
                <div class="small text-secondary mb-2">
                    <strong>Benchmark:</strong> ${a.benchmark}
                </div>
                <div class="input-group input-group-sm mb-1">
                    <span class="input-group-text bg-dark text-secondary border-secondary">Score / Result:</span>
                    <input type="text" class="form-control bg-dark text-light border-secondary" 
                           id="input_assess_${a.id}" 
                           value="${savedVal}" 
                           placeholder="e.g. 5.5 inches or Pass" 
                           onchange="saveAssessmentScore('${a.id}', this.value)">
                    <button class="btn btn-warning text-dark fw-bold px-3" onclick="saveAssessmentScore('${a.id}', document.getElementById('input_assess_${a.id}').value)">
                        Save
                    </button>
                </div>
                <div class="small text-muted" style="font-size: 0.75rem;">${a.cue}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function saveAssessmentScore(id, val) {
    if (val !== undefined && val !== null) {
        localStorage.setItem(`krome_assess_${id}`, val.trim());
        alert("Mobility ROM assessment score saved!");
    }
}
