import dotenv from 'dotenv';
import { connectDB } from '../backend/config/db.js';
import app from '../backend/app.js';

dotenv.config();

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Vercel API Handler Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error during request execution' 
    });
  }
}
