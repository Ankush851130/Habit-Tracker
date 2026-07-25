import express from 'express';
import { register, login, logout, getMe, forgotPassword, resetPassword, googleLogin } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/google', googleLogin);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.put('/reset-password/:resetToken', resetPasswordValidator, resetPassword);

export default router;

