import { AuthService } from '../services/authService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export class AuthController {
  static async signup(req, res, next) {
    try {
      const { user, token } = await AuthService.signup(req.body);
      AuthService.setAuthCookie(res, token);
      return ApiResponse.created(res, user, 'Account created successfully.');
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { user, token } = await AuthService.login(req.body);
      AuthService.setAuthCookie(res, token);
      return ApiResponse.success(res, user, 'Logged in successfully.');
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res, next) {
    try {
      AuthService.clearAuthCookie(res);
      return ApiResponse.success(res, null, 'Logged out successfully.');
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req, res, next) {
    try {
      return ApiResponse.success(res, req.user);
    } catch (err) {
      next(err);
    }
  }
}
