import express from 'express';
import {
  getExtraData,
  logPomodoro,
  logMood,
  logWater,
  addJournalEntry,
  getLeaderboard,
} from '../controllers/extra.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getExtraData);
router.post('/pomodoro', logPomodoro);
router.post('/mood', logMood);
router.post('/water', logWater);
router.post('/journal', addJournalEntry);
router.get('/leaderboard', getLeaderboard);

export default router;
