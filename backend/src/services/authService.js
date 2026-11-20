import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

export class AuthService {
  static async signup({ email, phone, password }) {
    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1 OR phone = $2', [email.toLowerCase(), phone]);
    if (existing.rows.length) {
      throw ApiError.badRequest('An account with this email or phone number already exists.');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `usr-${crypto.randomUUID()}`;

    await query(
      `INSERT INTO users (id, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, 'customer')`,
      [userId, email.toLowerCase(), phone, passwordHash]
    );

    const token = this.generateToken({ id: userId, email: email.toLowerCase(), role: 'customer' });
    return {
      user: { id: userId, email: email.toLowerCase(), phone, role: 'customer' },
      token
    };
  }

  static async login({ email, password }) {
    const res = await query(
      'SELECT id, email, phone, password_hash, role, is_active FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    // Constant-time check even if user doesn't exist to prevent timing attacks
    if (!res.rows.length || !res.rows[0].is_active) {
      await bcrypt.compare(password, '$2a$12$e80yqXN/8H4v7uF5ZfXvhe7kU34vjZkK/g23U4lKx4l3Z3K4l3Z3K'); // Dummy hash
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const user = res.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const token = this.generateToken({ id: user.id, email: user.email, role: user.role });
    return {
      user: { id: user.id, email: user.email, phone: user.phone, role: user.role },
      token
    };
  }

  static generateToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: `${env.SESSION_EXPIRES_DAYS}d`
    });
  }

  static setAuthCookie(res, token) {
    const isProd = env.NODE_ENV === 'production';
    res.cookie('pxs_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: env.SESSION_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
      path: '/'
    });
  }

  static clearAuthCookie(res) {
    res.clearCookie('pxs_token', {
      httpOnly: true,
      path: '/'
    });
  }
}
