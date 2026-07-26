import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import habitRoutes from './routes/habit.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import achievementRoutes from './routes/achievement.routes.js';
import extraRoutes from './routes/extra.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 300, // Limit each IP to 300 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

// Body Parser & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Allow for production flexibility
      }
    },
    credentials: true,
  })
);

// Serve static uploads
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Habit Tracker API is running smoothly 🚀' });
});

// API Routes
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/user', '/user'], userRoutes);
app.use(['/api/habits', '/habits'], habitRoutes);
app.use(['/api/analytics', '/analytics'], analyticsRoutes);
app.use(['/api/achievements', '/achievements'], achievementRoutes);
app.use(['/api/extra', '/extra'], extraRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
