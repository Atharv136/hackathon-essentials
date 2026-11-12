import config from '../config/env.js';

/**
 * WhatsApp Service (Stub)
 * Supports multiple providers (Twilio, Meta Cloud API) and reads configuration
 * from environment variables without hardcoding.
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
   * Placeholder to send an outbound WhatsApp message
   * @param {string} to - Recipient phone number (e.g. "whatsapp:+1234567890")
   * @param {string} body - Message body
   */
  async sendMessage(to, body) {
    if (!this.isConfigured()) {
      throw new Error(
        `WhatsApp service (${this.provider}) is not configured. Please supply required credentials in server/.env`
      );
    }

    console.log(`[WhatsApp Stub - ${this.provider}] Outbound message to ${to}: "${body}"`);
    return {
      success: true,
      provider: this.provider,
      recipient: to,
      messageId: `stub-wa-${Date.now()}`
    };
  }

  /**
   * Placeholder to process incoming webhook events from WhatsApp
   * @param {object} payload - Webhook payload from provider
   */
  async processIncomingMessage(payload) {
    console.log(`[WhatsApp Stub] Incoming webhook payload received:`, JSON.stringify(payload));
    return {
      status: 'received',
      processedAt: new Date().toISOString()
    };
  }
}

export const whatsappService = new WhatsAppService();
export default whatsappService;
