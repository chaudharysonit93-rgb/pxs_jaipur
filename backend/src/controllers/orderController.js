import { OrderService } from '../services/orderService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { z } from 'zod';

export const createOrderSchema = z.object({
  customerEmail: z.string().email(),
  customerPhone: z.string().regex(/^[6-9]\d{9}$/, 'Must be a 10-digit Indian phone number'),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    streetAddress: z.string().min(5),
    landmark: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().regex(/^\d{6}$/, 'Postal code must be 6 digits')
  }),
  items: z.array(
    z.object({
      variantId: z.string(),
      quantity: z.number().int().positive()
    })
  ).min(1),
  paymentMethod: z.enum(['RAZORPAY', 'COD'])
});

export class OrderController {
  static async createOrder(req, res, next) {
    try {
      const idempotencyKey = req.headers['idempotency-key'];
      const order = await OrderService.createOrder({
        userId: req.user?.id,
        ...req.body,
        idempotencyKey
      });
      return ApiResponse.created(res, order, 'Order initiated successfully.');
    } catch (err) {
      next(err);
    }
  }

  static async getMyOrders(req, res, next) {
    try {
      const orders = await OrderService.getOrdersByUserId(req.user.id);
      return ApiResponse.success(res, orders);
    } catch (err) {
      next(err);
    }
  }

  static async trackOrder(req, res, next) {
    try {
      const { orderNumber } = req.params;
      const order = await OrderService.getOrderByNumber(orderNumber);
      return ApiResponse.success(res, order);
    } catch (err) {
      next(err);
    }
  }
}
