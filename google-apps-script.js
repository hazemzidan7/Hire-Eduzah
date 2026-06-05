/**
 * Eduzah Hiring Form — Google Apps Script
 *
 * Setup:
 * 1. Open your Google Sheet → Extensions → Apps Script
 * 2. Delete all existing code and paste this entire file
 * 3. Save (Ctrl+S)
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL and set it as GOOGLE_SCRIPT_URL in form.js
 *
 * Sheet columns (Row 1 must have these headers exactly):
 * Date | Full Name (AR) | Full Name (EN) | Phone | Email | Position |
 * National ID | DOB | Gender | Governorate | City |
 * University | Faculty | Major | Grad Year | Status |
 * Work Mode | Work Type | Available Days | Shift | Start Date |
 * English Level | Teach Rate | Tech Rate | Comm Rate |
 * Laptop | Internet | Cam+Mic |
 * Video Link | CV File | Photo File | NatID Front | NatID Back |
 * Why Eduzah | Why Fit | Handle Q | Recorded |
 * Source | Referral |
 * Role Q1 | Role Q2 | Role Q3 | Role Q4 |
 * Submitted At
 */

var SPREADSHEET_ID = '17AiLZYmOHNGiWzqtZ55anWbvmAibIpb8xUy9wVvaHII';
var SHEET_NAME     = 'Sheet1'; // change if your sheet tab has a different name

// Admin token — must match ADMIN_TOKEN in admin.html
var ADMIN_TOKEN = 'eduzah-admin-token-2025';

function doPost(e) {
  try {
    var raw = e.postData ? e.postData.contents : '';
    if (!raw) return jsonResponse({ status: 'error', message: 'No data received' });

    var d = JSON.parse(raw);

    var ss    = SPREADSHEET_ID
                  ? SpreadsheetApp.openById(SPREADSHEET_ID)
                  : SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // Build role-specific columns (up to 4 answers)
    var roleAnswers = buildRoleAnswers(d);

    var row = [
      d.submittedAt   || new Date().toISOString(),   // A: Date
      d.nameAr        || '',                          // B: Full Name (AR)
      d.nameEn        || '',                          // C: Full Name (EN)
      d.phone         || '',                          // D: Phone
      d.email         || '',                          // E: Email
      d.position      || '',                          // F: Position
      d.natid         || '',                          // G: National ID
      d.dob           || '',                          // H: DOB
      d.gender        || '',                          // I: Gender
      d.gov           || '',                          // J: Governorate
      d.city          || '',                          // K: City
      d.uni           || '',                          // L: University
      d.faculty       || '',                          // M: Faculty
      d.major         || '',                          // N: Major
      d.gradYear      || '',                          // O: Grad Year
      d.status        || '',                          // P: Status
      d.workMode      || '',                          // Q: Work Mode
      d.workType      || '',                          // R: Work Type
      d.availDays     || '',                          // S: Available Days
      d.shift         || '',                          // T: Shift
      d.startDate     || '',                          // U: Start Date
      d.engLevel      || '',                          // V: English Level
      d.rateTeach     || '',                          // W: Teach Rate
      d.rateTech      || '',                          // X: Tech Rate
      d.rateComm      || '',                          // Y: Comm Rate
      d.laptop        || '',                          // Z: Laptop
      d.internet      || '',                          // AA: Internet
      d.camMic        || '',                          // AB: Cam+Mic
      d.videoLink     || '',                          // AC: Video Link
      d.cvFile        || '',                          // AD: CV File
      d.photoFile     || '',                          // AE: Photo File
      d.natidFront    || '',                          // AF: NatID Front
      d.natidBack     || '',                          // AG: NatID Back
      d.whyEduzah     || '',                          // AH: Why Eduzah
      d.whyFit        || '',                          // AI: Why Fit
      d.handleQ       || '',                          // AJ: Handle Q
      d.recorded      || '',                          // AK: Recorded
      d.source        || '',                          // AL: Source
      d.referral      || '',                          // AM: Referral
      roleAnswers[0],                                 // AN: Role Q1
      roleAnswers[1],                                 // AO: Role Q2
      roleAnswers[2],                                 // AP: Role Q3
      roleAnswers[3],                                 // AQ: Role Q4
    ];

    sheet.appendRow(row);

    return jsonResponse({ status: 'ok' });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * doGet — Admin dashboard data endpoint
 * Called by admin.html with ?action=getData&token=...
 */
function doGet(e) {
  try {
    var params = e ? (e.parameter || {}) : {};

    // Token check
    if (params.token !== ADMIN_TOKEN) {
      return jsonResponse({ status: 'error', message: 'Unauthorized' });
    }

    if (params.action !== 'getData') {
      return jsonResponse({ status: 'error', message: 'Unknown action' });
    }

    var ss    = SPREADSHEET_ID
                  ? SpreadsheetApp.openById(SPREADSHEET_ID)
                  : SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    var values = sheet.getDataRange().getValues();

    if (values.length < 2) {
      return jsonResponse({ status: 'ok', data: [] });
    }

    // Map column positions to field names (matches the row array in doPost)
    var FIELDS = [
      'submittedAt','nameAr','nameEn','phone','email','position',
      'natid','dob','gender','gov','city',
      'uni','faculty','major','gradYear','status',
      'workMode','workType','availDays','shift','startDate',
      'engLevel','rateTeach','rateTech','rateComm',
      'laptop','internet','camMic',
      'videoLink','cvFile','photoFile','natidFront','natidBack',
      'whyEduzah','whyFit','handleQ','recorded',
      'source','referral',
      'roleQ1','roleQ2','roleQ3','roleQ4',
    ];

    var data = values.slice(1).map(function(row) {
      var obj = {};
      FIELDS.forEach(function(f, i) {
        obj[f] = row[i] !== undefined ? String(row[i]) : '';
      });
      return obj;
    }).filter(function(r) { return r.submittedAt || r.nameAr || r.nameEn; });

    return jsonResponse({ status: 'ok', data: data });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

/** Collapse role-specific answers into 4 generic slots */
function buildRoleAnswers(d) {
  var pos = d.position || '';
  var q = ['', '', '', ''];

  if (pos === 'kids-coding') {
    q[0] = 'Kids exp: ' + (d.kidsExp || '');
    q[1] = 'Teaching: ' + (d.kidsTeach || '');
    q[2] = 'Explain: '  + (d.kidsExplain || '');
    q[3] = 'Engage: '   + (d.kidsComm || '');
  } else if (pos === 'prog-fundamentals') {
    q[0] = 'Beg comfort: ' + (d.beg || '');
    q[1] = 'Logic exp: '   + (d.logicExp || '');
    q[2] = 'Example: '     + (d.exTeach || '');
  } else if (pos === 'english-instructor') {
    q[0] = 'Mode: '    + (d.engMode || '');
    q[1] = 'Areas: '   + (d.engAreas || '');
    q[2] = 'Exp: '     + (d.engTeachExp || '');
    q[3] = 'Demo: '    + (d.engLessonDemo || '');
  } else if (pos === 'cybersecurity') {
    q[0] = 'Mode: '    + (d.cyberMode || '');
    q[1] = 'Topics: '  + (d.cyberTopics || '');
    q[2] = 'Phishing: '+ (d.phishQ || '');
    q[3] = 'Git: '     + (d.cyberGit || '');
  } else if (pos === 'data-analysis') {
    q[0] = 'Tools: '   + (d.dataTools || '');
    q[1] = 'Q: '       + (d.dataQ || '');
    q[2] = 'Portfolio: '+ (d.dataPort || '');
  } else if (pos === 'ai-instructor') {
    q[0] = 'Expertise: '+ (d.aiExpertise || '');
    q[1] = 'Tools: '    + (d.aiTools || '');
    q[2] = 'Q: '        + (d.mlQ || '');
    q[3] = 'Git: '      + (d.aiGit || '');
  } else if (pos === 'sales') {
    q[0] = 'Exp: '      + (d.salesExp || '');
    q[1] = 'Comm: '     + (d.salesComm || '');
    q[2] = 'Scenario: ' + (d.salesScen || '');
    q[3] = 'Salary: '   + (d.salesSalary || '');
  } else if (pos === 'designer') {
    q[0] = 'Tools: '    + (d.designTools || '');
    q[1] = 'Portfolio: '+ (d.designPort || '');
    q[2] = 'Yrs: '      + (d.designYrs || '');
    q[3] = 'Fields: '   + (d.designFields || '');
  }
  return q;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Quick test — run manually in the editor */
function testDoPost() {
  var fake = {
    postData: {
      contents: JSON.stringify({
        submittedAt: new Date().toISOString(),
        nameAr: 'اسم تجريبي', nameEn: 'Test Name',
        phone: '01012345678', email: 'test@test.com',
        position: 'kids-coding', natid: '30001011234567',
        dob: '2000-01-01', gender: 'male',
        gov: 'Cairo', city: 'Nasr City',
        workMode: 'online', workType: 'part',
        availDays: 'السبت, الأحد', shift: 'morning',
        startDate: 'فوراً', videoLink: 'https://drive.google.com/test',
        kidsExp: 'yes',
      })
    }
  };
  Logger.log(doPost(fake));
}
