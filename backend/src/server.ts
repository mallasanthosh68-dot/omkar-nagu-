import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { initDb } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolveUploadsDir = () => {
  const relUploads = path.resolve(__dirname, '../../uploads');
  const cwdBackendUploads = path.resolve(process.cwd(), 'backend/uploads');
  const cwdUploads = path.resolve(process.cwd(), 'uploads');

  const dir = fs.existsSync(relUploads)
    ? relUploads
    : fs.existsSync(cwdBackendUploads)
    ? cwdBackendUploads
    : cwdUploads;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

const uploadsDir = resolveUploadsDir();
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'OMKAR NAGU ELECTRICAL WORKS API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

// Boot server
const startServer = async () => {
  try {
    await initDb();
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`⚡ OMKAR NAGU ELECTRICAL WORKS API Server running on port ${PORT}`);
      console.log(`   ➜ Local:   http://localhost:${PORT}`);
      console.log(`   ➜ Network: Available to other devices on the same network`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
