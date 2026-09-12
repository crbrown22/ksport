const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DATA_FILE = path.join(__dirname, 'data', 'leads.json');
const ATHLETE_DATA_FILE = path.join(__dirname, 'data', 'athlete_data.json');
let GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFHMKVprWfXyqV8p6W7Kxqp4BjDi-MV5o9aT3KgJLE5pa-DnepKqygJkMH5p9Ov53z/exec';
if (process.env.GOOGLE_APPS_SCRIPT_URL && 
    !process.env.GOOGLE_APPS_SCRIPT_URL.includes('AKfycbzIAwh0') && 
    !process.env.GOOGLE_APPS_SCRIPT_URL.includes('AKfycbxvJxiP') &&
    !process.env.GOOGLE_APPS_SCRIPT_URL.includes('AKfycbzGJUgH')) {
  GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
}

// Helper to read leads database
function readLeads() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading leads:', err);
    return [];
  }
}

// Helper to write leads database
function writeLeads(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing leads:', err);
    return false;
  }
}

// Helper to read athlete data (Athlete Data tab in Google Sheet)
function readAthleteData() {
  try {
    if (!fs.existsSync(ATHLETE_DATA_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(ATHLETE_DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading athlete data:', err);
    return [];
  }
}

// Helper to write athlete data
function writeAthleteData(data) {
  try {
    const dir = path.dirname(ATHLETE_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ATHLETE_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing athlete data:', err);
    return false;
  }
}

// =========================================================================
// ATHLETE AUTHENTICATION (30-DAY SHRED, SUPPLEMENT PROTOCOL & NUTRITION E-BOOK)
// Checks Google Sheets KSP Leads under the 'Athlete Data' tab
// =========================================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Master & Program-Specific Access Key Definitions
const PROGRAM_KEY_DEFINITIONS = [
  {
    programId: 'shred',
    programName: '30-Day Shred Challenge Manual',
    targetPage: 'shred30_manual.html',
    keys: ['shred30', 'shred2026', 'shred', 'shred30manual', '30dayshred', 'shred2026!'],
    grant: { hasShredAccess: true, hasSupplementAccess: false, hasNutritionAccess: false }
  },
  {
    programId: 'blueprint',
    programName: 'Nutrition Blueprint E-Book',
    targetPage: 'nutrition_blueprint.html',
    keys: ['blueprint28', 'blueprint', 'nutrition28', 'nutritionblueprint', 'nutrition', 'macros28'],
    grant: { hasShredAccess: false, hasSupplementAccess: false, hasNutritionAccess: true }
  },
  {
    programId: 'protocol',
    programName: 'Athlete Supplement Protocol',
    targetPage: 'supplement_protocol.html',
    keys: ['protocol30', 'protocol', 'supplement30', 'supplementprotocol', 'supplements', 'supplementstack'],
    grant: { hasShredAccess: false, hasSupplementAccess: true, hasNutritionAccess: false }
  },
  {
    programId: 'all',
    programName: 'All Programs (30-Day Shred, Supplement Protocol & Nutrition Blueprint)',
    targetPage: 'shred30_manual.html',
    keys: ['krome-athlete', 'krome2026', 'ksp-athlete', 'krome', 'ksp2026', 'krome123', 'allaccess'],
    grant: { hasShredAccess: true, hasSupplementAccess: true, hasNutritionAccess: true }
  },
  {
    programId: 'onboarding',
    programName: 'Athlete Onboarding (No Program Set Up Yet)',
    targetPage: 'athlete_onboarding.html',
    keys: ['new-athlete', 'new', 'start', 'onboarding', 'consult', 'consultation', 'athlete2026', 'athlete', 'noprogram'],
    grant: { hasShredAccess: false, hasSupplementAccess: false, hasNutritionAccess: false }
  }
];

function resolveProgramAccess(accessKey, athleteRecord) {
  const cleanKey = (accessKey || '').trim().toLowerCase();
  if (!cleanKey && !athleteRecord) return null;

  // 1. Check direct program-specific key definitions
  for (const def of PROGRAM_KEY_DEFINITIONS) {
    if (def.keys.some(k => k === cleanKey)) {
      const isBundle = def.programId === 'all';
      return {
        programId: def.programId,
        programName: def.programName,
        targetPage: def.targetPage,
        isBundle: isBundle,
        hasShredAccess: def.grant.hasShredAccess,
        hasSupplementAccess: def.grant.hasSupplementAccess,
        hasNutritionAccess: def.grant.hasNutritionAccess,
        hasPortalAccess: true
      };
    }
  }

  // 2. Check athlete's saved accessKey / password in sheet or database
  if (athleteRecord) {
    const userKey = (athleteRecord.accessKey || athleteRecord.accessCode || athleteRecord.password || '').trim().toLowerCase();
    if (!cleanKey || userKey === cleanKey || cleanKey === 'athlete2026' || cleanKey === 'onboarding' || cleanKey === 'new') {
      const prog = (athleteRecord.program || '').toLowerCase();
      const isBundle = prog.includes('all') || prog.includes('bundle') || (athleteRecord.hasShredAccess && athleteRecord.hasNutritionAccess && athleteRecord.hasSupplementAccess);
      const hasShred = isBundle || athleteRecord.hasShredAccess === true || prog.includes('shred');
      const hasSupp = isBundle || athleteRecord.hasSupplementAccess === true || prog.includes('supplement') || prog.includes('protocol');
      const hasNutr = isBundle || athleteRecord.hasNutritionAccess === true || prog.includes('nutrition') || prog.includes('blueprint');

      let targetPage = 'shred30_manual.html';
      if (!hasShred && hasNutr) targetPage = 'nutrition_blueprint.html';
      else if (!hasShred && hasSupp) targetPage = 'supplement_protocol.html';
      else if (!hasShred && !hasNutr && !hasSupp) targetPage = 'athlete_onboarding.html';

      return {
        programId: (hasShred || hasNutr || hasSupp) ? 'athlete-enrolled' : 'onboarding',
        programName: athleteRecord.program || 'New Athlete Onboarding & Consultation',
        targetPage: targetPage,
        isBundle: isBundle,
        hasShredAccess: Boolean(hasShred),
        hasSupplementAccess: Boolean(hasSupp),
        hasNutritionAccess: Boolean(hasNutr),
        hasPortalAccess: true
      };
    }
  }

  return null;
}

// API: Athlete Portal Login with Email & Program Access Key Code (e.g. Shred30, Blueprint28, Protocol30)
async function handleAthleteLogin(req, res) {
  const email = (req.body.email || '').trim().toLowerCase();
  const accessKey = (req.body.accessKey || req.body.accessCode || req.body.key || req.body.password || '').trim();

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Please enter your registered athlete email address.'
    });
  }

  if (!accessKey) {
    return res.status(400).json({
      success: false,
      error: 'Please enter your Program Access Key Code (e.g. Shred30, Blueprint28, Protocol30).'
    });
  }

  const athleteList = readAthleteData();
  const leadsList = readLeads();

  // Find athlete in Athlete Data tab or leads store
  let athlete = athleteList.find(a => (a.email || '').trim().toLowerCase() === email);
  let isFromLeads = false;

  if (!athlete) {
    athlete = leadsList.find(l => (l.email || '').trim().toLowerCase() === email);
    if (athlete) isFromLeads = true;
  }

  const programAccess = resolveProgramAccess(accessKey, athlete);

  if (!programAccess) {
    return res.status(401).json({
      success: false,
      error: `Invalid Access Key Code "${accessKey}". Please check your key code (e.g. Shred30 for the 30-Day Shred, Blueprint28 for Nutrition Blueprint, or Protocol30 for Supplements).`
    });
  }

  const now = new Date().toLocaleString();

  // If match found locally, update athlete record
  if (athlete) {
    athlete.lastLogin = now;
    athlete.loginTimestamp = now;
    athlete.logoutTimestamp = '';
    athlete.accessKey = accessKey;
    if (programAccess.hasShredAccess) athlete.hasShredAccess = true;
    if (programAccess.hasSupplementAccess) athlete.hasSupplementAccess = true;
    if (programAccess.hasNutritionAccess) athlete.hasNutritionAccess = true;
    athlete.hasPortalAccess = true;

    // RECORD LOGIN DIRECTLY IN Athlete_Data SPREADSHEET VIA GOOGLE APPS SCRIPT
    if (GOOGLE_APPS_SCRIPT_URL) {
      try {
        const syncUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=athlete_login&tab=${encodeURIComponent('Athlete_Data')}&email=${encodeURIComponent(email)}&username=${encodeURIComponent(email)}&accessKey=${encodeURIComponent(accessKey)}&program=${encodeURIComponent(programAccess.programName)}`;
        const syncController = new AbortController();
        const syncTimeout = setTimeout(() => syncController.abort(), 3500);

        const syncRes = await fetch(syncUrl, {
          method: 'GET',
          redirect: 'follow',
          signal: syncController.signal
        }).catch(err => {
          console.warn('Athlete_Data login sync GET notice:', err.message);
          return null;
        });
        clearTimeout(syncTimeout);

        if (syncRes && syncRes.ok) {
          const syncJson = await syncRes.json().catch(() => null);
          if (syncJson && syncJson.athlete) {
            if (syncJson.athlete.shredDay) athlete.shredDay = syncJson.athlete.shredDay;
            if (syncJson.athlete.shredLane) athlete.shredLane = syncJson.athlete.shredLane;
            if (syncJson.athlete.currentWeight) athlete.currentWeight = syncJson.athlete.currentWeight;
            if (syncJson.athlete.goalWeight) athlete.goalWeight = syncJson.athlete.goalWeight;
            if (syncJson.athlete.supplementProtocol) athlete.supplementStack = syncJson.athlete.supplementProtocol;
            if (syncJson.athlete.nutritionGoals) athlete.nutritionMacros = syncJson.athlete.nutritionGoals;
            if (syncJson.athlete.athleteMessage) athlete.notes = syncJson.athlete.athleteMessage;
          }
          console.log('Successfully recorded login in Athlete_Data spreadsheet for:', email);
        }

        // Secondary POST broadcast for comprehensive compatibility
        fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'athlete_login',
            tab: 'Athlete_Data',
            username: email,
            email: email,
            accessKey: accessKey,
            program: programAccess.programName,
            loginTimestamp: now
          })
        }).catch(() => {});
      } catch (scriptErr) {
        console.warn('Google Apps Script login timestamp recording notice:', scriptErr.message);
      }
    }

    if (isFromLeads) {
      const newRecord = {
        rowNumber: athleteList.length + 2,
        timestamp: athlete.timestamp || now,
        fullName: athlete.fullName || athlete.name || 'KROME Athlete',
        email: athlete.email,
        accessKey: accessKey,
        phone: athlete.phone || '',
        program: athlete.program || programAccess.programName,
        shredDay: athlete.shredDay || 14,
        shredLane: athlete.shredLane || 'Lane 2 (2,000 kcal)',
        currentWeight: athlete.currentWeight || '180',
        goalWeight: athlete.goalWeight || '170',
        supplementStack: athlete.supplementNotes || 'Active Protocol',
        nutritionMacros: athlete.nutritionGoals || 'Active Blueprint',
        hasShredAccess: programAccess.hasShredAccess,
        hasSupplementAccess: programAccess.hasSupplementAccess,
        hasNutritionAccess: programAccess.hasNutritionAccess,
        hasPortalAccess: true,
        lastLogin: now,
        loginTimestamp: now,
        logoutTimestamp: ''
      };
      athleteList.push(newRecord);
      writeAthleteData(athleteList);
    } else {
      writeAthleteData(athleteList);
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

    return res.json({
      success: true,
      message: `Access Granted: ${programAccess.programName} unlocked for ${athlete.fullName || email}.`,
      token: token,
      programAccess: programAccess,
      targetPage: programAccess.targetPage,
      athlete: {
        fullName: athlete.fullName || athlete.name || 'KROME Athlete',
        email: athlete.email,
        program: athlete.program || programAccess.programName,
        unlockedProgram: programAccess.programName,
        shredDay: athlete.shredDay || 14,
        shredLane: athlete.shredLane || 'Lane 2 (2,000 kcal)',
        currentWeight: athlete.currentWeight || '180',
        goalWeight: athlete.goalWeight || '170',
        hasShredAccess: athlete.hasShredAccess || programAccess.hasShredAccess,
        hasSupplementAccess: athlete.hasSupplementAccess || programAccess.hasSupplementAccess,
        hasNutritionAccess: athlete.hasNutritionAccess || programAccess.hasNutritionAccess,
        hasPortalAccess: true,
        targetPage: programAccess.targetPage,
        lastLogin: now,
        loginTimestamp: now
      }
    });
  }

  // If new athlete email with valid program key, create and log in
  const newAthleteRecord = {
    rowNumber: athleteList.length + 2,
    timestamp: now,
    fullName: 'KROME Athlete',
    email: email,
    accessKey: accessKey,
    phone: '',
    program: programAccess.programName,
    shredDay: 1,
    shredLane: 'Lane 2 (2,000 kcal)',
    currentWeight: '180',
    goalWeight: '170',
    supplementStack: 'Creatine Monohydrate (5g), Whey Isolate (30g), Daily Multivitamin',
    nutritionMacros: 'TDEE: 2,200 kcal | P: 180g | C: 200g | F: 60g',
    hasShredAccess: programAccess.hasShredAccess,
    hasSupplementAccess: programAccess.hasSupplementAccess,
    hasNutritionAccess: programAccess.hasNutritionAccess,
    hasPortalAccess: true,
    lastLogin: now,
    loginTimestamp: now,
    logoutTimestamp: ''
  };
  athleteList.push(newAthleteRecord);
  writeAthleteData(athleteList);

  // Sync to Athlete_Data spreadsheet
  if (GOOGLE_APPS_SCRIPT_URL) {
    try {
      const syncUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=athlete_login&tab=${encodeURIComponent('Athlete_Data')}&email=${encodeURIComponent(email)}&username=${encodeURIComponent(email)}&accessKey=${encodeURIComponent(accessKey)}&program=${encodeURIComponent(programAccess.programName)}`;
      fetch(syncUrl, { method: 'GET', redirect: 'follow' }).catch(() => {});
    } catch (_) {}
  }

  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
  return res.json({
    success: true,
    message: `Access Granted: ${programAccess.programName} unlocked for ${email}.`,
    token: token,
    programAccess: programAccess,
    targetPage: programAccess.targetPage,
    athlete: newAthleteRecord
  });
}

// Bind auth routes
app.post('/api/auth/login', handleAthleteLogin);
app.post('/api/auth/athlete-login', handleAthleteLogin);
app.post('/api/auth/shred-login', handleAthleteLogin);

// API: Athlete Logout (Records Log Out TIme Stamp in Athlete_Data spreadsheet)
app.post('/api/auth/athlete-logout', async (req, res) => {
  const { email } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();
  const now = new Date().toLocaleString();

  if (cleanEmail) {
    const athleteList = readAthleteData();
    const idx = athleteList.findIndex(a => (a.email || '').toLowerCase() === cleanEmail);
    if (idx >= 0) {
      athleteList[idx].logoutTimestamp = now;
      athleteList[idx].lastUpdated = now;
      writeAthleteData(athleteList);
    }

    // Sync logout timestamp to Google Apps Script Athlete_Data tab
    if (GOOGLE_APPS_SCRIPT_URL) {
      try {
        const logoutUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=athlete_logout&tab=${encodeURIComponent('Athlete_Data')}&email=${encodeURIComponent(cleanEmail)}&username=${encodeURIComponent(cleanEmail)}`;
        fetch(logoutUrl, { method: 'GET', redirect: 'follow' }).catch(() => {});

        fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'athlete_logout',
            tab: 'Athlete_Data',
            username: cleanEmail,
            email: cleanEmail,
            logoutTimestamp: now
          })
        }).catch(err => console.warn('Logout sync notice:', err.message));
      } catch (_) {}
    }
  }

  return res.json({
    success: true,
    message: 'Athlete logged out. Log Out TIme Stamp recorded in Athlete_Data spreadsheet.',
    logoutTimestamp: now
  });
});

// API: Register New Athlete (Supports registering with NO pre-existing program set up)
async function handleAthleteRegistration(req, res) {
  const {
    fullName,
    name,
    email,
    phone,
    password,
    accessKey,
    program,
    programStatus,
    programInterest,
    fitnessGoal,
    athleteLevel,
    experience,
    currentWeight,
    goalWeight,
    notes,
    message
  } = req.body;

  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanName = (fullName || name || '').trim() || 'KROME Athlete';
  const cleanPhone = (phone || '').trim();
  const cleanPassword = (password || accessKey || 'ATHLETE2026').trim();
  const cleanGoal = (fitnessGoal || 'Fat Loss & Athletic Conditioning').trim();
  const cleanLevel = (athleteLevel || experience || 'Intermediate').trim();
  const cleanNotes = (notes || message || 'New athlete registered without pre-assigned program. Requesting onboarding assessment & coach consultation.').trim();
  
  const requestedProgram = (program || programStatus || programInterest || '').trim();
  const hasNoProgram = !requestedProgram || 
                       requestedProgram.toLowerCase().includes('no program') || 
                       requestedProgram.toLowerCase().includes('pending') || 
                       requestedProgram.toLowerCase().includes('onboarding') ||
                       requestedProgram.toLowerCase().includes('consultation');

  if (!cleanEmail) {
    return res.status(400).json({ success: false, error: 'Email address is required to register.' });
  }

  const athleteList = readAthleteData();
  const existingIdx = athleteList.findIndex(a => (a.email || '').toLowerCase() === cleanEmail);
  const now = new Date().toLocaleString();

  let athleteRecord;
  let targetPage = 'athlete_onboarding.html';

  // Determine program access permissions
  let hasShred = false;
  let hasSupp = false;
  let hasNutr = false;
  let assignedProgramName = hasNoProgram 
    ? 'New Athlete (No Program Set Up Yet - Pending Onboarding & Assessment)'
    : requestedProgram;

  if (requestedProgram.toLowerCase().includes('shred') && !hasNoProgram) {
    hasShred = true;
    targetPage = 'shred30_manual.html';
  } else if ((requestedProgram.toLowerCase().includes('blueprint') || requestedProgram.toLowerCase().includes('nutrition')) && !hasNoProgram) {
    hasNutr = true;
    targetPage = 'nutrition_blueprint.html';
  } else if ((requestedProgram.toLowerCase().includes('protocol') || requestedProgram.toLowerCase().includes('supplement')) && !hasNoProgram) {
    hasSupp = true;
    targetPage = 'supplement_protocol.html';
  } else if (requestedProgram.toLowerCase().includes('all') || requestedProgram.toLowerCase().includes('bundle')) {
    hasShred = true;
    hasNutr = true;
    hasSupp = true;
    targetPage = 'shred30_manual.html';
  }

  if (existingIdx >= 0) {
    // Update existing record with registration details
    athleteList[existingIdx].fullName = cleanName;
    athleteList[existingIdx].phone = cleanPhone || athleteList[existingIdx].phone || '';
    athleteList[existingIdx].password = cleanPassword;
    athleteList[existingIdx].accessKey = cleanPassword;
    athleteList[existingIdx].fitnessGoal = cleanGoal;
    athleteList[existingIdx].athleteLevel = cleanLevel;
    if (currentWeight) athleteList[existingIdx].currentWeight = String(currentWeight);
    if (goalWeight) athleteList[existingIdx].goalWeight = String(goalWeight);
    if (cleanNotes) athleteList[existingIdx].notes = cleanNotes;
    athleteList[existingIdx].hasPortalAccess = true;
    if (hasShred) athleteList[existingIdx].hasShredAccess = true;
    if (hasNutr) athleteList[existingIdx].hasNutritionAccess = true;
    if (hasSupp) athleteList[existingIdx].hasSupplementAccess = true;
    athleteList[existingIdx].lastLogin = now;
    athleteList[existingIdx].lastUpdated = now;
    athleteRecord = athleteList[existingIdx];
  } else {
    // Create new athlete record (no pre-assigned program required)
    athleteRecord = {
      rowNumber: athleteList.length + 2,
      timestamp: now,
      fullName: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      accessKey: cleanPassword,
      phone: cleanPhone,
      program: assignedProgramName,
      programInterest: requestedProgram || 'Athlete Onboarding & Assessment',
      fitnessGoal: cleanGoal,
      athleteLevel: cleanLevel,
      shredStatus: hasNoProgram 
        ? 'New Athlete Registration (Pending Program Setup)' 
        : 'Registered Athlete Enrollment',
      shredDay: 1,
      shredLane: 'Standard Onboarding Assessment',
      currentWeight: String(currentWeight || '180'),
      goalWeight: String(goalWeight || '170'),
      supplementStack: 'Pending 1-on-1 Athlete Consultation',
      nutritionMacros: 'Baseline Mifflin-St Jeor Assessment Pending',
      notes: cleanNotes,
      hasShredAccess: hasShred,
      hasSupplementAccess: hasSupp,
      hasNutritionAccess: hasNutr,
      hasPortalAccess: true,
      isNewAthleteNoProgram: hasNoProgram,
      lastLogin: now,
      loginTimestamp: now,
      logoutTimestamp: ''
    };
    athleteList.push(athleteRecord);
  }

  writeAthleteData(athleteList);

  // Synchronize with leads store
  const leadsList = readLeads();
  const leadIdx = leadsList.findIndex(l => (l.email || '').toLowerCase() === cleanEmail);
  const leadData = {
    rowNumber: (leadIdx >= 0 ? leadsList[leadIdx].rowNumber : leadsList.length + 2),
    timestamp: now,
    fullName: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    password: cleanPassword,
    program: assignedProgramName,
    programInterest: requestedProgram || 'Athlete Onboarding & Assessment',
    fitnessGoal: cleanGoal,
    athleteLevel: cleanLevel,
    currentWeight: String(currentWeight || '180'),
    goalWeight: String(goalWeight || '170'),
    shredStatus: hasNoProgram ? 'New Athlete (No Program Set Up Yet)' : 'Active Athlete Request',
    supplementNotes: 'Pending initial consultation',
    nutritionGoals: 'Pending baseline assessment',
    message: cleanNotes,
    lastUpdated: now
  };

  if (leadIdx >= 0) {
    leadsList[leadIdx] = { ...leadsList[leadIdx], ...leadData };
  } else {
    leadsList.push(leadData);
  }
  writeLeads(leadsList);

  // Sync with Google Apps Script
  if (GOOGLE_APPS_SCRIPT_URL) {
    try {
      fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'athlete_register',
          tab: 'Athlete_Data',
          ...athleteRecord
        })
      }).catch(err => console.warn('Registration Google Sheet sync notice:', err.message));

      fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          tab: 'ksp_leads',
          ...leadData
        })
      }).catch(() => {});
    } catch (_) {}
  }

  const token = Buffer.from(`${cleanEmail}:${Date.now()}`).toString('base64');
  return res.json({
    success: true,
    message: hasNoProgram 
      ? `Registration successful! Welcome to KROME Sports Performance, ${cleanName}. Your athlete onboarding profile is ready.`
      : `Account registered successfully for ${cleanName}.`,
    token: token,
    isNewAthleteNoProgram: hasNoProgram,
    targetPage: targetPage,
    athlete: {
      fullName: athleteRecord.fullName,
      email: athleteRecord.email,
      phone: athleteRecord.phone,
      program: athleteRecord.program,
      fitnessGoal: athleteRecord.fitnessGoal,
      athleteLevel: athleteRecord.athleteLevel,
      currentWeight: athleteRecord.currentWeight,
      goalWeight: athleteRecord.goalWeight,
      shredStatus: athleteRecord.shredStatus,
      hasShredAccess: athleteRecord.hasShredAccess,
      hasSupplementAccess: athleteRecord.hasSupplementAccess,
      hasNutritionAccess: athleteRecord.hasNutritionAccess,
      hasPortalAccess: athleteRecord.hasPortalAccess,
      isNewAthleteNoProgram: athleteRecord.isNewAthleteNoProgram,
      lastLogin: athleteRecord.lastLogin
    }
  });
}

// Bind registration routes
app.post('/api/auth/register', handleAthleteRegistration);
app.post('/api/auth/athlete-register', handleAthleteRegistration);
app.post('/api/auth/shred-register', handleAthleteRegistration);
app.post('/api/athlete/register', handleAthleteRegistration);

// API: List Athlete Data records (for quick test accounts & demo verification)
app.get('/api/auth/athletes', (req, res) => {
  const athleteList = readAthleteData();
  const safeList = athleteList.map(a => ({
    email: a.email,
    fullName: a.fullName,
    program: a.program,
    hasPassword: Boolean(a.password),
    lastLogin: a.lastLogin
  }));
  res.json({ success: true, athletes: safeList });
});

// Explicit routes for html pages & aliases
app.get('/30_day_shred.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'shred30_manual.html'));
});

app.get(['/register', '/signup', '/register.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.get(['/onboarding', '/athlete_onboarding.html', '/onboarding.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'athlete_onboarding.html'));
});

// API: Fetch athlete data by email (from Athlete Data tab in Google Sheet / local store)
app.get('/api/athlete/data', async (req, res) => {
  const email = (req.query.email || req.headers['x-athlete-email'] || '').trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email parameter is required.' });
  }

  const athleteList = readAthleteData();
  let athlete = athleteList.find(a => (a.email || '').trim().toLowerCase() === email);

  // If remote Google Apps Script is configured, try pulling latest updates from Google Sheet
  if (GOOGLE_APPS_SCRIPT_URL) {
    try {
      const fetchUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=get_athlete&tab=${encodeURIComponent('Athlete Data')}&email=${encodeURIComponent(email)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const remoteRes = await fetch(fetchUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (remoteRes.ok) {
        const remoteData = await remoteRes.json();
        if (remoteData && remoteData.success && remoteData.athlete) {
          const idx = athleteList.findIndex(a => (a.email || '').toLowerCase() === email);
          if (idx >= 0) {
            athleteList[idx] = { ...athleteList[idx], ...remoteData.athlete };
          } else {
            athleteList.push(remoteData.athlete);
          }
          writeAthleteData(athleteList);
          athlete = athleteList[idx >= 0 ? idx : athleteList.length - 1];
        }
      }
    } catch (err) {
      console.warn('Apps Script athlete fetch notice:', err.message);
    }
  }

  if (!athlete) {
    // Check leads
    const leads = readLeads();
    const leadMatch = leads.find(l => (l.email || '').trim().toLowerCase() === email);
    if (leadMatch) {
      athlete = {
        fullName: leadMatch.fullName || leadMatch.name || 'KROME Athlete',
        email: email,
        phone: leadMatch.phone || '',
        program: leadMatch.program || leadMatch.programInterest || '30-Day Shred Challenge',
        shredDay: 1,
        shredLane: 'Lane 2 (2,000 kcal)',
        currentWeight: '180',
        goalWeight: '170',
        supplementStack: leadMatch.supplementNotes || 'Creatine Monohydrate (5g), Whey Isolate (30g), Daily Multivitamin',
        nutritionMacros: leadMatch.nutritionGoals || 'TDEE: 2,200 kcal | P: 180g | C: 200g | F: 60g',
        hasShredAccess: true,
        hasSupplementAccess: true,
        hasNutritionAccess: true,
        lastLogin: new Date().toLocaleString()
      };
    }
  }

  if (athlete) {
    const { password, ...safeAthlete } = athlete;
    return res.json({ success: true, athlete: safeAthlete });
  }

  return res.status(404).json({ success: false, error: 'Athlete not found in Athlete Data tab.' });
});

// API: Update athlete progress (Shred Day, weight, calorie lane, notes)
app.post('/api/athlete/update', async (req, res) => {
  const { email, shredDay, currentWeight, goalWeight, shredLane, supplementStack, nutritionMacros, notes } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail) {
    return res.status(400).json({ success: false, error: 'Athlete email is required.' });
  }

  const athleteList = readAthleteData();
  const idx = athleteList.findIndex(a => (a.email || '').toLowerCase() === cleanEmail);
  const now = new Date().toLocaleString();

  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Athlete not found in Athlete Data store.' });
  }

  if (shredDay !== undefined) athleteList[idx].shredDay = parseInt(shredDay, 10) || 1;
  if (currentWeight !== undefined) athleteList[idx].currentWeight = String(currentWeight).trim();
  if (goalWeight !== undefined) athleteList[idx].goalWeight = String(goalWeight).trim();
  if (shredLane !== undefined) athleteList[idx].shredLane = shredLane;
  if (supplementStack !== undefined) athleteList[idx].supplementStack = supplementStack;
  if (nutritionMacros !== undefined) athleteList[idx].nutritionMacros = nutritionMacros;
  if (notes !== undefined) athleteList[idx].notes = notes;
  athleteList[idx].lastUpdated = now;

  writeAthleteData(athleteList);

  // Sync update to Google Apps Script Web App
  if (GOOGLE_APPS_SCRIPT_URL) {
    try {
      fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_athlete',
          tab: 'Athlete Data',
          email: cleanEmail,
          ...athleteList[idx]
        })
      }).catch(err => console.warn('Google Sheet athlete sync notice:', err.message));
    } catch (_) {}
  }

  const { password, ...safeAthlete } = athleteList[idx];
  res.json({ success: true, message: 'Athlete progress updated and synced with Google Sheets.', athlete: safeAthlete });
});

// API: Check/Get App Script Config
app.get('/api/portal/config', (req, res) => {
  res.json({
    scriptUrl: GOOGLE_APPS_SCRIPT_URL,
    totalRecords: readLeads().length
  });
});

// API: Update App Script URL
app.post('/api/portal/config', (req, res) => {
  const { scriptUrl } = req.body;
  if (scriptUrl && typeof scriptUrl === 'string') {
    GOOGLE_APPS_SCRIPT_URL = scriptUrl.trim();
    return res.json({ success: true, scriptUrl: GOOGLE_APPS_SCRIPT_URL });
  }
  res.status(400).json({ success: false, error: 'Invalid scriptUrl' });
});

// API: List Registered Emails (Demo/Lookup assistance)
app.get('/api/portal/leads', (req, res) => {
  const leads = readLeads();
  const emails = leads.map(l => ({
    email: l.email,
    fullName: l.fullName || l.name,
    program: l.program || l.programInterest,
    rowNumber: l.rowNumber
  }));
  res.json({ success: true, leads: emails });
});

// API: Email Login Verification
app.post('/api/portal/login', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ success: false, error: 'Please enter an email address to log in.' });
  }

  // Check local database first
  const leads = readLeads();
  const localMatch = leads.find(l => (l.email || '').trim().toLowerCase() === email);

  // If found locally, return verified access
  if (localMatch) {
    if (GOOGLE_APPS_SCRIPT_URL) {
      try {
        const syncUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=athlete_login&tab=${encodeURIComponent('Athlete_Data')}&email=${encodeURIComponent(email)}&username=${encodeURIComponent(email)}`;
        fetch(syncUrl, { method: 'GET', redirect: 'follow' }).catch(() => {});
      } catch (_) {}
    }

    return res.json({
      success: true,
      found: true,
      message: 'Access Granted: Athlete record verified.',
      rowNumber: localMatch.rowNumber || 2,
      data: localMatch
    });
  }

  // Attempt lookup via Google Apps Script Web App if configured
  if (GOOGLE_APPS_SCRIPT_URL) {
    try {
      const fetchUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=login&email=${encodeURIComponent(email)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const remoteRes = await fetch(fetchUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (remoteRes.ok) {
        const remoteData = await remoteRes.json();
        if (remoteData && remoteData.found && remoteData.data) {
          // Cache remotely found record into local database
          const existingIdx = leads.findIndex(l => (l.email || '').toLowerCase() === email);
          if (existingIdx === -1) {
            leads.push(remoteData.data);
            writeLeads(leads);
          }
          return res.json({
            success: true,
            found: true,
            rowNumber: remoteData.rowNumber || remoteData.data.rowNumber || leads.length + 1,
            data: remoteData.data
          });
        }
      }
    } catch (err) {
      console.warn('Google Apps Script lookup notice:', err.message);
    }
  }

  // If email was not found in either
  return res.status(403).json({
    success: false,
    found: false,
    error: `Access Denied: The email "${email}" was not found in the ksp_leads sheet records.`
  });
});

// API: Update Athlete Row Cells
app.post('/api/portal/update', async (req, res) => {
  const { email, updates } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail) {
    return res.status(400).json({ success: false, error: 'Email is required to update row.' });
  }

  const leads = readLeads();
  const idx = leads.findIndex(l => (l.email || '').trim().toLowerCase() === cleanEmail);

  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Cannot update: Athlete email not found.' });
  }

  const now = new Date().toLocaleString();
  const current = leads[idx];

  // Merge updates
  const updated = {
    ...current,
    ...updates,
    email: current.email, // preserve primary key
    lastUpdated: now
  };

  leads[idx] = updated;
  writeLeads(leads);

  // Asynchronously dispatch update to Google Apps Script Web App
  if (GOOGLE_APPS_SCRIPT_URL) {
    try {
      fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          email: cleanEmail,
          updates: updates
        })
      }).catch(err => console.warn('Apps Script async update sync notice:', err.message));
    } catch (err) {
      console.warn('Remote sync error:', err.message);
    }
  }

  return res.json({
    success: true,
    message: `Row ${updated.rowNumber || idx + 2} successfully updated in ksp_leads sheet.`,
    lastUpdated: now,
    data: updated
  });
});

// API: Lead Submission endpoint (used by website forms)
app.post('/api/leads', (req, res) => {
  const payload = req.body;
  const leads = readLeads();
  const now = new Date().toLocaleString();
  const cleanEmail = (payload.email || '').trim().toLowerCase();

  const existingIdx = leads.findIndex(l => (l.email || '').trim().toLowerCase() === cleanEmail);
  let savedRecord;

  if (existingIdx >= 0) {
    leads[existingIdx] = {
      ...leads[existingIdx],
      ...payload,
      lastUpdated: now
    };
    savedRecord = leads[existingIdx];
  } else {
    savedRecord = {
      rowNumber: leads.length + 2,
      timestamp: now,
      fullName: payload.fullName || payload.name || '',
      email: payload.email || '',
      phone: payload.phone || '',
      program: payload.program || payload.programInterest || '',
      programInterest: payload.program || payload.programInterest || '',
      athleteLevel: payload.athleteLevel || payload.experience || '',
      preferredContact: payload.preferredContact || 'Email',
      shredStatus: payload.shredStatus || 'New Athlete Enrollment',
      supplementNotes: payload.supplementNotes || 'Pending initial protocol consultation',
      nutritionGoals: payload.nutritionGoals || 'Pending calorie/macro calculation',
      message: payload.message || '',
      lastUpdated: now
    };
    leads.push(savedRecord);
  }

  writeLeads(leads);

  // Forward to Google Apps Script Web App
  if (GOOGLE_APPS_SCRIPT_URL) {
    try {
      fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          ...savedRecord
        })
      }).catch(err => console.warn('Lead dispatch to Apps script notice:', err.message));
    } catch (_) {}
  }

  res.json({ success: true, data: savedRecord });
});

// Serve static files from root directory
app.use(express.static(__dirname));

// Fallback to index.html for any unhandled routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

