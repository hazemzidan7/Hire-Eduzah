/* ═══════════════════════════════════════════════
   EDUZAH — app.js  (boot & glue layer)
   Keeps all state logic in form.js clean.
   This file just kicks things off.
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialise step list for role selection (step 0 only)
  S.stepList = [0];
  S.step = 0;
  S.lang = 'ar';

  // First render
  renderStep();
});
