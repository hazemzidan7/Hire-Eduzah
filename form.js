const STEPS = ['Role', 'Personal', 'Academic', 'Uploads', 'Role-Specific', 'Assessment', 'Equipment', 'Availability', 'Video', 'Screening', 'Referral', 'Agreement'];
const TEACHING = ['kids-coding', 'prog-fundamentals', 'cybersecurity', 'data-analysis', 'ai-instructor', 'english-instructor', 'robotics-instructor'];
const VIDEO_HINTS = {
  'kids-coding': { ar: 'سجّل فيديو مدته 1–2 دقيقة تشرح فيه مفهوماً بسيطاً في البرمجة لطفل', en: 'Record a 1–2 minute video explaining a simple programming concept for a child' },
  'prog-fundamentals': { ar: 'سجّل فيديو تشرح فيه مسألة برمجية بسيطة وطريقة حلها', en: 'Record a video explaining a simple programming problem and how you solve it' },
  'cybersecurity': { ar: 'سجّل فيديو مدته 1–2 دقيقة تشرح فيه مفهوماً أساسياً في الأمن السيبراني مع ذكر مثال عملي', en: 'Record a 1–2 minute video explaining a core cybersecurity concept with a practical example' },
  'data-analysis': { ar: 'سجّل فيديو تشرح فيه مفهوماً في تحليل البيانات', en: 'Record a video explaining a data analysis concept' },
  'ai-instructor': { ar: 'سجّل فيديو تشرح فيه مفهوماً في الذكاء الاصطناعي', en: 'Record a video explaining an AI concept' },
  'english-instructor': { ar: 'سجّل فيديو مدته 1–2 دقيقة تقدّم فيه نفسك وتشرح مفهوماً إنجليزياً بسيطاً لمتعلم بالغ', en: 'Record a 1–2 minute video introducing yourself and teaching a basic English concept to an adult learner' },
  'sales': { ar: 'سجّل فيديو مدته دقيقة تقدّم فيه نفسك وتبيّن مهاراتك في التواصل والبيع', en: 'Record a one-minute video introducing yourself and demonstrating communication and sales skills' },
  'designer': { ar: 'سجّل فيديو تشرح فيه عملية التصميم عندك', en: 'Record a video walking through your design process' },
  'robotics-instructor': { ar: 'سجّل فيديو مدته 1–2 دقيقة تشرح فيه مفهوماً في الروبوتكس أو الإلكترونيات بأسلوب مناسب للطلاب', en: 'Record a 1–2 minute video explaining a robotics or electronics concept in a student-friendly way' },
  'project-management': { ar: 'سجّل فيديو قصير تشرح فيه كيف تدير مشروعاً تعليمياً أو تدريبياً من البداية للنهاية', en: 'Record a short video explaining how you manage an educational or training project from start to finish' },
};
const ROLE_GROUPS = {
  'Kids Track':        { ar: 'مسار الأطفال',  en: 'Kids Track' },
  'Programming Track': { ar: 'مسار البرمجة',  en: 'Programming Track' },
  'Language Programs': { ar: 'برامج اللغات',  en: 'Language Programs' },
  'Non-Teaching':      { ar: 'غير تعليمي',    en: 'Non-Teaching' },
};
const ROLES = [
  { id: 'kids-coding',        name: 'Coding Instructor',                   track: { ar: 'أطفال / برنامج صيفي',           en: 'Kids / Summer Program' },  group: 'Kids Track' },
  { id: 'prog-fundamentals',  name: 'Programming Fundamentals Instructor', track: { ar: 'مسار الكبار',                   en: 'Adult Track' },            group: 'Programming Track' },
  { id: 'cybersecurity',      name: 'Cybersecurity Instructor',            track: { ar: 'أونلاين / أوفلاين',             en: 'Online / Offline' },       group: 'Programming Track' },
  { id: 'data-analysis',      name: 'Data Analysis Instructor',            track: { ar: 'حضوري فقط',                     en: 'Offline only' },           group: 'Programming Track' },
  { id: 'ai-instructor',      name: 'AI Instructor',                       track: { ar: 'حضوري فقط',                     en: 'Offline only' },           group: 'Programming Track' },
  { id: 'robotics-instructor',name: 'Robotics Instructor',                 track: { ar: 'STEM / روبوتكس',                en: 'STEM / Robotics' },        group: 'Programming Track' },
  { id: 'english-instructor', name: 'English Instructor',                  track: { ar: 'أونلاين / أوفلاين',             en: 'Online / Offline' },       group: 'Language Programs' },
  { id: 'sales',              name: 'Sales Representative',                track: { ar: 'غير تعليمي',                    en: 'Non-Teaching' },           group: 'Non-Teaching' },
  { id: 'designer',           name: 'Graphic Designer',                    track: { ar: 'غير تعليمي',                    en: 'Non-Teaching' },           group: 'Non-Teaching' },
  { id: 'project-management', name: 'Project Manager',                     track: { ar: 'تعليم وتكنولوجيا تعليمية',      en: 'Education & EdTech' },     group: 'Non-Teaching' },
];
const GOV = ['Alexandria', 'Aswan', 'Asyut', 'Beheira', 'Beni Suef', 'Cairo', 'Dakahlia', 'Damietta', 'Faiyum', 'Gharbia', 'Giza', 'Ismailia', 'Kafr El Sheikh', 'Luxor', 'Matruh', 'Minya', 'Monufia', 'New Valley', 'North Sinai', 'Port Said', 'Qalyubia', 'Qena', 'Red Sea', 'Sharqia', 'Sohag', 'South Sinai', 'Suez'];
const SOHAG = ['Akhmim', 'El Balyana', 'Dar El Salam', 'Girga', 'Juhaynah', 'El Mansha', 'El Maragha', 'Saqultah', 'Sohag', 'Tahta', 'Tama'];
const ALLOW_MANUAL_DOB_EDIT = false;

/** Set to true to close applications — shows a closed message and blocks the form entirely. */
const APPLICATIONS_CLOSED = true;

let S = { step: 0, role: null, stepList: [], lang: 'en' };
let natIdAutofillBound = false;

/** Exposed for submission modules */
if (typeof window !== 'undefined') {
  window.ROLES = ROLES;
  window.isEn = isEn;
  window.natIdMsg = natIdMsg;
  window.S = S;
}

function isEn() { return S.lang === 'en'; }
function tr(ar, en) { return isEn() ? en : ar; }
function trackLabel(r) { return isEn() ? r.track.en : r.track.ar; }
function groupLabel(g) { return ROLE_GROUPS[g] ? (isEn() ? ROLE_GROUPS[g].en : ROLE_GROUPS[g].ar) : g; }
function videoHint(role) {
  const h = VIDEO_HINTS[role];
  if (!h) return tr('سجّل فيديو قصير تعرّف فيه بنفسك وتُظهر مهاراتك', 'Record a short video introducing yourself and showcasing your skills');
  return isEn() ? h.en : h.ar;
}

function natIdMsg(msg) {
  if (!isEn()) return msg;
  const map = {
    'يرجى إدخال 14 رقمًا': 'Please enter 14 digits',
    'يرجى إدخال رقم قومي مصري صحيح (14 رقم)': 'Please enter a valid Egyptian National ID (14 digits)',
    'رقم القرن في الرقم القومي غير صالح (يجب أن يبدأ بـ 2 أو 3)': 'Invalid century digit in National ID (must start with 2 or 3)',
    'تاريخ الميلاد المستخرج من الرقم القومي غير صالح': 'Invalid date of birth extracted from National ID',
    'تعذر استخراج الجنس من الرقم القومي': 'Could not extract gender from National ID',
    'رمز المحافظة في الرقم القومي غير معروف': 'Unknown governorate code in National ID',
  };
  return map[msg] || 'Please enter a valid Egyptian National ID (14 digits)';
}

function applyDocumentLocale() {
  const en = isEn();
  const root = document.documentElement;
  root.lang = en ? 'en' : 'ar';
  root.dir = en ? 'ltr' : 'rtl';
  document.body.classList.toggle('lang-en', en);
  const sub = document.getElementById('headerSubtitle');
  if (sub) sub.textContent = tr('انضم لفريقنا — قدّم على وظيفة', 'Join our team — Apply for a position');
  document.title = tr('Eduzah — نموذج التوظيف', 'Eduzah — Hiring Form');
  const bar = document.getElementById('progressBar');
  if (bar) bar.setAttribute('aria-label', tr('التقدم في النموذج', 'Form progress'));
  // Update language toggle button label
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = en ? 'عربي' : 'English';
}

function toggleLang() {
  if (window.FormCollector) FormCollector.snapshotCurrentStep();
  S.lang = S.lang === 'en' ? 'ar' : 'en';
  if (window.FormStore) FormStore.set('_lang', S.lang);
  applyDocumentLocale();
  if (APPLICATIONS_CLOSED) { showClosedScreen(); return; }
  renderStep();
}

function buildSteps(r) {
  const b = [0, 1, 2, 3, 4, 5];
  if (TEACHING.includes(r)) b.push(6);
  b.push(7);
  if (r !== 'designer') b.push(8, 9);
  b.push(10, 11);
  return b;
}
function cur() { return S.stepList[S.step]; }

function $(id) { return document.getElementById(id); }
function val(id) { const el = $(id); return el ? el.value.trim() : ''; }
function radio(name) { const el = document.querySelector(`input[name="${name}"]:checked`); return el ? el.value : ''; }
function checkedIn(sel) { return [...document.querySelectorAll(sel)].filter(c => c.checked); }
function isEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }
function isUrl(s) { try { new URL(s); return true; } catch { return false; } }

function clearValidation() {
  document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  document.querySelectorAll('.invalid-outline').forEach(el => el.classList.remove('invalid-outline'));
  document.querySelectorAll('.field-error.show,.step-error.show').forEach(el => el.classList.remove('show'));
}

function setFieldError(id, msg) {
  const el = $(id);
  if (el) el.classList.add('invalid');
  const err = $(id + '_err');
  if (err) { err.textContent = msg; err.classList.add('show'); }
}

function setGroupError(groupId, msg) {
  const g = $(groupId);
  if (g) g.classList.add('invalid-outline');
  const err = $(groupId + '_err');
  if (err) { err.textContent = msg; err.classList.add('show'); }
}

function showStepError(msg) {
  const e = $('stepErr');
  if (e) { e.textContent = msg; e.classList.add('show'); }
}

function fld(lbl, id, type = 'text', req = true, ph = '') {
  const err = req ? `<div class="field-error" id="${id}_err"></div>` : '';
  return `<div class="field-group"><label class="field-label" for="${id}">${lbl}${req ? '<span class="req"> *</span>' : ''}</label><input type="${type}" id="${id}" placeholder="${ph}"/>${err}</div>`;
}
function sel(lbl, id, opts, req = true) {
  const err = req ? `<div class="field-error" id="${id}_err"></div>` : '';
  return `<div class="field-group"><label class="field-label" for="${id}">${lbl}${req ? '<span class="req"> *</span>' : ''}</label><select id="${id}"><option value="">${tr('اختر...', 'Select...')}</option>${opts.map(o => `<option>${o}</option>`).join('')}</select>${err}</div>`;
}
function ta(lbl, id, ph = '', req = true) {
  const err = req ? `<div class="field-error" id="${id}_err"></div>` : '';
  return `<div class="field-group"><label class="field-label" for="${id}">${lbl}${req ? '<span class="req"> *</span>' : ''}</label><textarea id="${id}" placeholder="${ph}"></textarea>${err}</div>`;
}
function rating(lbl, id) {
  return `<div class="rating-row"><div class="rl">${lbl}</div><input type="range" min="1" max="10" value="5" step="1" id="${id}" oninput="document.getElementById('${id}_v').textContent=this.value"/><div class="rating-val" id="${id}_v">5</div><span style="font-size:12px;color:#9ca3af">/10</span></div>`;
}
function navBtns(last = false) {
  return `<div class="nav-btns">${S.step > 0 ? `<button type="button" class="btn-back" onclick="goBack()">${tr('رجوع', 'Back')}</button>` : ''}<button type="button" class="btn-next" onclick="${last ? 'submitForm()' : 'goNext()'}">${last ? tr('إرسال الطلب', 'Submit Application') : tr('التالي', 'Next')}</button></div>`;
}
function yesNo(name, lbl) {
  return `<div class="field-group" id="${name}Group"><label class="field-label">${lbl} <span class="req">*</span></label><div class="check-group"><label class="check-item"><input type="radio" name="${name}" value="yes"> ${tr('نعم', 'Yes')}</label><label class="check-item"><input type="radio" name="${name}" value="no"> ${tr('لا', 'No')}</label></div><div class="field-error" id="${name}Group_err"></div></div>`;
}

function flashAutofill(el) {
  if (!el) return;
  el.classList.remove('auto-filled');
  void el.offsetWidth;
  el.classList.add('auto-filled');
}

function setDobFromNatId(dobEl, value, locked) {
  if (!dobEl) return;
  dobEl.value = value;
  if (locked && !ALLOW_MANUAL_DOB_EDIT) {
    dobEl.readOnly = true;
    dobEl.setAttribute('aria-readonly', 'true');
    dobEl.classList.add('dob-autofill');
    dobEl.title = tr('تم تعبئته تلقائياً من الرقم القومي', 'Auto-filled from National ID');
  } else {
    dobEl.readOnly = false;
    dobEl.removeAttribute('aria-readonly');
    dobEl.classList.remove('dob-autofill');
    dobEl.removeAttribute('title');
  }
  flashAutofill(dobEl.closest('.field-group') || dobEl);
}

function unlockDobManual() {
  const dob = $('dob');
  if (!dob) return;
  dob.readOnly = false;
  dob.removeAttribute('aria-readonly');
  dob.classList.remove('dob-autofill');
  dob.removeAttribute('title');
}

function setGenderFromNatId(value) {
  const el = document.querySelector(`input[name="gender"][value="${value}"]`);
  if (!el) return;
  el.checked = true;
  flashAutofill($('genderGroup'));
  const g = $('genderGroup');
  if (g) g.classList.remove('invalid-outline');
  const err = $('genderGroup_err');
  if (err) err.classList.remove('show');
}

function setGovernorateFromNatId(name) {
  const gov = $('gov');
  if (!gov || !name) return;
  const hasOption = [...gov.options].some(o => o.value === name || o.text === name);
  if (!hasOption) return;
  gov.value = name;
  flashAutofill(gov.closest('.field-group') || gov);
  gov.classList.remove('invalid');
  const err = $('gov_err');
  if (err) err.classList.remove('show');
  const sohagRow = $('sohagRow');
  if (sohagRow) sohagRow.style.display = name === 'Sohag' ? 'block' : 'none';
}

function clearNatIdAutofill() {
  unlockDobManual();
  const dob = $('dob');
  if (dob) { dob.value = ''; dob.classList.remove('auto-filled'); }
  document.querySelectorAll('input[name="gender"]').forEach(r => { r.checked = false; });
  const gov = $('gov');
  if (gov) {
    gov.value = '';
    const sohagRow = $('sohagRow');
    if (sohagRow) sohagRow.style.display = 'none';
    const sc = $('sohagCenter');
    if (sc) sc.value = '';
  }
  ['dob', 'genderGroup', 'gov'].forEach(id => {
    const wrap = id === 'genderGroup' ? $(id) : $(id) && $(id).closest('.field-group');
    if (wrap) wrap.classList.remove('auto-filled');
  });
}

function applyNatIdParse(raw) {
  const nat = $('natid');
  const parsed = EgyptianNationalId.parseEgyptianNationalId(raw);
  const err = $('natid_err');
  const hint = $('natid_hint');

  if (nat) {
    const sanitized = parsed.digits;
    if (nat.value !== sanitized) nat.value = sanitized;
  }

  if (parsed.digits.length === 0) {
    if (nat) nat.classList.remove('invalid', 'natid-valid');
    if (err) err.classList.remove('show');
    if (hint) { hint.textContent = ''; hint.classList.remove('show', 'success'); }
    clearNatIdAutofill();
    return;
  }

  if (!parsed.complete) {
    if (nat) nat.classList.remove('natid-valid', 'invalid');
    if (err) err.classList.remove('show');
    if (hint) {
      hint.textContent = isEn() ? `${parsed.digits.length}/14 digits` : `${parsed.digits.length}/14 رقم`;
      hint.classList.add('show');
      hint.classList.remove('success');
    }
    if (parsed.digits.length < 14) clearNatIdAutofill();
    return;
  }

  if (parsed.valid) {
    if (nat) { nat.classList.remove('invalid'); nat.classList.add('natid-valid'); }
    if (err) err.classList.remove('show');
    if (hint) {
      hint.textContent = tr('تم استخراج البيانات تلقائياً', 'Details extracted automatically');
      hint.classList.add('show', 'success');
    }
    setDobFromNatId($('dob'), parsed.dateOfBirth, true);
    $('dob').classList.remove('invalid');
    const dobErr = $('dob_err');
    if (dobErr) dobErr.classList.remove('show');
    setGenderFromNatId(parsed.gender);
    setGovernorateFromNatId(parsed.governorate);
    if (nat) flashAutofill(nat.closest('.field-group') || nat);
    return;
  }

  if (nat) { nat.classList.add('invalid'); nat.classList.remove('natid-valid'); }
  if (err) {
    err.textContent = natIdMsg(parsed.errors[0] || 'يرجى إدخال رقم قومي مصري صحيح (14 رقم)');
    err.classList.add('show');
  }
  if (hint) { hint.textContent = ''; hint.classList.remove('show', 'success'); }
  clearNatIdAutofill();
}

function bindNatIdAutofill() {
  if (natIdAutofillBound) return;
  const nat = $('natid');
  if (!nat) return;
  natIdAutofillBound = true;
  nat.setAttribute('inputmode', 'numeric');
  nat.setAttribute('autocomplete', 'off');
  nat.setAttribute('maxlength', '14');
  nat.setAttribute('pattern', '[0-9]{14}');
  nat.addEventListener('input', function () { applyNatIdParse(this.value); });
  nat.addEventListener('paste', function (e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    applyNatIdParse(text);
  });
  nat.addEventListener('keypress', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
  });
}

function validateCurrentStep() {
  clearValidation();
  const step = cur();
  let ok = true;
  const req = tr('هذا الحقل مطلوب', 'This field is required');
  const answer = tr('يرجى الإجابة', 'Please answer this question');
  const complete = tr('يرجى إكمال جميع الحقول المطلوبة بشكل صحيح', 'Please complete all required fields correctly');
  const completeShort = tr('يرجى إكمال جميع الحقول المطلوبة', 'Please complete all required fields');

  if (step === 0) {
    if (!S.role) { const e = $('roleErr'); if (e) e.classList.add('show'); return false; }
    return true;
  }

  if (step === 1) {
    if (!val('nameAr')) { setFieldError('nameAr', tr('يرجى إدخال الاسم بالعربية', 'Please enter your name in Arabic')); ok = false; }
    if (!val('nameEn')) { setFieldError('nameEn', tr('يرجى إدخال الاسم بالإنجليزية', 'Please enter your name in English')); ok = false; }
    if (!isEmail(val('email'))) { setFieldError('email', tr('يرجى إدخال بريد إلكتروني صحيح', 'Please enter a valid email address')); ok = false; }
    if (val('phone').length < 10) { setFieldError('phone', tr('يرجى إدخال رقم واتساب صحيح', 'Please enter a valid WhatsApp number')); ok = false; }
    const natCheck = EgyptianNationalId.validateNationalId(val('natid'));
    if (!natCheck.valid) { setFieldError('natid', natIdMsg(natCheck.message)); ok = false; }
    if (!radio('gender')) { setGroupError('genderGroup', tr('يرجى اختيار الجنس', 'Please select gender')); ok = false; }
    if (!val('dob')) { setFieldError('dob', tr('يرجى إدخال تاريخ الميلاد', 'Please enter your date of birth')); ok = false; }
    if (!val('gov')) { setFieldError('gov', tr('يرجى اختيار المحافظة', 'Please select governorate')); ok = false; }
    if (val('gov') === 'Sohag' && !val('sohagCenter')) { setFieldError('sohagCenter', tr('يرجى اختيار مركز سوهاج', 'Please select Sohag center')); ok = false; }
    if (!val('city')) { setFieldError('city', tr('يرجى إدخال المدينة أو المنطقة', 'Please enter your city or area')); ok = false; }
    if (!ok) showStepError(complete);
    return ok;
  }

  if (step === 2) {
    ['uni', 'faculty', 'major', 'gradYear'].forEach(id => {
      if (!val(id)) { setFieldError(id, req); ok = false; }
    });
    if (!radio('status')) { setGroupError('statusGroup', tr('يرجى اختيار الحالة', 'Please select your status')); ok = false; }
    if (!ok) showStepError(completeShort);
    return ok;
  }

  if (step === 3) {
    const docs = [
      ['cvFile',    tr('السيرة الذاتية', 'CV')],
      ['photoFile', tr('الصورة الشخصية', 'Profile photo')],
      ['natidFront',tr('الرقم القومي (أمام)', 'National ID (front)')],
      ['natidBack', tr('الرقم القومي (خلف)', 'National ID (back)')],
    ];
    docs.forEach(([id, lbl]) => {
      const inp  = $(id);
      const stored = window.FormStore ? FormStore.getFile(id) : null;
      const hasFile = (inp && inp.files && inp.files.length > 0) || !!stored;
      if (!hasFile) {
        const box = inp && inp.closest('.upload-box');
        if (box) box.classList.add('invalid');
        const errEl = $(id + '_err');
        if (errEl) {
          errEl.textContent = isEn() ? `Please upload ${lbl}` : `يرجى رفع ${lbl}`;
          errEl.classList.add('show');
        }
        ok = false;
      }
    });
    if (!ok) showStepError(tr('يرجى رفع جميع المستندات المطلوبة', 'Please upload all required documents'));
    return ok;
  }

  if (step === 4) {
    const r = S.role;
    if (r === 'kids-coding' && !radio('kidsExp')) { setGroupError('kidsExpGroup', answer); ok = false; }
    if (r === 'prog-fundamentals') {
      if (!radio('beg')) { setGroupError('begGroup', answer); ok = false; }
      if (!val('logicExp')) { setFieldError('logicExp', req); ok = false; }
      if (!val('exTeach')) { setFieldError('exTeach', req); ok = false; }
    }
    if (r === 'cybersecurity') {
      if (!radio('cyberMode')) { setGroupError('cyberModeGroup', tr('يرجى اختيار نوع التدريس', 'Please select teaching mode')); ok = false; }
      if (!val('phishQ')) { setFieldError('phishQ', req); ok = false; }
    }
    if (r === 'data-analysis' && !val('dataQ')) { setFieldError('dataQ', req); ok = false; }
    if (r === 'ai-instructor' && !val('mlQ')) { setFieldError('mlQ', req); ok = false; }
    if (r === 'english-instructor') {
      if (!radio('engMode')) { setGroupError('engModeGroup', tr('يرجى اختيار نوع التدريس', 'Please select teaching mode')); ok = false; }
      if (!val('engTeachExp')) { setFieldError('engTeachExp', req); ok = false; }
      if (!val('engLessonDemo')) { setFieldError('engLessonDemo', req); ok = false; }
    }
    if (r === 'designer') {
      if (!checkedIn('#designToolsGroup input[type=checkbox]').length) { setGroupError('designToolsGroup', tr('يرجى اختيار أداة واحدة على الأقل', 'Please select at least one tool')); ok = false; }
      if (!isUrl(val('designPort'))) { setFieldError('designPort', tr('يرجى إدخال رابط Portfolio صحيح', 'Please enter a valid portfolio URL')); ok = false; }
      if (!val('designYrs')) { setFieldError('designYrs', tr('يرجى إدخال سنوات الخبرة', 'Please enter years of experience')); ok = false; }
      if (!checkedIn('#designFieldsGroup input[type=checkbox]').length) { setGroupError('designFieldsGroup', tr('يرجى اختيار مجال واحد على الأقل', 'Please select at least one field')); ok = false; }
      if (!val('designProc')) { setFieldError('designProc', req); ok = false; }
    }
    if (r === 'robotics-instructor') {
      if (!checkedIn('#roboticsToolsGroup input[type=checkbox]').length) { setGroupError('roboticsToolsGroup', tr('يرجى اختيار أداة واحدة على الأقل', 'Please select at least one tool')); ok = false; }
      if (!radio('roboticsKids')) { setGroupError('roboticsKidsGroup', answer); ok = false; }
      if (!val('roboticsQ')) { setFieldError('roboticsQ', req); ok = false; }
    }
    if (r === 'project-management') {
      if (!val('pmPastProjects')) { setFieldError('pmPastProjects', req); ok = false; }
      if (!radio('pmEdTech')) { setGroupError('pmEdTechGroup', answer); ok = false; }
      if (!val('pmRole')) { setFieldError('pmRole', req); ok = false; }
    }
    if (!ok) showStepError(completeShort);
    return ok;
  }

  if (step === 5) {
    if (!val('engLevel')) { setFieldError('engLevel', tr('يرجى اختيار مستوى اللغة', 'Please select your English level')); ok = false; }
    if (!ok) showStepError(tr('يرجى إكمال التقييم الذاتي', 'Please complete the self-assessment'));
    return ok;
  }

  if (step === 6) {
    if (!radio('laptop')) { setGroupError('laptopGroup', answer); ok = false; }
    if (!val('internet')) { setFieldError('internet', tr('يرجى اختيار جودة الإنترنت', 'Please select internet quality')); ok = false; }
    if (!radio('camMic')) { setGroupError('camMicGroup', answer); ok = false; }
    if (!ok) showStepError(completeShort);
    return ok;
  }

  if (step === 7) {
    if (!radio('workMode')) { setGroupError('workModeGroup', tr('يرجى اختيار نوع العمل', 'Please select work mode')); ok = false; }
    if (!radio('workType')) { setGroupError('workTypeGroup', tr('يرجى اختيار نوع الدوام', 'Please select employment type')); ok = false; }
    if (!checkedIn('#availDaysGroup input[type=checkbox]').length) { setGroupError('availDaysGroup', tr('يرجى اختيار يوم واحد على الأقل', 'Please select at least one day')); ok = false; }
    if (!radio('shift')) { setGroupError('shiftGroup', tr('يرجى اختيار الفترة المفضلة', 'Please select preferred shift')); ok = false; }
    if (!radio('startDate')) { setGroupError('startDateGroup', tr('يرجى اختيار أقرب موعد للبدء', 'Please select earliest start date')); ok = false; }
    if (!ok) showStepError(completeShort);
    return ok;
  }

  if (step === 8) {
    const link = val('videoLink');
    if (!link || !isUrl(link)) {
      setFieldError('videoLink', tr('يرجى إدخال رابط Google Drive صحيح', 'Please enter a valid Google Drive link'));
      ok = false;
      showStepError(tr('يرجى إدخال رابط الفيديو', 'Please enter your video link'));
    }
    return ok;
  }

  if (step === 9) {
    if (!val('whyEduzah')) { setFieldError('whyEduzah', req); ok = false; }
    if (!val('whyFit')) { setFieldError('whyFit', req); ok = false; }
    if (!val('handleQ')) { setFieldError('handleQ', req); ok = false; }
    if (!radio('recorded')) { setGroupError('recordedGroup', answer); ok = false; }
    if (!ok) showStepError(tr('يرجى إكمال جميع الأسئلة', 'Please answer all questions'));
    return ok;
  }

  if (step === 10) {
    if (!val('source')) { setFieldError('source', tr('يرجى اختيار كيف عرفت عنا', 'Please select how you heard about us')); ok = false; }
    if (!radio('eduzahService')) { setGroupError('eduzahServiceGroup', tr('يرجى الإجابة على هذا السؤال', 'Please answer this question')); ok = false; }
    if (radio('eduzahService') === 'yes' && !val('eduzahServiceType')) { setFieldError('eduzahServiceType', tr('يرجى تحديد نوع الخدمة', 'Please specify the service type')); ok = false; }
    if (!ok) showStepError(tr('يرجى إكمال جميع الحقول المطلوبة', 'Please complete all required fields'));
    return ok;
  }

  return true;
}

function renderProgress() {
  const bar = document.getElementById('progressBar');
  bar.innerHTML = '';
  S.stepList.forEach((si, i) => {
    const d = document.createElement('div');
    d.className = 'step-dot' + (i === S.step ? ' active' : i < S.step ? ' done' : '');
    d.textContent = i < S.step ? '' : (i + 1);
    d.setAttribute('aria-label', tr(`الخطوة ${i + 1}`, `Step ${i + 1}`));
    bar.appendChild(d);
    if (i < S.stepList.length - 1) {
      const l = document.createElement('div');
      l.className = 'step-line' + (i < S.step ? ' done' : '');
      bar.appendChild(l);
    }
  });
}

function bindFileInputListeners() {
  const PDF_FIELDS   = new Set(['cvFile']);
  const IMAGE_FIELDS = new Set(['photoFile', 'natidFront', 'natidBack']);

  function isPdfMagic(b) {
    return b[0]===0x25 && b[1]===0x50 && b[2]===0x44 && b[3]===0x46;
  }
  function isImageMagic(b) {
    return (b[0]===0xFF && b[1]===0xD8 && b[2]===0xFF) ||
           (b[0]===0x89 && b[1]===0x50 && b[2]===0x4E && b[3]===0x47) ||
           (b[0]===0x52 && b[1]===0x49 && b[2]===0x46 && b[3]===0x46 &&
            b[8]===0x57 && b[9]===0x45 && b[10]===0x42 && b[11]===0x50);
  }

  document.querySelectorAll('#stepContent input[type=file][id]').forEach(inp => {
    inp.addEventListener('change', async function () {
      const file  = this.files && this.files[0];
      if (!file) return;
      const id    = this.id;
      const box   = this.closest('.upload-box');
      const errEl = document.getElementById(id + '_err');

      const needsPdf   = PDF_FIELDS.has(id);
      const needsImage = IMAGE_FIELDS.has(id);

      if (needsPdf || needsImage) {
        try {
          const buf   = await file.slice(0, 12).arrayBuffer();
          const bytes = new Uint8Array(buf);
          const valid = needsPdf ? isPdfMagic(bytes) : isImageMagic(bytes);

          if (!valid) {
            this.value = '';
            if (window.FormStore) FormStore.setFile(id, null);
            if (box) { box.classList.add('invalid'); box.classList.remove('file-selected'); }
            const hint = (box && box.dataset.hint) || (needsPdf ? tr('PDF فقط', 'PDF only') : tr('JPG، PNG، WEBP فقط', 'JPG, PNG, WEBP only'));
            if (box) {
              const p = box.querySelector('p');
              const small = box.querySelector('small');
              if (p) p.textContent = inp.getAttribute('aria-label') || id;
              if (small) small.textContent = hint;
            }
            const msg = needsPdf
              ? tr('نوع الملف غير صحيح — يُسمح بملفات PDF فقط', 'Wrong file type — only PDF files are allowed')
              : tr('نوع الملف غير صحيح — يُسمح بـ JPG، PNG، WEBP فقط', 'Wrong file type — only JPG, PNG, WEBP images are allowed');
            if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
            return;
          }
        } catch (e) {
          console.warn('[FileValidation]', e);
        }
      }

      if (window.FormStore) FormStore.setFile(id, file);
      if (box) { box.classList.remove('invalid'); box.classList.add('file-selected'); }
      const p = box && box.querySelector('p');
      if (p) p.textContent = '✓ ' + file.name;
      const small = box && box.querySelector('small');
      if (small) small.textContent = (file.size / 1024).toFixed(0) + ' KB';
      if (errEl) errEl.classList.remove('show');
    });
  });
}

function renderStep() {
  applyDocumentLocale();
  renderProgress();
  const c = document.getElementById('stepContent');
  c.innerHTML = '';
  [r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11][cur()]();
  if (window.FormCollector) FormCollector.restoreCurrentStep();
  bindFileInputListeners();
}

function r0() {
  const groups = [...new Set(ROLES.map(r => r.group))];
  let h = `<div class="step-title">${tr('اختر الوظيفة', 'Select a Position')}</div>`;
  groups.forEach(g => {
    h += `<div class="track-label">${groupLabel(g)}</div><div class="role-grid">`;
    ROLES.filter(r => r.group === g).forEach(r => {
      h += `<div class="role-card${S.role === r.id ? ' selected' : ''}" data-role="${r.id}" onclick="pickRole('${r.id}')"><div class="role-name">${r.name}</div><div class="role-track">${trackLabel(r)}</div></div>`;
    });
    h += '</div>';
  });
  h += `<div class="error-msg" id="roleErr">${tr('يرجى اختيار وظيفة للمتابعة', 'Please select a position to continue')}</div>${navBtns()}`;
  document.getElementById('stepContent').innerHTML = h;
}

function pickRole(id) {
  S.role = id;
  if (window.FormStore) FormStore.set('position', id);
  S.stepList = buildSteps(id);
  renderStep();
  const e = $('roleErr');
  if (e) e.classList.remove('show');
}

function r1() {
  let h = `<div class="step-error" id="stepErr"></div><div class="step-title">${tr('البيانات الشخصية', 'Personal Information')}</div>`;
  h += `<div class="field-row">${fld(tr('الاسم كامل (عربي)', 'Full name (Arabic)'), 'nameAr', 'text', true, tr('الاسم الرباعي', 'Full legal name in Arabic'))}${fld(tr('الاسم كامل (إنجليزي)', 'Full name (English)'), 'nameEn', 'text', true, 'Full legal name')}</div>`;
  h += `<div class="field-row">${fld(tr('البريد الإلكتروني', 'Email'), 'email', 'email', true, 'you@example.com')}${fld(tr('واتساب', 'WhatsApp'), 'phone', 'tel', true, '+20 10X XXX XXXX')}</div>`;
  h += `<div class="field-row"><div class="field-group"><label class="field-label" for="natid">${tr('الرقم القومي', 'National ID')} <span class="req"> *</span></label><input type="text" id="natid" placeholder="${tr('14 رقم', '14 digits')}" inputmode="numeric" maxlength="14" autocomplete="off"/><div class="field-hint" id="natid_hint" aria-live="polite"></div><div class="field-error" id="natid_err"></div></div>`;
  h += `<div class="field-group" id="genderGroup"><label class="field-label">${tr('الجنس', 'Gender')} <span class="req">*</span></label><div class="check-group">${[
    [tr('ذكر', 'Male'), 'male'],
    [tr('أنثى', 'Female'), 'female'],
  ].map(([l, v]) => `<label class="check-item"><input type="radio" name="gender" value="${v}"> ${l}</label>`).join('')}</div><div class="field-error" id="genderGroup_err"></div></div></div>`;
  h += `<div class="field-row">${fld(tr('تاريخ الميلاد', 'Date of birth'), 'dob', 'date')}${sel(tr('المحافظة', 'Governorate'), 'gov', GOV)}</div>`;
  h += `<div id="sohagRow" style="display:none">${sel(tr('مركز سوهاج', 'Sohag center'), 'sohagCenter', SOHAG)}</div>`;
  h += fld(tr('المدينة / المنطقة', 'City / Area'), 'city', 'text', true, tr('حيك أو منطقتك', 'Your neighborhood or district'));
  h += navBtns();
  document.getElementById('stepContent').innerHTML = h;
  $('gov').addEventListener('change', function () { $('sohagRow').style.display = this.value === 'Sohag' ? 'block' : 'none'; });
  natIdAutofillBound = false;
  bindNatIdAutofill();
}

function r2() {
  let h = `<div class="step-error" id="stepErr"></div><div class="step-title">${tr('البيانات الأكاديمية', 'Academic Background')}</div>`;
  h += `<div class="field-row">${fld(tr('الجامعة / المعهد', 'University / Institute'), 'uni')}${fld(tr('الكلية', 'Faculty'), 'faculty')}</div>`;
  h += `<div class="field-row">${fld(tr('التخصص', 'Major'), 'major')}${fld(tr('سنة التخرج', 'Graduation year'), 'gradYear', 'number', true, '2024')}</div>`;
  h += `<div class="field-group" id="statusGroup"><label class="field-label">${tr('الحالة', 'Status')} <span class="req">*</span></label><div class="check-group"><label class="check-item"><input type="radio" name="status" value="student"> ${tr('طالب', 'Student')}</label><label class="check-item"><input type="radio" name="status" value="graduate"> ${tr('خريج', 'Graduate')}</label></div><div class="field-error" id="statusGroup_err"></div></div>`;
  h += navBtns();
  document.getElementById('stepContent').innerHTML = h;
}

function r3() {
  let h = `<div class="step-error" id="stepErr"></div><div class="step-title">${tr('المستندات المطلوبة', 'Required Documents')}</div>`;
  [
    ['cvFile',    tr('السيرة الذاتية', 'CV'),                    tr('PDF فقط', 'PDF only'),                    '.pdf,application/pdf'],
    ['photoFile', tr('صورة شخصية', 'Profile photo'),             tr('JPG، PNG، WEBP فقط', 'JPG, PNG, WEBP only'), '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp'],
    ['natidFront',tr('الرقم القومي (أمام)', 'National ID (front)'),tr('JPG، PNG، WEBP فقط', 'JPG, PNG, WEBP only'),'.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp'],
    ['natidBack', tr('الرقم القومي (خلف)', 'National ID (back)'), tr('JPG، PNG، WEBP فقط', 'JPG, PNG, WEBP only'),'.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp'],
  ].forEach(([id, lbl, hint, accept]) => {
    h += `<div class="field-group"><label class="field-label">${lbl} <span class="req">*</span></label><div class="upload-box" data-hint="${hint}"><input type="file" id="${id}" accept="${accept}" aria-label="${lbl}"/><p>${lbl}</p><small>${hint}</small></div><div class="field-error" id="${id}_err"></div></div>`;
  });
  h += navBtns();
  document.getElementById('stepContent').innerHTML = h;
}

function r4() {
  const r = S.role;
  let h = `<div class="step-error" id="stepErr"></div><div class="step-title">${tr('أسئلة خاصة بالوظيفة', 'Role-Specific Questions')}</div>`;
  if (r === 'kids-coding') {
    h += yesNo('kidsExp', tr('هل لديك خبرة في التعامل مع الأطفال؟', 'Do you have experience working with children?'));
    h += ta(tr('صف تجربتك في التدريس (إن وجدت)', 'Describe your teaching experience (if any)'), 'kidsTeach', tr('كورسات، ورش عمل، دروس خصوصية...', 'Courses, workshops, private lessons...'), false);
    h += ta(tr('كيف تشرح مفهوماً بسيطاً لطفل؟', 'How do you explain a simple concept to a child?'), 'kidsExplain', tr('اعطِ مثالاً', 'Give an example'), false);
    h += ta(tr('كيف تحافظ على انتباه الطفل وتفاعله؟', 'How do you keep a child engaged?'), 'kidsComm', tr('صف أسلوبك', 'Describe your approach'), false);
  }
  if (r === 'prog-fundamentals') {
    h += yesNo('beg', tr('هل أنت مرتاح لتدريس المبتدئين تماماً؟', 'Are you comfortable teaching complete beginners?'));
    h += ta(tr('كيف تشرح التفكير المنطقي لمبتدئ؟', 'How do you explain logical thinking to a beginner?'), 'logicExp', '');
    h += ta(tr('اشرح مثالاً: المتغيرات أو الحلقات التكرارية', 'Give an example: variables or loops'), 'exTeach', '');
  }
  if (r === 'english-instructor') {
    h += `<div class="field-group" id="engModeGroup"><label class="field-label">${tr('نوع التدريس المفضل', 'Preferred teaching mode')} <span class="req">*</span></label><div class="check-group">${[
      ['Online', 'online'], ['Offline', 'offline'], ['Both', 'both'],
    ].map(([m, v]) => `<label class="check-item"><input type="radio" name="engMode" value="${v}"> ${m}</label>`).join('')}</div><div class="field-error" id="engModeGroup_err"></div></div>`;
    h += `<div class="field-group"><label class="field-label">${tr('مجالات التدريس', 'Teaching areas')}</label><div class="check-group" data-collect="engAreas">${['General English', 'Business English', 'Conversation', 'Grammar', 'IELTS / TOEFL prep'].map(t => `<label class="check-item"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}</div></div>`;
    h += ta(tr('صف خبرتك في تدريس الإنجليزية', 'Describe your English teaching experience'), 'engTeachExp', 'Years, settings, age groups, certifications (TEFL, CELTA, etc.)...');
    h += ta(tr('كيف تشرح قاعدة نحوية بسيطة لمتعلم بالغ؟', 'How would you explain a simple grammar rule to an adult learner?'), 'engLessonDemo', 'Brief example lesson outline');
    h += fld(tr('رابط Portfolio / LinkedIn (اختياري)', 'Portfolio / LinkedIn link (optional)'), 'engPort', 'url', false, 'https://...');
  }
  if (r === 'cybersecurity') {
    h += `<div class="field-group" id="cyberModeGroup"><label class="field-label">${tr('نوع التدريس المفضل', 'Preferred teaching mode')} <span class="req">*</span></label><div class="check-group">${[
      [tr('أونلاين', 'Online'), 'online'], [tr('أوفلاين', 'Offline'), 'offline'], [tr('كلاهما', 'Both'), 'both'],
    ].map(([m, v]) => `<label class="check-item"><input type="radio" name="cyberMode" value="${v}"> ${m}</label>`).join('')}</div><div class="field-error" id="cyberModeGroup_err"></div></div>`;
    h += `<div class="field-group"><label class="field-label">${tr('المواضيع التي يمكنك تدريسها', 'Topics you can teach')}</label><div class="check-group" data-collect="cyberTopics">${['Networking', 'Linux', 'Ethical Hacking', 'SOC'].map(t => `<label class="check-item"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}</div></div>`;
    h += ta(tr('ما هو التصيد الاحتيالي (Phishing)؟ اشرح بإيجاز', 'What is phishing? Explain briefly.'), 'phishQ', '');
    h += fld(tr('رابط GitHub / Portfolio', 'GitHub / Portfolio link'), 'cyberGit', 'url', false, 'https://github.com/...');
  }
  if (r === 'data-analysis') {
    h += `<div class="note-box">${tr('هذه الوظيفة متاحة للتدريس الحضوري (أوفلاين) فقط', 'This role is available for offline teaching only')}</div>`;
    h += `<div class="field-group"><label class="field-label">${tr('الأدوات التي تتقنها', 'Tools you master')}</label><div class="check-group" data-collect="dataTools">${['Excel', 'SQL', 'Power BI', 'Python'].map(t => `<label class="check-item"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}</div></div>`;
    h += ta(tr('ما الفرق بين البيانات المنظمة وغير المنظمة؟', 'What is the difference between structured and unstructured data?'), 'dataQ', '');
    h += fld(tr('رابط Portfolio / مشاريع', 'Portfolio / projects link'), 'dataPort', 'url', false, 'https://...');
  }
  if (r === 'ai-instructor') {
    h += `<div class="note-box">${tr('هذه الوظيفة متاحة للتدريس الحضوري (أوفلاين) فقط', 'This role is available for offline teaching only')}</div>`;
    h += `<div class="field-group"><label class="field-label">${tr('مجالات خبرتك', 'Areas of expertise')}</label><div class="check-group" data-collect="aiExpertise">${['Machine Learning', 'Deep Learning', 'NLP'].map(t => `<label class="check-item"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}</div></div>`;
    h += `<div class="field-group"><label class="field-label">${tr('الأدوات والأطر البرمجية', 'Tools & frameworks')}</label><div class="check-group" data-collect="aiTools">${['Python', 'TensorFlow', 'PyTorch'].map(t => `<label class="check-item"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}</div></div>`;
    h += ta(tr('ما الفرق بين Machine Learning و Deep Learning؟', 'What is the difference between Machine Learning and Deep Learning?'), 'mlQ', '');
    h += fld(tr('رابط GitHub / المشاريع', 'GitHub / projects link'), 'aiGit', 'url', false, 'https://github.com/...');
  }
  if (r === 'sales') {
    h += ta(tr('صف تجربتك في المبيعات', 'Describe your sales experience'), 'salesExp', tr('أدوار سابقة، قطاعات، إنجازات...', 'Previous roles, sectors, achievements...'), false);
    h += rating(tr('مهارات التواصل (1-10)', 'Communication skills (1–10)'), 'salesComm');
    h += ta(tr('كيف ستتعامل مع عميل غير راضٍ؟', 'How would you handle an unhappy client?'), 'salesScen', tr('صف أسلوبك', 'Describe your approach'), false);
    h += fld(tr('الراتب المتوقع (جنيه/شهر)', 'Expected salary (EGP/month)'), 'salesSalary', 'number', false, '');
  }
  if (r === 'designer') {
    h += `<div class="field-group" id="designToolsGroup"><label class="field-label">${tr('أدوات التصميم التي تستخدمها', 'Design tools you use')} <span class="req">*</span></label><div class="check-group">${['Photoshop', 'Illustrator', 'Figma', 'After Effects', 'Canva'].map(t => `<label class="check-item"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}</div><div class="field-error" id="designToolsGroup_err"></div></div>`;
    h += fld(tr('رابط Portfolio', 'Portfolio link'), 'designPort', 'url', true, 'https://behance.net/...');
    h += fld(tr('سنوات الخبرة', 'Years of experience'), 'designYrs', 'number', true, '');
    h += `<div class="field-group" id="designFieldsGroup"><label class="field-label">${tr('مجال التصميم المفضل', 'Preferred design field')} <span class="req">*</span></label><div class="check-group">${['UI/UX', 'Branding', 'Social Media', 'Motion'].map(f => `<label class="check-item"><input type="checkbox" value="${f}"> ${f}</label>`).join('')}</div><div class="field-error" id="designFieldsGroup_err"></div></div>`;
    h += ta(tr('صف عملية التصميم عندك', 'Describe your design process'), 'designProc', tr('من الـ brief للتسليم النهائي', 'From brief to final delivery'));
  }
  if (r === 'robotics-instructor') {
    h += `<div class="note-box">${tr('نرحب بالمتقدمين ذوي الخبرة في تدريس الروبوتكس وSTEM للأطفال والطلاب', 'We welcome applicants experienced in teaching Robotics and STEM to children and students')}</div>`;
    h += `<div class="field-group" id="roboticsToolsGroup"><label class="field-label">${tr('الأدوات والتقنيات التي تتقنها', 'Tools & technologies you work with')} <span class="req">*</span></label><div class="check-group">${['Arduino', 'Raspberry Pi', 'Sensors & Actuators', 'Electronics Basics', 'LEGO Mindstorms', 'Scratch / MIT App Inventor', '3D Printing'].map(t => `<label class="check-item"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}</div><div class="field-error" id="roboticsToolsGroup_err"></div></div>`;
    h += `<div class="field-group"><label class="field-label">${tr('مجالات الخبرة الإضافية', 'Additional areas of expertise')}</label><div class="check-group" data-collect="roboticsAreas">${['STEM Education', 'Robotics Programming', 'Electronics Design', 'Robotics Competitions & Olympiads'].map(t => `<label class="check-item"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}</div></div>`;
    h += yesNo('roboticsKids', tr('هل لديك خبرة في التدريس أو التعامل مع الأطفال والطلاب؟', 'Do you have experience teaching or working with children and students?'));
    h += ta(tr('كيف تشرح مفهوم الدائرة الكهربائية (Circuit) لطالب مبتدئ؟', 'How would you explain an electric circuit to a beginner student?'), 'roboticsQ', tr('اشرح بأسلوب بسيط ومناسب للعمر', 'Explain in a simple, age-appropriate way'));
    h += ta(tr('صف تجربتك في مسابقات الروبوتكس أو STEM (إن وجدت)', 'Describe your experience with robotics or STEM competitions (if any)'), 'roboticsComp', 'WRO, First Lego League, local competitions...', false);
    h += fld(tr('رابط مشاريع / GitHub / YouTube (اختياري)', 'Projects / GitHub / YouTube link (optional)'), 'roboticsPort', 'url', false, 'https://...');
  }
  if (r === 'project-management') {
    h += `<div class="note-box">${tr('نرحب بمتقدمين ذوي خبرة في إدارة المشاريع التعليمية والتدريبية وتكنولوجيا التعليم (EdTech)', 'We welcome applicants with experience managing educational, training, or EdTech projects')}</div>`;
    h += ta(tr('ما هي أبرز المشاريع التي عملت عليها سابقاً؟', 'What are the most notable projects you have worked on?'), 'pmPastProjects', tr('اذكر اسم المشروع، وصفه المختصر، والجهة، والفترة الزمنية', 'Include project name, brief description, organization, and timeline'));
    h += yesNo('pmEdTech', tr('هل كانت مشاريعك مرتبطة بمجال التعليم أو التدريب أو تكنولوجيا التعليم (EdTech)؟', 'Were your projects related to education, training, or educational technology (EdTech)?'));
    h += ta(tr('ما هو دورك داخل هذه المشاريع؟', 'What was your specific role within these projects?'), 'pmRole', tr('قائد مشروع، منسق، مخطط استراتيجي، مطور منهج...', 'Project lead, coordinator, strategic planner, curriculum developer...'));
    h += `<div class="field-group"><label class="field-label">${tr('المنهجيات التي تستخدمها في إدارة المشاريع', 'Project management methodologies you use')}</label><div class="check-group" data-collect="pmMethodologies">${['Agile / Scrum', 'PMP', 'Waterfall', 'Kanban', 'PRINCE2'].map(t => `<label class="check-item"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}</div></div>`;
    h += ta(tr('كيف تتعامل مع تغيير متطلبات المشروع في منتصف التنفيذ؟', 'How do you handle changing project requirements mid-execution?'), 'pmChallenge', tr('اذكر مثالاً من تجربتك', 'Share an example from your experience'), false);
    h += fld(tr('رابط Portfolio / LinkedIn / مشاريع موثقة (اختياري)', 'Portfolio / LinkedIn / documented projects link (optional)'), 'pmPort', 'url', false, 'https://...');
  }
  h += navBtns();
  document.getElementById('stepContent').innerHTML = h;
}

function r5() {
  const levels = isEn()
    ? ['Beginner', 'Intermediate', 'Advanced', 'Native / Fluent']
    : ['مبتدئ', 'متوسط', 'متقدم', 'متقدم جداً'];
  let h = `<div class="step-error" id="stepErr"></div><div class="step-title">${tr('التقييم الذاتي', 'Self-Assessment')}</div>`;
  h += sel(tr('مستوى اللغة الإنجليزية', 'English proficiency level'), 'engLevel', levels);
  h += rating(tr('مهارة التدريس / العرض', 'Teaching / presentation skills'), 'rateTeach');
  h += rating(tr('المهارة التقنية', 'Technical skills'), 'rateTech');
  h += rating(tr('مهارة التواصل', 'Communication skills'), 'rateComm');
  h += navBtns();
  document.getElementById('stepContent').innerHTML = h;
}

function r6() {
  let h = `<div class="step-error" id="stepErr"></div><div class="step-title">${tr('المعدات', 'Equipment')}</div>`;
  h += yesNo('laptop', tr('هل لديك لابتوب مناسب للتدريس؟', 'Do you have a laptop suitable for teaching?'));
  h += sel(tr('جودة الإنترنت', 'Internet quality'), 'internet', isEn() ? ['Poor', 'Good', 'Excellent'] : ['ضعيفة', 'جيدة', 'ممتازة']);
  h += yesNo('camMic', tr('هل لديك كاميرا وميكروفون يعملان؟', 'Do you have a working camera and microphone?'));
  h += navBtns();
  document.getElementById('stepContent').innerHTML = h;
}

function r7() {
  const r = S.role;
  const offlineOnly = r === 'data-analysis' || r === 'ai-instructor';
  const modeOpts = offlineOnly
    ? [tr('أوفلاين', 'Offline')]
    : [tr('أونلاين', 'Online'), tr('أوفلاين', 'Offline'), tr('أونلاين / أوفلاين', 'Online / Offline')];
  const modeVals = offlineOnly ? ['offline'] : ['online', 'offline', 'hybrid'];
  const days = isEn()
    ? ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    : ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const shifts = isEn()
    ? [['Morning', 'morning'], ['Afternoon', 'afternoon'], ['Evening', 'evening']]
    : [['صباحية', 'morning'], ['مسائية', 'afternoon'], ['ليلية', 'evening']];
  const starts = isEn()
    ? [['Immediately', 'Immediately'], ['Within a week', 'Within a week'], ['Within a month', 'Within a month']]
    : [['فوراً', 'فوراً'], ['خلال أسبوع', 'خلال أسبوع'], ['خلال شهر', 'خلال شهر']];

  let h = `<div class="step-error" id="stepErr"></div><div class="step-title">${tr('أوقات العمل', 'Availability')}</div>`;
  h += `<div class="field-group" id="workModeGroup"><label class="field-label">${tr('نوع العمل المفضل', 'Preferred work mode')} <span class="req">*</span></label><div class="check-group">${modeOpts.map((m, i) => `<label class="check-item"><input type="radio" name="workMode" value="${modeVals[i]}"> ${m}</label>`).join('')}</div><div class="field-error" id="workModeGroup_err"></div></div>`;
  h += `<div class="field-group" id="workTypeGroup"><label class="field-label">${tr('دوام', 'Employment type')} <span class="req">*</span></label><div class="check-group"><label class="check-item"><input type="radio" name="workType" value="full"> ${tr('كامل', 'Full-time')}</label><label class="check-item"><input type="radio" name="workType" value="part"> ${tr('جزئي', 'Part-time')}</label></div><div class="field-error" id="workTypeGroup_err"></div></div>`;
  h += `<div class="field-group" id="availDaysGroup"><label class="field-label">${tr('أيام العمل المتاحة', 'Available work days')} <span class="req">*</span></label><div class="check-group" data-collect="availDays">${days.map(d => `<label class="check-item"><input type="checkbox" value="${d}"> ${d}</label>`).join('')}</div><div class="field-error" id="availDaysGroup_err"></div></div>`;
  h += `<div class="field-group" id="shiftGroup"><label class="field-label">${tr('الفترة المفضلة', 'Preferred shift')} <span class="req">*</span></label><div class="check-group">${shifts.map(([s, v]) => `<label class="check-item"><input type="radio" name="shift" value="${v}"> ${s}</label>`).join('')}</div><div class="field-error" id="shiftGroup_err"></div></div>`;
  h += `<div class="field-group" id="startDateGroup"><label class="field-label">${tr('أقرب موعد للبدء', 'Earliest start date')} <span class="req">*</span></label><div class="check-group">${starts.map(([s, v]) => `<label class="check-item"><input type="radio" name="startDate" value="${v}"> ${s}</label>`).join('')}</div><div class="field-error" id="startDateGroup_err"></div></div>`;
  h += navBtns();
  document.getElementById('stepContent').innerHTML = h;
}

function r8() {
  let h = `<div class="step-error" id="stepErr"></div><div class="step-title">${tr('الفيديو التقديمي', 'Introduction Video')}</div>`;
  h += `<div class="note-box">${videoHint(S.role)}</div>`;
  h += `<div class="info-block">${tr(
    'الفيديو لازم يشمل: <strong>تعريف بنفسك</strong>، شرح <strong>مفهوم في مجالك</strong>، وأسلوب <strong>تواصلك</strong>.<br>ارفع الفيديو على Google Drive وشارك الرابط بصلاحية "أي شخص لديه الرابط".',
    'Your video should include: <strong>a self-introduction</strong>, explaining <strong>a concept in your field</strong>, and your <strong>communication style</strong>.<br>Upload to Google Drive and share the link with "Anyone with the link" access.'
  )}</div>`;
  h += fld(tr('رابط Google Drive للفيديو', 'Google Drive video link'), 'videoLink', 'url', true, 'https://drive.google.com/file/d/...');
  h += navBtns();
  document.getElementById('stepContent').innerHTML = h;
}

function r9() {
  let h = `<div class="step-error" id="stepErr"></div><div class="step-title">${tr('أسئلة الفلترة', 'Screening Questions')}</div>`;
  h += ta(tr('لماذا تريد الانضمام لـ Eduzah؟', 'Why do you want to join Eduzah?'), 'whyEduzah', '');
  h += ta(tr('ما الذي يجعلك مناسباً لهذه الوظيفة؟', 'What makes you a good fit for this role?'), 'whyFit', '');
  h += ta(tr('كيف تتعامل مع متدرب أو عميل يعاني من صعوبة؟', 'How do you handle a struggling learner or client?'), 'handleQ', '');
  h += yesNo('recorded', tr('هل أنت مرتاح لتسجيل الجلسات أو مراقبتها؟', 'Are you comfortable with session recording or monitoring?'));
  h += navBtns();
  document.getElementById('stepContent').innerHTML = h;
}

function r10() {
  const sources = isEn()
    ? ['Social media', 'Friend or colleague', 'LinkedIn', 'Job board', 'Search engine', 'Other']
    : ['سوشيال ميديا', 'صديق أو زميل', 'LinkedIn', 'بورد وظائف', 'محرك البحث', 'أخرى'];
  const serviceTypes = isEn()
    ? ['Course', 'Consultation', 'Training', 'Other']
    : ['كورس', 'استشارة', 'تدريب', 'أخرى'];

  let h = `<div class="step-error" id="stepErr"></div><div class="step-title">${tr('معلومات إضافية', 'Additional Information')}</div>`;
  h += sel(tr('كيف عرفت عن Eduzah؟', 'How did you hear about Eduzah?'), 'source', sources);
  h += fld(tr('تم ترشيحك من قِبَل (اختياري)', 'Referred by (optional)'), 'referral', 'text', false, tr('الاسم الكامل للشخص الذي رشّحك', 'Full name of the person who referred you'));
  h += `<div class="field-group" id="eduzahServiceGroup">
    <label class="field-label">${tr('هل حصلت على أي خدمة من خلال شركة Eduzah من قبل؟', 'Have you previously received any service from Eduzah?')} <span class="req">*</span></label>
    <div class="check-group">
      <label class="check-item"><input type="radio" name="eduzahService" value="yes"> ${tr('نعم', 'Yes')}</label>
      <label class="check-item"><input type="radio" name="eduzahService" value="no"> ${tr('لا', 'No')}</label>
    </div>
    <div class="field-error" id="eduzahServiceGroup_err"></div>
  </div>
  <div id="eduzahServiceDetail" style="display:none;margin-top:-0.5rem">
    ${sel(tr('ما هي الخدمة التي حصلت عليها؟', 'What service did you receive?'), 'eduzahServiceType', serviceTypes, true)}
  </div>`;
  h += navBtns();

  document.getElementById('stepContent').innerHTML = h;

  // Wire conditional field
  document.querySelectorAll('input[name="eduzahService"]').forEach(function(el) {
    el.addEventListener('change', function() {
      var detail = document.getElementById('eduzahServiceDetail');
      if (detail) detail.style.display = this.value === 'yes' ? 'block' : 'none';
    });
  });
  // Sync visibility after FormCollector.restoreCurrentStep() runs (called by renderStep)
  setTimeout(function() {
    var checked = document.querySelector('input[name="eduzahService"]:checked');
    var detail = document.getElementById('eduzahServiceDetail');
    if (detail && checked) detail.style.display = checked.value === 'yes' ? 'block' : 'none';
  }, 0);
}

function r11() {
  let h = `<div class="step-error" id="stepErr"></div><div class="step-error" id="submitGlobalErr"></div><div class="step-title">${tr('الإقرار والموافقة', 'Agreement & Consent')}</div>`;
  h += `<div class="info-block">${tr(
    'بتقديم هذا الطلب، أنت تؤكد أن جميع المعلومات المقدمة صحيحة وكاملة، وتوافق على أن Eduzah قد تتواصل معك عبر البريد الإلكتروني أو واتساب.',
    'By submitting this application, you confirm that all information provided is accurate and complete, and you agree that Eduzah may contact you via email or WhatsApp.'
  )}</div>`;
  h += `<div class="field-group"><label class="check-item" style="align-items:flex-start;gap:10px"><input type="checkbox" id="agree" style="width:16px;height:16px;flex-shrink:0;margin-top:3px"> <span style="font-size:14px;color:#374151">${tr(
    'أقر بأن جميع المعلومات صحيحة وأوافق على التواصل معي من قِبَل Eduzah.',
    'I confirm that all information is accurate and I agree to be contacted by Eduzah.'
  )}</span></label><div class="field-error" id="agree_err"></div></div>`;
  h += `<div class="nav-btns"><button type="button" class="btn-back" onclick="goBack()">${tr('رجوع', 'Back')}</button><button type="button" class="btn-next" onclick="submitForm()">${tr('إرسال الطلب', 'Submit Application')}</button></div>`;
  document.getElementById('stepContent').innerHTML = h;
}

function goNext() {
  if (!validateCurrentStep()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  if (window.FormCollector) FormCollector.snapshotCurrentStep();
  if (S.step < S.stepList.length - 1) { S.step++; renderStep(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

function goBack() {
  if (window.FormCollector) FormCollector.snapshotCurrentStep();
  if (S.step > 0) { S.step--; renderStep(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjuOQlKC9wQWt5_3i0xzlAKiAriqVv4YfcjEz3-BZh-lgeR9ukX-XsN8mn3CLdirGaWw/exec';

function collectFormData(fileUrls) {
  // submitForm already snapshotted — no need to repeat
  const d = window.FormStore ? FormStore.getAll() : {};
  const files = window.FormStore ? FormStore.getAllFiles() : {};
  const fu = fileUrls || {};
  const g = (k, def) => (k in d) ? d[k] : (def !== undefined ? def : '');
  const arr = k => Array.isArray(d[k]) ? d[k].join(', ') : '';

  return {
    position: S.role || g('position'),
    nameAr: g('nameAr'), nameEn: g('nameEn'),
    email: g('email'), phone: g('phone'),
    natid: g('natid'), gender: g('gender'),
    dob: g('dob'), gov: g('gov'),
    sohagCenter: g('sohagCenter'), city: g('city'),
    uni: g('uni'), faculty: g('faculty'),
    major: g('major'), gradYear: g('gradYear'),
    status: g('status'),
    engLevel: g('engLevel'),
    rateTeach: g('rateTeach', '5'), rateTech: g('rateTech', '5'), rateComm: g('rateComm', '5'),
    laptop: g('laptop'), internet: g('internet'), camMic: g('camMic'),
    workMode: g('workMode'), workType: g('workType'),
    availDays: arr('cb_availDays'),
    shift: g('shift'), startDate: g('startDate'),
    videoLink: g('videoLink'),
    whyEduzah: g('whyEduzah'), whyFit: g('whyFit'),
    handleQ: g('handleQ'), recorded: g('recorded'),
    source: g('source'), referral: g('referral'),
    kidsExp: g('kidsExp'), kidsTeach: g('kidsTeach'), kidsExplain: g('kidsExplain'), kidsComm: g('kidsComm'),
    beg: g('beg'), logicExp: g('logicExp'), exTeach: g('exTeach'),
    engMode: g('engMode'), engTeachExp: g('engTeachExp'), engLessonDemo: g('engLessonDemo'), engPort: g('engPort'),
    engAreas: arr('cb_engAreas'),
    cyberMode: g('cyberMode'), phishQ: g('phishQ'), cyberGit: g('cyberGit'),
    cyberTopics: arr('cb_cyberTopics'),
    dataTools: arr('cb_dataTools'), dataQ: g('dataQ'), dataPort: g('dataPort'),
    aiExpertise: arr('cb_aiExpertise'), aiTools: arr('cb_aiTools'), mlQ: g('mlQ'), aiGit: g('aiGit'),
    salesExp: g('salesExp'), salesComm: g('salesComm', '5'), salesScen: g('salesScen'), salesSalary: g('salesSalary'),
    designTools: arr('cbgroup_designToolsGroup'), designPort: g('designPort'), designYrs: g('designYrs'),
    designFields: arr('cbgroup_designFieldsGroup'), designProc: g('designProc'),
    // Robotics Instructor
    roboticsTools: arr('cbgroup_roboticsToolsGroup'), roboticsAreas: arr('cb_roboticsAreas'),
    roboticsKids: g('roboticsKids'), roboticsQ: g('roboticsQ'), roboticsComp: g('roboticsComp'), roboticsPort: g('roboticsPort'),
    // Project Management
    pmPastProjects: g('pmPastProjects'), pmEdTech: g('pmEdTech'), pmRole: g('pmRole'),
    pmMethodologies: arr('cb_pmMethodologies'), pmChallenge: g('pmChallenge'), pmPort: g('pmPort'),
    // Universal Eduzah service question
    eduzahService: g('eduzahService'), eduzahServiceType: g('eduzahServiceType'),
    // File names (always present)
    cvFile:      files.cvFile      ? files.cvFile.name      : '',
    photoFile:   files.photoFile   ? files.photoFile.name   : '',
    natidFront:  files.natidFront  ? files.natidFront.name  : '',
    natidBack:   files.natidBack   ? files.natidBack.name   : '',
    // Cloudinary URLs (populated if upload succeeded)
    cvFileUrl:      fu.cvFileUrl      || '',
    photoFileUrl:   fu.photoFileUrl   || '',
    natidFrontUrl:  fu.natidFrontUrl  || '',
    natidBackUrl:   fu.natidBackUrl   || '',
    submittedAt: new Date().toISOString(),
  };
}

function showClosedScreen() {
  const bar = document.getElementById('progressBar');
  if (bar) bar.style.display = 'none';
  document.getElementById('stepContent').innerHTML = `
    <div style="text-align:center;padding:40px 20px">
      <div style="font-size:64px;margin-bottom:16px">⏰</div>
      <h2 style="color:#1a3c5e;margin-bottom:12px">${tr('انتهى وقت التقديم', 'Applications are closed')}</h2>
      <p style="color:#6b7280;font-size:15px;max-width:420px;margin:0 auto">${tr(
        'نأسف، انتهت فترة التقديم على هذه الوظائف ولا يمكن استقبال طلبات جديدة حالياً. تابعونا لمعرفة فرص التقديم القادمة.',
        'Sorry, the application window for these positions has closed and we are no longer accepting new submissions. Please follow us for future opportunities.'
      )}</p>
    </div>`;
}

function showSuccessScreen() {
  document.getElementById('progressBar').style.display = 'none';
  document.getElementById('stepContent').innerHTML = `
    <div style="text-align:center;padding:40px 20px">
      <div style="font-size:64px;margin-bottom:16px">✅</div>
      <h2 style="color:#1a3c5e;margin-bottom:12px">${tr('تم إرسال طلبك بنجاح!', 'Application submitted successfully!')}</h2>
      <p style="color:#6b7280;font-size:15px;max-width:400px;margin:0 auto">${tr(
        'شكراً لتقديمك! سيتواصل معك فريق Eduzah خلال أيام عمل.',
        'Thank you for applying! The Eduzah team will contact you within a few business days.'
      )}</p>
    </div>`;
}

function _setOverlay(visible, msg) {
  const ov = document.getElementById('submitOverlay');
  const tx = document.getElementById('submitOverlayMsg');
  if (!ov) return;
  if (tx && msg) tx.textContent = msg;
  ov.classList.toggle('is-active', visible);
  ov.setAttribute('aria-hidden', String(!visible));
}

async function submitForm() {
  if (window.SubmissionService && SubmissionService.isSubmitting()) return;
  if (window.FormCollector) FormCollector.snapshotCurrentStep();
  if (window.SubmissionService) { await SubmissionService.submit(S); return; }

  const agree = $('agree');
  if (!agree || !agree.checked) {
    setFieldError('agree', tr('يرجى تأكيد الإقرار قبل إرسال الطلب', 'Please confirm the agreement before submitting'));
    showStepError(tr('يرجى تأكيد الإقرار قبل إرسال الطلب', 'Please confirm the agreement before submitting'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  _setOverlay(true, tr('جاري الإرسال...', 'Submitting your application…'));

  try {
    // Step 1: upload files to Cloudinary (if configured)
    let fileUrls = {};
    if (window.CloudinaryUploader && CloudinaryUploader.isConfigured()) {
      _setOverlay(true, tr('جاري رفع الملفات...', 'Uploading files…'));
      fileUrls = await CloudinaryUploader.uploadAll((key, i, total) => {
        _setOverlay(true, tr(`رفع ملف ${i} من ${total}...`, `Uploading file ${i} of ${total}…`));
      });
    }

    // Step 2: collect all form data (with file URLs)
    _setOverlay(true, tr('جاري الإرسال...', 'Sending application…'));
    const data = collectFormData(fileUrls);

    // Step 3: save via secure server-side endpoint (no DB keys in client)
    // Include honeypot field value (should be empty for real users)
    const honeypot = document.getElementById('_hp');
    if (honeypot) data._hp = honeypot.value;

    const submitRes = await fetch('/api/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    if (!submitRes.ok) {
      const err = await submitRes.json().catch(() => ({}));
      console.error('[submit] server error', submitRes.status, JSON.stringify(err));
      throw new Error(err.error || 'Submission failed');
    }

    _setOverlay(false);
    showSuccessScreen();
  } catch (e) {
    console.error('[submit] caught:', e.message);
    _setOverlay(false);
    showStepError(tr('حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى', 'An error occurred, please try again'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

S.stepList = [0];
applyDocumentLocale();
if (APPLICATIONS_CLOSED) {
  showClosedScreen();
} else {
  renderStep();
}
