import crypto from 'crypto';
import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

export class OrderService {
  static async createOrder({
    userId,
    customerEmail,
    customerPhone,
    shippingAddress,
    items,
    paymentMethod,
    idempotencyKey
  }) {
    // 1. Idempotency Check
    if (idempotencyKey) {
      const existing = await query('SELECT * FROM orders WHERE idempotency_key = $1', [idempotencyKey]);
      if (existing.rows.length) {
        return existing.rows[0];
      }
    }

    // 2. Validate Items Array
    if (!items || !items.length) {
      throw ApiError.badRequest('Cart is empty. Please select shirts to purchase.');
    }

    // 3. COD Fraud & Postal Check
    if (paymentMethod === 'COD') {
      const postalCode = shippingAddress.postalCode?.trim();
      if (!postalCode || !postalCode.startsWith(env.JAIPUR_PINCODE_PREFIX)) {
        throw ApiError.badRequest(
          `Cash on Delivery (COD) is currently exclusive to Jaipur PIN codes (${env.JAIPUR_PINCODE_PREFIX}xxx). Please choose Online Payment for pan-India delivery.`
        );
      }
    }

    // 4. Server-Side Price Recalculation & Stock Check
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const variantRes = await query(
        `SELECT pv.id as variant_id, pv.size, pv.stock, p.id as product_id, p.title, p.base_price
         FROM product_variants pv
         JOIN products p ON pv.product_id = p.id
         WHERE pv.id = $1 AND p.is_active = 1`,
        [item.variantId]
      );

      if (!variantRes.rows.length) {
        throw ApiError.badRequest(`One of the requested shirts is no longer available.`);
      }

      const v = variantRes.rows[0];

      if (v.stock < item.quantity) {
        throw ApiError.badRequest(`Insufficient stock for "${v.title}" in size ${v.size}. Only ${v.stock} remaining.`);
      }

      const lineTotal = v.base_price * item.quantity;
      calculatedSubtotal += lineTotal;

      validatedItems.push({
        variantId: v.variant_id,
        productTitle: v.title,
        size: v.size,
        pricePerUnit: v.base_price,
        quantity: item.quantity,
        totalPrice: lineTotal
      });
    }

    // 5. Check Max COD Value
    if (paymentMethod === 'COD' && calculatedSubtotal > env.MAX_COD_ORDER_VALUE) {
      throw ApiError.badRequest(
        `COD is limited to ₹${env.MAX_COD_ORDER_VALUE} per order. Please use Online Payment or reduce item quantity.`
      );
    }

    // 6. Calculate Shipping
    const shippingFee = calculatedSubtotal >= env.FREE_SHIPPING_THRESHOLD ? 0 : env.STANDARD_SHIPPING_FEE;
    const totalAmount = calculatedSubtotal + shippingFee;

    // 7. Atomic Stock Decrement & Order Creation
    const orderId = `ord-${crypto.randomUUID()}`;
    const orderNumber = `PXS-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const initialStatus = paymentMethod === 'COD' ? 'PENDING_CONFIRMATION' : 'PENDING';

    for (const item of validatedItems) {
      await query(
        `UPDATE product_variants SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [item.quantity, item.variantId]
      );
    }

    await query(
      `INSERT INTO orders (
        id, order_number, user_id, customer_email, customer_phone, shipping_address,
        subtotal, discount_amount, shipping_fee, total_amount, payment_method,
        order_status, idempotency_key
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        orderId,
        orderNumber,
        userId || null,
        customerEmail,
        customerPhone,
        JSON.stringify(shippingAddress),
        calculatedSubtotal,
        0.00,
        shippingFee,
        totalAmount,
        paymentMethod,
        initialStatus,
        idempotencyKey || `idem-${crypto.randomUUID()}`
      ]
    );

    for (const item of validatedItems) {
      await query(
        `INSERT INTO order_items (id, order_id, variant_id, product_title, size, price_per_unit, quantity, total_price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          `item-${crypto.randomUUID()}`,
          orderId,
          item.variantId,
          item.productTitle,
          item.size,
          item.pricePerUnit,
          item.quantity,
          item.totalPrice
        ]
      );
    }

    return {
      id: orderId,
      orderNumber,
      subtotal: calculatedSubtotal,
      shippingFee,
      totalAmount,
      paymentMethod,
      orderStatus: initialStatus,
      items: validatedItems,
      shippingAddress
    };
  }

  static async getOrdersByUserId(userId) {
    const res = await query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    for (const order of res.rows) {
      const itemsRes = await query(`SELECT * FROM order_items WHERE order_id = $1`, [order.id]);
      order.items = itemsRes.rows;
      order.shippingAddress = JSON.parse(order.shipping_address);
    }
    return res.rows;
  }

  static async getOrderByNumber(orderNumber) {
    const res = await query(`SELECT * FROM orders WHERE order_number = $1`, [orderNumber]);
    if (!res.rows.length) {
      throw ApiError.notFound('Order not found with the provided order number.');
    }
    const order = res.rows[0];
    const itemsRes = await query(`SELECT * FROM order_items WHERE order_id = $1`, [order.id]);
    order.items = itemsRes.rows;
    order.shippingAddress = JSON.parse(order.shipping_address);
    return order;
  }
}
