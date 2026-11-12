import api from './api';

/**
 * Client-side Gemini service.
 * In production architectures, API keys are kept server-side to prevent client exposure.
 * These methods proxy requests through the backend Express server endpoints.
 */
export const geminiService = {
  /**
   * Send prompt to Gemini via backend
   * @param {string} prompt
   * @param {object} options
   */
  async generateContent(prompt, options = {}) {
    const response = await api.post('/gemini/generate', { prompt, ...options });
    return response.data;
  },

  /**
   * Health/Status check for Gemini integration
   */
  async getStatus() {
    const response = await api.get('/gemini/status');
    return response.data;
  }
};

export default geminiService;

