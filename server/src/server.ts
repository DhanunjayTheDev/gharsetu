import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';

import config from './config';
import { connectDB } from './config/database';
import { connectRedis } from './config/redis';
import { configureCloudinary } from './config/cloudinary';
import { errorHandler } from './shared/middleware/errorHandler';
import logger from './shared/utils/logger';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import propertyRoutes from './modules/properties/property.routes';
import inquiryRoutes from './modules/inquiries/inquiry.routes';
import buySellRoutes from './modules/buySell/buySell.routes';
import rentalRoutes from './modules/rental/rental.routes';
import propertyMgmtRoutes from './modules/propertyManagement/propertyManagement.routes';
import legalRoutes from './modules/legal/legal.routes';
import jvRoutes from './modules/jointVenture/jv.routes';
import packersRoutes from './modules/packersMovers/packers.routes';
import marketingRoutes from './modules/marketing/marketing.routes';
import schedulingRoutes from './modules/scheduling/schedule.routes';
import feedbackRoutes from './modules/feedback/feedback.routes';
import notificationRoutes from './modules/notifications/notification.routes';
import paymentRoutes from './modules/payments/payment.routes';
import documentRoutes from './modules/documents/document.routes';
import adminRoutes from './modules/admin/admin.routes';

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
app.use(rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Logging
if (config.env !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (message: string) => logger.info(message.trim()) },
  }));
}

// Static files
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/offers', buySellRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/property-management', propertyMgmtRoutes);
app.use('/api/legal', legalRoutes);
app.use('/api/joint-ventures', jvRoutes);
app.use('/api/packers', packersRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/schedules', schedulingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    configureCloudinary();

    app.listen(config.port, () => {
      logger.info(`🏠 Ghar Setu API running on port ${config.port} [${config.env}]`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
