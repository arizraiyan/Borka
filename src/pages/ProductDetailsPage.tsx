import React, { useEffect, useState } from 'react';
import {
  Check,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Ruler,
  ShoppingBag,
  Star,
  Truck,
  ZoomIn,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { SafeImage } from '../components/SafeImage';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { useStore } from '../context/StoreContext';
import { fetchProductById, fetchProducts } from '../lib/api';
import { formatPrice } from '../lib/currency';
import { Link, useRouter } from '../lib/router';
import type { Product, ProductColor, Review } from '../types';

export function ProductDetailsPage({ productId }: { productId: string }) {
  const {
    currency,
    addToCart,
    toggleWishlist,
    isWishlisted,
    trackRecentlyViewed,
    recentlyViewed,
  } = useStore();
  const { navigate } = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'delivery'>('details');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);

    fetchProductById(productId)
      .then((res) => {
        if (!active) return;
        setProduct(res.product);
        setReviews(res.reviews);
        setRelated(res.relatedProducts);
        setSelectedImage(0);
        setSelectedColor(res.product.colors[0]);
        setSelectedSize(
          res.product.sizes[Math.min(2, res.product.sizes.length - 1)] || res.product.sizes[0]
        );
        setQuantity(1);
        trackRecentlyViewed(res.product.id);
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [productId, trackRecentlyViewed]);

  useEffect(() => {
    const otherIds = recentlyViewed.filter((id) => id !== productId).slice(0, 4);
    if (otherIds.length === 0) {
      setRecentProducts([]);
      return;
    }
    fetchProducts({ limit: 24 })
      .then((res) => {
        const mapped = otherIds
          .map((id) => res.products.find((p) => p.id === id))
          .filter((p): p is Product => Boolean(p));
        setRecentProducts(mapped);
      })
      .catch(() => {});
  }, [recentlyViewed, productId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 aspect-[3/4] bg-[#FFFFFF] animate-pulse" />
          <div className="lg:col-span-5 space-y-5">
            <div className="h-4 w-32 bg-[#EDE6DC] animate-pulse" />
            <div className="h-10 w-3/4 bg-[#FFFFFF] animate-pulse" />
            <div className="h-6 w-36 bg-[#EDE6DC] animate-pulse" />
            <div className="h-28 w-full bg-[#FFFFFF] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-xs uppercase tracking-widest text-[#A88C70]">404</p>
        <h1 className="mt-2 font-serif text-4xl text-[#242424]">Piece Not Found</h1>
        <p className="mt-3 text-sm text-[#777777]">
          This abaya may have been retired from our seasonal archive.
        </p>
        <Link
          to="/collections"
          className="mt-7 inline-block bg-[#242424] px-7 py-3.5 text-xs font-medium tracking-widest uppercase text-white"
        >
          Return to Collections
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomCoords({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-[#EAEAEA] bg-[#FFFFFF]/60">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-4 py-3.5 text-xs text-[#777777] sm:px-8">
          <Link to="/" className="hover:text-[#242424]">Home</Link>
          <span>/</span>
          <Link to={`/collections/${product.categorySlug}`} className="hover:text-[#242424]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#242424] truncate">{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 lg:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          {/* Left: Sticky Product Image Gallery with Interactive Zoom */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <div className="flex flex-col-reverse gap-4 sm:flex-row">
              {/* Thumbnails */}
              <div className="flex gap-2.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-col sm:w-20 shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={img + idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`aspect-[3/4] w-16 shrink-0 sm:w-full overflow-hidden border transition-all ${
                      selectedImage === idx
                        ? 'border-[#242424]'
                        : 'border-[#EAEAEA] opacity-65 hover:opacity-100'
                    }`}
                  >
                    <SafeImage
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>

              {/* Main Stage */}
              <div
                onClick={() => setZoomActive((z) => !z)}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setZoomActive(false)}
                className="relative flex-1 aspect-[3/4] overflow-hidden border border-[#EAEAEA] bg-[#FFFFFF] cursor-zoom-in"
              >
                <SafeImage
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover object-top transition-transform duration-200"
                  style={
                    zoomActive
                      ? {
                          transform: 'scale(1.85)',
                          transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                        }
                      : undefined
                  }
                />
                <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 border border-[#EAEAEA] bg-white/95 px-3 py-1.5 text-[11px] uppercase tracking-wider text-[#242424]">
                  <ZoomIn className="h-3.5 w-3.5" />
                  <span>{zoomActive ? 'Click to Reset' : 'Click to Zoom'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between text-xs text-[#777777]">
              <span className="uppercase tracking-widest text-[#A88C70]">{product.category}</span>
              <span className="tabular-nums">SKU: {product.sku}</span>
            </div>

            <h1 className="mt-2 font-serif text-3xl sm:text-4xl leading-tight text-[#242424]">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-[#777777]">{product.subtitle}</p>

            {/* Rating & Availability */}
            <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-[#EAEAEA] pb-5">
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex text-[#A88C70]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-[#242424] tabular-nums">{product.rating}</span>
                <span className="text-[#777777] tabular-nums">({product.reviewCount} reviews)</span>
              </div>

              <span className="text-[#EAEAEA]">|</span>

              <div className="flex items-center gap-1.5 text-xs">
                {product.inStock ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#A88C70]" />
                    <span className="text-[#242424] tabular-nums">
                      In Stock ({product.stock} remaining)
                    </span>
                  </>
                ) : (
                  <span className="text-[#777777]">Currently Out of Stock</span>
                )}
              </div>
            </div>

            {/* Dynamic Pricing */}
            <div className="mt-5 flex items-baseline gap-3 tabular-nums">
              <span className="text-2xl font-semibold text-[#242424]">
                {formatPrice(product.price, currency)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-[#777777] line-through">
                  {formatPrice(product.originalPrice, currency)}
                </span>
              )}
              {product.discountPercentage && (
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A88C70]">
                  Save {product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Color Selection */}
            <div className="mt-7">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#242424]">
                  Color: <span className="font-normal text-[#777777]">{selectedColor?.name}</span>
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    aria-label={`Select color ${c.name}`}
                    className={`h-8 w-8 rounded-full border transition-all ${
                      selectedColor?.name === c.name
                        ? 'ring-2 ring-[#242424] ring-offset-2 border-transparent'
                        : 'border-[#EAEAEA] hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection + Size Guide */}
            <div className="mt-7">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#242424]">
                  Size (Length): <span className="font-normal text-[#777777]">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#A88C70] underline underline-offset-4 hover:text-[#242424]"
                >
                  <Ruler className="h-3.5 w-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`border py-2.5 text-xs font-medium tabular-nums transition-colors ${
                      selectedSize === size
                        ? 'border-[#242424] bg-[#242424] text-white'
                        : 'border-[#EAEAEA] bg-white text-[#242424] hover:border-[#242424]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Actions */}
            <div className="mt-8 space-y-3">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
                <div className="flex items-center border border-[#EAEAEA] shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-12 w-10 sm:w-11 items-center justify-center text-[#242424] hover:bg-[#FFFFFF]"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 sm:w-11 text-center text-sm font-medium tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                    aria-label="Increase quantity"
                    className="flex h-12 w-10 sm:w-11 items-center justify-center text-[#242424] hover:bg-[#FFFFFF]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!product.inStock}
                  onClick={() =>
                    addToCart(product, {
                      color: selectedColor ?? product.colors[0],
                      size: selectedSize,
                      quantity,
                    })
                  }
                  className="flex flex-1 min-w-[140px] h-12 items-center justify-center gap-2 bg-[#242424] px-4 sm:px-6 text-xs font-medium tracking-widest uppercase text-white transition-colors hover:bg-[#A88C70] disabled:bg-[#777777]"
                >
                  <ShoppingBag className="h-4 w-4 shrink-0" />
                  <span>{product.inStock ? 'Add to Bag' : 'Out of Stock'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id, product.name)}
                  aria-label="Save to wishlist"
                  className={`flex h-12 w-12 shrink-0 items-center justify-center border border-[#EAEAEA] transition-colors ${
                    wishlisted ? 'text-[#A88C70] border-[#A88C70]' : 'text-[#242424] hover:border-[#242424]'
                  }`}
                >
                  <Heart className="h-4 w-4" fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              <button
                type="button"
                disabled={!product.inStock}
                onClick={() => {
                  addToCart(product, {
                    color: selectedColor ?? product.colors[0],
                    size: selectedSize,
                    quantity,
                    openDrawer: false,
                  });
                  navigate('/checkout');
                }}
                className="w-full border border-[#242424] bg-white py-3.5 text-xs font-medium tracking-widest uppercase text-[#242424] transition-colors hover:bg-[#EDE6DC] disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* Product Details / Fabric / Delivery Tabs */}
            <div className="mt-9 border-t border-[#EAEAEA] pt-6">
              <div className="flex gap-4 sm:gap-6 border-b border-[#EAEAEA] overflow-x-auto">
                {(
                  [
                    { id: 'details', label: 'Description' },
                    { id: 'fabric', label: 'Fabric & Care' },
                    { id: 'delivery', label: 'Delivery & Returns' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 text-xs font-medium tracking-widest uppercase transition-colors border-b-2 -mb-px whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-[#242424] text-[#242424]'
                        : 'border-transparent text-[#777777] hover:text-[#242424]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 text-sm leading-relaxed text-[#777777]">
                {activeTab === 'details' && (
                  <div className="space-y-3">
                    <p>{product.description}</p>
                    <p className="text-xs text-[#242424]">
                      {product.includesShayla
                        ? '• Complimentary matching chiffon/crepe shayla included.'
                        : '• Tailored outerwear piece.'}
                    </p>
                  </div>
                )}

                {activeTab === 'fabric' && (
                  <div className="space-y-3">
                    <p className="font-medium text-[#242424]">Primary Textile: {product.fabric}</p>
                    <ul className="space-y-1.5 list-disc pl-4">
                      {product.materialDetails.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                    <p className="pt-2 text-xs text-[#242424]">
                      Care: <span className="text-[#777777]">{product.careInstructions}</span>
                    </p>
                  </div>
                )}

                {activeTab === 'delivery' && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Truck className="mt-0.5 h-4 w-4 text-[#A88C70] shrink-0" />
                      <div>
                        <p className="font-medium text-[#242424]">Bangladesh &amp; Worldwide Express</p>
                        <p className="text-xs text-[#777777] mt-0.5">
                          Same-day dispatch from Dhaka House Building, Uttara, Dhaka, Bangladesh;
                          1–3 business days nationwide across Bangladesh, and 3–5 days worldwide
                          via DHL Express. Complimentary over ৳650.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RotateCcw className="mt-0.5 h-4 w-4 text-[#A88C70] shrink-0" />
                      <div>
                        <p className="font-medium text-[#242424]">14-Day Complimentary Exchanges</p>
                        <p className="text-xs text-[#777777] mt-0.5">
                          Unworn garments with original tags and garment bag may be exchanged or
                          returned within 14 days of delivery.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews for Product */}
        <section className="mt-20 border-t border-[#EAEAEA] pt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-3xl text-[#242424]">Client Reviews</h2>
            <span className="text-xs text-[#777777] tabular-nums">
              {product.rating} / 5.0 Average
            </span>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {reviews.map((rev) => (
              <div key={rev.id} className="border border-[#EAEAEA] bg-[#FFFFFF]/60 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#A88C70]">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#777777] tabular-nums">{rev.date}</span>
                </div>
                <h3 className="mt-3 font-serif text-xl text-[#242424]">{rev.title}</h3>
                <p className="mt-2 text-sm text-[#777777] leading-relaxed">“{rev.comment}”</p>
                <p className="mt-4 text-xs text-[#242424] font-medium">
                  {rev.author} <span className="font-normal text-[#777777]">· {rev.location}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-[#EAEAEA] pt-14">
            <div className="flex items-end justify-between">
              <h2 className="font-serif text-3xl text-[#242424]">Complementary Pieces</h2>
              <Link
                to={`/collections/${product.categorySlug}`}
                className="text-xs font-medium tracking-widest uppercase text-[#242424] underline underline-offset-4 hover:text-[#A88C70]"
              >
                View Category
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed */}
        {recentProducts.length > 0 && (
          <section className="mt-20 border-t border-[#EAEAEA] pt-14">
            <h2 className="font-serif text-3xl text-[#242424]">Recently Viewed</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {recentProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
