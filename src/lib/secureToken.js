// src/lib/secureToken.js
import crypto from 'crypto';

/**
 * Generate a cryptographically secure random token.
 * @param {number} bytes — byte length (default 32 → 64-char hex string)
 * @returns {string} hex-encoded random token
 */
export function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Generate a numeric OTP of specified length.
 * @param {number} digits — OTP length (default 6)
 * @returns {string} zero-padded numeric OTP
 */
export function generateOTP(digits = 6) {
  const max = Math.pow(10, digits);
  const randomBytes = crypto.randomBytes(4);
  const randomNum = randomBytes.readUInt32BE(0) % max;
  return randomNum.toString().padStart(digits, '0');
}
