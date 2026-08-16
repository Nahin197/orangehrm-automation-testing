// utils/randomData.js
// Reusable random data generators for test data

/** Returns a random lowercase alphabetic string of given length */
export function randomAlpha(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/** Returns a string of random digits of given length */
export function randomDigits(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

/** Capitalizes the first letter of a string */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Returns a random username: 5 letters + 3 digits  e.g. "qwert123" */
export function randomUsername() {
  return randomAlpha(5) + randomDigits(3);
}

/**
 * Generates a strong password satisfying OrangeHRM requirements:
 * - Upper + lower case characters
 * - At least one symbol
 * - At least one number
 * - Minimum 8 characters
 */
export function generateStrongPassword() {
  const upper   = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower   = 'abcdefghjkmnpqrstuvwxyz';
  const symbols = '@#$!%*?&';
  const digits  = '23456789';
  const pick    = (s) => s[Math.floor(Math.random() * s.length)];

  const parts = [
    pick(upper), pick(upper),       // 2 uppercase
    pick(lower), pick(lower), pick(lower), // 3 lowercase
    pick(symbols),                  // 1 symbol
    pick(digits), pick(digits),     // 2 digits
  ];

  // Shuffle to randomize order
  return parts.sort(() => Math.random() - 0.5).join('');
}
