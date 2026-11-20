import { query } from '../src/config/db.js';
import { initDatabase } from './init.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function seedDatabase() {
  await initDatabase();

  console.log('🌱 Seeding PXS database with initial catalog & categories...');

  // 1. Categories
  const categories = [
    { id: 'cat-solids', name: 'Solids', slug: 'solids', description: 'Raw textures, heavyweight cottons & Cuban collars' },
    { id: 'cat-prints', name: 'Prints', slug: 'prints', description: 'Electric geometric graphics & dark abstract visuals' },
    { id: 'cat-checks-stripes', name: 'Checks & Stripes', slug: 'checks-stripes', description: 'Brutalist linear patterns & structured relaxed fits' }
  ];

  for (const cat of categories) {
    await query(`
      INSERT OR IGNORE INTO categories (id, name, slug, description)
      VALUES ($1, $2, $3, $4)
    `, [cat.id, cat.name, cat.slug, cat.description]);
  }

  // 2. Default Admin Account
  const adminSalt = await bcrypt.genSalt(12);
  const adminHash = await bcrypt.hash('AdminPassword#2026', adminSalt);
  await query(`
    INSERT OR IGNORE INTO users (id, email, phone, password_hash, role)
    VALUES ($1, $2, $3, $4, $5)
  `, ['user-admin-01', 'admin@pxswear.com', '+919876543210', adminHash, 'admin']);

  // 3. Initial 8 Streetwear Shirts
  const products = [
    {
      id: 'prod-01',
      categoryId: 'cat-solids',
      title: 'The Raw Havana',
      slug: 'the-raw-havana',
      description: 'Crafted from heavyweight textured rayon, The Raw Havana features an exaggerated camp collar, dropped shoulders, and custom matte charcoal buttons. Cut for an effortless boxy drape that moves with you.',
      fabric: '100% Textured Rayon (Heavyweight 180 GSM)',
      fit: 'Relaxed Cuban / Oversized Boxy Cut',
      careInstructions: 'Cold hand wash or gentle machine wash inside out. Do not tumble dry. Low steam iron.',
      basePrice: 799.00,
      costPrice: 380.00,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      variants: [
        { size: 'S', stock: 4, sku: 'PXS-HAV-S' },
        { size: 'M', stock: 2, sku: 'PXS-HAV-M' }, // Low stock indicator!
        { size: 'L', stock: 5, sku: 'PXS-HAV-L' },
        { size: 'XL', stock: 0, sku: 'PXS-HAV-XL' } // Out of stock indicator!
      ]
    },
    {
      id: 'prod-02',
      categoryId: 'cat-prints',
      title: 'Electric Mirage',
      slug: 'electric-mirage',
      description: 'Geometric brutalist print with subtle Electric Lime vectors across deep charcoal slub cotton. Features a notched lapel and tonal stitching designed to make a statement in Jaipur nightlife.',
      fabric: 'Slub Cotton Blend with breathable open-weave',
      fit: 'Oversized Streetwear Fit',
      careInstructions: 'Machine wash cold with similar dark colors. Hang dry in shade.',
      basePrice: 899.00,
      costPrice: 420.00,
      imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      variants: [
        { size: 'S', stock: 3, sku: 'PXS-EM-S' },
        { size: 'M', stock: 4, sku: 'PXS-EM-M' },
        { size: 'L', stock: 2, sku: 'PXS-EM-L' },
        { size: 'XL', stock: 1, sku: 'PXS-EM-XL' }
      ]
    },
    {
      id: 'prod-03',
      categoryId: 'cat-solids',
      title: 'Jaipur Slate Boxy Shirt',
      slug: 'jaipur-slate-boxy-shirt',
      description: 'Mineral-washed slate grey overshirt inspired by brutalist concrete architecture. Substantial fabric weight with reinforced side splits and a clean French placket.',
      fabric: '100% Heavy Combed Cotton Twill (220 GSM)',
      fit: 'Boxy Drop-Shoulder',
      careInstructions: 'Machine wash cold. Warm iron if needed.',
      basePrice: 699.00,
      costPrice: 340.00,
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      variants: [
        { size: 'S', stock: 5, sku: 'PXS-JSL-S' },
        { size: 'M', stock: 5, sku: 'PXS-JSL-M' },
        { size: 'L', stock: 3, sku: 'PXS-JSL-L' },
        { size: 'XL', stock: 2, sku: 'PXS-JSL-XL' }
      ]
    },
    {
      id: 'prod-04',
      categoryId: 'cat-checks-stripes',
      title: 'Brutalist Stripe Resort Shirt',
      slug: 'brutalist-stripe-resort-shirt',
      description: 'High-contrast monochrome vertical stripes spaced for visual height. Features an open Cuban collar and a straight hem tailored to sit cleanly above trousers or relaxed denim.',
      fabric: 'Soft Rayon Twill',
      fit: 'Camp Collar Relaxed Cut',
      careInstructions: 'Gentle hand wash. Iron damp for a crisp look.',
      basePrice: 849.00,
      costPrice: 390.00,
      imageUrl: 'https://images.unsplash.com/photo-1620012253295-c15c429f66bf?auto=format&fit=crop&w=800&q=80',
      variants: [
        { size: 'S', stock: 2, sku: 'PXS-BST-S' },
        { size: 'M', stock: 4, sku: 'PXS-BST-M' },
        { size: 'L', stock: 0, sku: 'PXS-BST-L' },
        { size: 'XL', stock: 3, sku: 'PXS-BST-XL' }
      ]
    },
    {
      id: 'prod-05',
      categoryId: 'cat-solids',
      title: 'Delhi Archive 01 Linen Shirt',
      slug: 'delhi-archive-01-linen-shirt',
      description: 'Sourced directly from the Delhi wholesale textile hubs, this Desert Sand slub linen shirt delivers natural texture, heat-wicking performance, and luxury casual presence.',
      fabric: 'Pure Cotton Linen Blend',
      fit: 'Modern Relaxed Everyday Fit',
      careInstructions: 'Hand wash or dry clean recommended for optimal texture longevity.',
      basePrice: 899.00,
      costPrice: 410.00,
      imageUrl: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80',
      variants: [
        { size: 'S', stock: 3, sku: 'PXS-DAR-S' },
        { size: 'M', stock: 3, sku: 'PXS-DAR-M' },
        { size: 'L', stock: 4, sku: 'PXS-DAR-L' },
        { size: 'XL', stock: 2, sku: 'PXS-DAR-XL' }
      ]
    },
    {
      id: 'prod-06',
      categoryId: 'cat-prints',
      title: 'Acid Palm Resort Shirt',
      slug: 'acid-palm-resort-shirt',
      description: 'An inverted abstract palm motif in deep charcoal with Electric Lime micro-accents. Tailored for late-night gatherings, rooftop lounges, and statement casual wear.',
      fabric: 'Ultra-light Poly-Rayon Silky Weave',
      fit: 'Relaxed Flowing Street Silhouette',
      careInstructions: 'Gentle machine wash cold. Do not bleach.',
      basePrice: 949.00,
      costPrice: 430.00,
      imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      variants: [
        { size: 'S', stock: 2, sku: 'PXS-APM-S' },
        { size: 'M', stock: 2, sku: 'PXS-APM-M' },
        { size: 'L', stock: 3, sku: 'PXS-APM-L' },
        { size: 'XL', stock: 1, sku: 'PXS-APM-XL' }
      ]
    },
    {
      id: 'prod-07',
      categoryId: 'cat-solids',
      title: 'Monochrome Twill Overshirt',
      slug: 'monochrome-twill-overshirt',
      description: 'Heavyweight structured streetwear overshirt in Jet Black. Features twin utility flap pockets on the chest, gunmetal hardware buttons, and a clean straight hem.',
      fabric: '100% Heavy Twill Drill (240 GSM)',
      fit: 'Boxy Heavyweight Layering Cut',
      careInstructions: 'Dry clean or cold machine wash inside out.',
      basePrice: 999.00,
      costPrice: 460.00,
      imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
      variants: [
        { size: 'S', stock: 4, sku: 'PXS-MTW-S' },
        { size: 'M', stock: 4, sku: 'PXS-MTW-M' },
        { size: 'L', stock: 2, sku: 'PXS-MTW-L' },
        { size: 'XL', stock: 2, sku: 'PXS-MTW-XL' }
      ]
    },
    {
      id: 'prod-08',
      categoryId: 'cat-checks-stripes',
      title: 'Cuban Horizon Knit Shirt',
      slug: 'cuban-horizon-knit-shirt',
      description: 'Bone White textured waffle-knit shirt with subtle horizontal ribbed stripe weave. Features a soft ribbed collar and a breathable structure that stays cool under the Jaipur sun.',
      fabric: 'Cotton Poly Textured Waffle Knit',
      fit: 'Relaxed Drop-Shoulder Fit',
      careInstructions: 'Machine wash delicate. Lay flat to dry to preserve knit shape.',
      basePrice: 799.00,
      costPrice: 360.00,
      imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
      variants: [
        { size: 'S', stock: 5, sku: 'PXS-CHK-S' },
        { size: 'M', stock: 3, sku: 'PXS-CHK-M' },
        { size: 'L', stock: 3, sku: 'PXS-CHK-L' },
        { size: 'XL', stock: 0, sku: 'PXS-CHK-XL' }
      ]
    }
  ];

  for (const p of products) {
    await query(`
      INSERT OR IGNORE INTO products (id, category_id, title, slug, description, fabric, fit, care_instructions, base_price, cost_price)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [p.id, p.categoryId, p.title, p.slug, p.description, p.fabric, p.fit, p.careInstructions, p.basePrice, p.costPrice]);

    // Primary Image
    await query(`
      INSERT OR IGNORE INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
      VALUES ($1, $2, $3, $4, 0, 1)
    `, [`img-${p.id}-1`, p.id, p.imageUrl, `${p.title} - Front View`]);

    // Variants
    for (const v of p.variants) {
      await query(`
        INSERT OR IGNORE INTO product_variants (id, product_id, size, sku, stock)
        VALUES ($1, $2, $3, $4, $5)
      `, [`var-${p.id}-${v.size.toLowerCase()}`, p.id, v.size, v.sku, v.stock]);
    }
  }

  console.log('✅ PXS database seeded successfully with 8 shirts, categories and default admin!');
}

// Auto-run if executed directly
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
}
