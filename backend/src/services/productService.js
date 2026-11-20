import { query } from '../config/db.js';
import { ApiError } from '../utils/apiError.js';

export class ProductService {
  static async getCategories() {
    const sql = `
      SELECT c.id, c.name, c.slug, c.description, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
      GROUP BY c.id
      ORDER BY c.display_order ASC;
    `;
    const res = await query(sql);
    return res.rows;
  }

  static async getProducts({ page = 1, limit = 12, category, size, minPrice, maxPrice, inStock, search, sort }) {
    let sql = `
      SELECT 
        p.id, p.title, p.slug, p.description, p.fabric, p.fit, p.base_price,
        c.name as category_name, c.slug as category_slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    const params = [];

    if (category) {
      params.push(category);
      sql += ` AND c.slug = $${params.length}`;
    }

    if (minPrice !== undefined && minPrice !== null) {
      params.push(Number(minPrice));
      sql += ` AND p.base_price >= $${params.length}`;
    }

    if (maxPrice !== undefined && maxPrice !== null) {
      params.push(Number(maxPrice));
      sql += ` AND p.base_price <= $${params.length}`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      sql += ` AND (LOWER(p.title) LIKE $${params.length} OR LOWER(p.fabric) LIKE $${params.length})`;
    }

    if (size) {
      params.push(size);
      sql += ` AND p.id IN (SELECT product_id FROM product_variants WHERE size = $${params.length} ${inStock ? 'AND stock > 0' : ''})`;
    } else if (inStock) {
      sql += ` AND p.id IN (SELECT product_id FROM product_variants WHERE stock > 0)`;
    }

    // Sorting
    if (sort === 'price_asc') {
      sql += ` ORDER BY p.base_price ASC`;
    } else if (sort === 'price_desc') {
      sql += ` ORDER BY p.base_price DESC`;
    } else {
      sql += ` ORDER BY p.created_at DESC`;
    }

    // Pagination
    const offset = (Number(page) - 1) * Number(limit);
    params.push(Number(limit));
    sql += ` LIMIT $${params.length}`;
    params.push(Number(offset));
    sql += ` OFFSET $${params.length}`;

    const res = await query(sql, params);

    // Fetch variant sizes for each product
    for (const prod of res.rows) {
      const varRes = await query(
        `SELECT id, size, stock FROM product_variants WHERE product_id = $1 ORDER BY id ASC`,
        [prod.id]
      );
      prod.variants = varRes.rows;
      prod.availableSizes = varRes.rows.filter(v => v.stock > 0).map(v => v.size);
      prod.totalStock = varRes.rows.reduce((sum, v) => sum + v.stock, 0);
    }

    return res.rows;
  }

  static async getProductBySlug(slug) {
    const prodRes = await query(
      `SELECT p.id, p.title, p.slug, p.description, p.fabric, p.fit, p.care_instructions, p.base_price,
              c.name as category_name, c.slug as category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1 AND p.is_active = 1`,
      [slug]
    );

    if (!prodRes.rows.length) {
      throw ApiError.notFound('Product not found');
    }

    const product = prodRes.rows[0];

    // Images
    const imgRes = await query(
      `SELECT id, image_url, alt_text, is_primary FROM product_images WHERE product_id = $1 ORDER BY display_order ASC`,
      [product.id]
    );
    product.images = imgRes.rows;

    // Variants with live stock
    const varRes = await query(
      `SELECT id, size, sku, stock FROM product_variants WHERE product_id = $1 ORDER BY id ASC`,
      [product.id]
    );
    product.variants = varRes.rows;
    product.totalStock = varRes.rows.reduce((sum, v) => sum + v.stock, 0);

    return product;
  }
}
