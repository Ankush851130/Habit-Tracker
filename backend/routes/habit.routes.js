import express from 'express';
import {
  getHabits,
  createHabit,
  getHabitById,
  updateHabit,
  deleteHabit,
  toggleArchiveHabit,
  toggleHabitStatus,
} from '../controllers/habit.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { createHabitValidator } from '../validators/habit.validator.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getHabits).post(createHabitValidator, createHabit);
router.route('/:id').get(getHabitById).put(createHabitValidator, updateHabit).delete(deleteHabit);
router.patch('/:id/archive', toggleArchiveHabit);
router.post('/:id/toggle-status', toggleHabitStatus);

export default router;
