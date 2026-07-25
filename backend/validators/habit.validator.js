import { body } from 'express-validator';

export const createHabitValidator = [
  body('title').trim().notEmpty().withMessage('Habit title is required'),
  body('category').optional().trim(),
  body('priority').optional().isIn(['High', 'Medium', 'Low']).withMessage('Priority must be High, Medium, or Low'),
  body('frequency').optional().isIn(['Daily', 'Weekly', 'Monthly', 'Custom']).withMessage('Invalid frequency'),
];
