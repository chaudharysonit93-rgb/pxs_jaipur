import { ProductService } from '../services/productService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class ProductController {
  static async getCategories(req, res, next) {
    try {
      const categories = await ProductService.getCategories();
      return ApiResponse.success(res, categories);
    } catch (err) {
      next(err);
    }
  }

  static async getProducts(req, res, next) {
    try {
      const { page, limit, category, size, minPrice, maxPrice, inStock, search, sort } = req.query;
      const products = await ProductService.getProducts({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 12,
        category,
        size,
        minPrice,
        maxPrice,
        inStock: inStock === 'true',
        search,
        sort
      });
      return ApiResponse.success(res, products);
    } catch (err) {
      next(err);
    }
  }

  static async getProductBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const product = await ProductService.getProductBySlug(slug);
      return ApiResponse.success(res, product);
    } catch (err) {
      next(err);
    }
  }
}
