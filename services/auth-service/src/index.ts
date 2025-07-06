// src/index.ts
import 'reflect-metadata';
import dotenv from 'dotenv';

// Load environment variables FIRST - before ANY other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logger from  './config/logger'
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'auth-service' });
});

async function startServer() {
  try {
    // Dynamic imports AFTER dotenv has definitely loaded
    const { AuthDataSource } = await import('./config/database');
    const authRoutes = (await import('./routes/auth.routes')).default;
    
    await AuthDataSource.initialize();
    logger.info('Database connected successfully', {
      port: PORT,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
    
    // Add routes after database is ready
    app.use('/auth', authRoutes);
    
    app.listen(PORT, () => {
      logger.info(`Auth service cooking with gas`, {
        port: PORT,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      });
    });
  } catch (error:unknown) {
    logger.error('Database connection failed', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorType: typeof error
    });
    process.exit(1);
  }
}

startServer();