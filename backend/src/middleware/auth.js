import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { query } from '../config/db.js';
import { ApiError } from '../utils/apiError.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.pxs_token || req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
      throw ApiError.unauthorized('Authentication required. Please log in.');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      throw ApiError.unauthorized('Session expired or invalid. Please log in again.');
    }

    // Verify user exists and is active in database
    const userRes = await query(
      'SELECT id, email, phone, role, is_active FROM users WHERE id = $1',
      [decoded.id]
    );

    if (!userRes.rows.length || !userRes.rows[0].is_active) {
      throw ApiError.unauthorized('User account not found or suspended.');
    }

    req.user = userRes.rows[0];
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (req.user.role !== requiredRole) {
      return next(ApiError.forbidden(`Access restricted to ${requiredRole}s.`));
    }
    next();
  };
}

export async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.pxs_token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (token) {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      const userRes = await query('SELECT id, email, phone, role FROM users WHERE id = $1', [decoded.id]);
      if (userRes.rows.length) {
        req.user = userRes.rows[0];
      }
    }
  } catch (err) {
    // Ignore invalid token in optional auth
  }
  next();
}
