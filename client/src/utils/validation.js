/**
 * Basic email format validation
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Basic password validation (minimum 6 characters)
 * @param {string} password
 * @param {number} minLength
 * @returns {boolean}
 */
export const isValidPassword = (password, minLength = 6) => {
  return typeof password === 'string' && password.length >= minLength;
};
