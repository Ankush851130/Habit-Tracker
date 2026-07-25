import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import ExtraTracker from '../models/ExtraTracker.js';
import { sendEmail } from '../services/email.service.js';

// Helper to generate token & set cookie
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_habit_tracker_2026_production',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  const userObj = user.toObject();
  delete userObj.password;

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    message,
    token,
    user: userObj,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msg = errors.array().map((e) => e.msg).join(', ');
      return res.status(400).json({ success: false, message: msg, errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists with this email address' });
    }

    user = await User.create({
      name: name ? name.trim() : normalizedEmail.split('@')[0],
      email: normalizedEmail,
      password,
    });

    // Initialize extra trackers container for user
    await ExtraTracker.create({ userId: user._id });

    sendTokenResponse(user, 201, res, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msg = errors.array().map((e) => e.msg).join(', ');
      return res.status(400).json({ success: false, message: msg, errors: errors.array() });
    }

    const { email, password } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
export const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) requested a password reset. Please click on the link below:\n\n${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request - Habit Tracker',
        message,
      });

      res.status(200).json({ success: true, message: 'Password reset link sent to email' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resetToken
export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Google Sign In / Register
// @route   POST /api/auth/google
export const googleLogin = async (req, res, next) => {
  try {
    const { email, name, picture, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google authentication failed: Email is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId || `google_${Date.now()}`;
      }
      if (picture && (!user.avatar || user.avatar.includes('dicebear'))) {
        user.avatar = picture;
      }
      await user.save();
      return sendTokenResponse(user, 200, res, 'Signed in with Google successfully');
    }

    // Create new user authenticated via Google
    const newGoogleId = googleId || `google_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    user = await User.create({
      name: name || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      googleId: newGoogleId,
      avatar: picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || normalizedEmail)}`,
    });

    await ExtraTracker.create({ userId: user._id });

    sendTokenResponse(user, 201, res, 'Signed up with Google successfully');
  } catch (error) {
    next(error);
  }
};

