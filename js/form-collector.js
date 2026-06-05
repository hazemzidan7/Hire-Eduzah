window.FormCollector = (function () {

  function snapshot() {
    var content = document.getElementById('stepContent');
    if (!content || !window.FormStore) return;

    // Text, number, date, url, email, range, select, textarea
    content.querySelectorAll(
      'input:not([type=radio]):not([type=checkbox]):not([type=file]), select, textarea'
    ).forEach(function (el) {
      if (el.id) FormStore.set(el.id, el.value);
    });

    // Radio buttons — save the checked value per name
    var radioNames = {};
    content.querySelectorAll('input[type=radio]').forEach(function (el) {
      radioNames[el.name] = true;
    });
    Object.keys(radioNames).forEach(function (name) {
      var checked = content.querySelector('input[type=radio][name="' + name + '"]:checked');
      if (checked) FormStore.set(name, checked.value);
    });

    // Checkbox groups WITH data-collect attribute
    content.querySelectorAll('[data-collect]').forEach(function (grp) {
      var name = grp.dataset.collect;
      var values = [];
      grp.querySelectorAll('input[type=checkbox]:checked').forEach(function (cb) {
        values.push(cb.value);
      });
      FormStore.set('cb_' + name, values);
    });

    // Checkbox groups WITHOUT data-collect — group by nearest id'd ancestor
    content.querySelectorAll('.check-group:not([data-collect])').forEach(function (grp) {
      var parent = nearestId(grp);
      if (!parent) return;
      var values = [];
      grp.querySelectorAll('input[type=checkbox]:checked').forEach(function (cb) {
        values.push(cb.value);
      });
      FormStore.set('cbgroup_' + parent.id, values);
    });

    // Standalone checkboxes not inside a .check-group (e.g. #agree)
    content.querySelectorAll('input[type=checkbox]').forEach(function (el) {
      if (!el.id || el.closest('.check-group')) return;
      FormStore.set('chk_' + el.id, el.checked);
    });
  }

  function restore() {
    var content = document.getElementById('stepContent');
    if (!content || !window.FormStore) return;

    var d = FormStore.getAll();

    // Text / select / textarea / range
    content.querySelectorAll(
      'input:not([type=radio]):not([type=checkbox]):not([type=file]), select, textarea'
    ).forEach(function (el) {
      if (!el.id || !(el.id in d)) return;
      el.value = d[el.id];
      if (el.type === 'range') {
        var disp = document.getElementById(el.id + '_v');
        if (disp) disp.textContent = d[el.id];
      }
    });

    // Radio buttons
    var radioNames = {};
    content.querySelectorAll('input[type=radio]').forEach(function (el) {
      radioNames[el.name] = true;
    });
    Object.keys(radioNames).forEach(function (name) {
      var saved = d[name];
      if (saved === undefined) return;
      var el = content.querySelector(
        'input[type=radio][name="' + name + '"][value="' + CSS.escape(saved) + '"]'
      );
      if (el) el.checked = true;
    });

    // Checkbox groups with data-collect
    content.querySelectorAll('[data-collect]').forEach(function (grp) {
      var saved = d['cb_' + grp.dataset.collect];
      if (!Array.isArray(saved)) return;
      grp.querySelectorAll('input[type=checkbox]').forEach(function (cb) {
        cb.checked = saved.indexOf(cb.value) !== -1;
      });
    });

    // Checkbox groups without data-collect
    content.querySelectorAll('.check-group:not([data-collect])').forEach(function (grp) {
      var parent = nearestId(grp);
      if (!parent) return;
      var saved = d['cbgroup_' + parent.id];
      if (!Array.isArray(saved)) return;
      grp.querySelectorAll('input[type=checkbox]').forEach(function (cb) {
        cb.checked = saved.indexOf(cb.value) !== -1;
      });
    });

    // Standalone checkboxes
    content.querySelectorAll('input[type=checkbox]').forEach(function (el) {
      if (!el.id || el.closest('.check-group')) return;
      var saved = d['chk_' + el.id];
      if (saved !== undefined) el.checked = saved;
    });

    // Sohag row visibility
    var gov = document.getElementById('gov');
    if (gov && gov.value) {
      var sohagRow = document.getElementById('sohagRow');
      if (sohagRow) sohagRow.style.display = gov.value === 'Sohag' ? 'block' : 'none';
    }

    // Re-apply national ID validation UI (show/hide hint) WITHOUT overwriting
    // fields the user may have edited manually — only update visual state.
    var natid = document.getElementById('natid');
    if (natid && natid.value && typeof applyNatIdParse === 'function') {
      // Save current dob/gender/gov so natid parse doesn't overwrite them
      var dobEl = document.getElementById('dob');
      var savedDob = dobEl ? dobEl.value : null;
      var checkedGender = document.querySelector('input[name="gender"]:checked');
      var savedGender = checkedGender ? checkedGender.value : null;
      var govEl = document.getElementById('gov');
      var savedGov = govEl ? govEl.value : null;

      applyNatIdParse(natid.value);

      // Restore manually-overridden values after natid autofill
      if (dobEl && savedDob !== null) { dobEl.value = savedDob; dobEl.readOnly = false; dobEl.classList.remove('dob-autofill'); }
      if (savedGender !== null) {
        document.querySelectorAll('input[name="gender"]').forEach(function (r) { r.checked = r.value === savedGender; });
      }
      if (govEl && savedGov !== null) {
        govEl.value = savedGov;
        var sohagRow = document.getElementById('sohagRow');
        if (sohagRow) sohagRow.style.display = savedGov === 'Sohag' ? 'block' : 'none';
      }
    }

    // File upload feedback
    content.querySelectorAll('input[type=file][id]').forEach(function (inp) {
      var file = FormStore.getFile(inp.id);
      if (!file) return;
      var box = inp.closest('.upload-box');
      if (!box) return;
      box.classList.add('file-selected');
      box.classList.remove('invalid');
      var p = box.querySelector('p');
      if (p) p.textContent = '✓ ' + file.name;
      var small = box.querySelector('small');
      if (small) small.textContent = (file.size / 1024).toFixed(0) + ' KB — ' + (typeof isEn === 'function' && isEn() ? 'Selected' : 'تم الاختيار');
      var errEl = document.getElementById(inp.id + '_err');
      if (errEl) errEl.classList.remove('show');
    });
  }

  function nearestId(el) {
    var cur = el.parentElement;
    while (cur && cur.id !== 'stepContent') {
      if (cur.id) return cur;
      cur = cur.parentElement;
    }
    return null;
  }

  return { snapshotCurrentStep: snapshot, restoreCurrentStep: restore };
})();
