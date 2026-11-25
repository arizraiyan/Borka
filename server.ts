import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATEGORIES, JOURNAL_POSTS, ORDERS_STORE, PRODUCTS, REVIEWS } from './server/mockDb';
import type { Order, OrderCustomer, OrderLineItem, PaymentMethod } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FREE_SHIPPING_THRESHOLD_BDT = 650;
const STANDARD_SHIPPING_BDT = 35;

export async function createServer() {
  const app = express();
  app.use(express.json());

  // GET /api/categories
  app.get('/api/categories', (_req, res) => {
    const withCounts = CATEGORIES.map((cat) => ({
      ...cat,
      count: PRODUCTS.filter((p) => p.categorySlug === cat.slug).length,
    }));
    res.json({ categories: withCounts });
  });

  // GET /api/products
  app.get('/api/products', (req, res) => {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      color,
      material,
      size,
      availability,
      sort = 'newest',
      page = '1',
      limit = '12',
      newArrivals,
      luxury,
    } = req.query as Record<string, string | undefined>;

    let filtered = [...PRODUCTS];

    if (category && category !== 'all') {
      if (category === 'new-arrivals') {
        filtered = filtered.filter((p) => p.isNewArrival);
      } else if (category === 'luxury-collection') {
        filtered = filtered.filter((p) => p.isLuxury);
      } else {
        filtered = filtered.filter((p) => p.categorySlug === category);
      }
    }

    if (newArrivals === 'true') {
      filtered = filtered.filter((p) => p.isNewArrival);
    }

    if (luxury === 'true') {
      filtered = filtered.filter((p) => p.isLuxury);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (minPrice) {
      const min = Number(minPrice);
      if (!Number.isNaN(min)) filtered = filtered.filter((p) => p.price >= min);
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      if (!Number.isNaN(max)) filtered = filtered.filter((p) => p.price <= max);
    }

    if (color) {
      const colors = color.split(',').map((c) => c.trim().toLowerCase());
      filtered = filtered.filter((p) =>
        p.colors.some((pc) => colors.includes(pc.name.toLowerCase()))
      );
    }

    if (material) {
      const materials = material.split(',').map((m) => m.trim().toLowerCase());
      filtered = filtered.filter((p) => materials.includes(p.fabric.toLowerCase()));
    }

    if (size) {
      const sizes = size.split(',').map((s) => s.trim());
      filtered = filtered.filter((p) => p.sizes.some((ps) => sizes.includes(ps)));
    }

    if (availability === 'in-stock') {
      filtered = filtered.filter((p) => p.inStock && p.stock > 0);
    }

    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'newest':
      default:
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    const total = filtered.length;
    const pageNum = Math.max(1, parseInt(page || '1', 10) || 1);
    const limitNum = Math.max(1, Math.min(48, parseInt(limit || '12', 10) || 12));
    const totalPages = Math.max(1, Math.ceil(total / limitNum));
    const safePage = Math.min(pageNum, totalPages);
    const start = (safePage - 1) * limitNum;
    const paginated = filtered.slice(start, start + limitNum);

    const facets = {
      materials: Array.from(new Set(PRODUCTS.map((p) => p.fabric))),
      colors: Array.from(
        new Map(
          PRODUCTS.flatMap((p) => p.colors).map((c) => [c.name, c])
        ).values()
      ),
      sizes: ['50', '52', '54', '56', '58', '60'],
      priceRange: {
        min: Math.min(...PRODUCTS.map((p) => p.price)),
        max: Math.max(...PRODUCTS.map((p) => p.price)),
      },
    };

    res.json({
      products: paginated,
      total,
      page: safePage,
      limit: limitNum,
      totalPages,
      facets,
    });
  });

  // GET /api/products/:id
  app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const product = PRODUCTS.find((p) => p.id === id || p.slug === id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productReviews = REVIEWS.filter((r) => r.productId === product.id);
    const relatedProducts = PRODUCTS.filter(
      (p) => p.id !== product.id && (p.categorySlug === product.categorySlug || p.isLuxury === product.isLuxury)
    ).slice(0, 4);

    return res.json({
      product,
      reviews: productReviews.length > 0 ? productReviews : REVIEWS.slice(0, 2),
      relatedProducts,
    });
  });

  // GET /api/reviews
  app.get('/api/reviews', (req, res) => {
    const { productId } = req.query as { productId?: string };
    const list = productId
      ? REVIEWS.filter((r) => r.productId === productId)
      : REVIEWS;
    res.json({ reviews: list });
  });

  // GET /api/journal
  app.get('/api/journal', (_req, res) => {
    res.json({ posts: JOURNAL_POSTS });
  });

  // POST /api/newsletter
  app.post('/api/newsletter', (req, res) => {
    const { email } = req.body as { email?: string };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    return res.status(201).json({
      subscribed: true,
      message: 'Welcome to the Qasida Private List. Your invitation code is QASIDA10.',
    });
  });

  // POST /api/orders
  app.post('/api/orders', (req, res) => {
    const { customer, items, paymentMethod } = req.body as {
      customer?: OrderCustomer;
      items?: Array<{
        productId: string;
        color: string;
        size: string;
        quantity: number;
      }>;
      paymentMethod?: PaymentMethod;
      currency?: string;
    };

    if (!customer) {
      return res.status(400).json({ error: 'Customer information is required.' });
    }

    const requiredFields: Array<keyof OrderCustomer> = [
      'fullName',
      'phone',
      'country',
      'city',
      'area',
      'address',
    ];
    for (const field of requiredFields) {
      if (!customer[field] || String(customer[field]).trim().length < 2) {
        return res.status(400).json({ error: `Missing or invalid field: ${field}` });
      }
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Your shopping bag is empty.' });
    }

    if (paymentMethod !== 'cod' && paymentMethod !== 'manual_transfer') {
      return res.status(400).json({ error: 'Invalid payment method selected.' });
    }

    const verifiedItems: OrderLineItem[] = [];
    for (const item of items) {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ error: `Unknown product: ${item.productId}` });
      }
      const qty = Math.max(1, Math.min(20, Number(item.quantity) || 1));
      verifiedItems.push({
        productId: product.id,
        sku: product.sku,
        name: product.name,
        image: product.images[0],
        color: item.color || product.colors[0].name,
        size: item.size || product.sizes[0],
        quantity: qty,
        unitPrice: product.price,
        lineTotal: product.price * qty,
      });
    }

    const subtotal = verifiedItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD_BDT ? 0 : STANDARD_SHIPPING_BDT;
    const total = subtotal + shippingFee;

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const orderId = `QSD-${new Date().getFullYear()}-${randomCode}`;

    const newOrder: Order = {
      orderId,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      paymentMethod,
      customer: {
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim() || undefined,
        country: customer.country.trim(),
        city: customer.city.trim(),
        area: customer.area.trim(),
        address: customer.address.trim(),
        notes: customer.notes?.trim() || undefined,
      },
      items: verifiedItems,
      subtotal,
      shippingFee,
      total,
      currency: 'BDT',
    };

    ORDERS_STORE.unshift(newOrder);

    return res.status(201).json({ order: newOrder });
  });

  // GET /api/orders/:orderId
  app.get('/api/orders/:orderId', (req, res) => {
    const order = ORDERS_STORE.find((o) => o.orderId === req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json({ order });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`QASIDA Atelier server running on http://0.0.0.0:${PORT}`);
  });
}

createServer();
