import React, { useEffect, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { fetchProducts } from '../lib/api';
import { formatPrice } from '../lib/currency';
import { useRouter } from '../lib/router';
import type { Product } from '../types';
import { SafeImage } from './SafeImage';

export function SearchModal() {
  const { isSearchOpen, closeSearch, currency } = useStore();
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSearchOpen) return;
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetchProducts({
          search: query.trim() || undefined,
          limit: 6,
          sort: query.trim() ? 'popular' : 'newest',
        });
        if (active) setResults(res.products);
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, isSearchOpen]);

  if (!isSearchOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeSearch();
    navigate(query.trim() ? `/collections?search=${encodeURIComponent(query.trim())}` : '/collections');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white/98 backdrop-blur-xs" role="dialog" aria-modal="true" aria-label="Search Catalog">
      <div className="border-b border-[#EAEAEA]">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-5 sm:px-8">
          <Search className="h-5 w-5 text-[#777777] shrink-0" />
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search abayas, burqas, Korean Nida, embroidered, bisht..."
              className="w-full bg-transparent text-lg text-[#242424] placeholder-[#777777] focus:outline-none"
            />
          </form>
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className="flex h-10 w-10 items-center justify-center text-[#242424] hover:text-[#A88C70]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-4 py-8 sm:px-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-medium tracking-widest uppercase text-[#777777]">
            {query.trim() ? `Results for "${query.trim()}"` : 'Curated Suggestions'}
          </p>
          {query.trim() && (
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-[#242424] hover:text-[#A88C70]"
            >
              <span>View All Results</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-28 bg-[#FFFFFF] animate-pulse border border-[#EAEAEA]" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="border border-[#EAEAEA] bg-[#FFFFFF] p-10 text-center">
            <p className="font-serif text-2xl text-[#242424]">No matching pieces found</p>
            <p className="mt-2 text-sm text-[#777777]">
              Try searching for Korean Nida, Open Abaya, Zari, Pearl, or Burqa.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {results.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  closeSearch();
                  navigate(`/product/${product.id}`);
                }}
                className="flex items-center gap-4 border border-[#EAEAEA] bg-white p-3 text-left transition-colors hover:bg-[#FFFFFF]"
              >
                <div className="h-24 w-16 shrink-0 overflow-hidden bg-[#FFFFFF]">
                  <SafeImage
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-wider text-[#777777] truncate">
                    {product.category}
                  </p>
                  <p className="mt-1 font-serif text-base text-[#242424] line-clamp-2">
                    {product.name}
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-[#A88C70] tabular-nums">
                    {formatPrice(product.price, currency)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
