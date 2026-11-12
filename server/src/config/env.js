import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory first, fallback to root .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || ''
  },
  higgsfield: {
    apiKey: process.env.HIGGSFIELD_API_KEY || '',
    baseUrl: process.env.HIGGSFIELD_BASE_URL || 'https://api.higgsfield.ai'
  },
  whatsapp: {
    provider: process.env.WHATSAPP_PROVIDER || 'twilio',
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      phoneNumber: process.env.TWILIO_WHATSAPP_NUMBER || ''
    },
    meta: {
      accessToken: process.env.META_WHATSAPP_TOKEN || '',
      phoneNumberId: process.env.META_PHONE_NUMBER_ID || '',
      verifyToken: process.env.META_VERIFY_TOKEN || ''
    }
  }
};

export default config;
