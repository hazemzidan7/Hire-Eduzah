const STEPS=['Role','Personal','Academic','Uploads','Role-Specific','Assessment','Equipment','Availability','Video','Screening','Referral','Agreement'];
const TEACHING=['kids-coding','prog-fundamentals','cybersecurity','data-analysis','ai-instructor'];
const VIDEO_HINTS={
  'kids-coding':'سجّل فيديو مدته 1–2 دقيقة تشرح فيه مفهوماً بسيطاً في البرمجة لطفل',
  'prog-fundamentals':'سجّل فيديو تشرح فيه مسألة برمجية بسيطة وطريقة حلها',
  'cybersecurity':'سجّل فيديو مدته 1–2 دقيقة تشرح فيه مفهوماً أساسياً في الأمن السيبراني مع ذكر مثال عملي',
  'data-analysis':'سجّل فيديو تشرح فيه مفهوماً في تحليل البيانات',
  'ai-instructor':'سجّل فيديو تشرح فيه مفهوماً في الذكاء الاصطناعي',
  'sales':'سجّل فيديو مدته دقيقة تقدّم فيه نفسك وتبيّن مهاراتك في التواصل والبيع',
  'designer':'سجّل فيديو تشرح فيه عملية التصميم عندك'
};
const ROLES=[
  {id:'kids-coding',name:'Coding Instructor',track:'Kids / Summer Program',group:'Kids Track'},
  {id:'prog-fundamentals',name:'Programming Fundamentals Instructor',track:'Adult Track',group:'Adult Track'},
  {id:'cybersecurity',name:'Cybersecurity Instructor',track:'Online / Offline',group:'Technical Roles'},
  {id:'data-analysis',name:'Data Analysis Instructor',track:'Offline only',group:'Technical Roles'},
  {id:'ai-instructor',name:'AI Instructor',track:'Offline only',group:'Technical Roles'},
  {id:'sales',name:'Sales Representative',track:'Non-Teaching',group:'Non-Teaching'},
  {id:'designer',name:'Graphic Designer',track:'Non-Teaching',group:'Non-Teaching'},
];
const GOV=['Alexandria','Aswan','Asyut','Beheira','Beni Suef','Cairo','Dakahlia','Damietta','Faiyum','Gharbia','Giza','Ismailia','Kafr El Sheikh','Luxor','Matruh','Minya','Monufia','New Valley','North Sinai','Port Said','Qalyubia','Qena','Red Sea','Sharqia','Sohag','South Sinai','Suez'];
const SOHAG=['Akhmim','El Balyana','Dar El Salam','Girga','Juhaynah','El Mansha','El Maragha','Saqultah','Sohag','Tahta','Tama'];
/** Set true to let applicants edit DOB after auto-fill from National ID */
const ALLOW_MANUAL_DOB_EDIT=false;
let S={step:0,role:null,stepList:[]};
let natIdAutofillBound=false;

function buildSteps(r){
  const b=[0,1,2,3,4,5];
  if(TEACHING.includes(r))b.push(6);
  b.push(7);
  if(r!=='designer')b.push(8,9);
  b.push(10,11);
  return b;
}
function cur(){return S.stepList[S.step];}

function $(id){return document.getElementById(id);}
function val(id){const el=$(id);return el?el.value.trim():'';}
function radio(name){const el=document.querySelector(`input[name="${name}"]:checked`);return el?el.value:'';}
function checkedIn(sel){return [...document.querySelectorAll(sel)].filter(c=>c.checked);}
function isEmail(s){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);}
function isUrl(s){try{new URL(s);return true;}catch{return false;}}

function clearValidation(){
  document.querySelectorAll('.invalid').forEach(el=>el.classList.remove('invalid'));
  document.querySelectorAll('.invalid-outline').forEach(el=>el.classList.remove('invalid-outline'));
  document.querySelectorAll('.field-error.show,.step-error.show').forEach(el=>el.classList.remove('show'));
}

function setFieldError(id,msg){
  const el=$(id);
  if(el)el.classList.add('invalid');
  const err=$(id+'_err');
  if(err){err.textContent=msg;err.classList.add('show');}
}

function setGroupError(groupId,msg){
  const g=$(groupId);
  if(g)g.classList.add('invalid-outline');
  const err=$(groupId+'_err');
  if(err){err.textContent=msg;err.classList.add('show');}
}

function showStepError(msg){
  const e=$('stepErr');
  if(e){e.textContent=msg;e.classList.add('show');}
}

function fld(lbl,id,type='text',req=true,ph=''){
  const err=req?`<div class="field-error" id="${id}_err"></div>`:'';
  return`<div class="field-group"><label class="field-label" for="${id}">${lbl}${req?'<span class="req"> *</span>':''}</label><input type="${type}" id="${id}" placeholder="${ph}"/>${err}</div>`;
}
function sel(lbl,id,opts,req=true){
  const err=req?`<div class="field-error" id="${id}_err"></div>`:'';
  return`<div class="field-group"><label class="field-label" for="${id}">${lbl}${req?'<span class="req"> *</span>':''}</label><select id="${id}"><option value="">اختر...</option>${opts.map(o=>`<option>${o}</option>`).join('')}</select>${err}</div>`;
}
function ta(lbl,id,ph='',req=true){
  const err=req?`<div class="field-error" id="${id}_err"></div>`:'';
  return`<div class="field-group"><label class="field-label" for="${id}">${lbl}${req?'<span class="req"> *</span>':''}</label><textarea id="${id}" placeholder="${ph}"></textarea>${err}</div>`;
}
function rating(lbl,id){
  return`<div class="rating-row"><div class="rl">${lbl}</div><input type="range" min="1" max="10" value="5" step="1" id="${id}" oninput="document.getElementById('${id}_v').textContent=this.value"/><div class="rating-val" id="${id}_v">5</div><span style="font-size:12px;color:#9ca3af">/10</span></div>`;
}
function navBtns(last=false){
  return`<div class="nav-btns">${S.step>0?'<button type="button" class="btn-back" onclick="goBack()">رجوع</button>':''}<button type="button" class="btn-next" onclick="${last?'submitForm()':'goNext()'}">${last?'إرسال الطلب':'التالي'}</button></div>`;
}

function flashAutofill(el){
  if(!el)return;
  el.classList.remove('auto-filled');
  void el.offsetWidth;
  el.classList.add('auto-filled');
}

function setDobFromNatId(dobEl,value,locked){
  if(!dobEl)return;
  dobEl.value=value;
  if(locked&&!ALLOW_MANUAL_DOB_EDIT){
    dobEl.readOnly=true;
    dobEl.setAttribute('aria-readonly','true');
    dobEl.classList.add('dob-autofill');
    dobEl.title='تم تعبئته تلقائياً من الرقم القومي';
  }else{
    dobEl.readOnly=false;
    dobEl.removeAttribute('aria-readonly');
    dobEl.classList.remove('dob-autofill');
    dobEl.removeAttribute('title');
  }
  flashAutofill(dobEl.closest('.field-group')||dobEl);
}

function unlockDobManual(){
  const dob=$('dob');
  if(!dob)return;
  dob.readOnly=false;
  dob.removeAttribute('aria-readonly');
  dob.classList.remove('dob-autofill');
  dob.removeAttribute('title');
}

function setGenderFromNatId(value){
  const el=document.querySelector(`input[name="gender"][value="${value}"]`);
  if(!el)return;
  el.checked=true;
  flashAutofill($('genderGroup'));
  const g=$('genderGroup');
  if(g)g.classList.remove('invalid-outline');
  const err=$('genderGroup_err');
  if(err)err.classList.remove('show');
}

function setGovernorateFromNatId(name){
  const gov=$('gov');
  if(!gov||!name)return;
  const hasOption=[...gov.options].some(o=>o.value===name||o.text===name);
  if(!hasOption)return;
  gov.value=name;
  flashAutofill(gov.closest('.field-group')||gov);
  gov.classList.remove('invalid');
  const err=$('gov_err');
  if(err)err.classList.remove('show');
  const sohagRow=$('sohagRow');
  if(sohagRow)sohagRow.style.display=name==='Sohag'?'block':'none';
}

function clearNatIdAutofill(){
  unlockDobManual();
  const dob=$('dob');
  if(dob){dob.value='';dob.classList.remove('auto-filled');}
  document.querySelectorAll('input[name="gender"]').forEach(r=>{r.checked=false;});
  const gov=$('gov');
  if(gov){
    gov.value='';
    const sohagRow=$('sohagRow');
    if(sohagRow)sohagRow.style.display='none';
    const sc=$('sohagCenter');
    if(sc)sc.value='';
  }
  ['dob','genderGroup','gov'].forEach(id=>{
    const wrap=id==='genderGroup'?$(id):$(id)&&$(id).closest('.field-group');
    if(wrap)wrap.classList.remove('auto-filled');
  });
}

function applyNatIdParse(raw){
  const nat=$('natid');
  const parsed=EgyptianNationalId.parseEgyptianNationalId(raw);
  const err=$('natid_err');
  const hint=$('natid_hint');

  if(nat){
    const sanitized=parsed.digits;
    if(nat.value!==sanitized)nat.value=sanitized;
  }

  if(parsed.digits.length===0){
    if(nat)nat.classList.remove('invalid','natid-valid');
    if(err)err.classList.remove('show');
    if(hint){hint.textContent='';hint.classList.remove('show','success');}
    clearNatIdAutofill();
    return;
  }

  if(!parsed.complete){
    if(nat)nat.classList.remove('natid-valid','invalid');
    if(err)err.classList.remove('show');
    if(hint){
      hint.textContent=`${parsed.digits.length}/14 رقم`;
      hint.classList.add('show');
      hint.classList.remove('success');
    }
    if(parsed.digits.length<14)clearNatIdAutofill();
    return;
  }

  if(parsed.valid){
    if(nat){nat.classList.remove('invalid');nat.classList.add('natid-valid');}
    if(err)err.classList.remove('show');
    if(hint){
      hint.textContent='تم استخراج البيانات تلقائياً';
      hint.classList.add('show','success');
    }
    setDobFromNatId($('dob'),parsed.dateOfBirth,true);
    $('dob').classList.remove('invalid');
    const dobErr=$('dob_err');
    if(dobErr)dobErr.classList.remove('show');
    setGenderFromNatId(parsed.gender);
    setGovernorateFromNatId(parsed.governorate);
    if(nat)flashAutofill(nat.closest('.field-group')||nat);
    return;
  }

  if(nat){nat.classList.add('invalid');nat.classList.remove('natid-valid');}
  if(err){
    err.textContent=parsed.errors[0]||'يرجى إدخال رقم قومي مصري صحيح (14 رقم)';
    err.classList.add('show');
  }
  if(hint){hint.textContent='';hint.classList.remove('show','success');}
  clearNatIdAutofill();
}

function bindNatIdAutofill(){
  if(natIdAutofillBound)return;
  const nat=$('natid');
  if(!nat)return;
  natIdAutofillBound=true;

  nat.setAttribute('inputmode','numeric');
  nat.setAttribute('autocomplete','off');
  nat.setAttribute('maxlength','14');
  nat.setAttribute('pattern','[0-9]{14}');

  nat.addEventListener('input',function(){
    applyNatIdParse(this.value);
  });

  nat.addEventListener('paste',function(e){
    e.preventDefault();
    const text=(e.clipboardData||window.clipboardData).getData('text');
    applyNatIdParse(text);
  });

  nat.addEventListener('keypress',function(e){
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    if(e.key.length===1&&!/\d/.test(e.key))e.preventDefault();
  });
}

function validateCurrentStep(){
  clearValidation();
  const step=cur();
  let ok=true;

  if(step===0){
    if(!S.role){const e=$('roleErr');if(e)e.classList.add('show');return false;}
    return true;
  }

  if(step===1){
    if(!val('nameAr')){setFieldError('nameAr','يرجى إدخال الاسم بالعربية');ok=false;}
    if(!val('nameEn')){setFieldError('nameEn','يرجى إدخال الاسم بالإنجليزية');ok=false;}
    if(!isEmail(val('email'))){setFieldError('email','يرجى إدخال بريد إلكتروني صحيح');ok=false;}
    if(val('phone').length<10){setFieldError('phone','يرجى إدخال رقم واتساب صحيح');ok=false;}
    const natCheck=EgyptianNationalId.validateNationalId(val('natid'));
    if(!natCheck.valid){setFieldError('natid',natCheck.message);ok=false;}
    if(!radio('gender')){setGroupError('genderGroup','يرجى اختيار الجنس');ok=false;}
    if(!val('dob')){setFieldError('dob','يرجى إدخال تاريخ الميلاد');ok=false;}
    if(!val('gov')){setFieldError('gov','يرجى اختيار المحافظة');ok=false;}
    if(val('gov')==='Sohag'&&!val('sohagCenter')){setFieldError('sohagCenter','يرجى اختيار مركز سوهاج');ok=false;}
    if(!val('city')){setFieldError('city','يرجى إدخال المدينة أو المنطقة');ok=false;}
    if(!ok)showStepError('يرجى إكمال جميع الحقول المطلوبة بشكل صحيح');
    return ok;
  }

  if(step===2){
    ['uni','faculty','major','gradYear'].forEach(id=>{
      if(!val(id)){setFieldError(id,'هذا الحقل مطلوب');ok=false;}
    });
    if(!radio('status')){setGroupError('statusGroup','يرجى اختيار الحالة');ok=false;}
    if(!ok)showStepError('يرجى إكمال جميع الحقول المطلوبة');
    return ok;
  }

  if(step===3){
    [['cvFile','السيرة الذاتية'],['photoFile','الصورة الشخصية'],['natidFront','صورة الرقم القومي (أمام)'],['natidBack','صورة الرقم القومي (خلف)']].forEach(([id,lbl])=>{
      const inp=$(id);
      if(!inp||!inp.files||!inp.files.length){
        const box=inp&&inp.closest('.upload-box');
        if(box)box.classList.add('invalid');
        const err=$(id+'_err');
        if(err){err.textContent=`يرجى رفع ${lbl}`;err.classList.add('show');}
        ok=false;
      }
    });
    if(!ok)showStepError('يرجى رفع جميع المستندات المطلوبة');
    return ok;
  }

  if(step===4){
    const r=S.role;
    if(r==='kids-coding'&&!radio('kidsExp')){setGroupError('kidsExpGroup','يرجى الإجابة');ok=false;}
    if(r==='prog-fundamentals'){
      if(!radio('beg')){setGroupError('begGroup','يرجى الإجابة');ok=false;}
      if(!val('logicExp')){setFieldError('logicExp','هذا الحقل مطلوب');ok=false;}
      if(!val('exTeach')){setFieldError('exTeach','هذا الحقل مطلوب');ok=false;}
    }
    if(r==='cybersecurity'){
      if(!radio('cyberMode')){setGroupError('cyberModeGroup','يرجى اختيار نوع التدريس');ok=false;}
      if(!val('phishQ')){setFieldError('phishQ','هذا الحقل مطلوب');ok=false;}
    }
    if(r==='data-analysis'&&!val('dataQ')){setFieldError('dataQ','هذا الحقل مطلوب');ok=false;}
    if(r==='ai-instructor'&&!val('mlQ')){setFieldError('mlQ','هذا الحقل مطلوب');ok=false;}
    if(r==='designer'){
      if(!checkedIn('#designToolsGroup input[type=checkbox]').length){setGroupError('designToolsGroup','يرجى اختيار أداة واحدة على الأقل');ok=false;}
      if(!isUrl(val('designPort'))){setFieldError('designPort','يرجى إدخال رابط Portfolio صحيح');ok=false;}
      if(!val('designYrs')){setFieldError('designYrs','يرجى إدخال سنوات الخبرة');ok=false;}
      if(!checkedIn('#designFieldsGroup input[type=checkbox]').length){setGroupError('designFieldsGroup','يرجى اختيار مجال واحد على الأقل');ok=false;}
      if(!val('designProc')){setFieldError('designProc','هذا الحقل مطلوب');ok=false;}
    }
    if(!ok)showStepError('يرجى إكمال جميع الحقول المطلوبة');
    return ok;
  }

  if(step===5){
    if(!val('engLevel')){setFieldError('engLevel','يرجى اختيار مستوى اللغة');ok=false;}
    if(!ok)showStepError('يرجى إكمال التقييم الذاتي');
    return ok;
  }

  if(step===6){
    if(!radio('laptop')){setGroupError('laptopGroup','يرجى الإجابة');ok=false;}
    if(!val('internet')){setFieldError('internet','يرجى اختيار جودة الإنترنت');ok=false;}
    if(!radio('camMic')){setGroupError('camMicGroup','يرجى الإجابة');ok=false;}
    if(!ok)showStepError('يرجى إكمال جميع الحقول المطلوبة');
    return ok;
  }

  if(step===7){
    if(!radio('workMode')){setGroupError('workModeGroup','يرجى اختيار نوع العمل');ok=false;}
    if(!radio('workType')){setGroupError('workTypeGroup','يرجى اختيار نوع الدوام');ok=false;}
    if(!checkedIn('#availDaysGroup input[type=checkbox]').length){setGroupError('availDaysGroup','يرجى اختيار يوم واحد على الأقل');ok=false;}
    if(!radio('shift')){setGroupError('shiftGroup','يرجى اختيار الفترة المفضلة');ok=false;}
    if(!radio('startDate')){setGroupError('startDateGroup','يرجى اختيار أقرب موعد للبدء');ok=false;}
    if(!ok)showStepError('يرجى إكمال جميع الحقول المطلوبة');
    return ok;
  }

  if(step===8){
    const link=val('videoLink');
    if(!link||!isUrl(link)){setFieldError('videoLink','يرجى إدخال رابط Google Drive صحيح');ok=false;showStepError('يرجى إدخال رابط الفيديو');}
    return ok;
  }

  if(step===9){
    if(!val('whyEduzah')){setFieldError('whyEduzah','هذا الحقل مطلوب');ok=false;}
    if(!val('whyFit')){setFieldError('whyFit','هذا الحقل مطلوب');ok=false;}
    if(!val('handleQ')){setFieldError('handleQ','هذا الحقل مطلوب');ok=false;}
    if(!radio('recorded')){setGroupError('recordedGroup','يرجى الإجابة');ok=false;}
    if(!ok)showStepError('يرجى إكمال جميع الأسئلة');
    return ok;
  }

  if(step===10){
    if(!val('source')){setFieldError('source','يرجى اختيار كيف عرفت عنا');ok=false;showStepError('يرجى إكمال الحقل المطلوب');}
    return ok;
  }

  return true;
}

function renderProgress(){
  const bar=document.getElementById('progressBar');
  bar.innerHTML='';
  S.stepList.forEach((si,i)=>{
    const d=document.createElement('div');
    d.className='step-dot'+(i===S.step?' active':i<S.step?' done':'');
    d.textContent=i<S.step?'':(i+1);
    bar.appendChild(d);
    if(i<S.stepList.length-1){
      const l=document.createElement('div');
      l.className='step-line'+(i<S.step?' done':'');
      bar.appendChild(l);
    }
  });
}

function renderStep(){
  renderProgress();
  const c=document.getElementById('stepContent');
  c.innerHTML='';
  [r0,r1,r2,r3,r4,r5,r6,r7,r8,r9,r10,r11][cur()]();
}

function r0(){
  const groups=[...new Set(ROLES.map(r=>r.group))];
  let h=`<div class="step-title">اختر الوظيفة</div>`;
  groups.forEach(g=>{
    h+=`<div class="track-label">${g}</div><div class="role-grid">`;
    ROLES.filter(r=>r.group===g).forEach(r=>{
      h+=`<div class="role-card${S.role===r.id?' selected':''}" data-role="${r.id}" onclick="pickRole('${r.id}')"><div class="role-name">${r.name}</div><div class="role-track">${r.track}</div></div>`;
    });
    h+='</div>';
  });
  h+=`<div class="error-msg" id="roleErr">يرجى اختيار وظيفة للمتابعة</div>${navBtns()}`;
  document.getElementById('stepContent').innerHTML=h;
}

function pickRole(id){
  S.role=id;
  S.stepList=buildSteps(id);
  document.querySelectorAll('.role-card').forEach(c=>c.classList.toggle('selected',c.dataset.role===id));
  const e=$('roleErr');
  if(e)e.classList.remove('show');
}

function r1(){
  let h=`<div class="step-error" id="stepErr"></div><div class="step-title">البيانات الشخصية</div>`;
  h+=`<div class="field-row">${fld('الاسم كامل (عربي)','nameAr','text',true,'الاسم الرباعي')}${fld('الاسم كامل (إنجليزي)','nameEn','text',true,'Full legal name')}</div>`;
  h+=`<div class="field-row">${fld('البريد الإلكتروني','email','email',true,'you@example.com')}${fld('واتساب','phone','tel',true,'+20 10X XXX XXXX')}</div>`;
  h+=`<div class="field-row"><div class="field-group"><label class="field-label" for="natid">الرقم القومي <span class="req"> *</span></label><input type="text" id="natid" placeholder="14 رقم" inputmode="numeric" maxlength="14" autocomplete="off"/><div class="field-hint" id="natid_hint" aria-live="polite"></div><div class="field-error" id="natid_err"></div></div>`;
  h+=`<div class="field-group" id="genderGroup"><label class="field-label">الجنس <span class="req">*</span></label><div class="check-group">${['ذكر','أنثى'].map((l,i)=>`<label class="check-item"><input type="radio" name="gender" value="${i?'female':'male'}"> ${l}</label>`).join('')}</div><div class="field-error" id="genderGroup_err"></div></div></div>`;
  h+=`<div class="field-row">${fld('تاريخ الميلاد','dob','date')}${sel('المحافظة','gov',GOV)}</div>`;
  h+=`<div id="sohagRow" style="display:none">${sel('مركز سوهاج','sohagCenter',SOHAG)}</div>`;
  h+=fld('المدينة / المنطقة','city','text',true,'حيك أو منطقتك');
  h+=navBtns();
  document.getElementById('stepContent').innerHTML=h;
  $('gov').addEventListener('change',function(){$('sohagRow').style.display=this.value==='Sohag'?'block':'none';});
  natIdAutofillBound=false;
  bindNatIdAutofill();
}

function r2(){
  let h=`<div class="step-error" id="stepErr"></div><div class="step-title">البيانات الأكاديمية</div>`;
  h+=`<div class="field-row">${fld('الجامعة / المعهد','uni')}${fld('الكلية','faculty')}</div>`;
  h+=`<div class="field-row">${fld('التخصص','major')}${fld('سنة التخرج','gradYear','number',true,'2024')}</div>`;
  h+=`<div class="field-group" id="statusGroup"><label class="field-label">الحالة <span class="req">*</span></label><div class="check-group"><label class="check-item"><input type="radio" name="status" value="student"> طالب</label><label class="check-item"><input type="radio" name="status" value="graduate"> خريج</label></div><div class="field-error" id="statusGroup_err"></div></div>`;
  h+=navBtns();
  document.getElementById('stepContent').innerHTML=h;
}

function r3(){
  let h=`<div class="step-error" id="stepErr"></div><div class="step-title">المستندات المطلوبة</div>`;
  [['cvFile','السيرة الذاتية','PDF فقط'],['photoFile','صورة شخصية','JPG أو PNG'],['natidFront','الرقم القومي (أمام)','JPG أو PNG'],['natidBack','الرقم القومي (خلف)','JPG أو PNG']].forEach(([id,lbl,hint])=>{
    h+=`<div class="field-group"><label class="field-label">${lbl} <span class="req">*</span></label><div class="upload-box"><input type="file" id="${id}" aria-label="${lbl}"/><p>${lbl}</p><small>${hint}</small></div><div class="field-error" id="${id}_err"></div></div>`;
  });
  h+=navBtns();
  document.getElementById('stepContent').innerHTML=h;
}

function r4(){
  const r=S.role;
  let h=`<div class="step-error" id="stepErr"></div><div class="step-title">أسئلة خاصة بالوظيفة</div>`;
  if(r==='kids-coding'){
    h+=`<div class="field-group" id="kidsExpGroup"><label class="field-label">هل لديك خبرة في التعامل مع الأطفال؟ <span class="req">*</span></label><div class="check-group"><label class="check-item"><input type="radio" name="kidsExp" value="yes"> نعم</label><label class="check-item"><input type="radio" name="kidsExp" value="no"> لا</label></div><div class="field-error" id="kidsExpGroup_err"></div></div>`;
    h+=ta('صف تجربتك في التدريس (إن وجدت)','kidsTeach','كورسات، ورش عمل، دروس خصوصية...',false);
    h+=ta('كيف تشرح مفهوماً بسيطاً لطفل؟','kidsExplain','اعطِ مثالاً',false);
    h+=ta('كيف تحافظ على انتباه الطفل وتفاعله؟','kidsComm','صف أسلوبك',false);
  }
  if(r==='prog-fundamentals'){
    h+=`<div class="field-group" id="begGroup"><label class="field-label">هل أنت مرتاح لتدريس المبتدئين تماماً؟ <span class="req">*</span></label><div class="check-group"><label class="check-item"><input type="radio" name="beg" value="yes"> نعم</label><label class="check-item"><input type="radio" name="beg" value="no"> لا</label></div><div class="field-error" id="begGroup_err"></div></div>`;
    h+=ta('كيف تشرح التفكير المنطقي لمبتدئ؟','logicExp','');
    h+=ta('اشرح مثالاً: المتغيرات أو الحلقات التكرارية','exTeach','');
  }
  if(r==='cybersecurity'){
    h+=`<div class="field-group" id="cyberModeGroup"><label class="field-label">نوع التدريس المفضل <span class="req">*</span></label><div class="check-group">${['أونلاين','أوفلاين','كلاهما'].map((m,i)=>`<label class="check-item"><input type="radio" name="cyberMode" value="${['online','offline','both'][i]}"> ${m}</label>`).join('')}</div><div class="field-error" id="cyberModeGroup_err"></div></div>`;
    h+=`<div class="field-group"><label class="field-label">المواضيع التي يمكنك تدريسها</label><div class="check-group">${['Networking','Linux','Ethical Hacking','SOC'].map(t=>`<label class="check-item"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}</div></div>`;
    h+=ta('ما هو التصيد الاحتيالي (Phishing)؟ اشرح بإيجاز','phishQ','');
    h+=fld('رابط GitHub / Portfolio','cyberGit','url',false,'https://github.com/...');
  }
  if(r==='data-analysis'){
    h+=`<div class="note-box">هذه الوظيفة متاحة للتدريس الحضوري (أوفلاين) فقط</div>`;
    h+=`<div class="field-group"><label class="field-label">الأدوات التي تتقنها</label><div class="check-group">${['Excel','SQL','Power BI','Python'].map(t=>`<label class="check-item"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}</div></div>`;
    h+=ta('ما الفرق بين البيانات المنظمة وغير المنظمة؟','dataQ','');
    h+=fld('رابط Portfolio / مشاريع','dataPort','url',false,'https://...');
  }
  if(r==='ai-instructor'){
    h+=`<div class="note-box">هذه الوظيفة متاحة للتدريس الحضوري (أوفلاين) فقط</div>`;
    h+=`<div class="field-group"><label class="field-label">مجالات خبرتك</label><div class="check-group">${['Machine Learning','Deep Learning','NLP'].map(t=>`<label class="check-item"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}</div></div>`;
    h+=`<div class="field-group"><label class="field-label">الأدوات والأطر البرمجية</label><div class="check-group">${['Python','TensorFlow','PyTorch'].map(t=>`<label class="check-item"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}</div></div>`;
    h+=ta('ما الفرق بين Machine Learning و Deep Learning؟','mlQ','');
    h+=fld('رابط GitHub / المشاريع','aiGit','url',false,'https://github.com/...');
  }
  if(r==='sales'){
    h+=ta('صف تجربتك في المبيعات','salesExp','أدوار سابقة، قطاعات، إنجازات...',false);
    h+=rating('مهارات التواصل (1-10)','salesComm');
    h+=ta('كيف ستتعامل مع عميل غير راضٍ؟','salesScen','صف أسلوبك',false);
    h+=fld('الراتب المتوقع (جنيه/شهر)','salesSalary','number',false,'');
  }
  if(r==='designer'){
    h+=`<div class="field-group" id="designToolsGroup"><label class="field-label">أدوات التصميم التي تستخدمها <span class="req">*</span></label><div class="check-group">${['Photoshop','Illustrator','Figma','After Effects','Canva'].map(t=>`<label class="check-item"><input type="checkbox" value="${t}"> ${t}</label>`).join('')}</div><div class="field-error" id="designToolsGroup_err"></div></div>`;
    h+=fld('رابط Portfolio','designPort','url',true,'https://behance.net/...');
    h+=fld('سنوات الخبرة','designYrs','number',true,'');
    h+=`<div class="field-group" id="designFieldsGroup"><label class="field-label">مجال التصميم المفضل <span class="req">*</span></label><div class="check-group">${['UI/UX','Branding','Social Media','Motion'].map(f=>`<label class="check-item"><input type="checkbox" value="${f}"> ${f}</label>`).join('')}</div><div class="field-error" id="designFieldsGroup_err"></div></div>`;
    h+=ta('صف عملية التصميم عندك','designProc','من الـ brief للتسليم النهائي');
  }
  h+=navBtns();
  document.getElementById('stepContent').innerHTML=h;
}

function r5(){
  let h=`<div class="step-error" id="stepErr"></div><div class="step-title">التقييم الذاتي</div>`;
  h+=sel('مستوى اللغة الإنجليزية','engLevel',['مبتدئ','متوسط','متقدم']);
  h+=rating('مهارة التدريس / العرض','rateTeach');
  h+=rating('المهارة التقنية','rateTech');
  h+=rating('مهارة التواصل','rateComm');
  h+=navBtns();
  document.getElementById('stepContent').innerHTML=h;
}

function r6(){
  let h=`<div class="step-error" id="stepErr"></div><div class="step-title">المعدات</div>`;
  h+=`<div class="field-group" id="laptopGroup"><label class="field-label">هل لديك لابتوب مناسب للتدريس؟ <span class="req">*</span></label><div class="check-group"><label class="check-item"><input type="radio" name="laptop" value="yes"> نعم</label><label class="check-item"><input type="radio" name="laptop" value="no"> لا</label></div><div class="field-error" id="laptopGroup_err"></div></div>`;
  h+=sel('جودة الإنترنت','internet',['ضعيفة','جيدة','ممتازة']);
  h+=`<div class="field-group" id="camMicGroup"><label class="field-label">هل لديك كاميرا وميكروفون يعملان؟ <span class="req">*</span></label><div class="check-group"><label class="check-item"><input type="radio" name="camMic" value="yes"> نعم</label><label class="check-item"><input type="radio" name="camMic" value="no"> لا</label></div><div class="field-error" id="camMicGroup_err"></div></div>`;
  h+=navBtns();
  document.getElementById('stepContent').innerHTML=h;
}

function r7(){
  const r=S.role;
  const modeOpts=(r==='data-analysis'||r==='ai-instructor')?['أوفلاين']:['أونلاين','أوفلاين','أونلاين / أوفلاين'];
  const modeVals=(r==='data-analysis'||r==='ai-instructor')?['offline']:['online','offline','hybrid'];
  let h=`<div class="step-error" id="stepErr"></div><div class="step-title">أوقات العمل</div>`;
  h+=`<div class="field-group" id="workModeGroup"><label class="field-label">نوع العمل المفضل <span class="req">*</span></label><div class="check-group">${modeOpts.map((m,i)=>`<label class="check-item"><input type="radio" name="workMode" value="${modeVals[i]}"> ${m}</label>`).join('')}</div><div class="field-error" id="workModeGroup_err"></div></div>`;
  h+=`<div class="field-group" id="workTypeGroup"><label class="field-label">دوام <span class="req">*</span></label><div class="check-group"><label class="check-item"><input type="radio" name="workType" value="full"> كامل</label><label class="check-item"><input type="radio" name="workType" value="part"> جزئي</label></div><div class="field-error" id="workTypeGroup_err"></div></div>`;
  h+=`<div class="field-group" id="availDaysGroup"><label class="field-label">أيام العمل المتاحة <span class="req">*</span></label><div class="check-group">${['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'].map(d=>`<label class="check-item"><input type="checkbox" value="${d}"> ${d}</label>`).join('')}</div><div class="field-error" id="availDaysGroup_err"></div></div>`;
  h+=`<div class="field-group" id="shiftGroup"><label class="field-label">الفترة المفضلة <span class="req">*</span></label><div class="check-group">${['صباحية','مسائية','ليلية'].map((s,i)=>`<label class="check-item"><input type="radio" name="shift" value="${['morning','afternoon','evening'][i]}"> ${s}</label>`).join('')}</div><div class="field-error" id="shiftGroup_err"></div></div>`;
  h+=`<div class="field-group" id="startDateGroup"><label class="field-label">أقرب موعد للبدء <span class="req">*</span></label><div class="check-group">${['فوراً','خلال أسبوع','خلال شهر'].map(s=>`<label class="check-item"><input type="radio" name="startDate" value="${s}"> ${s}</label>`).join('')}</div><div class="field-error" id="startDateGroup_err"></div></div>`;
  h+=navBtns();
  document.getElementById('stepContent').innerHTML=h;
}

function r8(){
  let h=`<div class="step-error" id="stepErr"></div><div class="step-title">الفيديو التقديمي</div>`;
  h+=`<div class="note-box">${VIDEO_HINTS[S.role]||'سجّل فيديو قصير تعرّف فيه بنفسك وتُظهر مهاراتك'}</div>`;
  h+=`<div style="background:#f9fafb;border-radius:10px;padding:14px;margin-bottom:14px;font-size:13px;color:#4b5563;line-height:1.8">الفيديو لازم يشمل: <strong>تعريف بنفسك</strong>، شرح <strong>مفهوم في مجالك</strong>، وأسلوب <strong>تواصلك</strong>.<br>ارفع الفيديو على Google Drive وشارك الرابط بصلاحية "أي شخص لديه الرابط".</div>`;
  h+=fld('رابط Google Drive للفيديو','videoLink','url',true,'https://drive.google.com/file/d/...');
  h+=navBtns();
  document.getElementById('stepContent').innerHTML=h;
}

function r9(){
  let h=`<div class="step-error" id="stepErr"></div><div class="step-title">أسئلة الفلترة</div>`;
  h+=ta('لماذا تريد الانضمام لـ Eduzah؟','whyEduzah','');
  h+=ta('ما الذي يجعلك مناسباً لهذه الوظيفة؟','whyFit','');
  h+=ta('كيف تتعامل مع متدرب أو عميل يعاني من صعوبة؟','handleQ','');
  h+=`<div class="field-group" id="recordedGroup"><label class="field-label">هل أنت مرتاح لتسجيل الجلسات أو مراقبتها؟ <span class="req">*</span></label><div class="check-group"><label class="check-item"><input type="radio" name="recorded" value="yes"> نعم</label><label class="check-item"><input type="radio" name="recorded" value="no"> لا</label></div><div class="field-error" id="recordedGroup_err"></div></div>`;
  h+=navBtns();
  document.getElementById('stepContent').innerHTML=h;
}

function r10(){
  let h=`<div class="step-error" id="stepErr"></div><div class="step-title">طريقة التعرف علينا</div>`;
  h+=sel('كيف عرفت عن Eduzah؟','source',['سوشيال ميديا','صديق أو زميل','LinkedIn','بورد وظائف','محرك البحث','أخرى']);
  h+=fld('تم ترشيحك من قِبَل (اختياري)','referral','text',false,'الاسم الكامل للشخص الذي رشّحك');
  h+=navBtns();
  document.getElementById('stepContent').innerHTML=h;
}

function r11(){
  let h=`<div class="step-error" id="stepErr"></div><div class="step-title">الإقرار والموافقة</div>`;
  h+=`<div style="background:#f9fafb;border-radius:10px;padding:14px;margin-bottom:1.2rem;font-size:13px;color:#4b5563;line-height:1.8">بتقديم هذا الطلب، أنت تؤكد أن جميع المعلومات المقدمة صحيحة وكاملة، وتوافق على أن Eduzah قد تتواصل معك عبر البريد الإلكتروني أو واتساب.</div>`;
  h+=`<div class="field-group"><label class="check-item" style="align-items:flex-start;gap:10px"><input type="checkbox" id="agree" style="width:16px;height:16px;flex-shrink:0;margin-top:3px"> <span style="font-size:14px;color:#374151">أقر بأن جميع المعلومات صحيحة وأوافق على التواصل معي من قِبَل Eduzah.</span></label><div class="field-error" id="agree_err"></div></div>`;
  h+=`<div class="nav-btns"><button type="button" class="btn-back" onclick="goBack()">رجوع</button><button type="button" class="btn-next" onclick="submitForm()">إرسال الطلب</button></div>`;
  document.getElementById('stepContent').innerHTML=h;
}

function goNext(){
  if(!validateCurrentStep()){window.scrollTo({top:0,behavior:'smooth'});return;}
  if(S.step<S.stepList.length-1){S.step++;renderStep();window.scrollTo({top:0,behavior:'smooth'});}
}

function goBack(){
  if(S.step>0){S.step--;renderStep();window.scrollTo({top:0,behavior:'smooth'});}
}

function submitForm(){
  const agree=$('agree');
  if(!agree||!agree.checked){
    const err=$('agree_err');
    if(err){err.textContent='يرجى تأكيد الإقرار قبل إرسال الطلب';err.classList.add('show');}
    showStepError('يرجى تأكيد الإقرار قبل إرسال الطلب');
    window.scrollTo({top:0,behavior:'smooth'});
    return;
  }
  document.getElementById('formCard').innerHTML=`<div class="success-screen"><div class="success-mark"></div><h2>تم إرسال طلبك بنجاح</h2><p>شكراً لتقديمك في Eduzah. سنراجع طلبك ونتواصل معك عبر واتساب أو البريد الإلكتروني خلال 3-5 أيام عمل.</p></div>`;
  document.getElementById('progressBar').innerHTML='';
}

S.stepList=[0];
renderStep();
