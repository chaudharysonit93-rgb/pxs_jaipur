import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root or workspace root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().optional().default(''),
  JWT_SECRET: z.string().min(16).default('pxs_super_secure_jwt_secret_key_jaipur_2026_luxury'),
  SESSION_EXPIRES_DAYS: z.coerce.number().default(7),
  COOKIE_DOMAIN: z.string().default('localhost'),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_pxs_placeholder'),
  RAZORPAY_KEY_SECRET: z.string().default('pxs_test_secret_placeholder'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('pxs_test_webhook_secret'),
  MAX_COD_ORDER_VALUE: z.coerce.number().default(2000),
  FREE_SHIPPING_THRESHOLD: z.coerce.number().default(999),
  STANDARD_SHIPPING_FEE: z.coerce.number().default(70),
  JAIPUR_PINCODE_PREFIX: z.string().default('302')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ FATAL: Invalid environment variables:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
