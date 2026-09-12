/**
 * =========================================================================
 * KROME SPORTS PERFORMANCE - Athlete Registration Google Apps Script
 * =========================================================================
 * 
 * Target Sheet Tab: "athlete_registration"
 * 
 * COLUMNS IMPLEMENTED (18 Columns):
 * 1.  Registration Timestamp            (Col A) - Date/Time of registration
 * 2.  Full Name                         (Col B) - Athlete Full Name
 * 3.  Email / Username                  (Col C) - Primary Email (Login ID)
 * 4.  Phone Number                      (Col D) - Contact Phone
 * 5.  Program / Enrollment Status       (Col E) - Assigned Program or "No Program (Onboarding)"
 * 6.  Primary Goal Objective            (Col F) - Specific athletic/physique target objective
 * 7.  Experience Level                  (Col G) - Beginner / Intermediate / Advanced / Pro
 * 8.  Age                               (Col H) - Athlete Age (years)
 * 9.  Biological Sex                    (Col I) - Male / Female / Prefer not to say
 * 10. Height (Feet)                     (Col J) - Height component (feet: e.g. 5, 6)
 * 11. Height (Inches)                   (Col K) - Height component (inches: e.g. 10, 11)
 * 12. Current Weight (lbs)              (Col L) - Baseline starting weight
 * 13. Goal Weight (lbs)                 (Col M) - Target goal weight
 * 14. Activity Level                    (Col N) - Daily & weekly training activity level
 * 15. Access Key / Passkey              (Col O) - Portal login key / passkey
 * 16. Training Background & Coach Notes (Col P) - Athlete background & injury history
 * 17. Status / Coach Action             (Col Q) - e.g. "New Registered - Pending Consultation"
 * 18. Last Updated                      (Col R) - Timestamp of last modification
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet (e.g. "KROME Athlete Management" or "ksp_leads").
 * 2. Click Extensions > Apps Script.
 * 3. Paste this code into Code.gs (or athlete_registration.gs).
 * 4. Select `setupAthleteRegistrationSheet` from the function dropdown and click "Run".
 *    (If the sheet already exists with fewer columns, `setupAthleteRegistrationSheet` will
 *     automatically upgrade the headers to all 18 columns without deleting your existing rows!).
 * 5. Click "Deploy" > "New deployment" > type "Web app":
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 6. Copy the Web App URL and set it as GOOGLE_APPS_SCRIPT_URL in your environment.
 * =========================================================================
 */

var REGISTRATION_TAB_NAME = 'athlete_registration';
var COACH_NOTIFICATION_EMAILS = 'swolecode@gmail.com, kromefitness@gmail.com';
var CALENDAR_BOOKING_URL = 'https://calendar.app.google/vae7E9TF9P5mX9sy9';

// 22-Column Schema for 'athlete_registration' spreadsheet
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
  var actMult = 1.55; // Default: Moderately active
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

/**
 * One-click setup & migration: Configures/upgrades the "athlete_registration" sheet tab
 * with all 22 styled headers (including macros) without deleting existing data rows.
 */
function setupAthleteRegistrationSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getAthleteRegistrationSheet(ss, true);

  // Set the 22 exact headers in Row 1
  var headerRange = sheet.getRange(1, 1, 1, REGISTRATION_HEADERS.length);
  headerRange.setValues([REGISTRATION_HEADERS]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#0d1117'); // Dark slate brand color
  headerRange.setFontColor('#ffd447');  // Gold brand accent
  headerRange.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);

  // Auto-resize all 22 columns
  for (var col = 1; col <= REGISTRATION_HEADERS.length; col++) {
    sheet.autoResizeColumn(col);
  }

  // Populate sample starter rows if completely empty
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
      'New athlete registered without a pre-assigned program. Needs baseline assessment & strategy call.', // Col T: Notes
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
      'Targeting fat loss while maintaining strength on barbell compound lifts.', // Col T: Notes
      'Active Athlete - Enrolled',                                    // Col U: Status / Coach Action
      now                                                             // Col V: Last Updated
    ]);

    sheet.appendRow([
      now,                                                            // Col A: Timestamp
      'Sarah Thompson',                                               // Col B: Full Name
      'sarah.t@athlete.com',                                          // Col C: Email
      '(405) 555-0188',                                               // Col D: Phone
      '28-Day Nutrition Blueprint & Macro Protocol',                  // Col E: Program Status
      'Metabolic Conditioning, Endurance & Recovery',                 // Col F: Primary Goal Objective
      'Advanced (5+ years / Competitive Athlete)',                    // Col G: Experience Level
      29,                                                             // Col H: Age
      'Female',                                                       // Col I: Biological Sex
      5,                                                              // Col J: Height (Feet)
      6,                                                              // Col K: Height (Inches)
      '138',                                                          // Col L: Current Weight
      '132',                                                          // Col M: Goal Weight
      'Very Active (Competitive Training)',                           // Col N: Activity Level
      1920,                                                           // Col O: Target Calories (kcal)
      135,                                                            // Col P: Protein (g)
      210,                                                            // Col Q: Carbs (g)
      53,                                                             // Col R: Fat (g)
      'Blueprint28',                                                  // Col S: Access Key
      'Preparing for regional CrossFit open competition and strict macro adherence.', // Col T: Notes
      'Active Athlete - Enrolled',                                    // Col U: Status / Coach Action
      now                                                             // Col V: Last Updated
    ]);
  }

  Logger.log('athlete_registration sheet configured/upgraded successfully with 22 columns (including macro calculations)!');
}

/**
 * Dynamically resolves column indexes from Row 1
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
 * Sends formatted alert to coaching staff with all biometrics and calculated macros
 */
function sendCoachRegistrationAlert(data) {
  try {
    var heightDisplay = (data.heightFeet ? data.heightFeet + "'" : "") + (data.heightInches ? data.heightInches + '"' : "");
    if (!heightDisplay) heightDisplay = "Not specified";

    var macroSummary = (data.targetCalories ? data.targetCalories + " kcal (P: " + data.proteinGrams + "g / C: " + data.carbGrams + "g / F: " + data.fatGrams + "g)" : "Calculated on Onboarding");

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
 * HTTP POST Handler - Saves athlete registration & form submissions
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

    var action = (payload.action || 'athlete_register').toLowerCase();
    var tab = (payload.tab || '').toLowerCase();

    // Handle athlete registration requests
    if (action === 'athlete_register' || action === 'register' || action === 'save_registration' || tab === 'athlete_registration') {
      var regResult = saveAthleteRegistration(payload);
      return jsonResponse(regResult);
    }

    // Default: Save to athlete_registration
    return jsonResponse(saveAthleteRegistration(payload));

  } catch (err) {
    return jsonResponse({ success: false, error: 'Registration Apps Script error: ' + err.toString() });
  }
}

/**
 * HTTP GET Handler - Setup, health check, or record lookup
 */
function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = (params.action || 'get').toLowerCase();
    var callback = params.callback;

    if (action === 'setup' || action === 'setup_athlete_registration' || action === 'upgrade') {
      setupAthleteRegistrationSheet();
      return jsonResponse({ success: true, message: 'athlete_registration sheet configured/upgraded with 18 columns.' }, callback);
    }

    var email = (params.email || params.username || '').trim().toLowerCase();
    if (email) {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = getAthleteRegistrationSheet(ss);
      if (!sheet || sheet.getLastRow() < 2) {
        return jsonResponse({ found: false, error: 'No registrations found.' }, callback);
      }

      var cols = getRegistrationColumnMap(sheet);
      var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

      for (var i = 0; i < data.length; i++) {
        if ((data[i][cols.EMAIL - 1] || '').toString().trim().toLowerCase() === email) {
          return jsonResponse({
            found: true,
            success: true,
            registration: {
              timestamp: data[i][cols.TIMESTAMP - 1],
              fullName: data[i][cols.FULL_NAME - 1],
              email: data[i][cols.EMAIL - 1],
              phone: data[i][cols.PHONE - 1],
              program: data[i][cols.PROGRAM - 1],
              goalObjective: data[i][cols.GOAL_OBJECTIVE - 1],
              experienceLevel: data[i][cols.EXPERIENCE - 1],
              age: data[i][cols.AGE - 1],
              biologicalSex: data[i][cols.BIOLOGICAL_SEX - 1],
              heightFeet: data[i][cols.HEIGHT_FEET - 1],
              heightInches: data[i][cols.HEIGHT_INCHES - 1],
              currentWeight: data[i][cols.CURRENT_WEIGHT - 1],
              goalWeight: data[i][cols.GOAL_WEIGHT - 1],
              activityLevel: data[i][cols.ACTIVITY_LEVEL - 1],
              accessKey: data[i][cols.ACCESS_KEY - 1],
              notes: data[i][cols.NOTES - 1],
              status: data[i][cols.STATUS - 1],
              lastUpdated: data[i][cols.LAST_UPDATED - 1]
            }
          }, callback);
        }
      }
      return jsonResponse({ found: false, error: 'Athlete not found in athlete_registration tab.' }, callback);
    }

    return jsonResponse({ status: 'active', script: 'KROME Athlete Registration API', columns: 18 }, callback);
  } catch (err) {
    return jsonResponse({ success: false, error: 'Apps Script error: ' + err.toString() });
  }
}

/**
 * JSON & JSONP Output Helper
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
