/**
 * KROME Sports Performance - Speed & Conditioning Manual Interactive Engine
 * Controls E-Book drill viewing, category filtering, speed estimators,
 * interval timers, gait checklist, phase navigation, and profile metric sync.
 */

let activeCategory = 'all';
let activePhase = 1;
let currentTimerInterval = null;
let timerWorkSeconds = 10;
let timerRestSeconds = 50;
let currentTimerSeconds = 10;
let isWorkPhase = true;

let currentSelectedWeek = 1;
let currentSelectedDay = 1;

document.addEventListener('DOMContentLoaded', () => {
    initSpeedManualApp();
});

function initSpeedManualApp() {
    renderWeeklyScheduleHub();
    renderCategoryPills();
    renderDrillsGrid();
    renderPhaseCurriculum(1);
    renderGaitChecklist();
    loadProfileSpeedMetrics();
    calculateSpeedPowerOutput();

    // Event listeners
    const calcForm = document.getElementById('speed-calc-form');
    if (calcForm) {
        calcForm.addEventListener('input', calculateSpeedPowerOutput);
    }
}

// =========================================================================
// 1. WEEKS & DAILY OUTLINE SCHEDULE HUB
// =========================================================================
function selectWeek(weekNum) {
    currentSelectedWeek = weekNum;
    currentSelectedDay = 1;
    renderWeeklyScheduleHub();
}

function selectDay(dayNum) {
    currentSelectedDay = dayNum;
    renderWeeklyScheduleHub();
}

function renderWeeklyScheduleHub() {
    const container = document.getElementById('weekly-schedule-mount');
    if (!container) return;

    const blueprint = window.SPEED_CONDITIONING_BLUEPRINT;
    if (!blueprint || !blueprint.weeklySchedule) return;

    const weekData = blueprint.weeklySchedule.find(w => w.week === currentSelectedWeek);
    if (!weekData) return;

    // Build Week Selector Pills (1-12)
    let weekPillsHtml = `<div class="d-flex flex-wrap align-items-center gap-1.5 mb-3">`;
    blueprint.weeklySchedule.forEach(w => {
        const isSelected = w.week === currentSelectedWeek;
        const isCompleted = isWeekFullyCompleted(w.week);

        const btnClass = isSelected
            ? 'btn-warning text-dark fw-bold shadow-sm'
            : (isCompleted ? 'btn-outline-success text-success' : 'btn-outline-secondary text-light opacity-75');

        weekPillsHtml += `
            <button class="btn btn-sm ${btnClass} rounded-pill px-3 py-1.5 transition-all" onclick="selectWeek(${w.week})" style="font-size: 0.82rem;">
                ${isCompleted ? '<i class="fas fa-check-circle me-1"></i>' : ''}W${w.week}
            </button>
        `;
    });
    weekPillsHtml += `</div>`;

    const weekCompletionPct = getWeekCompletionPct(currentSelectedWeek);

    // Day Tabs
    let dayTabsHtml = `<div class="d-flex flex-wrap gap-2 mb-3">`;
    weekData.days.forEach(d => {
        const isDaySelected = d.dayNum === currentSelectedDay;
        const isDayDone = isDayCompleted(currentSelectedWeek, d.dayNum);

        const tabBtnClass = isDaySelected
            ? 'btn-info text-dark fw-bold shadow-sm'
            : (isDayDone ? 'btn-dark text-success border border-success' : 'btn-dark text-light border border-secondary border-opacity-25');

        dayTabsHtml += `
            <button class="btn btn-sm ${tabBtnClass} rounded-3 px-3.5 py-2 text-start transition-all" onclick="selectDay(${d.dayNum})" style="min-width: 140px;">
                <div class="d-flex align-items-center justify-content-between">
                    <span class="fw-bold" style="font-size: 0.85rem;">Day ${d.dayNum}</span>
                    ${isDayDone ? '<i class="fas fa-check-circle text-success ms-2"></i>' : ''}
                </div>
                <small class="d-block text-truncate opacity-75" style="max-width: 130px; font-size: 0.72rem;">${d.dayName.split(':')[1] || d.dayName}</small>
            </button>
        `;
    });
    dayTabsHtml += `</div>`;

    // Active Day Content
    const dayData = weekData.days.find(d => d.dayNum === currentSelectedDay) || weekData.days[0];
    const isCurrentDayDone = isDayCompleted(currentSelectedWeek, dayData.dayNum);

    // Warmup Drills
    let warmupDrills = [];
    blueprint.modules.forEach(mod => {
        mod.drills.forEach(dr => {
            if (dayData.warmup && dayData.warmup.includes(dr.id)) {
                warmupDrills.push(dr);
            }
        });
    });

    // Workout Table Rows & Mobile Cards
    let workoutRowsHtml = ``;
    let workoutCardsMobileHtml = ``;

    dayData.mainWorkout.forEach(item => {
        let drillObj = null;
        blueprint.modules.forEach(mod => {
            mod.drills.forEach(dr => {
                if (dr.id === item.drillId) drillObj = dr;
            });
        });

        const drillName = drillObj ? drillObj.name : item.drillId;
        const drillCategory = drillObj ? drillObj.category : 'Speed Drill';
        const isChecked = localStorage.getItem(`krome_spd_wk${currentSelectedWeek}_d${dayData.dayNum}_dr_${item.drillId}`) === 'true';

        workoutRowsHtml += `
            <tr class="${isChecked ? 'bg-success bg-opacity-10' : ''}">
                <td class="text-center" style="width: 44px;">
                    <div class="form-check m-0 d-flex justify-content-center">
                        <input class="form-check-input mt-0" type="checkbox" id="chk_dr_${currentSelectedWeek}_${dayData.dayNum}_${item.drillId}" ${isChecked ? 'checked' : ''} onchange="toggleWorkoutDrillCheck(${currentSelectedWeek}, ${dayData.dayNum}, '${item.drillId}')" style="cursor: pointer;">
                    </div>
                </td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div>
                            <span class="fw-bold text-white d-block" style="font-size: 0.9rem;">${drillName}</span>
                            <span class="badge bg-dark border border-secondary text-info px-2 py-0.5 rounded-pill" style="font-size: 0.68rem;">${drillCategory}</span>
                        </div>
                        ${drillObj ? `<button class="btn btn-xs btn-outline-warning rounded-circle p-1 ms-1" style="width: 24px; height: 24px; font-size: 0.65rem;" title="View Drill Guide" onclick="openDrillModal('${drillObj.id}')"><i class="fas fa-info"></i></button>` : ''}
                    </div>
                </td>
                <td><span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2.5 py-1 fw-bold" style="font-size: 0.78rem;">${item.prescribed}</span></td>
                <td><span class="small text-info fw-bold">${item.rest}</span></td>
                <td><span class="small text-light opacity-90">${item.note}</span></td>
            </tr>
        `;

        workoutCardsMobileHtml += `
            <div class="card bg-black bg-opacity-60 border ${isChecked ? 'border-success bg-success bg-opacity-10' : 'border-secondary border-opacity-25'} p-3 mb-2.5 rounded-3 text-start shadow-sm">
                <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
                    <div class="d-flex align-items-start gap-2.5">
                        <div class="form-check mt-0.5 mb-0">
                            <input class="form-check-input" type="checkbox" id="chk_dr_mob_${currentSelectedWeek}_${dayData.dayNum}_${item.drillId}" ${isChecked ? 'checked' : ''} onchange="toggleWorkoutDrillCheck(${currentSelectedWeek}, ${dayData.dayNum}, '${item.drillId}')" style="cursor: pointer; transform: scale(1.15);">
                        </div>
                        <div>
                            <span class="fw-bold text-white d-block ${isChecked ? 'text-decoration-line-through opacity-75' : ''}" style="font-size: 0.95rem;">${drillName}</span>
                            <span class="badge bg-dark border border-secondary text-info px-2 py-0.5 rounded-pill" style="font-size: 0.68rem;">${drillCategory}</span>
                        </div>
                    </div>
                    ${drillObj ? `<button class="btn btn-xs btn-outline-warning rounded-pill px-2 py-1 text-nowrap" style="font-size: 0.7rem;" title="View Drill Guide" onclick="openDrillModal('${drillObj.id}')"><i class="fas fa-info-circle me-1"></i>Guide</button>` : ''}
                </div>
                <div class="d-flex flex-wrap gap-2 mb-2">
                    <span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2.5 py-1 fw-bold" style="font-size: 0.78rem;">
                        <i class="fas fa-layer-group me-1"></i>${item.prescribed}
                    </span>
                    <span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-2.5 py-1 fw-bold" style="font-size: 0.78rem;">
                        <i class="fas fa-stopwatch me-1"></i>${item.rest}
                    </span>
                </div>
                <div class="small text-light opacity-90 border-top border-secondary border-opacity-25 pt-2 mt-1">
                    <strong class="text-warning small"><i class="fas fa-lightbulb me-1"></i>Cue:</strong> ${item.note}
                </div>
            </div>
        `;
    });

    let html = `
        <div class="dashboard-card accent-border-gold mb-4 p-4">
            <!-- Header Banner -->
            <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 pb-3 mb-3 border-bottom border-secondary border-opacity-25">
                <div>
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <span class="badge bg-warning text-dark fw-bold px-3 py-1 rounded-pill" style="font-size: 0.75rem;">
                            ${weekData.phaseName}
                        </span>
                        <span class="badge bg-dark border border-warning text-warning fw-bold px-3 py-1 rounded-pill" style="font-size: 0.75rem;">
                            Week ${weekData.week} of 12
                        </span>
                    </div>
                    <h3 class="fw-black text-white mb-1" style="font-weight: 800; font-size: 1.6rem;">${weekData.title}</h3>
                    <p class="text-secondary small mb-0" style="max-width: 720px;">${weekData.objective}</p>
                </div>
                <div class="text-md-end bg-black bg-opacity-40 p-3 rounded-3 border border-secondary border-opacity-25 min-w-160">
                    <small class="text-secondary d-block" style="font-size: 0.7rem;">WEEK ${weekData.week} PROGRESS</small>
                    <div class="d-flex align-items-center justify-content-md-end gap-2 mt-1">
                        <div class="progress flex-grow-1" style="height: 6px; width: 90px; background-color: rgba(255,255,255,0.1);">
                            <div class="progress-bar bg-warning" style="width: ${weekCompletionPct}%;"></div>
                        </div>
                        <span class="fw-bold text-warning small">${weekCompletionPct}%</span>
                    </div>
                </div>
            </div>

            <!-- Week Selector Pills -->
            <div class="mb-3">
                <small class="text-warning fw-bold text-uppercase d-block mb-2" style="font-size: 0.72rem; letter-spacing: 0.5px;">
                    <i class="fas fa-calendar-alt me-1"></i> Select Program Week (1-12):
                </small>
                ${weekPillsHtml}
            </div>

            <!-- Day Selector Tabs -->
            <div class="mb-3">
                <small class="text-info fw-bold text-uppercase d-block mb-2" style="font-size: 0.72rem; letter-spacing: 0.5px;">
                    <i class="fas fa-running me-1"></i> Daily Training Outline:
                </small>
                ${dayTabsHtml}
            </div>

            <!-- Selected Day Detail Card -->
            <div class="card bg-black bg-opacity-60 border border-secondary border-opacity-25 rounded-4 overflow-hidden">
                <div class="card-header bg-dark bg-opacity-80 py-3 px-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 border-bottom border-secondary border-opacity-25">
                    <div>
                        <h4 class="fw-bold text-warning mb-1" style="font-size: 1.25rem;">
                            <i class="fas fa-stopwatch me-2 text-info"></i> ${dayData.dayName}
                        </h4>
                        <p class="text-light opacity-90 small mb-0"><strong>Primary Focus:</strong> ${dayData.focus}</p>
                    </div>
                    <button class="btn btn-sm ${isCurrentDayDone ? 'btn-success text-white' : 'btn-outline-warning'} rounded-pill px-4 py-2 fw-bold transition-all" onclick="toggleDayCompleted(${currentSelectedWeek}, ${dayData.dayNum})">
                        <i class="fas ${isCurrentDayDone ? 'fa-check-circle' : 'fa-circle'} me-1"></i>
                        ${isCurrentDayDone ? 'Day Completed!' : 'Mark Day Complete'}
                    </button>
                </div>

                <div class="card-body p-4">
                    <!-- Warmup Section -->
                    ${warmupDrills.length > 0 ? `
                        <div class="p-3 mb-4 rounded-3 bg-dark bg-opacity-60 border border-info border-opacity-25">
                            <h6 class="text-info fw-bold mb-2" style="font-size: 0.85rem;">
                                <i class="fas fa-fire-alt me-1"></i> DYNAMIC MOVEMENT PREP WARM-UP PROTOCOL (10 MIN):
                            </h6>
                            <div class="d-flex flex-wrap gap-2">
                                ${warmupDrills.map(w => `
                                    <button class="btn btn-xs btn-outline-info rounded-pill px-3 py-1" onclick="openDrillModal('${w.id}')">
                                        <i class="fas fa-play-circle me-1"></i> ${w.name}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Main Session Workout (Desktop Table & Mobile Stacked Cards) -->
                    <h6 class="text-warning fw-bold mb-3" style="font-size: 0.88rem;">
                        <i class="fas fa-dumbbell me-1"></i> MAIN HIGH-VELOCITY SPRINT & PLYO WORKOUT:
                    </h6>
                    <!-- Desktop Session Table (d-none d-md-block) -->
                    <div class="table-responsive d-none d-md-block">
                        <table class="table table-dark table-striped align-middle border border-secondary border-opacity-25 rounded-3 mb-0">
                            <thead>
                                <tr class="text-warning small" style="font-size: 0.78rem;">
                                    <th class="text-center">DONE</th>
                                    <th>EXERCISE / DRILL</th>
                                    <th>PRESCRIBED VOLUME</th>
                                    <th>RECOVERY INTERVAL</th>
                                    <th>COACHING EXECUTION CUE</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${workoutRowsHtml}
                            </tbody>
                        </table>
                    </div>

                    <!-- Mobile Workout Stacked Cards (d-block d-md-none) - Zero Horizontal Scrolling -->
                    <div class="d-block d-md-none">
                        ${workoutCardsMobileHtml}
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function toggleWorkoutDrillCheck(week, day, drillId) {
    const key = `krome_spd_wk${week}_d${day}_dr_${drillId}`;
    const curr = localStorage.getItem(key) === 'true';
    localStorage.setItem(key, curr ? 'false' : 'true');
    renderWeeklyScheduleHub();
}

function toggleDayCompleted(week, day) {
    const key = `krome_spd_wk${week}_d${day}_completed`;
    const curr = localStorage.getItem(key) === 'true';
    localStorage.setItem(key, curr ? 'false' : 'true');

    const blueprint = window.SPEED_CONDITIONING_BLUEPRINT;
    if (blueprint && blueprint.weeklySchedule) {
        const wk = blueprint.weeklySchedule.find(w => w.week === week);
        if (wk) {
            const d = wk.days.find(dy => dy.dayNum === day);
            if (d && d.mainWorkout) {
                d.mainWorkout.forEach(item => {
                    localStorage.setItem(`krome_spd_wk${week}_d${day}_dr_${item.drillId}`, (!curr) ? 'true' : 'false');
                });
            }
        }
    }

    renderWeeklyScheduleHub();
}

function isDayCompleted(week, day) {
    return localStorage.getItem(`krome_spd_wk${week}_d${day}_completed`) === 'true';
}

function isWeekFullyCompleted(week) {
    const blueprint = window.SPEED_CONDITIONING_BLUEPRINT;
    if (!blueprint || !blueprint.weeklySchedule) return false;
    const wk = blueprint.weeklySchedule.find(w => w.week === week);
    if (!wk) return false;
    return wk.days.every(d => isDayCompleted(week, d.dayNum));
}

function getWeekCompletionPct(week) {
    const blueprint = window.SPEED_CONDITIONING_BLUEPRINT;
    if (!blueprint || !blueprint.weeklySchedule) return 0;
    const wk = blueprint.weeklySchedule.find(w => w.week === week);
    if (!wk) return 0;
    const completedCount = wk.days.filter(d => isDayCompleted(week, d.dayNum)).length;
    return Math.round((completedCount / wk.days.length) * 100);
}

// =========================================================================
// 2. DRILLS & CATEGORIES
// =========================================================================
function renderCategoryPills() {
    const container = document.getElementById('speed-category-pills');
    if (!container) return;

    const blueprint = window.SPEED_CONDITIONING_BLUEPRINT;
    if (!blueprint) return;

    let html = `
        <button class="btn btn-sm ${activeCategory === 'all' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light'} rounded-pill px-3 py-1.5 me-2 mb-2" onclick="filterSpeedDrills('all')">
            <i class="fas fa-th-large me-1"></i> All Modules (${getAllDrillsCount()})
        </button>
    `;

    blueprint.modules.forEach(mod => {
        const isActive = activeCategory === mod.id;
        const btnClass = isActive ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-light';
        html += `
            <button class="btn btn-sm ${btnClass} rounded-pill px-3 py-1.5 me-2 mb-2" onclick="filterSpeedDrills('${mod.id}')">
                <i class="${mod.icon} me-1 ${isActive ? '' : mod.color}"></i> ${mod.name} (${mod.drills.length})
            </button>
        `;
    });

    container.innerHTML = html;
}

function getAllDrillsCount() {
    const blueprint = window.SPEED_CONDITIONING_BLUEPRINT;
    if (!blueprint) return 0;
    return blueprint.modules.reduce((sum, mod) => sum + mod.drills.length, 0);
}

function filterSpeedDrills(catId) {
    activeCategory = catId;
    renderCategoryPills();
    renderDrillsGrid();
}

function renderDrillsGrid() {
    const container = document.getElementById('speed-drills-container');
    if (!container) return;

    const blueprint = window.SPEED_CONDITIONING_BLUEPRINT;
    if (!blueprint) return;

    let drillsToRender = [];
    blueprint.modules.forEach(mod => {
        if (activeCategory === 'all' || activeCategory === mod.id) {
            mod.drills.forEach(d => {
                drillsToRender.push({ ...d, moduleName: mod.name, moduleIcon: mod.icon, moduleColor: mod.color });
            });
        }
    });

    if (drillsToRender.length === 0) {
        container.innerHTML = `<div class="alert alert-dark text-center py-4 text-muted">No drills found in this category.</div>`;
        return;
    }

    let html = `<div class="row g-3">`;
    drillsToRender.forEach(drill => {
        html += `
            <div class="col-md-6 col-lg-4">
                <div class="card bg-dark border border-secondary border-opacity-25 rounded-4 h-100 shadow-sm hover-border-warning transition-all" style="background: #14171f !important;">
                    <div class="card-header bg-black bg-opacity-40 border-bottom border-secondary border-opacity-25 py-3 px-3 d-flex align-items-center justify-content-between">
                        <span class="badge bg-dark border border-secondary text-light small px-2 py-1 rounded-pill" style="font-size: 0.7rem;">
                            <i class="${drill.moduleIcon} ${drill.moduleColor} me-1"></i> ${drill.category}
                        </span>
                        <span class="text-warning small fw-bold">${drill.setsReps}</span>
                    </div>
                    <div class="card-body p-3 d-flex flex-column justify-content-between">
                        <div>
                            <h5 class="fw-bold text-white mb-2" style="font-size: 1.05rem;">
                                ${drill.name}
                            </h5>
                            <p class="text-secondary small mb-3 line-clamp-2" style="font-size: 0.82rem; line-height: 1.45;">
                                ${drill.notes}
                            </p>
                        </div>
                        <div>
                            <div class="bg-black bg-opacity-50 p-2 rounded-3 mb-3 border border-secondary border-opacity-10">
                                <small class="text-warning d-block fw-bold" style="font-size: 0.7rem;">KEY FOCUS:</small>
                                <small class="text-light" style="font-size: 0.78rem;">${drill.focus}</small>
                            </div>
                            <div class="d-flex align-items-center justify-content-between pt-1">
                                <span class="small text-muted"><i class="fas fa-clock me-1 text-info"></i> ${drill.rest}</span>
                                <button class="btn btn-sm btn-outline-warning rounded-pill px-3 py-1" onclick="openDrillModal('${drill.id}')">
                                    <i class="fas fa-eye me-1"></i> Drill Guide
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    html += `</div>`;

    container.innerHTML = html;
}

function openDrillModal(drillId) {
    const blueprint = window.SPEED_CONDITIONING_BLUEPRINT;
    if (!blueprint) return;

    let targetDrill = null;
    let targetMod = null;

    blueprint.modules.forEach(mod => {
        mod.drills.forEach(d => {
            if (d.id === drillId) {
                targetDrill = d;
                targetMod = mod;
            }
        });
    });

    if (!targetDrill) return;

    const modalTitle = document.getElementById('drillModalLabel');
    const modalBody = document.getElementById('drillModalBody');
    if (!modalTitle || !modalBody) return;

    modalTitle.innerHTML = `<i class="${targetMod.icon} ${targetMod.color} me-2"></i> ${targetDrill.name}`;

    modalBody.innerHTML = `
        <div class="mb-3">
            <span class="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold me-2" style="font-size: 0.78rem;">
                ${targetDrill.category}
            </span>
            <span class="badge bg-dark border border-warning text-warning px-3 py-1 rounded-pill" style="font-size: 0.78rem;">
                ${targetDrill.setsReps} &bull; ${targetDrill.rest}
            </span>
        </div>

        <div class="card bg-black bg-opacity-60 border border-secondary border-opacity-25 p-3 rounded-3 mb-3 text-start">
            <h6 class="text-warning fw-bold mb-1" style="font-size: 0.85rem;"><i class="fas fa-bullseye me-1"></i> BIOMECHANICAL FOCUS:</h6>
            <p class="text-light small mb-0">${targetDrill.focus}</p>
        </div>

        <div class="card bg-black bg-opacity-60 border border-secondary border-opacity-25 p-3 rounded-3 mb-3 text-start">
            <h6 class="text-info fw-bold mb-1" style="font-size: 0.85rem;"><i class="fas fa-clipboard-list me-1"></i> COACHING INSTRUCTIONS & EXECUTION:</h6>
            <p class="text-light small mb-0" style="line-height: 1.6;">${targetDrill.notes}</p>
        </div>

        <div class="row g-2 text-start">
            <div class="col-6">
                <div class="p-2.5 rounded-3 bg-dark border border-secondary border-opacity-25 text-center">
                    <small class="text-secondary d-block" style="font-size: 0.7rem;">INTENSITY PARAMETER</small>
                    <span class="fw-bold text-warning small">100% Explosive Intent</span>
                </div>
            </div>
            <div class="col-6">
                <div class="p-2.5 rounded-3 bg-dark border border-secondary border-opacity-25 text-center">
                    <small class="text-secondary d-block" style="font-size: 0.7rem;">RECOVERY INTERVAL</small>
                    <span class="fw-bold text-info small">${targetDrill.rest}</span>
                </div>
            </div>
        </div>
    `;

    const modalEl = document.getElementById('drillModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }
}

// =========================================================================
// 2. PHASE & CURRICULUM NAVIGATION
// =========================================================================
function showBlock(phaseNum) {
    activePhase = phaseNum;
    document.querySelectorAll('.workout-week-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById(`btn-block${phaseNum}`);
    if (btn) btn.classList.add('active');

    renderPhaseCurriculum(phaseNum);
}

function renderPhaseCurriculum(phaseNum) {
    const container = document.getElementById('phase-curriculum-mount');
    if (!container) return;

    const blueprint = window.SPEED_CONDITIONING_BLUEPRINT;
    if (!blueprint) return;

    const phaseData = blueprint.curriculumPhases.find(p => p.phase === phaseNum);
    if (!phaseData) return;

    // Collect drills in this phase
    let phaseDrillObjects = [];
    blueprint.modules.forEach(mod => {
        mod.drills.forEach(d => {
            if (phaseData.drills.includes(d.id)) {
                phaseDrillObjects.push(d);
            }
        });
    });

    let phaseRowsHtml = ``;
    let phaseMobileCardsHtml = ``;

    phaseDrillObjects.forEach(d => {
        phaseRowsHtml += `
            <tr>
                <td>
                    <span class="fw-bold text-white d-block" style="font-size: 0.9rem;">${d.name}</span>
                    <span class="badge bg-dark text-info border border-info border-opacity-25 px-2 py-0.5 rounded-pill" style="font-size: 0.68rem;">${d.category}</span>
                </td>
                <td><span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2.5 py-1 fw-bold">${d.setsReps}</span></td>
                <td><span class="small text-info">${d.rest}</span></td>
                <td><span class="small text-light opacity-90">${d.notes}</span></td>
            </tr>
        `;

        phaseMobileCardsHtml += `
            <div class="card bg-black bg-opacity-60 border border-secondary border-opacity-25 p-3 mb-2 rounded-3 text-start">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="fw-bold text-white d-block" style="font-size: 0.95rem;">${d.name}</span>
                    <span class="badge bg-dark text-info border border-info border-opacity-25 px-2 py-0.5 rounded-pill" style="font-size: 0.68rem;">${d.category}</span>
                </div>
                <div class="d-flex flex-wrap gap-2 mb-2">
                    <span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2.5 py-1 fw-bold" style="font-size: 0.78rem;">
                        <i class="fas fa-layer-group me-1"></i>Volume: ${d.setsReps}
                    </span>
                    <span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-2.5 py-1 fw-bold" style="font-size: 0.78rem;">
                        <i class="fas fa-stopwatch me-1"></i>Rest: ${d.rest}
                    </span>
                </div>
                <div class="small text-light opacity-90 border-top border-secondary border-opacity-25 pt-2 mt-1">
                    <strong class="text-warning small"><i class="fas fa-bullseye me-1"></i>Cue:</strong> ${d.notes}
                </div>
            </div>
        `;
    });

    let html = `
        <div class="card-header bg-black bg-opacity-40 border-bottom border-warning border-opacity-25 py-3 px-4 d-flex align-items-center justify-content-between">
            <h4 class="fw-bold text-warning mb-0">${phaseData.title}</h4>
            <span class="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold" style="font-size: 0.75rem;">
                ${phaseData.daysPerWeek} Sessions / Week
            </span>
        </div>
        <div class="card-body p-4">
            <p class="text-light opacity-75 small mb-4">
                <strong>Phase Focus:</strong> ${phaseData.focus}
            </p>

            <!-- Desktop Table -->
            <div class="table-responsive d-none d-md-block">
                <table class="table table-dark table-striped align-middle border border-secondary border-opacity-25 rounded mb-0">
                    <thead>
                        <tr class="text-warning" style="font-size: 0.82rem;">
                            <th>DRILL MODULE</th>
                            <th>TARGET VOLUME</th>
                            <th>RECOVERY TIME</th>
                            <th>COACHING EXECUTION NOTE</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${phaseRowsHtml}
                    </tbody>
                </table>
            </div>

            <!-- Mobile Stacked Cards (Zero Horizontal Scroll) -->
            <div class="d-block d-md-none">
                ${phaseMobileCardsHtml}
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// =========================================================================
// 3. LACTIC INTERVAL & SPRINT REST TIMER
// =========================================================================
function setTimerPreset(workSec, restSec, label) {
    pauseTimer();
    timerWorkSeconds = workSec;
    timerRestSeconds = restSec;
    currentTimerSeconds = workSec;
    isWorkPhase = true;

    const phaseEl = document.getElementById('timer-phase');
    if (phaseEl) {
        phaseEl.innerText = `${label} - BURST PHASE`;
        phaseEl.className = 'text-warning small fw-bold';
    }
    updateTimerDisplay();
}

function startTimer() {
    if (currentTimerInterval) return;
    currentTimerInterval = setInterval(() => {
        if (currentTimerSeconds > 0) {
            currentTimerSeconds--;
            updateTimerDisplay();
        } else {
            // Toggle Phase
            isWorkPhase = !isWorkPhase;
            currentTimerSeconds = isWorkPhase ? timerWorkSeconds : timerRestSeconds;
            
            const phaseEl = document.getElementById('timer-phase');
            if (phaseEl) {
                phaseEl.innerText = isWorkPhase ? 'MAX BURST PHASE' : 'ACTIVE REST RECOVERY';
                phaseEl.className = isWorkPhase ? 'text-warning small fw-bold' : 'text-info small fw-bold';
            }

            updateTimerDisplay();

            // Play Synth Audio Beep Tone
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.setValueAtTime(isWorkPhase ? 880 : 440, ctx.currentTime);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                osc.start();
                osc.stop(ctx.currentTime + 0.2);
            } catch(e) {}
        }
    }, 1000);
}

function pauseTimer() {
    if (currentTimerInterval) {
        clearInterval(currentTimerInterval);
        currentTimerInterval = null;
    }
}

function resetTimer() {
    pauseTimer();
    isWorkPhase = true;
    currentTimerSeconds = timerWorkSeconds;
    const phaseEl = document.getElementById('timer-phase');
    if (phaseEl) {
        phaseEl.innerText = 'MAX BURST PHASE';
        phaseEl.className = 'text-warning small fw-bold';
    }
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const mins = Math.floor(currentTimerSeconds / 60);
    const secs = currentTimerSeconds % 60;
    const textEl = document.getElementById('timer-text');
    if (textEl) {
        textEl.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// =========================================================================
// 4. SPEED & AGILITY PERFORMANCE CALCULATORS
// =========================================================================
function calculateSpeedPowerOutput() {
    const sprint10Input = parseFloat(document.getElementById('calc-sprint10')?.value);
    const sprint40Input = parseFloat(document.getElementById('calc-sprint40')?.value);
    const verticalInput = parseFloat(document.getElementById('calc-vertical')?.value);
    const weightInput = parseFloat(document.getElementById('calc-weight')?.value);

    const s10 = !isNaN(sprint10Input) ? sprint10Input : parseFloat(localStorage.getItem('krome_metric_sprint_10') || '1.68');
    const s40 = !isNaN(sprint40Input) ? sprint40Input : parseFloat(localStorage.getItem('krome_metric_sprint_40') || '4.85');
    const vert = !isNaN(verticalInput) ? verticalInput : parseFloat(localStorage.getItem('krome_metric_vertical_jump') || '26.5');
    const weightLbs = !isNaN(weightInput) ? weightInput : parseFloat(localStorage.getItem('krome_athlete_current_weight') || '185');

    // Calculations
    // Top speed estimated from 40-yd sprint (40 yards / (s40 - 1.2s acceleration))
    const avgVelocityMph = s40 > 0 ? ((40 * 3) / s40) * 0.681818 : 0; // rough avg mph
    const peakVelocityMph = s40 > 0 ? (20 / (s40 * 0.42)) * 0.681818 : 0; // peak top velocity estimate

    // Power output (Sayers vertical jump power formula: P (Watts) = 60.7 x jump_cm + 45.3 x mass_kg - 2055)
    const vertCm = vert * 2.54;
    const massKg = weightLbs * 0.453592;
    let powerWatts = (60.7 * vertCm) + (45.3 * massKg) - 2055;
    if (powerWatts < 1000) powerWatts = 2200; // fallback floor

    // Classification
    let rating = 'Varsity';
    if (s40 <= 4.50 && vert >= 32) rating = 'Elite D1 / Pro';
    else if (s40 <= 4.70 && vert >= 28) rating = 'Collegiate Starter';
    else if (s40 <= 4.95 && vert >= 24) rating = 'Varsity Athlete';

    // Update DOM
    const valMph = document.getElementById('val-speed-mph');
    if (valMph) valMph.textContent = `${peakVelocityMph.toFixed(1)} mph`;

    const valWatts = document.getElementById('val-power-watts');
    if (valWatts) valWatts.textContent = `${Math.round(powerWatts)} W`;

    const valClass = document.getElementById('val-speed-rating');
    if (valClass) valClass.textContent = rating;

    // Save to localStorage if changed
    try {
        if (!isNaN(sprint10Input)) localStorage.setItem('krome_metric_sprint_10', sprint10Input);
        if (!isNaN(sprint40Input)) localStorage.setItem('krome_metric_sprint_40', sprint40Input);
        if (!isNaN(verticalInput)) localStorage.setItem('krome_metric_vertical_jump', verticalInput);
        if (!isNaN(weightInput)) localStorage.setItem('krome_athlete_current_weight', weightInput);
    } catch(e) {}

    if (typeof window.updateAthleteData === 'function') {
        window.updateAthleteData({
            sprint10: s10,
            sprint40: s40,
            verticalJump: vert,
            currentWeight: weightLbs
        });
    }
}

function loadProfileSpeedMetrics() {
    const s10 = localStorage.getItem('krome_metric_sprint_10');
    const s40 = localStorage.getItem('krome_metric_sprint_40');
    const vert = localStorage.getItem('krome_metric_vertical_jump');
    const wt = localStorage.getItem('krome_athlete_current_weight');

    const in10 = document.getElementById('calc-sprint10');
    if (in10 && s10) in10.value = s10;

    const in40 = document.getElementById('calc-sprint40');
    if (in40 && s40) in40.value = s40;

    const inVert = document.getElementById('calc-vertical');
    if (inVert && vert) inVert.value = vert;

    const inWt = document.getElementById('calc-weight');
    if (inWt && wt) inWt.value = wt;
}

// =========================================================================
// 5. GAIT & COD AUDIT CHECKLIST
// =========================================================================
function renderGaitChecklist() {
    const container = document.getElementById('gait-checklist-mount');
    if (!container) return;

    const blueprint = window.SPEED_CONDITIONING_BLUEPRINT;
    if (!blueprint) return;

    let html = ``;
    blueprint.gaitChecklist.forEach(item => {
        const isChecked = localStorage.getItem(`krome_gait_chk_${item.id}`) === 'true';
        html += `
            <div class="form-check p-3 mb-2 rounded-3 bg-black bg-opacity-40 border border-secondary border-opacity-25 d-flex align-items-start gap-2">
                <input class="form-check-input mt-1" type="checkbox" id="${item.id}" ${isChecked ? 'checked' : ''} onchange="toggleGaitCheck('${item.id}')">
                <div>
                    <label class="form-check-label text-warning fw-bold small d-block mb-0" for="${item.id}" style="cursor: pointer;">
                        ${item.title}
                    </label>
                    <small class="text-light opacity-75 d-block" style="font-size: 0.8rem; line-height: 1.4;">
                        ${item.description}
                    </small>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function toggleGaitCheck(itemId) {
    const el = document.getElementById(itemId);
    if (!el) return;
    localStorage.setItem(`krome_gait_chk_${itemId}`, el.checked ? 'true' : 'false');
}

// Global Exports
if (typeof window !== 'undefined') {
    window.selectWeek = selectWeek;
    window.selectDay = selectDay;
    window.toggleWorkoutDrillCheck = toggleWorkoutDrillCheck;
    window.toggleDayCompleted = toggleDayCompleted;
    window.filterSpeedDrills = filterSpeedDrills;
    window.openDrillModal = openDrillModal;
    window.showBlock = showBlock;
    window.startTimer = startTimer;
    window.pauseTimer = pauseTimer;
    window.resetTimer = resetTimer;
    window.setTimerPreset = setTimerPreset;
    window.calculateSpeedPowerOutput = calculateSpeedPowerOutput;
    window.toggleGaitCheck = toggleGaitCheck;
}
