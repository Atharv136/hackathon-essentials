import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

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

// Connect to MongoDB gracefully
connectDB();

// Start Server
const server = app.listen(config.port, () => {
  console.log(`🚀 [Server] Running in ${config.nodeEnv} mode on port ${config.port}`);
  console.log(`🩺 [Server] Health check available at http://localhost:${config.port}/api/health`);
});

export default app;
