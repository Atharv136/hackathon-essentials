import axios from 'axios';
import config from '../config/env.js';
import {
  getCredentialStatus,
  updateCredential,
  maskSecret,
  MONITORED_KEYS
} from '../utils/envManager.js';

// In-memory conversation state for conversational prompt flows
const sessionState = new Map();

/**
 * WhatsApp Service & Credential Bot
 */
class WhatsAppService {
  constructor() {
    this.provider = config.whatsapp.provider;
    this.twilioConfig = config.whatsapp.twilio;
    this.metaConfig = config.whatsapp.meta;
  }

  isConfigured() {
    if (this.provider === 'twilio') {
      return Boolean(
        this.twilioConfig.accountSid &&
        this.twilioConfig.authToken &&
        this.twilioConfig.phoneNumber &&
        !this.twilioConfig.accountSid.startsWith('your-')
      );
    }
    if (this.provider === 'meta') {
      return Boolean(
        this.metaConfig.accessToken &&
        this.metaConfig.phoneNumberId &&
        !this.metaConfig.accessToken.startsWith('your-')
      );
    }
    return false;
  }

  /**
   * Process incoming WhatsApp messages and handle interactive credential collection
   * @param {object} payload - Parsed webhook payload from Twilio or Meta
   */
  async processIncomingMessage(payload) {
    // Normalize sender and text across Twilio and Meta Cloud API formats
    let sender = payload.From || payload.from || 'unknown';
    let text = (payload.Body || payload.body || payload.text || '').trim();

    // Support Meta WhatsApp webhook nested structure
    if (payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const msg = payload.entry[0].changes[0].value.messages[0];
      sender = msg.from;
      text = (msg.text?.body || '').trim();
    }

    console.log(`[WhatsApp Bot] Message from ${sender}: "${text}"`);

    const reply = await this.handleBotCommand(sender, text);
    return {
      sender,
      incomingText: text,
      replyText: reply,
      twiml: `<Response><Message>${this.escapeXml(reply)}</Message></Response>`
    };
  }

  /**
   * Core interactive bot command router
   */
  async handleBotCommand(sender, text) {
    const lower = text.toLowerCase();
    const state = sessionState.get(sender) || { pendingKey: null };

    // 1. HELP / STATUS / HI
    if (lower === 'hi' || lower === 'hello' || lower === 'help' || lower === 'start') {
      return this.generateWelcomeMessage();
    }

    if (lower === 'status' || lower === 'list' || lower === 'check') {
      return this.generateStatusReport();
    }

    // 2. SET COMMAND (e.g., SET GEMINI_API_KEY AIzaSy...)
    const setMatch = text.match(/^SET\s+([A-Za-z0-9_]+)\s+([\s\S]+)$/i);
    if (setMatch) {
      const key = setMatch[1].trim().toUpperCase();
      const value = setMatch[2].trim();
      return this.applyCredentialUpdate(sender, key, value);
    }

    // 3. CONVERSATIONAL STATE: If waiting for a specific key from user
    if (state.pendingKey) {
      const key = state.pendingKey;
      sessionState.set(sender, { pendingKey: null }); // clear state
      return this.applyCredentialUpdate(sender, key, text);
    }

    // 4. DIRECT KEY MENTION (e.g. user sends "GEMINI_API_KEY")
    const upperText = text.toUpperCase();
    const allValidKeys = Object.values(MONITORED_KEYS).flat();
    if (allValidKeys.includes(upperText)) {
      sessionState.set(sender, { pendingKey: upperText });
      return `🔑 Please send the value for ${upperText}:`;
    }

    // 5. DEFAULT FALLBACK
    return (
      `🤖 Unrecognized command: "${text}"\n\n` +
      `Commands:\n` +
      `• *status* - View configured and missing credentials\n` +
      `• *SET <KEY> <VALUE>* - Save a credential to .env\n` +
      `• *help* - Instructions and list of available keys`
    );
  }

  /**
   * Apply a credential update to .env
   */
  applyCredentialUpdate(sender, key, value) {
    const allValidKeys = Object.values(MONITORED_KEYS).flat();

    if (!allValidKeys.includes(key)) {
      return (
        `❌ Unknown key "${key}".\n` +
        `Supported keys:\n` +
        allValidKeys.map((k) => `• ${k}`).join('\n')
      );
    }

    try {
      updateCredential(key, value);
      sessionState.set(sender, { pendingKey: null });

      // Check what is remaining
      const status = getCredentialStatus();
      const missing = [];
      for (const [group, data] of Object.entries(status)) {
        for (const k of data.keys) {
          if (!k.configured && k.key !== 'SUPABASE_SERVICE_ROLE_KEY') {
            missing.push(k.key);
          }
        }
      }

      let response = `✅ Successfully saved *${key}* (${maskSecret(value)}) to .env!\n\n`;
      if (missing.length === 0) {
        response += `🎉 All required credentials are now configured! The server is ready.`;
      } else {
        response += `⏳ Next missing key: *${missing[0]}*\n`;
        response += `Reply \`SET ${missing[0]} <your-value>\` or just send the value.`;
        sessionState.set(sender, { pendingKey: missing[0] });
      }
      return response;
    } catch (err) {
      return `❌ Failed to save credential: ${err.message}`;
    }
  }

  /**
   * Status report of all credentials
   */
  generateStatusReport() {
    const status = getCredentialStatus();
    let report = `📋 *Credential Status:*\n\n`;

    for (const [group, data] of Object.entries(status)) {
      report += `*${group.toUpperCase()}*:\n`;
      data.keys.forEach((k) => {
        const icon = k.configured ? '✅' : '⏳';
        report += `  ${icon} ${k.key}: ${k.valuePreview}\n`;
      });
      report += '\n';
    }

    report += `To set a key, reply: \`SET <KEY> <VALUE>\``;
    return report;
  }

  /**
   * Welcome message
   */
  generateWelcomeMessage() {
    const status = getCredentialStatus();
    const missing = [];
    for (const [group, data] of Object.entries(status)) {
      for (const k of data.keys) {
        if (!k.configured && k.key !== 'SUPABASE_SERVICE_ROLE_KEY') {
          missing.push(k.key);
        }
      }
    }

    let msg = `👋 *MERN Hackathon Credential Bot*\n\n`;
    if (missing.length === 0) {
      msg += `All credentials are configured! You can reply *status* to review.\n`;
    } else {
      msg += `You have *${missing.length}* missing credentials:\n`;
      missing.forEach((k) => (msg += `• ${k}\n`));
      msg += `\nReply \`SET ${missing[0]} <value>\` to configure the first one, or reply *status* for full details.`;
    }
    return msg;
  }

  /**
   * Send outbound message via provider API
   */
  async sendMessage(to, body) {
    if (!this.isConfigured()) {
      console.log(`[WhatsApp Stub] Credentials not configured. Simulated outbound to ${to}: "${body}"`);
      return { success: false, reason: 'Provider credentials not configured' };
    }

    if (this.provider === 'twilio') {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.twilioConfig.accountSid}/Messages.json`;
      const auth = Buffer.from(
        `${this.twilioConfig.accountSid}:${this.twilioConfig.authToken}`
      ).toString('base64');

      const toNum = to.startsWith('whatsapp:') ? to : `whatsapp:${to.replace(/\s+/g, '')}`;
      const fromNum = this.twilioConfig.phoneNumber.startsWith('whatsapp:')
        ? this.twilioConfig.phoneNumber
        : `whatsapp:${this.twilioConfig.phoneNumber.replace(/\s+/g, '')}`;

      params.append('To', toNum);
      params.append('From', fromNum);
      params.append('Body', body);

      const res = await axios.post(url, params.toString(), {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return { success: true, messageId: res.data.sid };
    }

    return { success: false, reason: `Provider ${this.provider} not supported for outbound yet.` };
  }

  escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });
  }
}

export const whatsappService = new WhatsAppService();
export default whatsappService;
