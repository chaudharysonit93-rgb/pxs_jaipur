import { PaymentService } from '../services/paymentService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class PaymentController {
  static async createRazorpayOrder(req, res, next) {
    try {
      const { orderId } = req.body;
      const paymentOrder = await PaymentService.createRazorpayOrder(orderId);
      return ApiResponse.success(res, paymentOrder);
    } catch (err) {
      next(err);
    }
  }

  static async verifyRazorpayPayment(req, res, next) {
    try {
      const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
      const result = await PaymentService.verifyRazorpayPayment({
        orderId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      });
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  }

  static async handleWebhook(req, res, next) {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const result = await PaymentService.handleWebhook(req.rawBody || JSON.stringify(req.body), signature);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
