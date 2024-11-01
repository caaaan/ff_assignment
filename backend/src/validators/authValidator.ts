import { body } from 'express-validator';

export const registerValidator = [
  body('username')
    .not()
    .isEmpty()
    .withMessage('Username is required')
    .trim()
    .isString()
    .withMessage('Username must be a string'),

  body('password')
    .not()
    .isEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const loginValidator = [
  body('username')
    .not()
    .isEmpty()
    .withMessage('Username is required')
    .trim()
    .isString()
    .withMessage('Username must be a string'),

  body('password')
    .not()
    .isEmpty()
    .withMessage('Password is required'),
];
