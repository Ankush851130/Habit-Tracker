import express from 'express';
import { updateProfile, uploadAvatar, changePassword, deleteAccount } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.put('/change-password', changePassword);
router.delete('/account', deleteAccount);

export default router;
