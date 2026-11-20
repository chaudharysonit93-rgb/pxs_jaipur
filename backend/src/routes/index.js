import { Router } from 'express';
import productRoutes from './productRoutes.js';
import authRoutes from './authRoutes.js';
import orderRoutes from './orderRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import adminRoutes from './adminRoutes.js';
import { query } from '../config/db.js';

const router = Router();

// Health check endpoint for UptimeRobot and load balancers
router.get('/health', async (req, res) => {
  try {
    await query('SELECT 1');
    return res.status(200).json({
      status: 'ok',
      service: 'PXS Luxury Streetwear API',
      database: 'connected',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(503).json({
      status: 'error',
      service: 'PXS Luxury Streetwear API',
      database: 'disconnected',
      error: err.message
    });
  }
});

router.use('/', productRoutes);
router.use('/auth', authRoutes);
router.use('/', orderRoutes);
router.use('/', paymentRoutes);
router.use('/', adminRoutes);

export default router;
