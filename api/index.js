import dotenv from 'dotenv';
import { connectDB } from '../backend/config/db.js';
import app from '../backend/app.js';

dotenv.config();

export default async function handler(req, res) {
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
      errorDetails: error.message,
      envCheck: {
        hasMongoUri: !!process.env.MONGO_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV || 'not set'
      }
    });
  }
}
