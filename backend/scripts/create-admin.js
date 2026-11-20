import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query } from '../src/config/db.js';

async function createAdmin() {
  const [,, email, password, phone] = process.argv;

  if (!email || !password || !phone) {
    console.error('❌ Usage: node scripts/create-admin.js <email> <password> <phone>');
    console.error('Example: node scripts/create-admin.js owner@pxswear.com "SecurePass#2026" "+919876543210"');
    process.exit(1);
  }

  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    const id = `usr-${crypto.randomUUID()}`;

    await query(
      `INSERT INTO users (id, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, 'admin')
       ON CONFLICT (email) DO UPDATE SET password_hash = $4, role = 'admin'`,
      [id, email.toLowerCase(), phone, hash]
    );

    console.log(`✅ Admin account created/updated successfully: ${email} (${phone}) with role 'admin'`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin account:', err.message);
    process.exit(1);
  }
}

createAdmin();
