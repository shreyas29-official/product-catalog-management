import * as authService from '../services/authService.js';
import catchAsync from '../utilities/catchAsync.js';

export const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
});

export const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ success: true, data: result });
});

export const getProfile = catchAsync(async (req, res) => {
  const profile = await authService.getProfile(req.user._id);
  res.json({ success: true, data: profile });
});
