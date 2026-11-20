import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Protect ALL admin routes with authentication and strict role check
router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/admin/stats', AdminController.getStats);
router.get('/admin/orders', AdminController.getOrders);
router.patch('/admin/orders/:id/status', AdminController.updateOrderStatus);
router.get('/admin/inventory', AdminController.getInventory);
router.patch('/admin/inventory/:variantId', AdminController.updateStock);

export default router;
