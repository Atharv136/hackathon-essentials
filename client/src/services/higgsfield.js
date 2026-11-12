import api from './api';

/**
 * Client-side Higgsfield service.
 * In production architectures, API keys are kept server-side to prevent client exposure.
 * These methods proxy video generation requests through the backend Express server endpoints.
 */
export const higgsfieldService = {
  /**
   * Request video generation from Higgsfield via backend
   * @param {object} payload
   */
  async generateVideo(payload) {
    const response = await api.post('/higgsfield/generate', payload);
    return response.data;
  },

  /**
   * Check status of a generation job
   * @param {string} jobId
   */
  async getJobStatus(jobId) {
    const response = await api.get(`/higgsfield/status/${jobId}`);
    return response.data;
  }
};

export default higgsfieldService;

