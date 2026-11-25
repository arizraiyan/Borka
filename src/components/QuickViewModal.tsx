import React, { useEffect, useState } from 'react';
import { ArrowRight, Heart, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { fetchProductById } from '../lib/api';
import { formatPrice } from '../lib/currency';
import { useRouter } from '../lib/router';
import type { Product, ProductColor } from '../types';
import { SafeImage } from './SafeImage';

export function QuickViewModal() {
  const {
    quickViewProductId,
    closeQuickView,
    currency,
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useStore();
  const { navigate } = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!quickViewProductId) {
      setProduct(null);
      return;
    }
    let active = true;
    setLoading(true);
    fetchProductById(quickViewProductId)
      .then((res) => {
        if (!active) return;
        setProduct(res.product);
        setSelectedImage(0);
        setSelectedColor(res.product.colors[0]);
        setSelectedSize(res.product.sizes[Math.min(2, res.product.sizes.length - 1)] || res.product.sizes[0]);
        setQuantity(1);
      })
      .catch(() => {
        if (active) setProduct(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [quickViewProductId]);

  if (!quickViewProductId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Product Quick View"
    >
      <div className="fixed inset-0 bg-black/45" onClick={closeQuickView} />

      <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto bg-white border border-[#EAEAEA]">
        <button
          type="button"
          onClick={closeQuickView}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center border border-[#EAEAEA] bg-white text-[#242424] hover:text-[#A88C70]"
        >
          <X className="h-4 w-4" />
        </button>

        {loading || !product ? (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-[3/4] bg-[#FFFFFF] animate-pulse" />
            <div className="p-8 space-y-4">
              <div className="h-4 w-32 bg-[#EDE6DC] animate-pulse" />
              <div className="h-8 w-3/4 bg-[#FFFFFF] animate-pulse" />
              <div className="h-6 w-28 bg-[#EDE6DC] animate-pulse" />
              <div className="h-24 w-full bg-[#FFFFFF] animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery */}
            <div className="bg-[#FFFFFF] p-6">
              <div className="aspect-[3/4] w-full overflow-hidden border border-[#EAEAEA] bg-white">
                <SafeImage
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              {product.images.length > 1 && (
                <div className="mt-3 flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={img + i}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={`h-16 w-12 overflow-hidden border ${
                        selectedImage === i ? 'border-[#242424]' : 'border-[#EAEAEA] opacity-70'
                      }`}
                    >
                      <SafeImage src={img} alt="" className="h-full w-full object-cover object-top" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Purchase Module */}
            <div className="flex flex-col justify-between p-6 sm:p-8">
              <div>
                <p className="text-[11px] font-medium tracking-widest uppercase text-[#777777]">
                  {product.category} · {product.sku}
                </p>
                <h2 className="mt-2 font-serif text-2xl sm:text-3xl text-[#242424]">
                  {product.name}
                </h2>

                <div className="mt-3 flex items-baseline gap-3 tabular-nums">
                  <span className="text-xl font-semibold text-[#242424]">
                    {formatPrice(product.price, currency)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#777777] line-through">
                      {formatPrice(product.originalPrice, currency)}
                    </span>
                  )}
                  {product.discountPercentage && (
                    <span className="text-xs font-medium text-[#A88C70]">
                      Save {product.discountPercentage}%
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[#777777]">
                  {product.description}
                </p>

                {/* Color Picker */}
                <div className="mt-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#242424]">
                    Color: <span className="text-[#777777]">{selectedColor?.name}</span>
                  </p>
                  <div className="mt-2.5 flex items-center gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        aria-label={`Select color ${c.name}`}
                        className={`h-7 w-7 rounded-full border transition-transform ${
                          selectedColor?.name === c.name
                            ? 'ring-2 ring-[#242424] ring-offset-2 border-transparent'
                            : 'border-[#EAEAEA]'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Picker */}
                <div className="mt-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#242424]">
                    Abaya Length (Size): <span className="text-[#777777]">{selectedSize}</span>
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[44px] border px-3 py-2 text-xs font-medium tabular-nums transition-colors ${
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

                {/* Quantity & Add */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex items-center border border-[#EAEAEA]">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="flex h-11 w-10 items-center justify-center text-[#242424] hover:bg-[#FFFFFF]"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      aria-label="Increase quantity"
                      className="flex h-11 w-10 items-center justify-center text-[#242424] hover:bg-[#FFFFFF]"
                    >
                      <Plus className="h-3.5 w-3.5" />
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
                      });
                      closeQuickView();
                    }}
                    className="flex flex-1 items-center justify-center gap-2 bg-[#242424] px-6 py-3.5 text-xs font-medium tracking-widest uppercase text-white transition-colors hover:bg-[#A88C70] disabled:bg-[#777777]"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>{product.inStock ? 'Add to Bag' : 'Sold Out'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id, product.name)}
                    aria-label="Toggle wishlist"
                    className={`flex h-11 w-11 items-center justify-center border border-[#EAEAEA] transition-colors ${
                      isWishlisted(product.id) ? 'text-[#A88C70]' : 'text-[#242424]'
                    }`}
                  >
                    <Heart className="h-4 w-4" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  closeQuickView();
                  navigate(`/product/${product.id}`);
                }}
                className="mt-6 flex items-center gap-2 border-t border-[#EAEAEA] pt-4 text-xs font-medium tracking-widest uppercase text-[#242424] hover:text-[#A88C70]"
              >
                <span>View Full Product Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
