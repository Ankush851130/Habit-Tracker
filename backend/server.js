import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect Database and Start Server
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================`);
    console.log(`🚀 Habit Tracker Server Running!`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Local API: http://localhost:${PORT}/api`);
    console.log(`=================================`);
  });
});
