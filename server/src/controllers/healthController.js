import { getDBStatus } from '../config/db.js';
import config from '../config/env.js';

export const getHealth = (req, res) => {
  const dbStatus = getDBStatus();

  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    services: {
      database: {
        connected: dbStatus.connected,
        status: dbStatus.connected ? 'connected' : 'disconnected'
      },
      gemini: {
        configured: Boolean(config.gemini.apiKey && !config.gemini.apiKey.startsWith('your-'))
      },
      higgsfield: {
        configured: Boolean(config.higgsfield.apiKey && !config.higgsfield.apiKey.startsWith('your-'))
      },
      supabase: {
        configured: Boolean(config.supabase.url && !config.supabase.url.startsWith('https://your-'))
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

