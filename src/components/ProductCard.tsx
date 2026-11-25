import React, { useState } from 'react';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../lib/currency';
import { Link } from '../lib/router';
import type { Product } from '../types';
import { SafeImage } from './SafeImage';

export function ProductCard({ product }: { product: Product }) {
  const { currency, addToCart, toggleWishlist, isWishlisted, openQuickView } = useStore();
  const [hovered, setHovered] = useState(false);
  const wishlisted = isWishlisted(product.id);
  const secondaryImage = product.images[1] || product.images[0];

  return (
    <article
      className="group flex flex-col animate-fade-up"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FFFFFF] border border-[#EAEAEA]">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <SafeImage
            src={hovered ? secondaryImage : product.images[0]}
            alt={product.name}
            fallbackTitle={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {/* Top-left subtle unboxed editorial label */}
        <div className="pointer-events-none absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1">
          {!product.inStock ? (
            <span className="bg-white/95 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-[#777777]">
              Sold Out
            </span>
          ) : product.discountPercentage ? (
            <span className="bg-white/95 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-[#A88C70] tabular-nums">
              −{product.discountPercentage}%
            </span>
          ) : product.isNewArrival ? (
            <span className="bg-white/95 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-[#242424]">
              New
            </span>
          ) : null}
        </div>

        {/* Top-right wishlist & quick view affordances */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id, product.name)}
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center border border-[#EAEAEA] bg-white/95 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#A88C70] ${
              wishlisted ? 'text-[#A88C70]' : 'text-[#242424] hover:text-[#A88C70]'
            }`}
          >
            <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={() => openQuickView(product.id)}
            aria-label={`Quick view ${product.name}`}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center border border-[#EAEAEA] bg-white/95 text-[#242424] transition-all duration-200 hover:text-[#A88C70] md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[#A88C70]"
          >
            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>

        {/* Bottom quick-add bar on hover / touch */}
        <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 transition-all duration-200 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100">
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => addToCart(product)}
            className="flex w-full items-center justify-center gap-1.5 sm:gap-2 bg-[#242424] px-2.5 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs font-medium tracking-widest uppercase text-white transition-colors duration-200 hover:bg-[#A88C70] disabled:cursor-not-allowed disabled:bg-[#777777]"
          >
            <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
            <span className="truncate">{product.inStock ? 'Add to Bag' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>

      {/* Product Metadata */}
      <div className="mt-3 flex flex-1 flex-col justify-between gap-1.5 min-w-0">
        <div>
          <p className="text-[10px] sm:text-[11px] tracking-widest uppercase text-[#777777] truncate">
            {product.category} · {product.fabric}
          </p>
          <Link
            to={`/product/${product.id}`}
            className="mt-1 block font-serif text-base sm:text-lg leading-snug text-[#242424] transition-colors hover:text-[#A88C70] line-clamp-2"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-1.5">
          <div className="flex items-baseline gap-1.5 sm:gap-2 tabular-nums">
            <span className="text-sm sm:text-[15px] font-semibold text-[#242424]">
              {formatPrice(product.price, currency)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#777777] line-through">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1" aria-label="Available colors">
            {product.colors.slice(0, 3).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-2.5 w-2.5 rounded-full border border-[#EAEAEA]"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-[3/4] w-full bg-[#FFFFFF] border border-[#EAEAEA]" />
      <div className="mt-3.5 space-y-2">
        <div className="h-3 w-28 bg-[#EDE6DC]" />
        <div className="h-5 w-4/5 bg-[#FFFFFF]" />
        <div className="h-4 w-24 bg-[#EDE6DC]" />
      </div>
    </div>
  );
}
