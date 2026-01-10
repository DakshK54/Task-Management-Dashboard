const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/',
  [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty')
      .isLength({ max: 50 })
      .withMessage('Name cannot exceed 50 characters'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { name, email, avatar } = req.body;
      const updateFields = {};

      if (name) updateFields.name = name;
      if (email) {
        // Check if email is already taken by another user
        const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
        if (existingUser) {
          return res.status(400).json({
            message: 'Email is already taken by another user',
          });
        }
        updateFields.email = email;
      }
      if (avatar !== undefined) updateFields.avatar = avatar;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        updateFields,
        {
          new: true,
          runValidators: true,
        }
      );

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
