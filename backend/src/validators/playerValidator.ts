import { body } from 'express-validator';

export const createValidator = [
  body('name').not().isEmpty().withMessage('The player name is mandatory')
    .trim().isString().withMessage('Name needs to be in text format'),

  body('team').not().isEmpty().withMessage('The player team is mandatory')
    .trim().isString().withMessage('Team needs to be in text format'),

  body('position').not().isEmpty().withMessage('The player position is mandatory')
    .trim().isString().withMessage('Position needs to be in text format'),

  body('dribbleSkill').isNumeric().withMessage('Dribble skill must be a number'),

  body('length').isNumeric().withMessage('Length must be a number'),

  body('weight').isNumeric().withMessage('Weight must be a number'),

  body('age').isNumeric().withMessage('Age must be a number'),

  body('ballControl').isNumeric().withMessage('Ball control must be a number'),

  body('passingUnderPressure').isNumeric().withMessage('Passing under pressure must be a number'),
];

export const updateValidator = [
  body('id').not().isEmpty().withMessage('The player id is mandatory')
    .trim().isString().withMessage('ID needs to be a valid uuid format'),

  body('team').optional().trim().isString().withMessage('Team needs to be in text format'),

  body('position').optional().trim().isString().withMessage('Position needs to be in text format'),

  // ... other fields can be added as needed
];

  