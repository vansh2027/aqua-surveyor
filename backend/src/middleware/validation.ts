import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateSurvey = [
  body('location.coordinates').isArray().withMessage('Coordinates must be an array'),
  body('location.coordinates.*').isFloat().withMessage('Coordinates must be numbers'),
  body('waterLevel').isFloat().withMessage('Water level must be a number'),
  body('pH').isFloat({ min: 0, max: 14 }).withMessage('pH must be between 0 and 14'),
  body('temperature').isFloat().withMessage('Temperature must be a number'),
  body('dissolvedOxygen').isFloat().withMessage('Dissolved oxygen must be a number'),
  body('conductivity').isFloat().withMessage('Conductivity must be a number'),
  body('turbidity').isFloat().withMessage('Turbidity must be a number'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateUser = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter'),
  body('name').isString().withMessage('Name must be a string'),
  body('phoneNumber').optional().isMobilePhone('any').withMessage('Invalid phone number'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 