import helmet from 'helmet';
import cors from 'cors';
import { env } from '../config/env.js';

export function setupSecurityMiddleware(app) {
  // 1. Helmet Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
          frameSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
          connectSrc: ["'self'", env.FRONTEND_URL, "https://api.razorpay.com", "https://lumberjack.razorpay.com"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          objectSrc: ["'none'"]
        }
      },
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );

  // 2. Strict CORS Configuration
  const allowedOrigins = [env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'];
  
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl) in development
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('CORS blocked: Origin not allowed by PXS security policy.'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key', 'X-Requested-With']
    })
  );
}
