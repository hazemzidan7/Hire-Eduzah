/* cloudinary.js — file upload service */
window.CloudinaryUploader = (function () {

  function cfg() {
    return (window.EDUZAH_CONFIG || {}).cloudinary || {};
  }

  function isConfigured() {
    var c = cfg();
    return !!(c.cloudName && c.uploadPreset);
  }

  /**
   * Upload a File object to Cloudinary.
   * Returns the secure_url string.
   */
  async function uploadFile(file, folder) {
    var c = cfg();
    if (!c.cloudName || !c.uploadPreset) throw new Error('Cloudinary not configured');

    var fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', c.uploadPreset);
    if (folder) fd.append('folder', folder);

    var res = await fetch(
      'https://api.cloudinary.com/v1_1/' + c.cloudName + '/auto/upload',
      { method: 'POST', body: fd }
    );
    if (!res.ok) throw new Error('Cloudinary HTTP ' + res.status);
    var data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.secure_url;
  }

  /**
   * Upload all stored files.
   * Returns { cvFileUrl, photoFileUrl, natidFrontUrl, natidBackUrl }
   */
  async function uploadAll(onProgress) {
    var keys = ['cvFile', 'photoFile', 'natidFront', 'natidBack'];
    var urls = {};
    if (!isConfigured() || !window.FormStore) return urls;

    var files = FormStore.getAllFiles();
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var file = files[key];
      if (!file) continue;
      if (onProgress) onProgress(key, i + 1, keys.length);
      try {
        urls[key + 'Url'] = await uploadFile(file, 'eduzah-hiring');
      } catch (e) {
        console.warn('[Cloudinary] upload failed for', key, e.message);
        urls[key + 'Url'] = '';
      }
    }
    return urls;
  }

  return { isConfigured, uploadFile, uploadAll };
})();
