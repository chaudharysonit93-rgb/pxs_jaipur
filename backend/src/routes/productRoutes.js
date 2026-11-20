import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';

const router = Router();

router.get('/categories', ProductController.getCategories);
router.get('/products', ProductController.getProducts);
router.get('/products/:slug', ProductController.getProductBySlug);

export default router;
