import config from '../config/env.js';
import { isSupabaseConfigured } from '../services/supabase.js';

export const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    services: {
      database: {
        engine: 'supabase-postgresql',
        configured: isSupabaseConfigured,
        status: isSupabaseConfigured ? 'configured' : 'unconfigured'
      },
      supabase: {
        configured: isSupabaseConfigured
      },
      gemini: {
        configured: Boolean(config.gemini.apiKey && !config.gemini.apiKey.startsWith('your-'))
      },
      higgsfield: {
        configured: Boolean(config.higgsfield.apiKey && !config.higgsfield.apiKey.startsWith('your-'))
      },
      whatsapp: {
        provider: config.whatsapp.provider,
        configured: Boolean(
          (config.whatsapp.provider === 'twilio' && config.whatsapp.twilio.accountSid && !config.whatsapp.twilio.accountSid.startsWith('your-')) ||
          (config.whatsapp.provider === 'meta' && config.whatsapp.meta.accessToken && !config.whatsapp.meta.accessToken.startsWith('your-'))
        )
      }
    }
  });
};
