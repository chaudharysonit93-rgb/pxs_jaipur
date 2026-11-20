import express from 'express';
import cookieParser from 'cookie-parser';
import { setupSecurityMiddleware } from './middleware/security.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// 1. Security Headers & CORS
setupSecurityMiddleware(app);

// 2. Body Parser with 10kb ceiling and rawBody capture for webhooks
app.use(
  express.json({
    limit: '10kb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 3. Cookie Parser
app.use(cookieParser());

// 4. Rate Limiting for general API
app.use('/api', apiLimiter);

// 5. API Routes
app.use('/api', routes);

// 6. Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
