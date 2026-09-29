/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import companyRoutes from './routes/companyRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { runMigrations } from './db/dbSetup';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

// Run migrations and start server
const startServer = async () => {
  try {
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);

      // Initial telemetry sync on startup
      (async () => {
        try {
          const { syncAllOrganizations } = await import('./services/ingestionService');
          console.log('[Initial Telemetry Sync] Ingesting telemetry for registered organizations...');
          await syncAllOrganizations();
          console.log('[Initial Telemetry Sync] Complete.');
        } catch (e: any) {
          console.warn('[Initial Telemetry Sync Error]:', e.message);
        }
      })();

      // Initialize background telemetry polling engine (refreshes all registered company repos every 15 minutes)
      const POLLING_INTERVAL_MS = 15 * 60 * 1000;
      console.log(`[Scheduled Polling Engine] Active & Running (Interval: 15 minutes).`);
      setInterval(async () => {
        try {
          const { syncAllOrganizations } = await import('./services/ingestionService');
          await syncAllOrganizations();
        } catch (e: any) {
          console.warn('[Scheduled Polling Error]:', e.message);
        }
      }, POLLING_INTERVAL_MS);
    });
  } catch (error) {
    console.error('Failed to run database migrations. Server not started.', error);
    process.exit(1);
  }
};

startServer();
