const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest'); // custom middleware to handle validation errors

// Signup route
router.post(
  '/signup',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  signup
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  login
);

module.exports = router;
