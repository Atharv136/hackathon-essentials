import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/env.js';

/**
 * Gemini AI Service (Stub)
 * Reads GEMINI_API_KEY from environment variables without hardcoding.
 */
class GeminiService {
  constructor() {
    this.apiKey = config.gemini.apiKey;
    this.client = null;
    if (this.isConfigured()) {
      this.client = new GoogleGenerativeAI(this.apiKey);
    }
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey !== 'your-gemini-api-key');
  }

  /**
   * Placeholder function to generate text content using Gemini
   * @param {string} prompt
   * @param {string} modelName
   * @returns {Promise<string>}
   */
  async generateText(prompt, modelName = 'gemini-1.5-flash') {
    if (!this.isConfigured()) {
      throw new Error(
        'Gemini service is not configured. Please supply GEMINI_API_KEY in server/.env'
      );
    }

    try {
      if (!this.client) {
        this.client = new GoogleGenerativeAI(this.apiKey);
      }
      const model = this.client.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('[Gemini] Generation failed:', error.message);
      throw error;
    }
  }

  /**
   * Placeholder for conversational chat session
   * @param {Array<{role: string, parts: Array<{text: string}>}>} history
   * @param {string} message
   */
  async chat(history = [], message) {
    if (!this.isConfigured()) {
      throw new Error('Gemini service is not configured.');
    }

    const model = this.client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chatSession = model.startChat({ history });
    const result = await chatSession.sendMessage(message);
    return result.response.text();
  }
}

export const geminiService = new GeminiService();
export default geminiService;

