import express from 'express';
import { getAchievements } from '../controllers/achievement.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAchievements);

export default router;
