import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/payments/razorpay/create-order', authLimiter, PaymentController.createRazorpayOrder);
router.post('/payments/razorpay/verify', authLimiter, PaymentController.verifyRazorpayPayment);
router.post('/payments/razorpay/webhook', PaymentController.handleWebhook);

export default router;
