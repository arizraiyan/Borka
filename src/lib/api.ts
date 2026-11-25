import type {
  Category,
  JournalPost,
  Order,
  OrderCustomer,
  PaymentMethod,
  Product,
  ProductColor,
  Review,
} from '../types';

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  facets: {
    materials: string[];
    colors: ProductColor[];
    sizes: string[];
    priceRange: { min: number; max: number };
  };
}

export interface ProductQueryParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string[];
  material?: string[];
  size?: string[];
  availability?: 'all' | 'in-stock';
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
  page?: number;
  limit?: number;
  newArrivals?: boolean;
  luxury?: boolean;
}

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = 'Request failed';
    try {
      const err = await res.json();
      if (err?.error) message = err.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  const data = await handleJson<{ categories: Category[] }>(res);
  return data.categories;
}

export async function fetchProducts(params: ProductQueryParams = {}): Promise<ProductsResponse> {
  const sp = new URLSearchParams();
  if (params.category && params.category !== 'all') sp.set('category', params.category);
  if (params.search) sp.set('search', params.search);
  if (params.minPrice !== undefined) sp.set('minPrice', String(params.minPrice));
  if (params.maxPrice !== undefined) sp.set('maxPrice', String(params.maxPrice));
  if (params.color && params.color.length > 0) sp.set('color', params.color.join(','));
  if (params.material && params.material.length > 0) sp.set('material', params.material.join(','));
  if (params.size && params.size.length > 0) sp.set('size', params.size.join(','));
  if (params.availability && params.availability !== 'all') {
    sp.set('availability', params.availability);
  }
  if (params.sort) sp.set('sort', params.sort);
  if (params.page) sp.set('page', String(params.page));
  if (params.limit) sp.set('limit', String(params.limit));
  if (params.newArrivals) sp.set('newArrivals', 'true');
  if (params.luxury) sp.set('luxury', 'true');

  const query = sp.toString();
  const res = await fetch(`/api/products${query ? `?${query}` : ''}`);
  return handleJson<ProductsResponse>(res);
}

export async function fetchProductById(id: string): Promise<{
  product: Product;
  reviews: Review[];
  relatedProducts: Product[];
}> {
  const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
  return handleJson(res);
}

export async function fetchReviews(productId?: string): Promise<Review[]> {
  const url = productId
    ? `/api/reviews?productId=${encodeURIComponent(productId)}`
    : '/api/reviews';
  const res = await fetch(url);
  const data = await handleJson<{ reviews: Review[] }>(res);
  return data.reviews;
}

export async function fetchJournalPosts(): Promise<JournalPost[]> {
  const res = await fetch('/api/journal');
  const data = await handleJson<{ posts: JournalPost[] }>(res);
  return data.posts;
}

export async function submitOrder(payload: {
  customer: OrderCustomer;
  items: Array<{
    productId: string;
    color: string;
    size: string;
    quantity: number;
  }>;
  paymentMethod: PaymentMethod;
  currency: string;
}): Promise<Order> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await handleJson<{ order: Order }>(res);
  return data.order;
}

export async function subscribeNewsletter(email: string): Promise<{ subscribed: boolean; message: string }> {
  const res = await fetch('/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleJson(res);
}
