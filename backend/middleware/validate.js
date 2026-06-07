import { validationResult } from 'express-validator';
import ApiError from '../utilities/ApiError.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((err) => err.msg)
      .join(', ');
    return next(new ApiError(400, message));
  }
  next();
};
