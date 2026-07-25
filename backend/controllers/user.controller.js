import User from '../models/User.js';
import Habit from '../models/Habit.js';

// @desc    Update user profile details
// @route   PUT /api/user/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, preferences } = req.body;
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (preferences) fieldsToUpdate.preferences = preferences;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user profile avatar
// @route   POST /api/user/avatar
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, { avatar: avatarPath }, { new: true });

    res.status(200).json({ success: true, avatar: avatarPath, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/user/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete account
// @route   DELETE /api/user/account
export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Habit.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.cookie('token', 'none', { expires: new Date(Date.now() + 5000), httpOnly: true });
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};
