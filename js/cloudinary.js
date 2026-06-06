/* cloudinary.js — secure file upload service
 *
 * Security measures:
 * 1. Magic byte validation (checks actual file content, not just extension)
 * 2. File size limit (5 MB)
 * 3. Allowed types: JPEG, PNG, WEBP, PDF only
 * 4. Files renamed by Cloudinary (unique_filename: true in preset)
 */
window.CloudinaryUploader = (function () {

  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

  const ALLOWED_TYPES = {
    'image/jpeg':       { ext: 'jpg',  magic: b => b[0]===0xFF && b[1]===0xD8 && b[2]===0xFF },
    'image/png':        { ext: 'png',  magic: b => b[0]===0x89 && b[1]===0x50 && b[2]===0x4E && b[3]===0x47 },
    'image/webp':       { ext: 'webp', magic: b => b[0]===0x52 && b[1]===0x49 && b[2]===0x46 && b[3]===0x46 && b[8]===0x57 && b[9]===0x45 && b[10]===0x42 && b[11]===0x50 },
    'application/pdf':  { ext: 'pdf',  magic: b => b[0]===0x25 && b[1]===0x50 && b[2]===0x44 && b[3]===0x46 },
  };

  function cfg() {
    return (window.EDUZAH_CONFIG || {}).cloudinary || {};
  }

  function isConfigured() {
    var c = cfg();
    return !!(c.cloudName && c.uploadPreset);
  }

  /** Validate file magic bytes (actual content check, not extension) */
  async function validateMagicBytes(file) {
    const buf   = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buf);
    for (const [mime, info] of Object.entries(ALLOWED_TYPES)) {
      if (info.magic(bytes)) return mime;
    }
    return null;
  }

  /** Validate file before upload — throws with user-friendly message
   *  @param {File}     file
   *  @param {string}   label         — human-readable field name for error messages
   *  @param {string[]|null} allowedMimes — restrict to specific MIME types (null = any allowed)
   */
  async function validateFile(file, label, allowedMimes) {
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error(`${label}: الحجم الأقصى هو 5 ميجابايت / Max size is 5 MB`);
    }
    const detectedMime = await validateMagicBytes(file);
    if (!detectedMime) {
      throw new Error(`${label}: نوع الملف غير مسموح (JPG, PNG, WEBP, PDF فقط) / Only JPG, PNG, WEBP, PDF allowed`);
    }
    if (allowedMimes && !allowedMimes.includes(detectedMime)) {
      const isPdfField = allowedMimes.includes('application/pdf');
      throw new Error(isPdfField
        ? `${label}: يُسمح بملفات PDF فقط / Only PDF files are allowed`
        : `${label}: يُسمح بالصور فقط (JPG, PNG, WEBP) / Only images allowed (JPG, PNG, WEBP)`
      );
    }
    return detectedMime;
  }

  /** Upload a single validated file to Cloudinary */
  async function uploadFile(file, label, allowedMimes) {
    var c = cfg();
    if (!c.cloudName || !c.uploadPreset) throw new Error('Cloudinary not configured');

    await validateFile(file, label || file.name, allowedMimes || null);

    var fd = new FormData();
    fd.append('file',           file);
    fd.append('upload_preset',  c.uploadPreset);
    fd.append('folder',         'eduzah-hiring');

    var res = await fetch(
      'https://api.cloudinary.com/v1_1/' + c.cloudName + '/auto/upload',
      { method: 'POST', body: fd }
    );
    if (!res.ok) throw new Error('Upload failed (HTTP ' + res.status + ')');
    var data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.secure_url;
  }

  const PDF_MIMES   = ['application/pdf'];
  const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

  /** Upload all form files — returns { cvFileUrl, photoFileUrl, ... } */
  async function uploadAll(onProgress) {
    var specs = [
      { key: 'cvFile',      label: 'CV / Resume',        allowedMimes: PDF_MIMES   },
      { key: 'photoFile',   label: 'Profile photo',       allowedMimes: IMAGE_MIMES },
      { key: 'natidFront',  label: 'National ID (front)', allowedMimes: IMAGE_MIMES },
      { key: 'natidBack',   label: 'National ID (back)',  allowedMimes: IMAGE_MIMES },
    ];
    var urls = {};
    if (!isConfigured() || !window.FormStore) return urls;

    var files = FormStore.getAllFiles();
    for (var i = 0; i < specs.length; i++) {
      var spec = specs[i];
      var file = files[spec.key];
      if (!file) continue;
      if (onProgress) onProgress(spec.key, i + 1, specs.length);
      try {
        urls[spec.key + 'Url'] = await uploadFile(file, spec.label, spec.allowedMimes);
      } catch (e) {
        console.warn('[Cloudinary] upload failed for', spec.key, e.message);
        // Surface validation errors to user
        if (e.message.includes('نوع الملف') || e.message.includes('الحجم') ||
            e.message.includes('Type') || e.message.includes('size')) {
          throw e; // re-throw validation errors
        }
        urls[spec.key + 'Url'] = '';
      }
    }
    return urls;
  }

  return { isConfigured, uploadFile, uploadAll, validateFile };
})();
