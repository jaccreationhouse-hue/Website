import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import { env } from './config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const allowedOrigins = new Set(env.corsOrigins);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.size === 0 || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use(publicRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'JAC MediaLand CMS API Server is running.' });
});

function healthResponse() {
  return {
    ok: true,
    environment: env.nodeEnv,
    databaseReady: mongoose.connection.readyState === 1
  };
}

app.get('/healthz', (req, res) => {
  res.json(healthResponse());
});

app.get('/health/live', (req, res) => {
  res.json(healthResponse());
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

export default app;
