import crypto from 'crypto';
import { query } from '../config/db.js';
import { ApiError } from '../utils/apiError.js';

export class AdminService {
  static async getStats() {
    // 1. Revenue
    const revRes = await query(`
      SELECT COALESCE(SUM(total_amount), 0) as total_revenue
      FROM orders
      WHERE order_status IN ('CONFIRMED', 'VERIFIED_COD', 'PACKED', 'SHIPPED', 'DELIVERED')
    `);
    const totalRevenue = revRes.rows[0]?.total_revenue || 0;

    // 2. Orders count
    const countRes = await query(`SELECT COUNT(*) as total_orders FROM orders`);
    const totalOrders = countRes.rows[0]?.total_orders || 0;

    // 3. Status breakdown
    const statusRes = await query(`
      SELECT order_status, COUNT(*) as count
      FROM orders
      GROUP BY order_status
    `);

    // 4. Low stock variants (stock <= 2)
    const lowStockRes = await query(`
      SELECT pv.id, pv.size, pv.stock, p.title, p.slug
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.id
      WHERE pv.stock <= 2 AND p.is_active = 1
      ORDER BY pv.stock ASC
    `);

    // 5. Recent orders
    const recentOrdersRes = await query(`
      SELECT id, order_number, customer_email, customer_phone, total_amount, payment_method, order_status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 10
    `);

    return {
      totalRevenue: Number(totalRevenue),
      totalOrders: Number(totalOrders),
      statusBreakdown: statusRes.rows,
      lowStockAlerts: lowStockRes.rows,
      recentOrders: recentOrdersRes.rows
    };
  }

  static async getOrders({ status, search }) {
    let sql = `SELECT * FROM orders WHERE 1=1`;
    const params = [];

    if (status) {
      params.push(status);
      sql += ` AND order_status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      sql += ` AND (LOWER(order_number) LIKE $${params.length} OR LOWER(customer_phone) LIKE $${params.length} OR LOWER(customer_email) LIKE $${params.length})`;
    }

    sql += ` ORDER BY created_at DESC`;

    const res = await query(sql, params);
    for (const order of res.rows) {
      const itemsRes = await query(`SELECT * FROM order_items WHERE order_id = $1`, [order.id]);
      order.items = itemsRes.rows;
      order.shippingAddress = JSON.parse(order.shipping_address);
    }
    return res.rows;
  }

  static async updateOrderStatus(orderId, newStatus, adminUser) {
    const validStatuses = [
      'PENDING',
      'PENDING_CONFIRMATION',
      'VERIFIED_COD',
      'CONFIRMED',
      'PACKED',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
      'RETURNED'
    ];

    if (!validStatuses.includes(newStatus)) {
      throw ApiError.badRequest(`Invalid order status: ${newStatus}`);
    }

    const orderRes = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
    if (!orderRes.rows.length) {
      throw ApiError.notFound('Order not found.');
    }
    const order = orderRes.rows[0];
    const prevStatus = order.order_status;

    // FSM check: cannot change from terminal state
    if (prevStatus === 'CANCELLED' && newStatus !== 'CANCELLED') {
      throw ApiError.badRequest('Cancelled orders cannot be reopened.');
    }

    // Auto-restock inventory if cancelled
    if ((newStatus === 'CANCELLED' || newStatus === 'RETURNED') && prevStatus !== 'CANCELLED' && prevStatus !== 'RETURNED') {
      const itemsRes = await query('SELECT variant_id, quantity FROM order_items WHERE order_id = $1', [orderId]);
      for (const item of itemsRes.rows) {
        if (item.variant_id) {
          await query(
            `UPDATE product_variants SET stock = stock + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
            [item.quantity, item.variant_id]
          );
        }
      }
    }

    // Update status
    await query(
      `UPDATE orders SET order_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [newStatus, orderId]
    );

    // Audit Log
    await query(
      `INSERT INTO audit_logs (id, actor_id, actor_role, action, target_table, target_id, details)
       VALUES ($1, $2, 'admin', 'ORDER_STATUS_CHANGE', 'orders', $3, $4)`,
      [
        `log-${crypto.randomUUID()}`,
        adminUser.id,
        orderId,
        JSON.stringify({ previousStatus: prevStatus, newStatus })
      ]
    );

    return { orderId, previousStatus: prevStatus, newStatus };
  }

  static async getInventory() {
    const res = await query(`
      SELECT 
        pv.id as variant_id, pv.size, pv.sku, pv.stock,
        p.id as product_id, p.title, p.slug, p.base_price, p.is_active,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.id
      ORDER BY p.title ASC, pv.size ASC
    `);
    return res.rows;
  }

  static async updateStock(variantId, newStock, adminUser) {
    if (newStock < 0) {
      throw ApiError.badRequest('Stock quantity cannot be negative.');
    }

    const varRes = await query('SELECT stock FROM product_variants WHERE id = $1', [variantId]);
    if (!varRes.rows.length) {
      throw ApiError.notFound('Product variant not found.');
    }
    const prevStock = varRes.rows[0].stock;

    await query(
      `UPDATE product_variants SET stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [newStock, variantId]
    );

    // Audit Log
    await query(
      `INSERT INTO audit_logs (id, actor_id, actor_role, action, target_table, target_id, details)
       VALUES ($1, $2, 'admin', 'STOCK_UPDATE', 'product_variants', $3, $4)`,
      [
        `log-${crypto.randomUUID()}`,
        adminUser.id,
        variantId,
        JSON.stringify({ previousStock: prevStock, newStock })
      ]
    );

    return { variantId, previousStock: prevStock, newStock };
  }
}
