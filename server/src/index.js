import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import { isSupabaseConfigured } from './services/supabase.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', routes);

// Central Error Handler
app.use(errorHandler);

// Log Database & Server Status
if (isSupabaseConfigured) {
  console.log(`✅ [Database] Supabase (PostgreSQL) connected & configured at ${config.supabase.url}`);
} else {
  console.warn(`⚠️ [Database] Supabase credentials missing or incomplete in server/.env`);
}

// Start Server
const server = app.listen(config.port, () => {
  console.log(`🚀 [Server] Running in ${config.nodeEnv} mode on port ${config.port}`);
  console.log(`🩺 [Server] Health check available at http://localhost:${config.port}/api/health`);
});

export default app;
