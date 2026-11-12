import express from 'express';
import healthRoutes from './healthRoutes.js';
import { geminiService } from '../services/gemini.js';
import { higgsfieldService } from '../services/higgsfield.js';
import { whatsappService } from '../services/whatsapp.js';
import config from '../config/env.js';

const router = express.Router();

// Health check endpoint mounted at /api/health
router.use('/health', healthRoutes);

// Gemini AI endpoints
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

// Higgsfield endpoints
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

// WhatsApp webhook - GET for Meta verification handshake
router.get('/whatsapp/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === config.whatsapp.meta.verifyToken) {
      console.log('[WhatsApp Webhook] Meta challenge verified successfully');
      return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
  }
  res.status(200).send('WhatsApp Webhook Active');
});

// WhatsApp webhook - POST for incoming messages (Twilio, Meta, or direct)
router.post('/whatsapp/webhook', async (req, res, next) => {
  try {
    const result = await whatsappService.processIncomingMessage(req.body);

    // If client is Twilio (or requested text/xml)
    if (req.headers['content-type']?.includes('urlencoded') || req.body.From) {
      res.type('text/xml');
      return res.send(result.twiml);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Local simulation endpoint for testing the credential bot without Twilio
router.post('/whatsapp/simulate', async (req, res, next) => {
  try {
    const { text, from } = req.body;
    if (!text) {
      return res.status(400).json({ error: true, message: 'Field "text" is required.' });
    }
    const result = await whatsappService.processIncomingMessage({
      Body: text,
      From: from || 'simulated-user'
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
