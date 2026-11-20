import { Router } from 'express';
import { OrderController, createOrderSchema } from '../controllers/orderController.js';
import { validate } from '../middleware/validate.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Guest or registered user can create orders
router.post('/orders', authLimiter, optionalAuth, validate(createOrderSchema), OrderController.createOrder);

// Authenticated user can fetch their order history
router.get('/orders/my-orders', requireAuth, OrderController.getMyOrders);

// Track order by order number (public lookup)
router.get('/orders/track/:orderNumber', OrderController.trackOrder);

export default router;
