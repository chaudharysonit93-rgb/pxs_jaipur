import crypto from 'crypto';
import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

export class PaymentService {
  static async createRazorpayOrder(orderId) {
    const orderRes = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (!orderRes.rows.length) {
      throw ApiError.notFound('Order not found.');
    }
    const order = orderRes.rows[0];

    const amountInPaise = Math.round(order.total_amount * 100);

    // If real keys are configured, use live/test Razorpay API, otherwise provide local simulation order
    let razorpayOrderId;
    const isRealKey = env.RAZORPAY_KEY_ID && !env.RAZORPAY_KEY_ID.includes('placeholder');

    if (isRealKey) {
      try {
        const auth = Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString('base64');
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: order.order_number
          })
        });
        const rzpData = await rzpRes.json();
        if (rzpData.id) {
          razorpayOrderId = rzpData.id;
        } else {
          throw new Error(rzpData.error?.description || 'Razorpay order creation failed');
        }
      } catch (err) {
        console.warn('⚠️ Razorpay API call failed, falling back to sandbox simulator:', err.message);
        razorpayOrderId = `order_pxs_test_${crypto.randomBytes(8).toString('hex')}`;
      }
    } else {
      // Local Developer Sandbox Mode
      razorpayOrderId = `order_pxs_test_${crypto.randomBytes(8).toString('hex')}`;
    }

    // Save payment intent
    await query(
      `INSERT INTO payments (id, order_id, gateway, razorpay_order_id, amount, payment_status)
       VALUES ($1, $2, 'RAZORPAY', $3, $4, 'CREATED')`,
      [`pay-${crypto.randomUUID()}`, orderId, razorpayOrderId, order.total_amount]
    );

    return {
      orderId: order.id,
      orderNumber: order.order_number,
      razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: env.RAZORPAY_KEY_ID
    };
  }

  static async verifyRazorpayPayment({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const isRealKey = env.RAZORPAY_KEY_SECRET && !env.RAZORPAY_KEY_SECRET.includes('placeholder');
    
    if (isRealKey) {
      const generatedSignature = crypto
        .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      const isAuthentic = crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(razorpaySignature)
      );

      if (!isAuthentic) {
        throw ApiError.badRequest('Payment verification failed. Invalid signature.');
      }
    }

    // Mark Order as CONFIRMED
    await query(
      `UPDATE orders SET order_status = 'CONFIRMED', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [orderId]
    );

    // Update Payment status to CAPTURED
    await query(
      `UPDATE payments 
       SET razorpay_payment_id = $1, razorpay_signature = $2, payment_status = 'CAPTURED'
       WHERE order_id = $3`,
      [razorpayPaymentId, razorpaySignature, orderId]
    );

    return {
      verified: true,
      message: 'Payment verified successfully. Order confirmed.'
    };
  }

  static async handleWebhook(rawBody, signature) {
    if (env.RAZORPAY_WEBHOOK_SECRET && !env.RAZORPAY_WEBHOOK_SECRET.includes('placeholder')) {
      const expected = crypto
        .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      if (expected !== signature) {
        throw ApiError.badRequest('Invalid webhook signature');
      }
    }

    const payload = JSON.parse(rawBody.toString());
    const event = payload.event;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload.payment.entity;
      const rzpOrderId = paymentEntity.order_id;
      
      const payRes = await query('SELECT order_id FROM payments WHERE razorpay_order_id = $1', [rzpOrderId]);
      if (payRes.rows.length) {
        const orderId = payRes.rows[0].order_id;
        await query(`UPDATE orders SET order_status = 'CONFIRMED' WHERE id = $1`, [orderId]);
        await query(`UPDATE payments SET payment_status = 'CAPTURED' WHERE order_id = $1`, [orderId]);
      }
    }

    return { received: true };
  }
}
