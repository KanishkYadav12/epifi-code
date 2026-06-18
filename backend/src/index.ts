import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { initSocket } from './socket';
import monitorRoutes from './routes/monitors';
import Monitor from './models/Monitor';
import { pingMonitor } from './services/pingService';
import { startScheduler } from './scheduler';

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/monitors', monitorRoutes);

const PORT = process.env.PORT || 4000;

const start = async (): Promise<void> => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('MongoDB connected');

  initSocket(httpServer);

  const existingMonitors = await Monitor.find();
  existingMonitors.forEach((monitor) => {
    pingMonitor(monitor).catch((err) =>
      console.error(`Initial ping failed for ${monitor.url}:`, err.message)
    );
  });

  startScheduler();

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});