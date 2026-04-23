import crypto from 'crypto';
import mongoose from 'mongoose';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const DEFAULT_LENGTH = 6;

// All models that participate in the shared short-code namespace.
// Short codes must be unique across every entry in this list so /s/[code]
// always resolves to exactly one document.
export const SHORT_CODE_MODELS = ['TechBlog', 'Writing', 'Book', 'Project'];

export function generateShortCode(length = DEFAULT_LENGTH) {
  const bytes = crypto.randomBytes(length);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return code;
}

async function codeExistsAnywhere(code, excludeModelName, excludeId) {
  for (const name of SHORT_CODE_MODELS) {
    const Model = mongoose.models[name];
    if (!Model) continue;
    const query = { shortCode: code };
    if (name === excludeModelName && excludeId) {
      query._id = { $ne: excludeId };
    }
    const hit = await Model.findOne(query).select('_id').lean();
    if (hit) return true;
  }
  return false;
}

export async function generateUniqueShortCode({ excludeModelName = null, excludeId = null, length = DEFAULT_LENGTH } = {}) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateShortCode(length + Math.floor(attempt / 3));
    if (!(await codeExistsAnywhere(code, excludeModelName, excludeId))) return code;
  }
  return generateShortCode(length + 4);
}

export function isValidShortCode(code) {
  return typeof code === 'string' && /^[A-Za-z0-9]{4,12}$/.test(code);
}
