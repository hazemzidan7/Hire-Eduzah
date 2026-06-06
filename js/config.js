/* config.js
 * Cloudinary unsigned upload — cloud name only (no API secret).
 * File type + size validation is enforced client-side (magic bytes)
 * AND server-side (Cloudinary preset restrictions).
 *
 * To restrict your Cloudinary preset:
 * Dashboard → Settings → Upload → ml_default → Edit:
 *   - Allowed formats: jpg, png, webp, pdf
 *   - Max file size: 5 MB
 *   - Unique filename: true
 */
window.EDUZAH_CONFIG = {
  cloudinary: {
    cloudName:    'dnfcayldd',
    uploadPreset: 'ml_default',
  },
};
