/* ═══════════════════════════════════════════════════
   EDUZAH HIRING FORM — form.js
   • All role definitions (including English Instructor)
   • English-mode: when en-instructor is selected, the
     entire UI switches to English (labels, placeholders,
     buttons, step titles, messages)
   • All other roles remain in Arabic
═══════════════════════════════════════════════════ */

const TEACHING_ROLES = ['kids-coding','prog-fundamentals','cybersecurity','data-analysis','ai-instructor','en-instructor'];

const ROLES = [
  { id:'kids-coding',       name:'Coding Instructor',                  nameAr:'مدرّس برمجة للأطفال',       track:'Kids / Summer Program',  trackAr:'برنامج الأطفال / الصيفي', emoji:'💻', group:'Kids Track',       groupAr:'قسم الأطفال' },
  { id:'prog-fundamentals', name:'Programming Fundamentals Instructor', nameAr:'مدرّس أساسيات البرمجة',     track:'Adult Track',            trackAr:'قسم البالغين',           emoji:'👨‍💻', group:'Adult Track',      groupAr:'قسم البالغين' },
  { id:'en-instructor',     name:'English Instructor',                  nameAr:'مدرّس لغة إنجليزية',        track:'Online / Offline',       trackAr:'أونلاين / أوفلاين',      emoji:'🇬🇧', group:'Language',         groupAr:'اللغات' },
  { id:'cybersecurity',     name:'Cybersecurity Instructor',            nameAr:'مدرّس أمن المعلومات',       track:'Online / Offline',       trackAr:'أونلاين / أوفلاين',      emoji:'🛡️', group:'Technical Roles',  groupAr:'الأدوار التقنية' },
  { id:'data-analysis',     name:'Data Analysis Instructor',            nameAr:'مدرّس تحليل البيانات',      track:'Offline only',           trackAr:'أوفلاين فقط',            emoji:'📊', group:'Technical Roles',  groupAr:'الأدوار التقنية' },
  { id:'ai-instructor',     name:'AI Instructor',                       nameAr:'مدرّس الذكاء الاصطناعي',   track:'Offline only',           trackAr:'أوفلاين فقط',            emoji:'🤖', group:'Technical Roles',  groupAr:'الأدوار التقنية' },
  { id:'sales',             name:'Sales Representative',                nameAr:'مندوب مبيعات',              track:'Full time / Part time',  trackAr:'دوام كامل / جزئي',       emoji:'💼', group:'Non-Teaching',     groupAr:'غير تدريسي' },
  { id:'designer',          name:'Graphic Designer',                    nameAr:'مصمم جرافيك',               track:'Full time / Part time',  trackAr:'دوام كامل / جزئي',       emoji:'🎨', group:'Non-Teaching',     groupAr:'غير تدريسي' },
];

const GOV_AR = ['الإسكندرية','أسوان','أسيوط','البحيرة','بني سويف','القاهرة','الدقهلية','دمياط','الفيوم','الغربية','الجيزة','الإسماعيلية','كفر الشيخ','الأقصر','مطروح','المنيا','المنوفية','الوادي الجديد','شمال سيناء','بورسعيد','القليوبية','قنا','البحر الأحمر','الشرقية','سوهاج','جنوب سيناء','السويس'];
const GOV_EN = ['Alexandria','Aswan','Asyut','Beheira','Beni Suef','Cairo','Dakahlia','Damietta','Faiyum','Gharbia','Giza','Ismailia','Kafr El Sheikh','Luxor','Matruh','Minya','Monufia','New Valley','North Sinai','Port Said','Qalyubia','Qena','Red Sea','Sharqia','Sohag','South Sinai','Suez'];
const SOHAG_AR = ['أخميم','البلينا','دار السلام','جرجا','جهينة','المنشأة','المراغة','ساقلتة','سوهاج','طهطا','طما'];
const SOHAG_EN = ['Akhmim','El Balyana','Dar El Salam','Girga','Juhaynah','El Mansha','El Maragha','Saqultah','Sohag','Tahta','Tama'];

/* ── State ───────────────────────────────────────────── */
const S = {
  step: 0,
  role: null,
  lang: 'ar',   // 'ar' or 'en'
  stepList: [],
};

/* ── Language helpers ────────────────────────────────── */
function isEN() { return S.lang === 'en'; }

function applyLang(lang) {
  S.lang = lang;
  const html = document.getElementById('htmlRoot');
  const body = document.body;
  if (lang === 'en') {
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
    body.classList.add('lang-en');
    body.classList.remove('lang-ar');
  } else {
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
    body.classList.remove('lang-en');
    body.classList.add('lang-ar');
  }
  updateStaticTexts(lang);
}

function updateStaticTexts(lang) {
  const texts = {
    ar: {
      tagline: 'بوابة التوظيف',
      adminLink: 'لوحة الإدارة',
      pill: 'فرص مفتوحة · 2025',
      heading: 'انضم إلى فريق <strong>Eduzah</strong>',
      desc: 'نبحث عن المبدعين والشغوفين بالتعليم والتقنية<br/>قدّم الآن وكن جزءاً من مستقبل التعليم الرقمي',
    },
    en: {
      tagline: 'Careers Portal',
      adminLink: 'Admin Panel',
      pill: 'Open Positions · 2025',
      heading: 'Join the <strong>Eduzah</strong> Team',
      desc: 'We\'re looking for passionate educators and tech professionals.<br/>Apply now and be part of the future of digital education.',
    },
  };
  const t = texts[lang];
  const set = (id, val, html=false) => {
    const el = document.getElementById(id);
    if (!el) return;
    html ? (el.innerHTML = val) : (el.textContent = val);
  };
  set('topbarTagline', t.tagline);
  set('adminLinkText', t.adminLink);
  set('heroPill', t.pill);
  set('heroHeading', t.heading, true);
  set('heroDesc', t.desc, true);
}

/* ── Step list builder ───────────────────────────────── */
function buildStepList(role) {
  const base = [0, 1, 2, 3, 4, 5]; // role, personal, academic, uploads, role-specific, assessment
  if (TEACHING_ROLES.includes(role)) base.push(6);  // equipment
  base.push(7, 8, 9, 10, 11);  // availability, video, screening, referral, agreement
  return base;
}

function stepName(idx) {
  const ar = ['الدور','البيانات','الأكاديمية','المستندات','الدور','التقييم','المعدات','الإتاحة','الفيديو','الفلترة','المصدر','الإقرار'];
  const en = ['Role','Personal','Academic','Uploads','Role','Assessment','Equipment','Availability','Video','Screening','Source','Agreement'];
  return isEN() ? en[idx] : ar[idx];
}

/* ── Progress bar ────────────────────────────────────── */
function renderProgress() {
  const track = document.getElementById('ppTrack');
  const label = document.getElementById('ppLabel');
  if (!track) return;
  track.innerHTML = '';

  S.stepList.forEach((si, i) => {
    const dot = document.createElement('div');
    dot.className = 'pp-dot' + (i === S.step ? ' active' : i < S.step ? ' done' : '');
    dot.textContent = i < S.step ? '✓' : (i + 1);
    dot.title = stepName(si);
    track.appendChild(dot);

    if (i < S.stepList.length - 1) {
      const seg = document.createElement('div');
      seg.className = 'pp-seg' + (i < S.step ? ' done' : '');
      track.appendChild(seg);
    }
  });

  const total = S.stepList.length;
  const cur   = S.step + 1;
  label.textContent = isEN() ? `Step ${cur} / ${total}` : `الخطوة ${cur} من ${total}`;
}

/* ── Nav buttons ─────────────────────────────────────── */
function renderNav(isLast = false) {
  const nav = document.getElementById('snInner');
  if (!nav) return;
  const backLabel = isEN() ? '← Back' : '→ رجوع';
  const nextLabel = isEN()
    ? (isLast ? 'Submit Application' : 'Continue →')
    : (isLast ? 'إرسال الطلب' : 'التالي ←');

  nav.innerHTML = `
    ${S.step > 0 ? `<button class="btn btn-back" onclick="goBack()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="${isEN() ? '15 18 9 12 15 6' : '9 18 15 12 9 6'}"/></svg>
      ${backLabel}
    </button>` : '<div></div>'}
    <button class="btn ${isLast ? 'btn-submit' : 'btn-next'}" onclick="${isLast ? 'submitForm()' : 'goNext()'}">
      ${nextLabel}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="${isEN() ? '9 18 15 12 9 6' : '15 18 9 12 15 6'}"/></svg>
    </button>
  `;
}

/* ── Main render dispatcher ─────────────────────────── */
function renderStep() {
  renderProgress();
  const si = S.stepList[S.step];
  const content = document.getElementById('stepContent');
  content.style.opacity = '0';
  content.style.transform = 'translateY(10px)';

  setTimeout(() => {
    content.innerHTML = '';
    const renderers = [r0, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11];
    renderers[si]();
    renderNav(S.step === S.stepList.length - 1);
    content.style.transition = 'opacity .3s ease, transform .3s ease';
    content.style.opacity = '1';
    content.style.transform = 'translateY(0)';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 80);
}

/* ── Navigation ──────────────────────────────────────── */
function goNext() {
  if (S.step === 0 && !S.role) {
    const e = document.getElementById('roleErr');
    if (e) e.classList.add('show');
    return;
  }
  if (S.step < S.stepList.length - 1) {
    S.step++;
    renderStep();
  }
}
function goBack() {
  if (S.step > 0) { S.step--; renderStep(); }
}

/* ── Field helpers ───────────────────────────────────── */
function fld(label, id, type = 'text', req = true, ph = '') {
  return `<div class="field-group">
    <label class="field-label" for="${id}">${label}${req ? '<span class="req"> *</span>' : ''}</label>
    <input type="${type}" id="${id}" placeholder="${ph}"/>
  </div>`;
}
function selFld(label, id, opts, req = true) {
  return `<div class="field-group">
    <label class="field-label" for="${id}">${label}${req ? '<span class="req"> *</span>' : ''}</label>
    <select id="${id}">
      <option value="">${isEN() ? 'Select…' : 'اختر...'}</option>
      ${opts.map(o => `<option>${o}</option>`).join('')}
    </select>
  </div>`;
}
function taFld(label, id, ph = '', req = true) {
  return `<div class="field-group">
    <label class="field-label" for="${id}">${label}${req ? '<span class="req"> *</span>' : ''}</label>
    <textarea id="${id}" placeholder="${ph}"></textarea>
  </div>`;
}
function ratingFld(label, id) {
  return `<div class="rating-row">
    <span class="rating-lbl">${label}</span>
    <input type="range" min="1" max="10" value="5" id="${id}"
      oninput="document.getElementById('${id}_v').textContent=this.value"/>
    <span class="rating-num" id="${id}_v">5</span>
  </div>`;
}
function uploadZone(label, hint, ico, id) {
  return `<div class="field-group">
    <label class="field-label">${label}<span class="req"> *</span></label>
    <div class="upload-zone" id="uz_${id}">
      <input type="file" aria-label="${label}" onchange="markUpload('${id}')"/>
      <div class="upload-default">
        <span class="upload-ico">${ico}</span>
        <div class="upload-lbl">${label}</div>
        <div class="upload-hint">${hint}</div>
      </div>
      <div class="upload-ok">✅ ${isEN() ? 'File selected' : 'تم اختيار الملف'}</div>
    </div>
  </div>`;
}
function markUpload(id) {
  document.getElementById('uz_' + id)?.classList.add('done');
}

/* ──────────────────────────────────────────────────────
   STEP 0 — Role Selection
─────────────────────────────────────────────────────── */
function r0() {
  const t = isEN()
    ? { title: 'Choose your role', sub: 'Select the position you\'re applying for. Your form will be customised accordingly.' }
    : { title: 'اختر دورك الوظيفي', sub: 'اختر الوظيفة التي تتقدم إليها — سيتكيف النموذج تلقائياً بناءً على اختيارك.' };

  const groups = [...new Set(ROLES.map(r => isEN() ? r.group : r.groupAr))];
  let html = `
    <div class="step-kicker">${isEN() ? 'Step 1' : 'الخطوة 1'}</div>
    <h1 class="step-title">${t.title}</h1>
    <p class="step-sub">${t.sub}</p>
  `;

  const rolesByGroup = {};
  ROLES.forEach(r => {
    const g = isEN() ? r.group : r.groupAr;
    if (!rolesByGroup[g]) rolesByGroup[g] = [];
    rolesByGroup[g].push(r);
  });

  groups.forEach(g => {
    html += `<div class="track-heading">${g}</div><div class="role-grid">`;
    rolesByGroup[g].forEach(r => {
      const name  = isEN() ? r.name  : r.nameAr;
      const track = isEN() ? r.track : r.trackAr;
      html += `
        <div class="role-card${S.role === r.id ? ' selected' : ''}" onclick="pickRole('${r.id}')">
          <span class="role-emoji">${r.emoji}</span>
          <div>
            <div class="role-name">${name}</div>
            <div class="role-meta">${track}</div>
          </div>
        </div>`;
    });
    html += '</div>';
  });

  html += `<div class="err${S.role === null && S.step > 0 ? ' show' : ''}" id="roleErr">
    ${isEN() ? '⚠ Please select a role to continue.' : '⚠ يرجى اختيار دور للمتابعة.'}
  </div>`;

  document.getElementById('stepContent').innerHTML = html;
}

function pickRole(id) {
  S.role = id;
  S.stepList = buildStepList(id);

  // Switch language if English Instructor selected
  if (id === 'en-instructor') {
    applyLang('en');
  } else if (S.lang === 'en') {
    applyLang('ar');
  }

  // Re-render role cards with updated selection
  document.querySelectorAll('.role-card').forEach(c => {
    const match = c.getAttribute('onclick')?.includes(`'${id}'`);
    c.classList.toggle('selected', match);
  });
  document.getElementById('roleErr')?.classList.remove('show');
}

/* ──────────────────────────────────────────────────────
   STEP 1 — Personal Information
─────────────────────────────────────────────────────── */
function r1() {
  const en = isEN();
  const T = {
    kicker: en ? 'Step 2' : 'الخطوة 2',
    title:  en ? 'Personal Information' : 'البيانات الشخصية',
    sub:    en ? 'Please fill in your personal details accurately.' : 'يرجى ملء بياناتك الشخصية بدقة.',
    nameAr: en ? 'Full Name (Arabic)'   : 'الاسم الكامل (عربي)',
    nameEn: en ? 'Full Name (English)'  : 'الاسم الكامل (إنجليزي)',
    email:  en ? 'Email Address'        : 'البريد الإلكتروني',
    phone:  en ? 'WhatsApp Number'      : 'رقم الواتساب',
    natid:  en ? 'National ID'          : 'الرقم القومي',
    gender: en ? 'Gender'               : 'الجنس',
    male:   en ? 'Male'                 : 'ذكر',
    female: en ? 'Female'               : 'أنثى',
    dob:    en ? 'Date of Birth'        : 'تاريخ الميلاد',
    gov:    en ? 'Governorate'          : 'المحافظة',
    city:   en ? 'City / Area'          : 'المدينة / المنطقة',
    sohag:  en ? 'Sohag Center'         : 'مركز سوهاج',
  };
  const govList  = en ? GOV_EN  : GOV_AR;
  const sohagList= en ? SOHAG_EN: SOHAG_AR;

  let html = `
    <div class="step-kicker">${T.kicker}</div>
    <h1 class="step-title">👤 ${T.title}</h1>
    <p class="step-sub">${T.sub}</p>
    <div class="field-row">
      ${fld(T.nameAr, 'nameAr', 'text', true, en ? 'e.g. Mohamed Ahmed' : 'الاسم الرباعي')}
      ${fld(T.nameEn, 'nameEn', 'text', true, 'Full legal name')}
    </div>
    <div class="field-row">
      ${fld(T.email, 'email', 'email', true, 'you@example.com')}
      ${fld(T.phone, 'phone', 'tel',   true, '+20 10X XXX XXXX')}
    </div>
    <div class="field-row">
      ${fld(T.natid, 'natid', 'text', true, en ? '14-digit ID number' : '14 رقم')}
      <div class="field-group">
        <label class="field-label">${T.gender}<span class="req"> *</span></label>
        <div class="choice-group">
          <label class="choice-pill"><input type="radio" name="gender" value="male"> ${T.male}</label>
          <label class="choice-pill"><input type="radio" name="gender" value="female"> ${T.female}</label>
        </div>
      </div>
    </div>
    <div class="field-row">
      ${fld(T.dob, 'dob', 'date')}
      ${selFld(T.gov, 'gov', govList)}
    </div>
    <div id="sohagRow" style="display:none">${selFld(T.sohag, 'sohagCenter', sohagList)}</div>
    ${fld(T.city, 'city', 'text', true, en ? 'Your district or area' : 'حيّك أو منطقتك')}
  `;
  document.getElementById('stepContent').innerHTML = html;
  document.getElementById('gov').addEventListener('change', function () {
    const isSohag = this.value === (en ? 'Sohag' : 'سوهاج');
    document.getElementById('sohagRow').style.display = isSohag ? 'block' : 'none';
  });
}

/* ──────────────────────────────────────────────────────
   STEP 2 — Academic
─────────────────────────────────────────────────────── */
function r2() {
  const en = isEN();
  const T = {
    kicker:   en ? 'Step 3'            : 'الخطوة 3',
    title:    en ? 'Academic Background': 'الخلفية الأكاديمية',
    sub:      en ? 'Tell us about your education.'  : 'أخبرنا عن مؤهلاتك الأكاديمية.',
    uni:      en ? 'University / Institute': 'الجامعة / المعهد',
    faculty:  en ? 'Faculty / School'      : 'الكلية',
    major:    en ? 'Major / Specialisation': 'التخصص',
    gradYear: en ? 'Graduation Year'       : 'سنة التخرج',
    status:   en ? 'Current Status'        : 'الحالة الدراسية',
    student:  en ? 'Student'               : 'طالب',
    graduate: en ? 'Graduate'              : 'خريج',
  };
  let html = `
    <div class="step-kicker">${T.kicker}</div>
    <h1 class="step-title">🎓 ${T.title}</h1>
    <p class="step-sub">${T.sub}</p>
    <div class="field-row">
      ${fld(T.uni, 'uni')}
      ${fld(T.faculty, 'faculty')}
    </div>
    <div class="field-row">
      ${fld(T.major, 'major')}
      ${fld(T.gradYear, 'gradYear', 'number', true, '2024')}
    </div>
    <div class="field-group">
      <label class="field-label">${T.status}<span class="req"> *</span></label>
      <div class="choice-group">
        <label class="choice-pill"><input type="radio" name="status" value="student"> ${T.student}</label>
        <label class="choice-pill"><input type="radio" name="status" value="graduate"> ${T.graduate}</label>
      </div>
    </div>
  `;
  document.getElementById('stepContent').innerHTML = html;
}

/* ──────────────────────────────────────────────────────
   STEP 3 — Uploads
─────────────────────────────────────────────────────── */
function r3() {
  const en = isEN();
  const T = {
    kicker: en ? 'Step 4'    : 'الخطوة 4',
    title:  en ? 'Required Documents' : 'المستندات المطلوبة',
    sub:    en ? 'Please upload clear, readable files.' : 'يرجى رفع ملفات واضحة وقابلة للقراءة.',
    cv:     en ? 'CV / Resume'       : 'السيرة الذاتية',
    photo:  en ? 'Personal Photo'    : 'صورة شخصية',
    idF:    en ? 'National ID — Front': 'الرقم القومي (وجه)',
    idB:    en ? 'National ID — Back' : 'الرقم القومي (ظهر)',
  };
  let html = `
    <div class="step-kicker">${T.kicker}</div>
    <h1 class="step-title">📎 ${T.title}</h1>
    <p class="step-sub">${T.sub}</p>
    <div class="upload-grid">
      ${uploadZone(T.cv,    en ? 'PDF only' : 'PDF فقط',     '📄', 'cv')}
      ${uploadZone(T.photo, en ? 'JPG or PNG' : 'JPG أو PNG','📷', 'photo')}
      ${uploadZone(T.idF,   en ? 'JPG or PNG' : 'JPG أو PNG','🪪', 'idFront')}
      ${uploadZone(T.idB,   en ? 'JPG or PNG' : 'JPG أو PNG','🪪', 'idBack')}
    </div>
  `;
  document.getElementById('stepContent').innerHTML = html;
}

/* ──────────────────────────────────────────────────────
   STEP 4 — Role-Specific
─────────────────────────────────────────────────────── */
function r4() {
  const r  = S.role;
  const en = isEN();
  const kicker = en ? 'Step 5' : 'الخطوة 5';
  const title  = en ? 'Role-Specific Questions' : 'أسئلة خاصة بالدور';
  let body = '';

  if (r === 'kids-coding') {
    body = `
      <div class="field-group">
        <label class="field-label">هل لديك خبرة في التعامل مع الأطفال؟<span class="req"> *</span></label>
        <div class="choice-group">
          <label class="choice-pill"><input type="radio" name="kidsExp" value="yes"> نعم</label>
          <label class="choice-pill"><input type="radio" name="kidsExp" value="no"> لا</label>
        </div>
      </div>
      ${taFld('صف تجربتك في التدريس (إن وجدت)', 'kidsTeach', 'كورسات، ورش عمل...', false)}
      ${taFld('كيف تشرح مفهوماً بسيطاً لطفل؟', 'kidsExplain', 'اعطِ مثالاً')}
      ${taFld('كيف تحافظ على انتباه الطفل؟', 'kidsComm', 'صف أسلوبك')}`;
  }

  if (r === 'prog-fundamentals') {
    body = `
      <div class="field-group">
        <label class="field-label">هل أنت مرتاح لتدريس المبتدئين تماماً؟<span class="req"> *</span></label>
        <div class="choice-group">
          <label class="choice-pill"><input type="radio" name="beg" value="yes"> نعم</label>
          <label class="choice-pill"><input type="radio" name="beg" value="no"> لا</label>
        </div>
      </div>
      ${taFld('كيف تشرح التفكير المنطقي لمبتدئ؟', 'logicExp')}
      ${taFld('اشرح مثالاً: المتغيرات أو الحلقات التكرارية', 'exTeach')}`;
  }

  if (r === 'en-instructor') {
    body = `
      <div class="field-group">
        <label class="field-label">Teaching level you can cover<span class="req"> *</span></label>
        <div class="choice-group">
          ${['Beginner (A1-A2)','Elementary (B1)','Intermediate (B2)','Upper Intermediate (C1)','Advanced (C2)'].map(l =>
            `<label class="choice-pill"><input type="checkbox" value="${l}"> ${l}</label>`).join('')}
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">Teaching mode<span class="req"> *</span></label>
        <div class="choice-group">
          ${['Online','Offline','Both'].map(m =>
            `<label class="choice-pill"><input type="radio" name="enMode" value="${m.toLowerCase()}"> ${m}</label>`).join('')}
        </div>
      </div>
      ${fld('Certifications (e.g. CELTA, DELTA, IELTS score)', 'enCert', 'text', false, 'e.g. CELTA, IELTS 8.0')}
      ${taFld('Describe your teaching methodology', 'enMethod', 'How do you structure a lesson? What approaches do you use?')}
      ${taFld('How do you keep adult learners engaged?', 'enEngage', '')}
      ${fld('Portfolio / previous course links (optional)', 'enPort', 'url', false, 'https://...')}`;
  }

  if (r === 'cybersecurity') {
    body = `
      <div class="field-group">
        <label class="field-label">نوع التدريس المفضل<span class="req"> *</span></label>
        <div class="choice-group">
          ${['أونلاين','أوفلاين','كلاهما'].map((m, i) =>
            `<label class="choice-pill"><input type="radio" name="cyberMode" value="${['online','offline','both'][i]}"> ${m}</label>`).join('')}
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">المواضيع التي يمكنك تدريسها</label>
        <div class="choice-group">
          ${['Networking','Linux','Ethical Hacking','SOC'].map(t =>
            `<label class="choice-pill"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}
        </div>
      </div>
      ${taFld('ما هو التصيد الاحتيالي (Phishing)؟ اشرح بإيجاز', 'phishQ')}
      ${fld('رابط GitHub / Portfolio', 'cyberGit', 'url', false, 'https://github.com/...')}`;
  }

  if (r === 'data-analysis') {
    body = `
      <div class="note info"><span class="note-ico">📌</span>هذا الدور متاح للتدريس الحضوري (أوفلاين) فقط</div>
      <div class="field-group">
        <label class="field-label">الأدوات التي تتقنها</label>
        <div class="choice-group">
          ${['Excel','SQL','Power BI','Python'].map(t =>
            `<label class="choice-pill"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}
        </div>
      </div>
      ${taFld('ما الفرق بين البيانات المنظمة وغير المنظمة؟', 'dataQ')}
      ${fld('رابط Portfolio / مشاريع', 'dataPort', 'url', false, 'https://...')}`;
  }

  if (r === 'ai-instructor') {
    body = `
      <div class="note info"><span class="note-ico">📌</span>هذا الدور متاح للتدريس الحضوري (أوفلاين) فقط</div>
      <div class="field-group">
        <label class="field-label">مجالات الخبرة</label>
        <div class="choice-group">
          ${['Machine Learning','Deep Learning','NLP'].map(t =>
            `<label class="choice-pill"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}
        </div>
      </div>
      <div class="field-group">
        <label class="field-label">الأدوات والأطر</label>
        <div class="choice-group">
          ${['Python','TensorFlow','PyTorch'].map(t =>
            `<label class="choice-pill"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}
        </div>
      </div>
      ${taFld('ما الفرق بين Machine Learning و Deep Learning؟', 'mlQ')}
      ${fld('رابط GitHub / المشاريع', 'aiGit', 'url', false, 'https://github.com/...')}`;
  }

  if (r === 'sales') {
    body = `
      ${taFld('صف تجربتك في المبيعات', 'salesExp', 'أدوار سابقة، قطاعات، إنجازات...', false)}
      ${ratingFld('مهارات التواصل (1-10)', 'salesComm')}
      ${taFld('كيف تتعامل مع عميل غير راضٍ؟', 'salesScen')}
      ${fld('الراتب المتوقع (جنيه/شهر)', 'salesSalary', 'number', false)}`;
  }

  if (r === 'designer') {
    body = `
      <div class="field-group">
        <label class="field-label">أدوات التصميم التي تستخدمها<span class="req"> *</span></label>
        <div class="choice-group">
          ${['Photoshop','Illustrator','Figma','After Effects','Canva'].map(t =>
            `<label class="choice-pill"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}
        </div>
      </div>
      ${fld('رابط Portfolio', 'designPort', 'url', true, 'https://behance.net/...')}
      ${fld('سنوات الخبرة', 'designYrs', 'number', true)}
      <div class="field-group">
        <label class="field-label">مجال التصميم المفضل<span class="req"> *</span></label>
        <div class="choice-group">
          ${['UI/UX','Branding','Social Media','Motion'].map(f =>
            `<label class="choice-pill"><input type="checkbox" value="${f}"> ${f}</label>`).join('')}
        </div>
      </div>
      ${taFld('صف عملية التصميم عندك', 'designProc')}`;
  }

  document.getElementById('stepContent').innerHTML = `
    <div class="step-kicker">${kicker}</div>
    <h1 class="step-title">⚙️ ${title}</h1>
    ${body}
  `;
}

/* ──────────────────────────────────────────────────────
   STEP 5 — Self Assessment
─────────────────────────────────────────────────────── */
function r5() {
  const en = isEN();
  const T = {
    kicker:  en ? 'Step 6'   : 'الخطوة 6',
    title:   en ? 'Self Assessment'   : 'التقييم الذاتي',
    sub:     en ? 'Rate yourself honestly — this helps us match you to the right opportunity.'
                : 'قيّم نفسك بصدق — يساعدنا ذلك على مطابقتك مع الفرصة المناسبة.',
    engLvl:  en ? 'English Level'     : 'مستوى اللغة الإنجليزية',
    teach:   en ? 'Teaching / Presentation Skill' : 'مهارة التدريس / العرض',
    tech:    en ? 'Technical Skill'   : 'المهارة التقنية',
    comm:    en ? 'Communication Skill': 'مهارة التواصل',
    levels:  en ? ['Beginner','Intermediate','Advanced'] : ['مبتدئ','متوسط','متقدم'],
  };
  document.getElementById('stepContent').innerHTML = `
    <div class="step-kicker">${T.kicker}</div>
    <h1 class="step-title">⭐ ${T.title}</h1>
    <p class="step-sub">${T.sub}</p>
    ${selFld(T.engLvl, 'engLevel', T.levels)}
    ${ratingFld(T.teach, 'rateTeach')}
    ${ratingFld(T.tech,  'rateTech')}
    ${ratingFld(T.comm,  'rateComm')}
  `;
}

/* ──────────────────────────────────────────────────────
   STEP 6 — Equipment (teaching roles only)
─────────────────────────────────────────────────────── */
function r6() {
  const en = isEN();
  const T = {
    kicker:   en ? 'Step 7'           : 'الخطوة 7',
    title:    en ? 'Equipment Check'  : 'فحص المعدات',
    sub:      en ? 'We need to ensure you have the basic tools for online / in-person teaching.'
                : 'نحتاج التأكد من توفر الأدوات الأساسية للتدريس.',
    laptop:   en ? 'Do you have a laptop suitable for teaching?' : 'هل لديك لابتوب مناسب للتدريس؟',
    internet: en ? 'Internet Quality'  : 'جودة الإنترنت',
    cam:      en ? 'Do you have a working camera and microphone?' : 'هل لديك كاميرا وميكروفون يعملان؟',
    yes: en ? 'Yes' : 'نعم', no: en ? 'No' : 'لا',
    iLevels: en ? ['Weak','Good','Excellent'] : ['ضعيفة','جيدة','ممتازة'],
  };
  document.getElementById('stepContent').innerHTML = `
    <div class="step-kicker">${T.kicker}</div>
    <h1 class="step-title">💻 ${T.title}</h1>
    <p class="step-sub">${T.sub}</p>
    <div class="field-group">
      <label class="field-label">${T.laptop}<span class="req"> *</span></label>
      <div class="choice-group">
        <label class="choice-pill"><input type="radio" name="laptop" value="yes"> ${T.yes}</label>
        <label class="choice-pill"><input type="radio" name="laptop" value="no">  ${T.no}</label>
      </div>
    </div>
    ${selFld(T.internet, 'internet', T.iLevels)}
    <div class="field-group">
      <label class="field-label">${T.cam}<span class="req"> *</span></label>
      <div class="choice-group">
        <label class="choice-pill"><input type="radio" name="camMic" value="yes"> ${T.yes}</label>
        <label class="choice-pill"><input type="radio" name="camMic" value="no">  ${T.no}</label>
      </div>
    </div>
  `;
}

/* ──────────────────────────────────────────────────────
   STEP 7 — Availability
─────────────────────────────────────────────────────── */
function r7() {
  const r  = S.role;
  const en = isEN();
  const offlineOnly = r === 'data-analysis' || r === 'ai-instructor';
  const modeOpts = offlineOnly
    ? (en ? ['Offline'] : ['أوفلاين'])
    : (en ? ['Online','Offline','Hybrid'] : ['أونلاين','أوفلاين','هجين']);
  const modeVals = offlineOnly ? ['offline'] : ['online','offline','hybrid'];
  const days = en
    ? ['Sat','Sun','Mon','Tue','Wed','Thu','Fri']
    : ['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'];
  const shifts = en
    ? ['Morning','Afternoon','Evening']
    : ['صباحية','مسائية','ليلية'];
  const starts = en
    ? ['Immediately','Within a week','Within a month']
    : ['فوراً','خلال أسبوع','خلال شهر'];
  const T = {
    kicker: en ? 'Step 8'    : 'الخطوة 8',
    title:  en ? 'Availability' : 'الإتاحة الزمنية',
    mode:   en ? 'Preferred Work Mode'  : 'نوع العمل المفضل',
    type:   en ? 'Work Type'            : 'نوع الدوام',
    full:   en ? 'Full time'            : 'كامل',
    part:   en ? 'Part time'            : 'جزئي',
    days:   en ? 'Available Days'       : 'أيام الإتاحة',
    shift:  en ? 'Preferred Shift'      : 'الفترة المفضلة',
    start:  en ? 'Earliest Start Date'  : 'أقرب موعد للبدء',
  };
  document.getElementById('stepContent').innerHTML = `
    <div class="step-kicker">${T.kicker}</div>
    <h1 class="step-title">📅 ${T.title}</h1>
    <div class="field-group">
      <label class="field-label">${T.mode}<span class="req"> *</span></label>
      <div class="choice-group">
        ${modeOpts.map((m, i) =>
          `<label class="choice-pill"><input type="radio" name="workMode" value="${modeVals[i]}"> ${m}</label>`).join('')}
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">${T.type}<span class="req"> *</span></label>
      <div class="choice-group">
        <label class="choice-pill"><input type="radio" name="workType" value="full"> ${T.full}</label>
        <label class="choice-pill"><input type="radio" name="workType" value="part"> ${T.part}</label>
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">${T.days}<span class="req"> *</span></label>
      <div class="choice-group">
        ${days.map(d => `<label class="choice-pill"><input type="checkbox" value="${d}"> ${d}</label>`).join('')}
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">${T.shift}<span class="req"> *</span></label>
      <div class="choice-group">
        ${shifts.map((s, i) =>
          `<label class="choice-pill"><input type="radio" name="shift" value="${['morning','afternoon','evening'][i]}"> ${s}</label>`).join('')}
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">${T.start}<span class="req"> *</span></label>
      <div class="choice-group">
        ${starts.map(s => `<label class="choice-pill"><input type="radio" name="startDate" value="${s}"> ${s}</label>`).join('')}
      </div>
    </div>
  `;
}

/* ──────────────────────────────────────────────────────
   STEP 8 — Video
─────────────────────────────────────────────────────── */
function r8() {
  const r  = S.role;
  const en = isEN();
  const hints = {
    'kids-coding':       en ? 'Record 1–2 min explaining a simple concept to a child.'    : 'سجّل فيديو 1-2 دقيقة تشرح فيه مفهوماً بسيطاً لطفل',
    'prog-fundamentals': 'سجّل فيديو تشرح فيه مفهوم برمجي لمبتدئ',
    'en-instructor':     'Record a 1–2 min video: introduce yourself and teach a short English mini-lesson.',
    'cybersecurity':     'سجّل فيديو تشرح فيه مفهوم أمن معلومات',
    'data-analysis':     'سجّل فيديو تشرح فيه مفهوم في تحليل البيانات',
    'ai-instructor':     'سجّل فيديو تشرح فيه مفهوم في الذكاء الاصطناعي',
    'sales':             'سجّل فيديو مدته دقيقة تبيع فيه أي منتج',
    'designer':          'سجّل فيديو تشرح فيه عملية التصميم عندك',
  };
  const T = {
    kicker: en ? 'Step 9'     : 'الخطوة 9',
    title:  en ? 'Video Submission' : 'الفيديو التقديمي',
    instr:  en
      ? 'Your video must include: <strong>a brief self-introduction</strong>, a short <strong>concept explanation</strong>, and show your <strong>communication style</strong>. Upload to Google Drive and share the link (Anyone with the link can view).'
      : 'الفيديو لازم يشمل: <strong>تعريف بنفسك</strong>، شرح <strong>مفهوم في مجالك</strong>، وأسلوب <strong>تواصلك</strong>. ارفعه على Google Drive وشارك الرابط (أي شخص لديه الرابط).',
    label:  en ? 'Google Drive Video Link' : 'رابط Google Drive للفيديو',
  };
  document.getElementById('stepContent').innerHTML = `
    <div class="step-kicker">${T.kicker}</div>
    <h1 class="step-title">🎥 ${T.title}</h1>
    <div class="note info"><span class="note-ico">📌</span>${hints[r] || (en ? 'Record a 1-2 min intro video.' : 'سجّل فيديو تعريفي 1-2 دقيقة.')}</div>
    <div style="background:var(--gray-50);border-radius:var(--r-lg);padding:1rem 1.25rem;margin-bottom:1rem;font-size:13px;color:var(--text-muted);line-height:1.75">
      ${T.instr}
    </div>
    ${fld(T.label, 'videoLink', 'url', true, 'https://drive.google.com/file/d/...')}
  `;
}

/* ──────────────────────────────────────────────────────
   STEP 9 — Screening
─────────────────────────────────────────────────────── */
function r9() {
  const en = isEN();
  const T = {
    kicker: en ? 'Step 10'  : 'الخطوة 10',
    title:  en ? 'Screening Questions' : 'أسئلة الفلترة',
    q1:     en ? 'Why do you want to join Eduzah?' : 'لماذا تريد الانضمام لـ Eduzah؟',
    q2:     en ? 'What makes you a strong fit for this role?' : 'ما الذي يجعلك مناسباً لهذا الدور؟',
    q3:     en ? 'How do you handle a struggling student or client?' : 'كيف تتعامل مع متدرب أو عميل يعاني من صعوبة؟',
    q4:     en ? 'Are you comfortable having sessions recorded or monitored?' : 'هل أنت مرتاح لتسجيل الجلسات أو مراقبتها؟',
    yes:    en ? 'Yes' : 'نعم',
    no:     en ? 'No'  : 'لا',
  };
  document.getElementById('stepContent').innerHTML = `
    <div class="step-kicker">${T.kicker}</div>
    <h1 class="step-title">❓ ${T.title}</h1>
    ${taFld(T.q1, 'whyEduzah')}
    ${taFld(T.q2, 'whyFit')}
    ${taFld(T.q3, 'handleQ')}
    <div class="field-group">
      <label class="field-label">${T.q4}<span class="req"> *</span></label>
      <div class="choice-group">
        <label class="choice-pill"><input type="radio" name="recorded" value="yes"> ${T.yes}</label>
        <label class="choice-pill"><input type="radio" name="recorded" value="no">  ${T.no}</label>
      </div>
    </div>
  `;
}

/* ──────────────────────────────────────────────────────
   STEP 10 — Referral
─────────────────────────────────────────────────────── */
function r10() {
  const en = isEN();
  const T = {
    kicker:  en ? 'Step 11'       : 'الخطوة 11',
    title:   en ? 'How did you find us?' : 'المصدر والإحالة',
    src:     en ? 'How did you hear about Eduzah?' : 'كيف عرفت عن Eduzah؟',
    ref:     en ? 'Referred by (optional)' : 'تم ترشيحك من قِبَل (اختياري)',
    refPh:   en ? 'Full name of the person who referred you' : 'الاسم الكامل للشخص الذي رشّحك',
    sources: en
      ? ['Social media','Friend or colleague','LinkedIn','Job board','Search engine','Other']
      : ['سوشيال ميديا','صديق أو زميل','LinkedIn','بورد وظائف','محرك البحث','أخرى'],
  };
  document.getElementById('stepContent').innerHTML = `
    <div class="step-kicker">${T.kicker}</div>
    <h1 class="step-title">📣 ${T.title}</h1>
    ${selFld(T.src, 'source', T.sources)}
    ${fld(T.ref, 'referral', 'text', false, T.refPh)}
  `;
}

/* ──────────────────────────────────────────────────────
   STEP 11 — Agreement
─────────────────────────────────────────────────────── */
function r11() {
  const en = isEN();
  const T = {
    kicker: en ? 'Final Step' : 'الخطوة الأخيرة',
    title:  en ? 'Declaration & Agreement' : 'الإقرار والموافقة',
    body:   en
      ? 'By submitting this application, you confirm that all information provided is accurate and complete. You understand that Eduzah may contact you via email or WhatsApp regarding your application.'
      : 'بتقديم هذا الطلب، تؤكد أن جميع المعلومات المقدمة صحيحة وكاملة، وتوافق على أن Eduzah قد تتواصل معك عبر البريد الإلكتروني أو الواتساب.',
    chk:    en
      ? 'I confirm all information is accurate and I agree to be contacted by Eduzah.'
      : 'أقر بأن جميع المعلومات صحيحة وأوافق على التواصل معي من قِبَل Eduzah.',
  };
  document.getElementById('stepContent').innerHTML = `
    <div class="step-kicker">${T.kicker}</div>
    <h1 class="step-title">✅ ${T.title}</h1>
    <div style="background:var(--gray-50);border:1px solid var(--gray-200);border-radius:var(--r-lg);padding:1.1rem 1.25rem;margin-bottom:1.25rem;font-size:13.5px;color:var(--text-muted);line-height:1.8">
      ${T.body}
    </div>
    <label style="display:flex;align-items:flex-start;gap:11px;cursor:pointer;font-size:14px;font-weight:500;color:var(--text-secondary);line-height:1.6">
      <input type="checkbox" id="agree" style="width:17px;height:17px;flex-shrink:0;margin-top:3px;accent-color:var(--brand-blue);cursor:pointer"/>
      ${T.chk}
    </label>
    <div class="err" id="agreeErr" style="margin-top:8px">
      ${en ? '⚠ Please confirm the declaration.' : '⚠ يرجى تأكيد الإقرار قبل الإرسال.'}
    </div>
  `;
}

/* ──────────────────────────────────────────────────────
   Submit
─────────────────────────────────────────────────────── */
function submitForm() {
  const agree = document.getElementById('agree');
  if (!agree || !agree.checked) {
    document.getElementById('agreeErr')?.classList.add('show');
    return;
  }
  const en = isEN();
  const ref = 'EDZ-' + Date.now().toString(36).toUpperCase().slice(-6);

  document.getElementById('formCard').innerHTML = `
    <div class="success-wrap">
      <div class="success-ring">
        <div class="success-ring-inner">🎉</div>
      </div>
      <h2 class="success-h">${en ? 'Application Submitted!' : 'تم إرسال طلبك بنجاح!'}</h2>
      <p class="success-p">
        ${en
          ? 'Thank you for applying to Eduzah. We will review your application and reach out via WhatsApp or email within 3–5 business days.'
          : 'شكراً لتقديمك في Eduzah. سنراجع طلبك ونتواصل معك خلال 3-5 أيام عمل.'}
      </p>
      <div class="success-ref">${en ? 'Ref' : 'المرجع'}: ${ref}</div>
    </div>
  `;
  document.getElementById('stickyNav').style.display = 'none';
  document.getElementById('progressPill').style.display = 'none';
}

/* ── Boot ────────────────────────────────────────────── */
S.stepList = [0];
// will be re-rendered by app.js after DOM ready
