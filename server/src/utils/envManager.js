import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVER_ROOT = path.resolve(__dirname, '../..');
const CLIENT_ROOT = path.resolve(__dirname, '../../../client');
const SERVER_ENV = path.join(SERVER_ROOT, '.env');
const CLIENT_ENV = path.join(CLIENT_ROOT, '.env');
const SERVER_ENV_EXAMPLE = path.join(SERVER_ROOT, '.env.example');
const CLIENT_ENV_EXAMPLE = path.join(CLIENT_ROOT, '.env.example');

// Keys monitored by the bot/setup flow
export const MONITORED_KEYS = {
  supabase: ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
  gemini: ['GEMINI_API_KEY'],
  higgsfield: ['HIGGSFIELD_API_KEY', 'HIGGSFIELD_BASE_URL'],
  mongodb: ['MONGODB_URI'],
  whatsapp: ['WHATSAPP_PROVIDER', 'TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_WHATSAPP_NUMBER']
};

/**
 * Ensure .env exists by creating from .env.example if missing
 */
export const initEnvFiles = () => {
  if (!fs.existsSync(SERVER_ENV) && fs.existsSync(SERVER_ENV_EXAMPLE)) {
    fs.copyFileSync(SERVER_ENV_EXAMPLE, SERVER_ENV);
  }
  if (!fs.existsSync(CLIENT_ENV) && fs.existsSync(CLIENT_ENV_EXAMPLE)) {
    fs.copyFileSync(CLIENT_ENV_EXAMPLE, CLIENT_ENV);
  }
};

/**
 * Read key-value pairs from an env file
 */
export const readEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf-8');
  const result = {};
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        result[key] = value;
      }
    }
  });
  return result;
};

/**
 * Write or update a single key in an env file while preserving structure
 */
export const writeEnvKey = (filePath, key, value) => {
  let content = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
  const lines = content.split('\n');
  let found = false;

  const newLines = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const existingKey = trimmed.slice(0, idx).trim();
        if (existingKey === key) {
          found = true;
          return `${key}=${value}`;
        }
      }
    }
    return line;
  });

  if (!found) {
    if (newLines.length > 0 && newLines[newLines.length - 1].trim() !== '') {
      newLines.push('');
    }
    newLines.push(`${key}=${value}`);
  }

  fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
};

/**
 * Update credential and apply to disk + process.env
 */
export const updateCredential = (key, value) => {
  initEnvFiles();
  const cleanValue = value ? value.trim() : '';

  if (key.startsWith('VITE_')) {
    writeEnvKey(CLIENT_ENV, key, cleanValue);
    // Also mirror to server .env if server needs it (e.g. SUPABASE_URL)
    if (key === 'VITE_SUPABASE_URL') {
      writeEnvKey(SERVER_ENV, 'SUPABASE_URL', cleanValue);
      process.env['SUPABASE_URL'] = cleanValue;
    }
  } else {
    writeEnvKey(SERVER_ENV, key, cleanValue);
    process.env[key] = cleanValue;
    // If setting SUPABASE_URL, mirror to client as VITE_SUPABASE_URL
    if (key === 'SUPABASE_URL') {
      writeEnvKey(CLIENT_ENV, 'VITE_SUPABASE_URL', cleanValue);
    }
  }

  return { key, value: maskSecret(cleanValue) };
};

/**
 * Mask secret values for display
 */
export const maskSecret = (val) => {
  if (!val || val.startsWith('your-') || val.includes('<username>')) return '(not set)';
  if (val.length <= 8) return '********';
  return val.slice(0, 4) + '...' + val.slice(-4);
};

/**
 * Check which credentials are missing
 */
export const getCredentialStatus = () => {
  initEnvFiles();
  const serverEnv = readEnvFile(SERVER_ENV);
  const clientEnv = readEnvFile(CLIENT_ENV);
  const merged = { ...serverEnv, ...clientEnv };

  const checkConfigured = (key) => {
    const val = merged[key];
    if (!val) return false;
    if (val.startsWith('your-') || val.includes('example.mongodb.net') || val === 'https://your-project.supabase.co') {
      return false;
    }
    return true;
  };

  const status = {};
  for (const [group, keys] of Object.entries(MONITORED_KEYS)) {
    status[group] = {
      isComplete: keys.every((k) => checkConfigured(k) || k === 'SUPABASE_SERVICE_ROLE_KEY'),
      keys: keys.map((k) => ({
        key: k,
        configured: checkConfigured(k),
        valuePreview: maskSecret(merged[k])
      }))
    };
  }
  return status;
};

export default {
  initEnvFiles,
  readEnvFile,
  writeEnvKey,
  updateCredential,
  maskSecret,
  getCredentialStatus,
  MONITORED_KEYS
};
