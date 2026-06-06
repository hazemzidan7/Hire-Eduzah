/**
 * Egyptian National ID parser — modular utilities for 14-digit IDs.
 * Century digit: 2 = 1900–1999, 3 = 2000–2099
 * DOB: digits 2–7 (YYMMDD). Governorate: digits 8–9. Gender: digit 13 (odd = male).
 */
(function (global) {
  const GOVERNORATE_BY_CODE = {
    '01': 'Cairo',
    '02': 'Alexandria',
    '03': 'Port Said',
    '04': 'Suez',
    '11': 'Damietta',
    '12': 'Dakahlia',
    '13': 'Sharqia',
    '14': 'Qalyubia',
    '15': 'Kafr El Sheikh',
    '16': 'Gharbia',
    '17': 'Monufia',
    '18': 'Beheira',
    '19': 'Ismailia',
    '21': 'Giza',
    '22': 'Beni Suef',
    '23': 'Faiyum',
    '24': 'Minya',
    '25': 'Asyut',
    '26': 'Sohag',
    '27': 'Qena',
    '28': 'Aswan',
    '29': 'Luxor',
    '31': 'Red Sea',
    '32': 'New Valley',
    '33': 'Matruh',
    '34': 'North Sinai',
    '35': 'South Sinai',
  };

  /** Strip non-digits; cap at 14 characters. */
  function sanitizeNationalId(input) {
    return String(input || '').replace(/\D/g, '').slice(0, 14);
  }

  function isValidCenturyDigit(d) {
    return d === '2' || d === '3';
  }

  function parseDateParts(digits) {
    if (!isValidCenturyDigit(digits[0])) return null;
    const century = digits[0] === '3' ? 2000 : 1900;
    const year = century + parseInt(digits.slice(1, 3), 10);
    const month = parseInt(digits.slice(3, 5), 10);
    const day = parseInt(digits.slice(5, 7), 10);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    const d = new Date(year, month - 1, day);
    if (
      d.getFullYear() !== year ||
      d.getMonth() !== month - 1 ||
      d.getDate() !== day
    ) {
      return null;
    }
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { year, month, day, iso };
  }

  function parseGender(digits) {
    const digit = parseInt(digits[12], 10);
    if (Number.isNaN(digit)) return null;
    return digit % 2 === 1 ? 'male' : 'female';
  }

  function parseGovernorate(digits) {
    const code = digits.slice(7, 9);
    return GOVERNORATE_BY_CODE[code] || null;
  }

  /**
   * @param {string} raw - User input (may contain non-digits)
   * @returns {{ valid: boolean, digits: string, errors: string[], dateOfBirth: string|null, gender: string|null, governorate: string|null }}
   */
  function parseEgyptianNationalId(raw) {
    const digits = sanitizeNationalId(raw);
    const errors = [];

    if (digits.length === 0) {
      return {
        valid: false,
        digits,
        errors: [],
        dateOfBirth: null,
        gender: null,
        governorate: null,
        complete: false,
      };
    }

    if (digits.length < 14) {
      return {
        valid: false,
        digits,
        errors: [],
        dateOfBirth: null,
        gender: null,
        governorate: null,
        complete: false,
      };
    }

    if (!isValidCenturyDigit(digits[0])) {
      errors.push('رقم القرن في الرقم القومي غير صالح (يجب أن يبدأ بـ 2 أو 3)');
    }

    const dob = parseDateParts(digits);
    if (!dob) {
      errors.push('تاريخ الميلاد المستخرج من الرقم القومي غير صالح');
    }

    const gender = parseGender(digits);
    if (!gender) {
      errors.push('تعذر استخراج الجنس من الرقم القومي');
    }

    const governorate = parseGovernorate(digits);
    if (!governorate) {
      errors.push('رمز المحافظة في الرقم القومي غير معروف');
    }

    const valid =
      errors.length === 0 &&
      dob !== null &&
      gender !== null &&
      governorate !== null;

    return {
      valid,
      digits,
      errors,
      dateOfBirth: dob ? dob.iso : null,
      gender,
      governorate,
      complete: true,
    };
  }

  function validateNationalId(raw) {
    const result = parseEgyptianNationalId(raw);
    if (!result.complete) {
      return { valid: false, message: 'يرجى إدخال 14 رقمًا' };
    }
    if (!result.valid) {
      return {
        valid: false,
        message: result.errors[0] || 'يرجى إدخال رقم قومي مصري صحيح (14 رقم)',
      };
    }
    return { valid: true, message: '' };
  }

  const api = {
    sanitizeNationalId,
    parseEgyptianNationalId,
    parseDateOfBirth: (raw) => {
      const r = parseEgyptianNationalId(raw);
      return r.dateOfBirth;
    },
    validateNationalId,
    GOVERNORATE_BY_CODE,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.EgyptianNationalId = api;
  }
})(typeof window !== 'undefined' ? window : global);
