/**
 * =========================================================================
 * KROME SPORTS PERFORMANCE - Google Sheets Apps Script API
 * =========================================================================
 * 
 * ATHLETE DATA TAB COLUMNS IMPLEMENTED:
 * 1. Login Timestamp      (Col A) - Date/Time of athlete login
 * 2. username log in      (Col B) - Athlete Email / Username (Primary Identifier)
 * 3. 30 Day Shred Status  (Col C) - Active Challenge Day, Calorie Lane, Current & Goal Weight
 * 4. Supplement Protocol  (Col D) - Clinical Supplement Regimen / Stack
 * 5. Nutrition Goals & Macros (Col E) - Prescribed TDEE, Protein, Carb & Fat Targets
 * 6. Athlete Message / Notes  (Col F) - Coaching Notes, Directives & Athlete Feedback
 * 7. Last Updated         (Col G) - Date/Time of last record sync or progress update
 * 8. Log Out TIme Stamp   (Col H) - Date/Time when athlete logged out
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet (e.g. "ksp_leads" or "KROME Athlete Portal").
 * 2. In the top menu, click Extensions > Apps Script.
 * 3. Replace all code in Code.gs with this entire script and click "Save" (Ctrl+S / Cmd+S).
 * 4. From the function dropdown at the top, select `setupAthleteDataSheet` (or `setupAllSheets`) and click "Run".
 *    - This configures the "Athlete Data" tab with the 8 columns formatted with dark headers (#0d1117) and gold text (#ffd447).
 *    - Seeds sample athlete records if the sheet is newly created.
 * 5. Click "Deploy" (top right blue button) > "New deployment".
 * 6. Select type: "Web app".
 *    - Description: "KROME Athlete Data & Portal API"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone"
 * 7. Click "Deploy", authorize access, and copy the Web App URL.
 * =========================================================================
 */

var ATHLETE_TAB_NAME = 'Athlete_Data';
var REGISTRATION_TAB_NAME = 'athlete_registration';
var LEADS_TAB_NAME = 'ksp_leads';

/**
 * Intelligent sheet getter: finds either 'Athlete_Data' or 'Athlete Data'
 */
function getAthleteSheet(ss, autoCreate) {
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Athlete_Data') || 
              ss.getSheetByName('Athlete Data') || 
              ss.getSheetByName('athlete_data') || 
              ss.getSheetByName('AthleteData') || 
              ss.getSheetByName(ATHLETE_TAB_NAME);
  if (!sheet) {
    var allSheets = ss.getSheets();
    for (var i = 0; i < allSheets.length; i++) {
      var sName = allSheets[i].getName().toLowerCase().replace(/[\s_-]/g, '');
      if (sName.indexOf('athletedata') !== -1 || sName === 'athletes') {
        return allSheets[i];
      }
    }
  }
  if (!sheet && autoCreate) {
    sheet = ss.insertSheet('Athlete_Data');
  }
  return sheet;
}

/**
 * Intelligent sheet getter: finds or creates 'athlete_registration' tab
 */
function getAthleteRegistrationSheet(ss, autoCreate) {
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(REGISTRATION_TAB_NAME) || 
              ss.getSheetByName('Athlete_Registration') || 
              ss.getSheetByName('Athlete Registration') ||
              ss.getSheetByName('athlete registration') ||
              ss.getSheetByName('AthleteRegistration');
              
  if (!sheet && autoCreate) {
    sheet = ss.insertSheet(REGISTRATION_TAB_NAME);
  }
  return sheet;
}

// Configuration: Coach Notification Emails, Calendar & Working Hours
var COACH_NOTIFICATION_EMAILS = 'swolecode@gmail.com, kromefitness@gmail.com';
var CALENDAR_BOOKING_URL = 'https://calendar.app.google/vae7E9TF9P5mX9sy9';
var WORK_START_HOUR = 8;    // 8:00 AM
var WORK_END_HOUR = 18;     // 6:00 PM (18:00)
var BUFFER_MINUTES = 15;    // 15-minute window between appointments
var SESSION_DURATION = 30;  // 30-minute consultation

// 22-Column Schema for 'athlete_registration' spreadsheet tab
var REGISTRATION_HEADERS = [
  'Registration Timestamp',
  'Full Name',
  'Email / Username',
  'Phone Number',
  'Program / Enrollment Status',
  'Primary Goal Objective',
  'Experience Level',
  'Age',
  'Biological Sex',
  'Height (Feet)',
  'Height (Inches)',
  'Current Weight (lbs)',
  'Goal Weight (lbs)',
  'Activity Level',
  'Target Calories (kcal)',
  'Protein (g)',
  'Carbs (g)',
  'Fat (g)',
  'Access Key / Passkey',
  'Training Background & Coach Notes',
  'Status / Coach Action',
  'Last Updated'
];

var REG_COLS = {
  TIMESTAMP: 1,        // Col A
  FULL_NAME: 2,        // Col B
  EMAIL: 3,            // Col C
  PHONE: 4,            // Col D
  PROGRAM: 5,          // Col E
  GOAL_OBJECTIVE: 6,   // Col F
  EXPERIENCE: 7,       // Col G
  AGE: 8,              // Col H
  BIOLOGICAL_SEX: 9,   // Col I
  HEIGHT_FEET: 10,     // Col J
  HEIGHT_INCHES: 11,   // Col K
  CURRENT_WEIGHT: 12,  // Col L
  GOAL_WEIGHT: 13,     // Col M
  ACTIVITY_LEVEL: 14,  // Col N
  TARGET_CALORIES: 15, // Col O
  PROTEIN: 16,         // Col P
  CARBS: 17,           // Col Q
  FAT: 18,             // Col R
  ACCESS_KEY: 19,      // Col S
  NOTES: 20,           // Col T
  STATUS: 21,          // Col U
  LAST_UPDATED: 22     // Col V
};

/**
 * Calculates Mifflin-St Jeor TDEE and Target Macronutrients
 * (Protein, Carbs, Fat) based on athlete biometrics and goal objectives.
 */
function calculateAthleteMacros(weightLbs, goalWeightLbs, heightFt, heightIn, age, sex, activityLevelStr, goalObjectiveStr) {
  var wLbs = parseFloat(weightLbs) || 180;
  var gWLbs = parseFloat(goalWeightLbs) || wLbs;
  var hFt = parseFloat(heightFt) || 5;
  var hIn = parseFloat(heightIn) || 10;
  var a = parseFloat(age) || 28;
  var isFemale = String(sex || '').toLowerCase().indexOf('female') !== -1 || String(sex || '').toLowerCase() === 'f';
  
  // Unit conversions
  var weightKg = wLbs * 0.45359237;
  var totalInches = (hFt * 12) + hIn;
  var heightCm = totalInches * 2.54;
  
  // Mifflin-St Jeor BMR
  var bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * a) + (isFemale ? -161 : 5);
  
  // Activity Multiplier
  var actMult = 1.55;
  var actStr = String(activityLevelStr || '').toLowerCase();
  if (actStr.indexOf('sedentary') !== -1 || actStr === '1.2') {
    actMult = 1.2;
  } else if (actStr.indexOf('light') !== -1 || actStr === '1.375') {
    actMult = 1.375;
  } else if (actStr.indexOf('very active') !== -1 || actStr === '1.725') {
    actMult = 1.725;
  } else if (actStr.indexOf('extreme') !== -1 || actStr === '1.9') {
    actMult = 1.9;
  } else if (actStr.indexOf('moderate') !== -1 || actStr === '1.55') {
    actMult = 1.55;
  }
  
  var tdee = Math.round(bmr * actMult);
  var targetCalories = tdee;
  
  // Goal adjustments
  var goalStr = String(goalObjectiveStr || '').toLowerCase();
  if (goalStr.indexOf('fat loss') !== -1 || goalStr.indexOf('shred') !== -1 || goalStr.indexOf('cut') !== -1 || (gWLbs < wLbs - 2)) {
    targetCalories = Math.max(1400, tdee - 500); // 500 kcal deficit
  } else if (goalStr.indexOf('hypertrophy') !== -1 || goalStr.indexOf('muscle') !== -1 || goalStr.indexOf('strength') !== -1 || goalStr.indexOf('bulk') !== -1 || (gWLbs > wLbs + 2)) {
    targetCalories = tdee + 350; // 350 kcal surplus
  } else {
    targetCalories = tdee; // Maintenance / Recomposition
  }
  
  // Protein: 1.0g per lb of bodyweight (capped or aligned with goal weight)
  var proteinGrams = Math.round(Math.min(wLbs, gWLbs > 0 ? gWLbs : wLbs) * 1.0);
  if (proteinGrams < 90) proteinGrams = 90;
  var proteinCalories = proteinGrams * 4;
  
  // Fat: 25% of target daily calories
  var fatCalories = targetCalories * 0.25;
  var fatGrams = Math.round(fatCalories / 9);
  if (fatGrams < 35) fatGrams = 35;
  var actualFatCalories = fatGrams * 9;
  
  // Carbs: Remaining calories
  var remainingCalories = Math.max(200, targetCalories - proteinCalories - actualFatCalories);
  var carbGrams = Math.round(remainingCalories / 4);
  
  return {
    calories: targetCalories,
    protein: proteinGrams,
    carbs: carbGrams,
    fat: fatGrams,
    summary: targetCalories + ' kcal | ' + proteinGrams + 'g P / ' + carbGrams + 'g C / ' + fatGrams + 'g F'
  };
}

// Exact 8-Column Schema for 'Athlete Data' spreadsheet
var ATHLETE_HEADERS = [
  'Login Timestamp',
  'username log in',
  '30 Day Shred Status',
  'Supplement Protocol',
  'Nutrition Goals & Macros',
  'Athlete Message / Notes',
  'Last Updated',
  'Log Out TIme Stamp'
];

var ATHLETE_COLS = {
  LOGIN_TIMESTAMP: 1,      // Col A: Login Timestamp
  USERNAME: 2,             // Col B: username log in
  SHRED_STATUS: 3,         // Col C: 30 Day Shred Status
  SUPPLEMENT_PROTOCOL: 4,  // Col D: Supplement Protocol
  NUTRITION_GOALS: 5,      // Col E: Nutrition Goals & Macros
  MESSAGE_NOTES: 6,        // Col F: Athlete Message / Notes
  LAST_UPDATED: 7,         // Col G: Last Updated
  LOGOUT_TIMESTAMP: 8      // Col H: Log Out TIme Stamp
};

/**
 * One-click setup: Configures "Athlete Data", "athlete_registration", and "ksp_leads".
 */
function setupAllSheets() {
  setupAthleteRegistrationSheet();
  setupAthleteDataSheet();
  setupLeadsSheet();
  Logger.log('All KROME Google Sheets (athlete_registration, Athlete_Data, ksp_leads) configured successfully!');
}

/**
 * Configures/upgrades the "athlete_registration" sheet with all 18 columns:
 */
function setupAthleteRegistrationSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getAthleteRegistrationSheet(ss, true);

  var headerRange = sheet.getRange(1, 1, 1, REGISTRATION_HEADERS.length);
  headerRange.setValues([REGISTRATION_HEADERS]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#0d1117');
  headerRange.setFontColor('#ffd447');
  headerRange.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);

  for (var col = 1; col <= REGISTRATION_HEADERS.length; col++) {
    sheet.autoResizeColumn(col);
  }

  if (sheet.getLastRow() === 1) {
    var now = new Date().toLocaleString();

    sheet.appendRow([
      now,                                                            // Col A: Timestamp
      'Jordan Hayes',                                                 // Col B: Full Name
      'new.athlete@kromesp.com',                                      // Col C: Email
      '(405) 555-0144',                                               // Col D: Phone
      'No Program Set Up Yet (New Athlete Onboarding & Consultation)',// Col E: Program Status
      'Body Recomposition & Lean Muscle Building',                    // Col F: Primary Goal Objective
      'Beginner (0-1 years consistent training)',                     // Col G: Experience Level
      26,                                                             // Col H: Age
      'Male',                                                         // Col I: Biological Sex
      5,                                                              // Col J: Height (Feet)
      11,                                                             // Col K: Height (Inches)
      '185',                                                          // Col L: Current Weight
      '175',                                                          // Col M: Goal Weight
      'Moderately Active (Moderate exercise 3-5 days/wk)',            // Col N: Activity Level
      2450,                                                           // Col O: Target Calories (kcal)
      180,                                                            // Col P: Protein (g)
      260,                                                            // Col Q: Carbs (g)
      68,                                                             // Col R: Fat (g)
      'ATHLETE2026',                                                  // Col S: Access Key
      'New athlete registered without pre-assigned program. Needs baseline assessment & strategy call.', // Col T: Notes
      'New Registered - Awaiting Assessment / Call',                  // Col U: Status / Coach Action
      now                                                             // Col V: Last Updated
    ]);

    sheet.appendRow([
      now,                                                            // Col A: Timestamp
      'Marcus Vance',                                                 // Col B: Full Name
      'marcus.v@athlete.com',                                         // Col C: Email
      '(405) 555-0192',                                               // Col D: Phone
      '30-Day Shred Challenge Manual',                                // Col E: Program Status
      'Rapid Fat Loss & Muscular Definition',                         // Col F: Primary Goal Objective
      'Intermediate (2-4 years consistent training)',                 // Col G: Experience Level
      32,                                                             // Col H: Age
      'Male',                                                         // Col I: Biological Sex
      6,                                                              // Col J: Height (Feet)
      1,                                                              // Col K: Height (Inches)
      '205',                                                          // Col L: Current Weight
      '192',                                                          // Col M: Goal Weight
      'Very Active (Hard exercise 6-7 days/wk)',                      // Col N: Activity Level
      2280,                                                           // Col O: Target Calories (kcal)
      195,                                                            // Col P: Protein (g)
      230,                                                            // Col Q: Carbs (g)
      63,                                                             // Col R: Fat (g)
      'Protocol30',                                                   // Col S: Access Key
      'Targeting fat loss while maintaining strength on compound lifts.', // Col T: Notes
      'Active Athlete - Enrolled',                                    // Col U: Status / Coach Action
      now                                                             // Col V: Last Updated
    ]);
  }

  Logger.log('athlete_registration sheet setup complete with 22 columns (including macro calculations)!');
}

/**
 * Configures the "Athlete Data" sheet with the exact 8 columns:
 * Login Timestamp | username log in | 30 Day Shred Status | Supplement Protocol | Nutrition Goals & Macros | Athlete Message / Notes | Last Updated | Log Out TIme Stamp
 */
function setupAthleteDataSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getAthleteSheet(ss, true);

  // Set the 8 exact columns
  var headerRange = sheet.getRange(1, 1, 1, ATHLETE_HEADERS.length);
  headerRange.setValues([ATHLETE_HEADERS]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#0d1117');
  headerRange.setFontColor('#ffd447');
  headerRange.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);

  // Set auto-fit column widths
  for (var col = 1; col <= ATHLETE_HEADERS.length; col++) {
    sheet.autoResizeColumn(col);
  }

  // Populate starter rows if sheet has only the header row
  if (sheet.getLastRow() === 1) {
    var now = new Date().toLocaleString();

    sheet.appendRow([
      now,
      'swolecode@gmail.com',
      'Day 14/30 | Lane 2 (2,000 kcal) | Current: 184 lbs (Goal: 175 lbs)',
      'Creatine Monohydrate (5g), Whey Isolate (30g), Vitamin D3 (5,000 IU), Magnesium (400mg), Omega-3 (2,000mg)',
      'TDEE: 2,350 kcal | P: 195g | C: 220g | F: 65g',
      'Phase 2 Metabolic Conditioning - maintaining compound strength mechanics.',
      now,
      '' // Log Out TIme Stamp empty while active
    ]);

    sheet.appendRow([
      now,
      'marcus.v@athlete.com',
      'Day 7/30 | Lane 3 (2,400 kcal) | Current: 205 lbs (Goal: 192 lbs)',
      'L-Glutamine (10g), Multivitamin + Zinc, Tart Cherry Extract',
      'TDEE: 2,600 kcal | P: 210g | C: 250g | F: 75g',
      'Week 1 completed with clean macros and high energy.',
      now,
      ''
    ]);

    sheet.appendRow([
      now,
      'sarah.t@athlete.com',
      'Day 21/30 | Lane 1 (1,600 kcal) | Current: 138 lbs (Goal: 132 lbs)',
      'Whey Isolate (25g), Iron + B-Complex, Magnesium Bisglycinate (300mg)',
      'TDEE: 1,850 kcal | P: 140g | C: 155g | F: 45g',
      'Plateau broken after Lane 1 macro recalibration.',
      now,
      ''
    ]);
  }

  Logger.log('Athlete Data sheet setup complete with 8 requested columns!');
}

/**
 * Configures the "ksp_leads" sheet
 */
function setupLeadsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(LEADS_TAB_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(LEADS_TAB_NAME);
  }

  var headers = [
    'Timestamp',
    'Full Name',
    'Email',
    'Phone',
    'Program',
    'Athlete Level',
    'Preferred Contact',
    '30-Day Shred Status',
    'Supplement Protocol',
    'Nutrition Goals & Macros',
    'Athlete Message / Notes',
    'Last Updated'
  ];

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#111827');
  headerRange.setFontColor('#ffd447');
  sheet.setFrozenRows(1);
}

/**
 * Dynamically resolves column indexes from Row 1 headers to guarantee
 * compatibility even if columns are slightly shifted or case-modified.
 */
function getAthleteColumnMap(sheet) {
  var map = {
    LOGIN_TIMESTAMP: ATHLETE_COLS.LOGIN_TIMESTAMP,
    USERNAME: ATHLETE_COLS.USERNAME,
    SHRED_STATUS: ATHLETE_COLS.SHRED_STATUS,
    SUPPLEMENT_PROTOCOL: ATHLETE_COLS.SUPPLEMENT_PROTOCOL,
    NUTRITION_GOALS: ATHLETE_COLS.NUTRITION_GOALS,
    MESSAGE_NOTES: ATHLETE_COLS.MESSAGE_NOTES,
    LAST_UPDATED: ATHLETE_COLS.LAST_UPDATED,
    LOGOUT_TIMESTAMP: ATHLETE_COLS.LOGOUT_TIMESTAMP
  };

  if (!sheet || sheet.getLastRow() < 1) return map;

  var numCols = Math.max(sheet.getLastColumn(), 8);
  var headerValues = sheet.getRange(1, 1, 1, numCols).getValues()[0];

  for (var i = 0; i < headerValues.length; i++) {
    var h = (headerValues[i] || '').toString().trim().toLowerCase();
    if (h.indexOf('out') !== -1 && h.indexOf('time') !== -1) {
      map.LOGOUT_TIMESTAMP = i + 1;
    } else if (h.indexOf('login') !== -1 && h.indexOf('time') !== -1) {
      map.LOGIN_TIMESTAMP = i + 1;
    } else if (h.indexOf('user') !== -1 || h.indexOf('log in') !== -1 || h === 'email') {
      map.USERNAME = i + 1;
    } else if (h.indexOf('shred') !== -1 || h.indexOf('30 day') !== -1) {
      map.SHRED_STATUS = i + 1;
    } else if (h.indexOf('supplement') !== -1) {
      map.SUPPLEMENT_PROTOCOL = i + 1;
    } else if (h.indexOf('nutrition') !== -1 || h.indexOf('macro') !== -1) {
      map.NUTRITION_GOALS = i + 1;
    } else if (h.indexOf('message') !== -1 || h.indexOf('note') !== -1) {
      map.MESSAGE_NOTES = i + 1;
    } else if (h.indexOf('updated') !== -1) {
      map.LAST_UPDATED = i + 1;
    }
  }

  return map;
}

/**
 * Intelligent helper: parses Shred Day, Calorie Lane, and weights from "30 Day Shred Status"
 */
function parseShredStatus(statusStr) {
  var res = {
    shredDay: 1,
    shredLane: 'Lane 2 (2,000 kcal)',
    currentWeight: '180',
    goalWeight: '170',
    rawStatus: statusStr ? String(statusStr).trim() : ''
  };

  if (!statusStr) return res;
  var str = statusStr.toString();

  // Day match: e.g. "Day 14" or "Day 14/30"
  var dayMatch = str.match(/Day\s*(\d+)/i);
  if (dayMatch) {
    res.shredDay = parseInt(dayMatch[1], 10);
  }

  // Calorie Lane match
  if (str.match(/Lane\s*1|1[,.]?600/i)) {
    res.shredLane = 'Lane 1 (1,600 kcal)';
  } else if (str.match(/Lane\s*3|2[,.]?400/i)) {
    res.shredLane = 'Lane 3 (2,400 kcal)';
  } else if (str.match(/Lane\s*2|2[,.]?000/i)) {
    res.shredLane = 'Lane 2 (2,000 kcal)';
  }

  // Current weight match
  var curMatch = str.match(/(?:Current[:\s]*|Weight[:\s]*)(\d+(?:\.\d+)?)\s*lbs?/i) || str.match(/(\d+(?:\.\d+)?)\s*lbs/i);
  if (curMatch) {
    res.currentWeight = curMatch[1];
  }

  // Goal weight match
  var goalMatch = str.match(/Goal[:\s]*(\d+(?:\.\d+)?)\s*lbs?/i);
  if (goalMatch) {
    res.goalWeight = goalMatch[1];
  }

  return res;
}

/**
 * Formats "30 Day Shred Status" string from incoming update parameters
 */
function formatShredStatus(existingStr, payload) {
  if (payload.shredStatus && payload.shredDay === undefined && payload.currentWeight === undefined) {
    return String(payload.shredStatus).trim();
  }

  var current = parseShredStatus(existingStr);
  var day = payload.shredDay !== undefined ? payload.shredDay : current.shredDay;
  var lane = payload.shredLane !== undefined ? payload.shredLane : current.shredLane;
  var curW = payload.currentWeight !== undefined ? payload.currentWeight : current.currentWeight;
  var goalW = payload.goalWeight !== undefined ? payload.goalWeight : current.goalWeight;

  return 'Day ' + day + '/30 | ' + lane + ' | Current: ' + curW + ' lbs (Goal: ' + goalW + ' lbs)';
}

/**
 * HTTP GET Request Handler
 * Supported actions:
 * - action=get_athlete&email=... / username=... -> Returns athlete record
 * - action=athlete_login&email=... -> Records Login Timestamp and returns athlete
 * - action=athlete_logout&email=... -> Records Log Out TIme Stamp
 * - action=setup -> Re-runs setupAthleteDataSheet()
 */
function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = (params.action || 'get_athlete').toLowerCase();
    var user = (params.username || params.email || '').trim().toLowerCase();
    var callback = params.callback;

    if (action === 'setup_all' || action === 'setup_all_sheets') {
      setupAllSheets();
      return jsonResponse({ success: true, message: 'All KROME Google Sheets configured successfully.' }, callback);
    }

    if (action === 'setup_athlete_registration' || action === 'setup_registration') {
      setupAthleteRegistrationSheet();
      return jsonResponse({ success: true, message: 'athlete_registration sheet configured with 13 columns.' }, callback);
    }

    if (action === 'setup' || action === 'setup_athlete_data') {
      setupAthleteDataSheet();
      return jsonResponse({ success: true, message: 'Athlete Data sheet configured with 8 columns.' }, callback);
    }

    if (!user) {
      return jsonResponse({ success: false, error: 'Username or email parameter is required.' }, callback);
    }

    if (action === 'get_athlete' || action === 'get_athlete_data' || action === 'get') {
      var athleteResult = findAthleteInSheet(user);
      return jsonResponse(athleteResult, callback);
    }

    if (action === 'athlete_login' || action === 'login') {
      var loginRes = recordAthleteLogin(user);
      return jsonResponse(loginRes, callback);
    }

    if (action === 'athlete_logout' || action === 'logout') {
      var logoutRes = recordAthleteLogout(user);
      return jsonResponse(logoutRes, callback);
    }

    var defaultResult = findAthleteInSheet(user);
    return jsonResponse(defaultResult, callback);

  } catch (err) {
    return jsonResponse({ success: false, error: 'Apps Script error: ' + err.toString() });
  }
}

/**
 * HTTP POST Request Handler
 * Supported actions:
 * - action=athlete_login -> Updates 'Login Timestamp' & clears 'Log Out TIme Stamp'
 * - action=athlete_logout -> Updates 'Log Out TIme Stamp'
 * - action=update_athlete -> Updates '30 Day Shred Status', 'Supplement Protocol', 'Nutrition Goals & Macros', 'Athlete Message / Notes', 'Last Updated'
 * - action=submit -> Appends to 'ksp_leads'
 */
function doPost(e) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (_) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    var action = (payload.action || 'submit').toLowerCase();
    var user = (payload.username || payload.email || '').trim().toLowerCase();

    // 1. RECORD ATHLETE LOGIN TIMESTAMP
    if (action === 'athlete_login' || action === 'login') {
      if (!user) return jsonResponse({ success: false, error: 'Username/Email required for login.' });
      return jsonResponse(recordAthleteLogin(user));
    }

    // 2. RECORD ATHLETE LOGOUT TIMESTAMP
    if (action === 'athlete_logout' || action === 'logout') {
      if (!user) return jsonResponse({ success: false, error: 'Username/Email required for logout.' });
      return jsonResponse(recordAthleteLogout(user));
    }

    // 3. UPDATE ATHLETE ROW
    if (action === 'update_athlete' || action === 'update') {
      if (!user) return jsonResponse({ success: false, error: 'Username/Email required to update athlete.' });
      return jsonResponse(updateAthleteInSheet(user, payload));
    }

    // 4. ATHLETE REGISTER
    if (action === 'athlete_register') {
      if (!user) return jsonResponse({ success: false, error: 'Username/Email required to register.' });
      return jsonResponse(registerAthlete(user, payload));
    }

    // 5. LEAD FORM SUBMISSION
    return jsonResponse(appendLead(payload));

  } catch (err) {
    return jsonResponse({ success: false, error: 'Execution error: ' + err.toString() });
  }
}

/**
 * Finds an athlete in the 'Athlete_Data' sheet by username/email
 */
function findAthleteInSheet(userIdentifier) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getAthleteSheet(ss);
  if (!sheet) {
    return { found: false, error: 'Athlete_Data tab not found.' };
  }

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return { found: false, error: 'Athlete_Data tab has no rows.' };
  }

  var cols = getAthleteColumnMap(sheet);
  var numCols = Math.max(sheet.getLastColumn(), 8);
  var data = sheet.getRange(2, 1, lastRow - 1, numCols).getValues();

  for (var i = 0; i < data.length; i++) {
    var cellUser = (data[i][cols.USERNAME - 1] || '').toString().trim().toLowerCase();
    if (cellUser === userIdentifier) {
      var rowNum = i + 2;
      var row = data[i];

      var rawShredStatus = row[cols.SHRED_STATUS - 1] ? String(row[cols.SHRED_STATUS - 1]) : '';
      var parsedStatus = parseShredStatus(rawShredStatus);

      return {
        found: true,
        success: true,
        rowNumber: rowNum,
        athlete: {
          rowNumber: rowNum,
          username: cellUser,
          email: cellUser,
          fullName: (payloadFullName(cellUser) || 'KROME Athlete'),
          loginTimestamp: row[cols.LOGIN_TIMESTAMP - 1] ? String(row[cols.LOGIN_TIMESTAMP - 1]) : '',
          shredStatus: rawShredStatus,
          shredDay: parsedStatus.shredDay,
          shredLane: parsedStatus.shredLane,
          currentWeight: parsedStatus.currentWeight,
          goalWeight: parsedStatus.goalWeight,
          supplementProtocol: row[cols.SUPPLEMENT_PROTOCOL - 1] ? String(row[cols.SUPPLEMENT_PROTOCOL - 1]) : '',
          supplementStack: row[cols.SUPPLEMENT_PROTOCOL - 1] ? String(row[cols.SUPPLEMENT_PROTOCOL - 1]) : '',
          nutritionGoals: row[cols.NUTRITION_GOALS - 1] ? String(row[cols.NUTRITION_GOALS - 1]) : '',
          nutritionMacros: row[cols.NUTRITION_GOALS - 1] ? String(row[cols.NUTRITION_GOALS - 1]) : '',
          athleteMessage: row[cols.MESSAGE_NOTES - 1] ? String(row[cols.MESSAGE_NOTES - 1]) : '',
          notes: row[cols.MESSAGE_NOTES - 1] ? String(row[cols.MESSAGE_NOTES - 1]) : '',
          lastUpdated: row[cols.LAST_UPDATED - 1] ? String(row[cols.LAST_UPDATED - 1]) : '',
          logoutTimestamp: row[cols.LOGOUT_TIMESTAMP - 1] ? String(row[cols.LOGOUT_TIMESTAMP - 1]) : '',
          hasShredAccess: true,
          hasSupplementAccess: true,
          hasNutritionAccess: true
        }
      };
    }
  }

  return { found: false, success: false, error: 'Athlete not found in Athlete_Data tab.' };
}

/**
 * Records 'Login Timestamp' and clears 'Log Out TIme Stamp' for athlete
 */
function recordAthleteLogin(userIdentifier) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getAthleteSheet(ss, true);

  var cols = getAthleteColumnMap(sheet);
  var lastRow = sheet.getLastRow();
  var now = new Date().toLocaleString();
  var targetRow = -1;

  if (lastRow >= 2) {
    var users = sheet.getRange(2, cols.USERNAME, lastRow - 1, 1).getValues();
    for (var i = 0; i < users.length; i++) {
      if ((users[i][0] || '').toString().trim().toLowerCase() === userIdentifier) {
        targetRow = i + 2;
        break;
      }
    }
  }

  if (targetRow >= 2) {
    sheet.getRange(targetRow, cols.LOGIN_TIMESTAMP).setValue(now);
    sheet.getRange(targetRow, cols.LOGOUT_TIMESTAMP).setValue(''); // Clear logout timestamp
    sheet.getRange(targetRow, cols.LAST_UPDATED).setValue(now);
    var updatedData = findAthleteInSheet(userIdentifier);
    return {
      success: true,
      message: 'Login timestamp recorded for row ' + targetRow,
      row: targetRow,
      loginTimestamp: now,
      athlete: updatedData.athlete || null
    };
  } else {
    // New athlete record
    sheet.appendRow([
      now,                                                                 // Login Timestamp
      userIdentifier,                                                      // username log in
      'Day 1/30 | Lane 2 (2,000 kcal) | Current: 180 lbs (Goal: 170 lbs)', // 30 Day Shred Status
      'Creatine Monohydrate (5g), Whey Isolate (30g), Daily Multivitamin',// Supplement Protocol
      'TDEE: 2,200 kcal | P: 180g | C: 200g | F: 60g',                     // Nutrition Goals & Macros
      'First login via Athlete Portal',                                    // Athlete Message / Notes
      now,                                                                 // Last Updated
      ''                                                                   // Log Out TIme Stamp
    ]);

    var newAthlete = findAthleteInSheet(userIdentifier);
    return {
      success: true,
      message: 'New athlete initialized in Athlete_Data tab.',
      row: sheet.getLastRow(),
      loginTimestamp: now,
      athlete: newAthlete.athlete || null
    };
  }
}

/**
 * Records 'Log Out TIme Stamp' for athlete
 */
function recordAthleteLogout(userIdentifier) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getAthleteSheet(ss);
  if (!sheet) {
    return { success: false, error: 'Athlete_Data tab not found.' };
  }

  var cols = getAthleteColumnMap(sheet);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return { success: false, error: 'Athlete_Data tab is empty.' };
  }

  var users = sheet.getRange(2, cols.USERNAME, lastRow - 1, 1).getValues();
  var targetRow = -1;

  for (var i = 0; i < users.length; i++) {
    if ((users[i][0] || '').toString().trim().toLowerCase() === userIdentifier) {
      targetRow = i + 2;
      break;
    }
  }

  if (targetRow === -1) {
    return { success: false, error: 'Athlete username not found.' };
  }

  var now = new Date().toLocaleString();
  sheet.getRange(targetRow, cols.LOGOUT_TIMESTAMP).setValue(now);
  sheet.getRange(targetRow, cols.LAST_UPDATED).setValue(now);

  return {
    success: true,
    message: 'Log Out TIme Stamp recorded in row ' + targetRow,
    row: targetRow,
    logoutTimestamp: now
  };
}

/**
 * Updates athlete's progress in 'Athlete Data'
 */
function updateAthleteInSheet(userIdentifier, payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getAthleteSheet(ss, true);

  var cols = getAthleteColumnMap(sheet);
  var lastRow = sheet.getLastRow();
  var targetRow = -1;

  if (lastRow >= 2) {
    var users = sheet.getRange(2, cols.USERNAME, lastRow - 1, 1).getValues();
    for (var i = 0; i < users.length; i++) {
      if ((users[i][0] || '').toString().trim().toLowerCase() === userIdentifier) {
        targetRow = i + 2;
        break;
      }
    }
  }

  var now = new Date().toLocaleString();

  if (targetRow === -1) {
    // Append new row if not found
    var initialShred = formatShredStatus('', payload);
    var initialSupp = payload.supplementProtocol || payload.supplementStack || 'Creatine Monohydrate (5g), Whey Isolate (30g)';
    var initialNutr = payload.nutritionGoals || payload.nutritionMacros || 'TDEE: 2,200 kcal | P: 180g | C: 200g | F: 60g';
    var initialNotes = payload.athleteMessage || payload.notes || 'Created via App update';

    sheet.appendRow([
      now,            // Login Timestamp
      userIdentifier, // username log in
      initialShred,   // 30 Day Shred Status
      initialSupp,    // Supplement Protocol
      initialNutr,    // Nutrition Goals & Macros
      initialNotes,   // Athlete Message / Notes
      now,            // Last Updated
      ''              // Log Out TIme Stamp
    ]);

    return { success: true, message: 'Athlete row created with updated data.', row: sheet.getLastRow(), lastUpdated: now };
  }

  // Update existing row
  var currentShredStatus = sheet.getRange(targetRow, cols.SHRED_STATUS).getValue();
  var updatedShredStatus = formatShredStatus(currentShredStatus, payload);
  sheet.getRange(targetRow, cols.SHRED_STATUS).setValue(updatedShredStatus);

  if (payload.supplementProtocol !== undefined || payload.supplementStack !== undefined) {
    var supp = payload.supplementProtocol !== undefined ? payload.supplementProtocol : payload.supplementStack;
    sheet.getRange(targetRow, cols.SUPPLEMENT_PROTOCOL).setValue(supp);
  }

  if (payload.nutritionGoals !== undefined || payload.nutritionMacros !== undefined) {
    var nutr = payload.nutritionGoals !== undefined ? payload.nutritionGoals : payload.nutritionMacros;
    sheet.getRange(targetRow, cols.NUTRITION_GOALS).setValue(nutr);
  }

  if (payload.athleteMessage !== undefined || payload.notes !== undefined) {
    var note = payload.athleteMessage !== undefined ? payload.athleteMessage : payload.notes;
    sheet.getRange(targetRow, cols.MESSAGE_NOTES).setValue(note);
  }

  if (payload.loginTimestamp) {
    sheet.getRange(targetRow, cols.LOGIN_TIMESTAMP).setValue(payload.loginTimestamp);
  }

  if (payload.logoutTimestamp) {
    sheet.getRange(targetRow, cols.LOGOUT_TIMESTAMP).setValue(payload.logoutTimestamp);
  }

  sheet.getRange(targetRow, cols.LAST_UPDATED).setValue(now);

  return {
    success: true,
    message: 'Athlete data updated in Google Sheet row ' + targetRow,
    row: targetRow,
    lastUpdated: now
  };
}

/**
 * Dynamically resolves column indexes for 'athlete_registration' tab
 */
function getRegistrationColumnMap(sheet) {
  var map = {
    TIMESTAMP: REG_COLS.TIMESTAMP,
    FULL_NAME: REG_COLS.FULL_NAME,
    EMAIL: REG_COLS.EMAIL,
    PHONE: REG_COLS.PHONE,
    PROGRAM: REG_COLS.PROGRAM,
    GOAL_OBJECTIVE: REG_COLS.GOAL_OBJECTIVE,
    EXPERIENCE: REG_COLS.EXPERIENCE,
    AGE: REG_COLS.AGE,
    BIOLOGICAL_SEX: REG_COLS.BIOLOGICAL_SEX,
    HEIGHT_FEET: REG_COLS.HEIGHT_FEET,
    HEIGHT_INCHES: REG_COLS.HEIGHT_INCHES,
    CURRENT_WEIGHT: REG_COLS.CURRENT_WEIGHT,
    GOAL_WEIGHT: REG_COLS.GOAL_WEIGHT,
    ACTIVITY_LEVEL: REG_COLS.ACTIVITY_LEVEL,
    TARGET_CALORIES: REG_COLS.TARGET_CALORIES,
    PROTEIN: REG_COLS.PROTEIN,
    CARBS: REG_COLS.CARBS,
    FAT: REG_COLS.FAT,
    ACCESS_KEY: REG_COLS.ACCESS_KEY,
    NOTES: REG_COLS.NOTES,
    STATUS: REG_COLS.STATUS,
    LAST_UPDATED: REG_COLS.LAST_UPDATED
  };

  if (!sheet || sheet.getLastRow() < 1) return map;

  var numCols = Math.max(sheet.getLastColumn(), REGISTRATION_HEADERS.length);
  var headerValues = sheet.getRange(1, 1, 1, numCols).getValues()[0];

  for (var i = 0; i < headerValues.length; i++) {
    var h = (headerValues[i] || '').toString().trim().toLowerCase();
    
    if (h.indexOf('timestamp') !== -1 && h.indexOf('reg') !== -1) {
      map.TIMESTAMP = i + 1;
    } else if (h.indexOf('name') !== -1) {
      map.FULL_NAME = i + 1;
    } else if (h.indexOf('email') !== -1 || h.indexOf('user') !== -1) {
      map.EMAIL = i + 1;
    } else if (h.indexOf('phone') !== -1) {
      map.PHONE = i + 1;
    } else if (h.indexOf('program') !== -1 || (h.indexOf('status') !== -1 && h.indexOf('coach') === -1)) {
      map.PROGRAM = i + 1;
    } else if (h.indexOf('objective') !== -1 || (h.indexOf('goal') !== -1 && h.indexOf('weight') === -1)) {
      map.GOAL_OBJECTIVE = i + 1;
    } else if (h.indexOf('experience') !== -1 || (h.indexOf('level') !== -1 && h.indexOf('activity') === -1)) {
      map.EXPERIENCE = i + 1;
    } else if (h === 'age' || (h.indexOf('age') !== -1 && h.indexOf('message') === -1)) {
      map.AGE = i + 1;
    } else if (h.indexOf('sex') !== -1 || h.indexOf('gender') !== -1) {
      map.BIOLOGICAL_SEX = i + 1;
    } else if (h.indexOf('feet') !== -1 || h.indexOf('ft') !== -1) {
      map.HEIGHT_FEET = i + 1;
    } else if (h.indexOf('inch') !== -1 || h.indexOf('in') !== -1) {
      map.HEIGHT_INCHES = i + 1;
    } else if (h.indexOf('current') !== -1 && h.indexOf('weight') !== -1) {
      map.CURRENT_WEIGHT = i + 1;
    } else if (h.indexOf('goal') !== -1 && h.indexOf('weight') !== -1) {
      map.GOAL_WEIGHT = i + 1;
    } else if (h.indexOf('activity') !== -1) {
      map.ACTIVITY_LEVEL = i + 1;
    } else if (h.indexOf('calorie') !== -1 || h.indexOf('tdee') !== -1 || h.indexOf('kcal') !== -1) {
      map.TARGET_CALORIES = i + 1;
    } else if (h.indexOf('protein') !== -1 || h === 'p (g)' || h === 'protein (g)') {
      map.PROTEIN = i + 1;
    } else if (h.indexOf('carb') !== -1 || h === 'c (g)' || h === 'carbs (g)') {
      map.CARBS = i + 1;
    } else if (h.indexOf('fat') !== -1 || h === 'f (g)' || h === 'fat (g)') {
      map.FAT = i + 1;
    } else if (h.indexOf('key') !== -1 || h.indexOf('pass') !== -1) {
      map.ACCESS_KEY = i + 1;
    } else if (h.indexOf('note') !== -1 || h.indexOf('background') !== -1) {
      map.NOTES = i + 1;
    } else if (h.indexOf('coach') !== -1 || h.indexOf('action') !== -1) {
      map.STATUS = i + 1;
    } else if (h.indexOf('updated') !== -1) {
      map.LAST_UPDATED = i + 1;
    }
  }

  return map;
}

/**
 * Saves or updates athlete registration in the 'athlete_registration' tab
 */
function saveAthleteRegistration(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getAthleteRegistrationSheet(ss, true);
  var cols = getRegistrationColumnMap(sheet);
  
  var now = new Date().toLocaleString();
  var email = (payload.email || payload.username || '').trim().toLowerCase();
  var fullName = payload.fullName || payload.name || 'KROME Athlete';
  var phone = payload.phone || '';
  var program = payload.program || payload.programStatus || payload.programInterest || 'No Program Set Up Yet (Onboarding)';
  var goalObjective = payload.primaryGoalObjective || payload.fitnessGoal || payload.goal || 'Fat Loss & Muscle Definition';
  var experience = payload.athleteLevel || payload.experience || 'Intermediate';
  var age = payload.age ? String(payload.age) : '';
  var biologicalSex = payload.biologicalSex || payload.gender || payload.sex || '';
  var heightFeet = payload.heightFeet || payload.height_feet || payload.heightFt || '';
  var heightInches = payload.heightInches || payload.height_inches || payload.heightIn || '';
  var currentWeight = payload.currentWeight ? String(payload.currentWeight) : '';
  var goalWeight = payload.goalWeight ? String(payload.goalWeight) : '';
  var activityLevel = payload.activityLevel || payload.activity || 'Moderately Active (3-5 days/wk)';
  var accessKey = payload.password || payload.accessKey || payload.accessCode || 'ATHLETE2026';
  var notes = payload.notes || payload.message || payload.trainingBackground || 'Registered online via KROME Athlete Portal';
  
  // Calculate or extract Macronutrient targets
  var macros = calculateAthleteMacros(
    currentWeight,
    goalWeight,
    heightFeet,
    heightInches,
    age,
    biologicalSex,
    activityLevel,
    goalObjective
  );

  var targetCalories = payload.targetCalories || payload.calories || macros.calories;
  var proteinGrams = payload.proteinGrams || payload.protein || macros.protein;
  var carbGrams = payload.carbGrams || payload.carbs || macros.carbs;
  var fatGrams = payload.fatGrams || payload.fat || macros.fat;

  var isNoProgram = !program || 
                    program.toLowerCase().indexOf('no program') !== -1 || 
                    program.toLowerCase().indexOf('pending') !== -1 || 
                    program.toLowerCase().indexOf('onboarding') !== -1;
                    
  var coachStatus = payload.status || (isNoProgram 
    ? 'New Registered - Pending Onboarding & Strategy Call' 
    : 'Active Athlete - Enrolled');

  if (!email) {
    return { success: false, error: 'Email is required for athlete registration.' };
  }

  // Ensure sheet header row has all 22 columns if needed
  if (sheet.getLastColumn() < REGISTRATION_HEADERS.length) {
    sheet.getRange(1, 1, 1, REGISTRATION_HEADERS.length).setValues([REGISTRATION_HEADERS]);
    sheet.getRange(1, 1, 1, REGISTRATION_HEADERS.length).setFontWeight('bold').setBackground('#0d1117').setFontColor('#ffd447');
    cols = getRegistrationColumnMap(sheet);
  }

  // Check if athlete email already exists in athlete_registration tab
  var lastRow = sheet.getLastRow();
  var targetRow = -1;

  if (lastRow >= 2) {
    var emailValues = sheet.getRange(2, cols.EMAIL, lastRow - 1, 1).getValues();
    for (var i = 0; i < emailValues.length; i++) {
      if ((emailValues[i][0] || '').toString().trim().toLowerCase() === email) {
        targetRow = i + 2;
        break;
      }
    }
  }

  if (targetRow >= 2) {
    // Update existing row
    sheet.getRange(targetRow, cols.FULL_NAME).setValue(fullName);
    if (phone) sheet.getRange(targetRow, cols.PHONE).setValue(phone);
    sheet.getRange(targetRow, cols.PROGRAM).setValue(program);
    sheet.getRange(targetRow, cols.GOAL_OBJECTIVE).setValue(goalObjective);
    sheet.getRange(targetRow, cols.EXPERIENCE).setValue(experience);
    if (age) sheet.getRange(targetRow, cols.AGE).setValue(age);
    if (biologicalSex) sheet.getRange(targetRow, cols.BIOLOGICAL_SEX).setValue(biologicalSex);
    if (heightFeet) sheet.getRange(targetRow, cols.HEIGHT_FEET).setValue(heightFeet);
    if (heightInches !== '') sheet.getRange(targetRow, cols.HEIGHT_INCHES).setValue(heightInches);
    if (currentWeight) sheet.getRange(targetRow, cols.CURRENT_WEIGHT).setValue(currentWeight);
    if (goalWeight) sheet.getRange(targetRow, cols.GOAL_WEIGHT).setValue(goalWeight);
    if (activityLevel) sheet.getRange(targetRow, cols.ACTIVITY_LEVEL).setValue(activityLevel);
    if (cols.TARGET_CALORIES) sheet.getRange(targetRow, cols.TARGET_CALORIES).setValue(targetCalories);
    if (cols.PROTEIN) sheet.getRange(targetRow, cols.PROTEIN).setValue(proteinGrams);
    if (cols.CARBS) sheet.getRange(targetRow, cols.CARBS).setValue(carbGrams);
    if (cols.FAT) sheet.getRange(targetRow, cols.FAT).setValue(fatGrams);
    if (accessKey) sheet.getRange(targetRow, cols.ACCESS_KEY).setValue(accessKey);
    if (notes) sheet.getRange(targetRow, cols.NOTES).setValue(notes);
    sheet.getRange(targetRow, cols.STATUS).setValue(coachStatus);
    sheet.getRange(targetRow, cols.LAST_UPDATED).setValue(now);
  } else {
    // Append new athlete registration row (22 columns)
    sheet.appendRow([
      now,            // Col A: Registration Timestamp
      fullName,       // Col B: Full Name
      email,          // Col C: Email / Username
      phone,          // Col D: Phone Number
      program,        // Col E: Program / Enrollment Status
      goalObjective,  // Col F: Primary Goal Objective
      experience,     // Col G: Experience Level
      age,            // Col H: Age
      biologicalSex,  // Col I: Biological Sex
      heightFeet,     // Col J: Height (Feet)
      heightInches,   // Col K: Height (Inches)
      currentWeight,  // Col L: Current Weight (lbs)
      goalWeight,     // Col M: Goal Weight (lbs)
      activityLevel,  // Col N: Activity Level
      targetCalories, // Col O: Target Calories (kcal)
      proteinGrams,   // Col P: Protein (g)
      carbGrams,      // Col Q: Carbs (g)
      fatGrams,       // Col R: Fat (g)
      accessKey,      // Col S: Access Key / Passkey
      notes,          // Col T: Training Background & Coach Notes
      coachStatus,    // Col U: Status / Coach Action
      now             // Col V: Last Updated
    ]);
    targetRow = sheet.getLastRow();
  }

  // Also sync to Athlete_Data if available
  try {
    updateAthleteInSheet(email, {
      athleteMessage: notes,
      shredStatus: isNoProgram ? 'New Athlete Registration (Pending Program)' : program,
      currentWeight: currentWeight || '180',
      goalWeight: goalWeight || '170'
    });
  } catch (_) {}

  // 1. Dispatch Notification Email to Coaches
  sendCoachRegistrationAlert({
    fullName: fullName,
    email: email,
    phone: phone,
    program: program,
    goalObjective: goalObjective,
    experience: experience,
    age: age,
    biologicalSex: biologicalSex,
    heightFeet: heightFeet,
    heightInches: heightInches,
    currentWeight: currentWeight,
    goalWeight: goalWeight,
    activityLevel: activityLevel,
    targetCalories: targetCalories,
    proteinGrams: proteinGrams,
    carbGrams: carbGrams,
    fatGrams: fatGrams,
    accessKey: accessKey,
    notes: notes,
    isNoProgram: isNoProgram,
    timestamp: now
  });

  // 2. Dispatch Welcome & Strategy Call Email to New Athlete
  sendAthleteWelcomeEmail({
    fullName: fullName,
    email: email,
    program: program,
    targetCalories: targetCalories,
    proteinGrams: proteinGrams,
    carbGrams: carbGrams,
    fatGrams: fatGrams,
    accessKey: accessKey,
    isNoProgram: isNoProgram
  });

  return {
    success: true,
    message: 'Athlete registration saved to athlete_registration sheet (Row ' + targetRow + ')',
    row: targetRow,
    email: email,
    fullName: fullName,
    macros: {
      calories: targetCalories,
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams
    },
    tab: REGISTRATION_TAB_NAME
  };
}

/**
 * Sends formatted alert to coaching staff with biometrics and calculated macro targets
 */
function sendCoachRegistrationAlert(data) {
  try {
    var heightDisplay = (data.heightFeet ? data.heightFeet + "'" : "") + (data.heightInches ? data.heightInches + '"' : "");
    if (!heightDisplay) heightDisplay = "Not specified";

    var subject = "🏋️ New Athlete Registration: " + data.fullName + (data.isNoProgram ? " (No Program - Needs Onboarding)" : " (" + data.program + ")");
    var body = "A new athlete has registered on the KROME Sports Performance platform:\n\n" +
               "----------------------------------------\n" +
               "Full Name: " + data.fullName + "\n" +
               "Email: " + data.email + "\n" +
               "Phone: " + (data.phone || "Not provided") + "\n" +
               "Program: " + data.program + "\n" +
               "Primary Goal Objective: " + (data.goalObjective || "N/A") + "\n" +
               "Experience Level: " + data.experience + "\n" +
               "Age: " + (data.age || "N/A") + "\n" +
               "Biological Sex: " + (data.biologicalSex || "N/A") + "\n" +
               "Height: " + heightDisplay + "\n" +
               "Current Weight: " + (data.currentWeight ? data.currentWeight + " lbs" : "N/A") + "\n" +
               "Goal Weight: " + (data.goalWeight ? data.goalWeight + " lbs" : "N/A") + "\n" +
               "Activity Level: " + (data.activityLevel || "N/A") + "\n" +
               "Calculated Target Calories: " + (data.targetCalories ? data.targetCalories + " kcal/day" : "N/A") + "\n" +
               "Target Protein: " + (data.proteinGrams ? data.proteinGrams + "g" : "N/A") + "\n" +
               "Target Carbs: " + (data.carbGrams ? data.carbGrams + "g" : "N/A") + "\n" +
               "Target Fat: " + (data.fatGrams ? data.fatGrams + "g" : "N/A") + "\n" +
               "Access Key: " + data.accessKey + "\n" +
               "Notes / Background: " + data.notes + "\n" +
               "Timestamp: " + data.timestamp + "\n" +
               "----------------------------------------\n\n" +
               "Saved to Google Sheet tab: 'athlete_registration' (22 Columns)";

    MailApp.sendEmail(COACH_NOTIFICATION_EMAILS, subject, body);
    Logger.log("Coach registration alert dispatched to " + COACH_NOTIFICATION_EMAILS);
  } catch (err) {
    Logger.log("Notice: Error sending coach registration alert: " + err.toString());
  }
}

/**
 * Sends welcome and onboarding link to athlete
 */
function sendAthleteWelcomeEmail(data) {
  if (!data.email || data.email.indexOf('@') === -1) return;
  try {
    var subject = "Welcome to KROME Sports Performance, " + data.fullName + "!";
    var body = "Hi " + data.fullName + ",\n\n" +
               "Welcome to KROME Sports Performance! Your athlete profile has been registered.\n\n" +
               "Your Login Key / Passkey: " + data.accessKey + "\n" +
               "Program: " + data.program + "\n\n" +
               "Next Step: Schedule your 1-on-1 Athlete Consultation & Baseline Assessment with Coach Brown:\n" +
               CALENDAR_BOOKING_URL + "\n\n" +
               "Let's get to work,\n" +
               "Coach Brown & The KROME Performance Team\n" +
               "(405) 535-4702\n";

    var htmlBody = 
      "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222; line-height: 1.6;'>" +
        "<div style='background-color: #0b0f19; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;'>" +
          "<h1 style='color: #ffd447; margin: 0; font-size: 24px; letter-spacing: 1px;'>KROME SPORTS PERFORMANCE</h1>" +
          "<p style='color: #00ffd1; margin: 5px 0 0 0; font-size: 13px; text-transform: uppercase;'>Athlete Onboarding &amp; Elite Performance</p>" +
        "</div>" +
        "<div style='padding: 30px; background-color: #ffffff; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;'>" +
          "<h2 style='color: #111; margin-top: 0;'>Welcome, " + data.fullName + "!</h2>" +
          "<p>Your athlete profile is officially registered with KROME Sports Performance.</p>" +
          "<div style='background-color: #f8fafc; border-left: 4px solid #ffd447; padding: 15px; margin: 20px 0; border-radius: 4px;'>" +
            "<p style='margin: 0 0 8px 0;'><strong>Username / Email:</strong> " + data.email + "</p>" +
            "<p style='margin: 0 0 8px 0;'><strong>Login Passkey:</strong> <code style='background: #e2e8f0; padding: 2px 6px; border-radius: 4px;'>" + data.accessKey + "</code></p>" +
            "<p style='margin: 0 0 8px 0;'><strong>Status:</strong> " + data.program + "</p>" +
            (data.targetCalories ? "<p style='margin: 0;'><strong>Baseline Nutrition Targets:</strong> " + data.targetCalories + " kcal | " + data.proteinGrams + "g Protein | " + data.carbGrams + "g Carbs | " + data.fatGrams + "g Fat</p>" : "") +
          "</div>" +
          "<div style='background-color: #fff9e6; border: 2px solid #ffd447; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;'>" +
            "<h3 style='margin: 0 0 8px 0; color: #111;'>Schedule Your 1-on-1 Consultation</h3>" +
            "<p style='font-size: 14px; color: #555; margin: 0 0 16px 0;'>Lock in a time on Coach Brown's live calendar to review your baseline goals and customize your training program:</p>" +
            "<a href='" + CALENDAR_BOOKING_URL + "' style='background-color: #ffd447; color: #111; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 50px; display: inline-block; font-size: 15px;'>📅 Book Strategy Call with Coach Brown</a>" +
          "</div>" +
          "<p style='color: #666; font-size: 14px;'>Questions? Contact Coach Brown directly at <strong>(405) 535-4702</strong> or reply to this email.</p>" +
          "<p style='margin-bottom: 0;'>Let's get to work,<br><strong>Coach Brown</strong><br><span style='color: #777; font-size: 13px;'>KROME Sports Performance</span></p>" +
        "</div>" +
      "</div>";

    MailApp.sendEmail({
      to: data.email,
      subject: subject,
      body: body,
      htmlBody: htmlBody,
      name: "KROME Sports Performance",
      replyTo: "kromefitness@gmail.com"
    });
    Logger.log("Athlete welcome email dispatched to " + data.email);
  } catch (err) {
    Logger.log("Notice: Error sending welcome email: " + err.toString());
  }
}

/**
 * Registers a new athlete row in 'athlete_registration' & 'Athlete Data'
 */
function registerAthlete(userIdentifier, payload) {
  if (!payload.email) payload.email = userIdentifier;
  return saveAthleteRegistration(payload);
}

/**
 * Appends a lead submission row to 'ksp_leads' and sends email notifications
 */
function appendLead(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(LEADS_TAB_NAME) || ss.getActiveSheet();
  var timestamp = new Date();
  var now = timestamp.toLocaleString();

  var name = payload.name || payload.fullName || 'Athlete';
  var email = (payload.email || '').trim();
  var phone = (payload.phone || '').trim();
  var program = payload.program || payload.programInterest || 'Training Program';
  var experience = payload.experience || payload.athleteLevel || '';
  var message = payload.message || '';
  var bookingUrl = CALENDAR_BOOKING_URL;

  // Optional requested slot (e.g. from calendar booking or form)
  var requestedSlot = payload.requestedTime ? new Date(payload.requestedTime) : null;
  var calendarEventCreated = false;
  var calendarNote = "";

  // 1. Validate & Create Calendar Event (if requestedSlot provided)
  if (requestedSlot && !isNaN(requestedSlot.getTime())) {
    try {
      var cal = CalendarApp.getDefaultCalendar();
      var day = requestedSlot.getDay(); // 0 = Sun, 6 = Sat
      var hour = requestedSlot.getHours();

      // Rule 1: Working hours check (Monday-Saturday, 8 AM to 6 PM)
      if (day === 0 || hour < WORK_START_HOUR || hour >= WORK_END_HOUR) {
        calendarNote = "Requested time was outside working hours (" + WORK_START_HOUR + ":00 - " + WORK_END_HOUR + ":00).";
      } else {
        var startWithBuffer = new Date(requestedSlot.getTime() - BUFFER_MINUTES * 60000);
        var endSlot = new Date(requestedSlot.getTime() + SESSION_DURATION * 60000);
        var endWithBuffer = new Date(endSlot.getTime() + BUFFER_MINUTES * 60000);

        var conflicts = cal.getEvents(startWithBuffer, endWithBuffer);
        if (conflicts.length > 0) {
          calendarNote = "Conflict detected: slot or 15-min buffer is already booked.";
        } else {
          cal.createEvent("KROME Consultation: " + name + " (" + program + ")", requestedSlot, endSlot, {
            description: "Athlete: " + name + "\nPhone: " + phone + "\nEmail: " + email + "\nProgram: " + program + "\nExperience: " + experience + "\nNotes: " + message,
            guests: email,
            sendInvites: true
          });
          calendarEventCreated = true;
          calendarNote = "Confirmed for " + requestedSlot.toLocaleString();
        }
      }
    } catch (calErr) {
      Logger.log("Calendar sync notice: " + calErr.toString());
      calendarNote = "Calendar sync note: " + calErr.message;
    }
  }

  // 2. Append lead row to your Google Sheet
  var newRow = [
    now,
    name,
    email,
    phone,
    program,
    experience,
    payload.preferredContact || 'Email',
    payload.shredStatus || '',
    payload.supplementNotes || '',
    payload.nutritionGoals || '',
    message,
    calendarNote || now
  ];
  sheet.appendRow(newRow);

  // 3. Send Notification Email to Coaches (swolecode@gmail.com, kromefitness@gmail.com)
  try {
    var coachSubject = "🔥 New Lead: " + name + " (" + program + ")";
    var coachBody = "New inquiry received from your KROME website:\n\n" +
                    "Name: " + name + "\n" +
                    "Email: " + email + "\n" +
                    "Phone: " + phone + "\n" +
                    "Program: " + program + "\n" +
                    "Experience: " + experience + "\n" +
                    "Message: " + message + "\n" +
                    (calendarNote ? "Calendar Status: " + calendarNote + "\n" : "") +
                    "\nTimestamp: " + now;

    MailApp.sendEmail(COACH_NOTIFICATION_EMAILS, coachSubject, coachBody);
    Logger.log("Coach notification email successfully dispatched to: " + COACH_NOTIFICATION_EMAILS);
  } catch (coachMailErr) {
    Logger.log("Error sending coach notification email: " + coachMailErr.toString());
  }

  // 4. Send Automatic Introduction Email to Athlete
  if (email && email.indexOf('@') !== -1) {
    try {
      var athleteSubject = "Welcome to KROME Sports Performance, " + name + "!";
      var athleteBody = "Hi " + name + ",\n\n" +
        "Thank you for reaching out regarding our " + program + "!\n\n" +
        "Coach Brown is reviewing your goals. To lock in your 1-on-1 strategy call with automatic buffer scheduling, pick your time slot here:\n" +
        bookingUrl + "\n\n" +
        "Coach Brown & The KROME Performance Team\n(405) 535-4702\n";

      var athleteHtml = 
        "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;'>" +
          "<div style='background-color: #0b0f19; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;'>" +
            "<h1 style='color: #ffd447; margin: 0; font-size: 24px; letter-spacing: 1px;'>KROME SPORTS PERFORMANCE</h1>" +
            "<p style='color: #00ffd1; margin: 5px 0 0 0; font-size: 13px; text-transform: uppercase;'>Elite Training &amp; Athletic Longevity</p>" +
          "</div>" +
          "<div style='padding: 30px; background-color: #ffffff; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;'>" +
            "<h2 style='color: #111; margin-top: 0;'>Welcome, " + name + "!</h2>" +
            "<p>Thank you for taking the first step toward reaching your peak athletic performance. We’ve received your inquiry regarding the <strong>" + program + "</strong>.</p>" +
            "<div style='background-color: #fff9e6; border: 2px solid #ffd447; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;'>" +
              "<h3 style='margin: 0 0 8px 0; color: #111;'>Schedule Your 1-on-1 Strategy Call</h3>" +
              "<p style='font-size: 14px; color: #555; margin: 0 0 16px 0;'>Select an open slot on Coach Brown's live Google Calendar (all appointments include a 15-minute buffer to ensure undivided attention):</p>" +
              "<a href='" + bookingUrl + "' style='background-color: #ffd447; color: #111; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 50px; display: inline-block; font-size: 15px;'>📅 Pick Your Time on Google Calendar</a>" +
            "</div>" +
            "<p style='color: #666; font-size: 14px;'>Questions? Call or text Coach Brown at <strong>(405) 535-4702</strong>.</p>" +
            "<p style='margin-bottom: 0;'>Let's get to work,<br><strong>Coach Brown</strong><br><span style='color: #777; font-size: 13px;'>KROME Sports Performance</span></p>" +
          "</div>" +
        "</div>";

      MailApp.sendEmail({
        to: email,
        subject: athleteSubject,
        body: athleteBody,
        htmlBody: athleteHtml,
        name: "KROME Sports Performance",
        replyTo: "kromefitness@gmail.com"
      });
      Logger.log("Athlete introduction email successfully dispatched to: " + email);
    } catch (athleteMailErr) {
      Logger.log("Error sending athlete introduction email: " + athleteMailErr.toString());
    }
  }

  return {
    status: "success",
    success: true,
    message: 'Lead saved and notification emails dispatched to coaches.',
    rowNumber: sheet.getLastRow(),
    calendarEventCreated: calendarEventCreated,
    calendarNote: calendarNote
  };
}

/**
 * Fallback name helper
 */
function payloadFullName(email) {
  if (!email) return 'KROME Athlete';
  var parts = email.split('@')[0].split(/[._-]/);
  return parts.map(function (p) {
    return p.charAt(0).toUpperCase() + p.slice(1);
  }).join(' ');
}

/**
 * JSON & JSONP response helper
 */
function jsonResponse(data, callback) {
  var output;
  if (callback) {
    output = ContentService.createTextOutput(callback + '(' + JSON.stringify(data) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    output = ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return output;
}

