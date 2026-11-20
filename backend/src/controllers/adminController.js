import { AdminService } from '../services/adminService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class AdminController {
  static async getStats(req, res, next) {
    try {
      const stats = await AdminService.getStats();
      return ApiResponse.success(res, stats);
    } catch (err) {
      next(err);
    }
  }

  static async getOrders(req, res, next) {
    try {
      const { status, search } = req.query;
      const orders = await AdminService.getOrders({ status, search });
      return ApiResponse.success(res, orders);
    } catch (err) {
      next(err);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await AdminService.updateOrderStatus(id, status, req.user);
      return ApiResponse.success(res, updated, 'Order status updated successfully.');
    } catch (err) {
      next(err);
    }
  }

  static async getInventory(req, res, next) {
    try {
      const inventory = await AdminService.getInventory();
      return ApiResponse.success(res, inventory);
    } catch (err) {
      next(err);
    }
  }

  static async updateStock(req, res, next) {
    try {
      const { variantId } = req.params;
      const { stock } = req.body;
      const result = await AdminService.updateStock(variantId, Number(stock), req.user);
      return ApiResponse.success(res, result, 'Stock updated successfully.');
    } catch (err) {
      next(err);
    }
  }
}
