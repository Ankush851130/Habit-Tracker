import dotenv from 'dotenv';
import { connectDB } from '../backend/config/db.js';
import app from '../backend/app.js';

dotenv.config();

export default async function handler(req, res) {
  try {
    // Normalize Vercel rewrite URL for Express routing
    if (req.url && req.url.startsWith('/api/index.js')) {
      const originalUrl = req.headers['x-forwarded-uri'] || req.headers['x-matched-path'];
      if (originalUrl) {
        req.url = originalUrl;
      } else if (req.query && req.query['1']) {
        req.url = `/api/${req.query['1']}`;
      }
    }

    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Vercel API Handler Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error during request execution',
      errorDetails: process.env.NODE_ENV === 'production' ? error.stack : error.stack
    });
  }
}
