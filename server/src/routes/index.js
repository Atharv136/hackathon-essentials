import express from 'express';
import healthRoutes from './healthRoutes.js';
import { geminiService } from '../services/gemini.js';
import { higgsfieldService } from '../services/higgsfield.js';
import { whatsappService } from '../services/whatsapp.js';

const router = express.Router();

// Health check endpoint mounted at /api/health
router.use('/health', healthRoutes);

// Gemini AI stub endpoint
router.post('/gemini/generate', async (req, res, next) => {
  try {
    const { prompt, model } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: true, message: 'Prompt is required' });
    }
    const result = await geminiService.generateText(prompt, model);
    res.json({ success: true, result });
  } catch (error) {
    next(error);
  }
});

router.get('/gemini/status', (req, res) => {
  res.json({ configured: geminiService.isConfigured() });
});

// Higgsfield stub endpoint
router.post('/higgsfield/generate', async (req, res, next) => {
  try {
    const result = await higgsfieldService.generateVideo(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/higgsfield/status/:jobId', async (req, res, next) => {
  try {
    const result = await higgsfieldService.checkJobStatus(req.params.jobId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// WhatsApp stub endpoint
router.post('/whatsapp/webhook', async (req, res, next) => {
  try {
    const result = await whatsappService.processIncomingMessage(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
