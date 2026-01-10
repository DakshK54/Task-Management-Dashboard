const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks for the logged in user with filtering and search
// @access  Private
router.get(
  '/',
  [
    query('status').optional().isIn(['todo', 'in-progress', 'completed']),
    query('priority').optional().isIn(['low', 'medium', 'high']),
    query('search').optional().trim(),
    query('sortBy').optional().isIn(['createdAt', 'dueDate', 'priority', 'title']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
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

      const { status, priority, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      
      // Build query filter
      const filter = { user: req.user.id };
      
      if (status) {
        filter.status = status;
      }
      
      if (priority) {
        filter.priority = priority;
      }
      
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const tasks = await Task.find(filter).sort(sort);

      res.json({
        count: tasks.length,
        tasks,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/tasks/:id
// @desc    Get a single task by ID
// @access  Private
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    res.json({ task });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }
    next(error);
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Task title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    body('status')
      .optional()
      .isIn(['todo', 'in-progress', 'completed'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid priority'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
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

      const taskData = {
        ...req.body,
        user: req.user.id,
      };

      const task = await Task.create(taskData);

      res.status(201).json({
        message: 'Task created successfully',
        task,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put(
  '/:id',
  [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    body('status')
      .optional()
      .isIn(['todo', 'in-progress', 'completed'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid priority'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format'),
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

      let task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

      if (!task) {
        return res.status(404).json({
          message: 'Task not found',
        });
      }

      // Update task
      task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      res.json({
        message: 'Task updated successfully',
        task,
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          message: 'Invalid task ID',
        });
      }
      next(error);
    }
  }
);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }
    next(error);
  }
});

module.exports = router;
