import React, { useCallback, useEffect, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { fetchCategories, fetchProducts, type ProductsResponse } from '../lib/api';
import { formatPrice } from '../lib/currency';
import { useRouter } from '../lib/router';
import type { Category, ProductColor } from '../types';

const CATEGORY_TITLES: Record<string, string> = {
  all: 'All Abayas & Modest Couture',
  'black-abayas': 'Black Abayas & Burqa Sets',
  'open-abayas': 'Open & Bisht Abayas',
  'embroidered-abayas': 'Embroidered Abayas',
  'luxury-abayas': 'Luxury Couture Abayas',
  'luxury-collection': 'Luxury Collection',
  'plain-abayas': 'Plain Everyday Abayas',
  'stone-abayas': 'Stone & Crystal Abayas',
  'new-arrivals': 'New Arrivals',
};

const PRICE_PRESETS = [
  { label: 'All Prices', min: undefined, max: undefined },
  { label: 'Under ৳750', min: undefined, max: 750 },
  { label: '৳750 – ৳1,200', min: 750, max: 1200 },
  { label: 'Over ৳1,200', min: 1200, max: undefined },
];

export function CollectionsPage({ categorySlug = 'all' }: { categorySlug?: string }) {
  const { currency } = useStore();
  const { search: urlSearch, navigate } = useRouter();

  const initialSearchQuery = new URLSearchParams(urlSearch).get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categorySlug);
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState<Category[]>([]);
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory(categorySlug || 'all');
    setPage(1);
  }, [categorySlug]);

  useEffect(() => {
    const q = new URLSearchParams(urlSearch).get('search') || '';
    setSearchTerm(q);
    setPage(1);
  }, [urlSearch]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchProducts({
        category: selectedCategory,
        search: searchTerm || undefined,
        minPrice,
        maxPrice,
        color: selectedColors,
        material: selectedMaterials,
        size: selectedSizes,
        availability: inStockOnly ? 'in-stock' : 'all',
        sort,
        page,
        limit: 12,
      });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load collection.');
    } finally {
      setLoading(false);
    }
  }, [
    selectedCategory,
    searchTerm,
    minPrice,
    maxPrice,
    selectedColors,
    selectedMaterials,
    selectedSizes,
    inStockOnly,
    sort,
    page,
  ]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const toggleItem = (list: string[], value: string, setter: (v: string[]) => void) => {
    setPage(1);
    setter(list.includes(value) ? list.filter((i) => i !== value) : [...list, value]);
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setSort('newest');
    setPage(1);
    navigate('/collections');
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchTerm ? 1 : 0) +
    (minPrice !== undefined || maxPrice !== undefined ? 1 : 0) +
    selectedColors.length +
    selectedMaterials.length +
    selectedSizes.length +
    (inStockOnly ? 1 : 0);

  const facets = data?.facets;

  const filterSidebarContent = (
    <div className="space-y-8">
      {/* Category / Abaya Type */}
      <div>
        <h3 className="text-xs font-semibold tracking-widest uppercase text-[#242424]">
          Abaya Type
        </h3>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setPage(1);
                navigate('/collections');
              }}
              className={`w-full text-left transition-colors ${
                selectedCategory === 'all'
                  ? 'font-semibold text-[#A88C70]'
                  : 'text-[#777777] hover:text-[#242424]'
              }`}
            >
              All Abayas
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('new-arrivals');
                setPage(1);
                navigate('/collections/new-arrivals');
              }}
              className={`w-full text-left transition-colors ${
                selectedCategory === 'new-arrivals'
                  ? 'font-semibold text-[#A88C70]'
                  : 'text-[#777777] hover:text-[#242424]'
              }`}
            >
              New Arrivals
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('luxury-collection');
                setPage(1);
                navigate('/collections/luxury-collection');
              }}
              className={`w-full text-left transition-colors ${
                selectedCategory === 'luxury-collection'
                  ? 'font-semibold text-[#A88C70]'
                  : 'text-[#777777] hover:text-[#242424]'
              }`}
            >
              Luxury Collection
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setPage(1);
                  navigate(`/collections/${cat.slug}`);
                }}
                className={`flex w-full items-center justify-between text-left transition-colors ${
                  selectedCategory === cat.slug
                    ? 'font-semibold text-[#A88C70]'
                    : 'text-[#777777] hover:text-[#242424]'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs tabular-nums">{cat.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="border-t border-[#EAEAEA] pt-6">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-[#242424]">
          Price Range
        </h3>
        <div className="mt-3 space-y-2">
          {PRICE_PRESETS.map((preset) => {
            const active = minPrice === preset.min && maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setMinPrice(preset.min);
                  setMaxPrice(preset.max);
                  setPage(1);
                }}
                className={`block w-full text-left text-sm transition-colors ${
                  active ? 'font-semibold text-[#A88C70]' : 'text-[#777777] hover:text-[#242424]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min BDT"
            value={minPrice ?? ''}
            onChange={(e) => {
              setMinPrice(e.target.value ? Number(e.target.value) : undefined);
              setPage(1);
            }}
            className="w-full border border-[#EAEAEA] px-2.5 py-1.5 text-xs text-[#242424] tabular-nums focus:border-[#A88C70] focus:outline-none"
          />
          <span className="text-[#777777]">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max BDT"
            value={maxPrice ?? ''}
            onChange={(e) => {
              setMaxPrice(e.target.value ? Number(e.target.value) : undefined);
              setPage(1);
            }}
            className="w-full border border-[#EAEAEA] px-2.5 py-1.5 text-xs text-[#242424] tabular-nums focus:border-[#A88C70] focus:outline-none"
          />
        </div>
        {(minPrice !== undefined || maxPrice !== undefined) && (
          <p className="mt-2 text-[11px] text-[#777777] tabular-nums">
            Range: {minPrice ? formatPrice(minPrice, currency) : 'Any'} –{' '}
            {maxPrice ? formatPrice(maxPrice, currency) : 'Any'}
          </p>
        )}
      </div>

      {/* Color Filter */}
      {facets?.colors && (
        <div className="border-t border-[#EAEAEA] pt-6">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-[#242424]">
            Color
          </h3>
          <div className="mt-3 space-y-2">
            {facets.colors.map((c: ProductColor) => {
              const checked = selectedColors.includes(c.name);
              return (
                <label
                  key={c.name}
                  className="flex cursor-pointer items-center gap-2.5 text-sm text-[#242424]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleItem(selectedColors, c.name, setSelectedColors)}
                    className="h-3.5 w-3.5 accent-[#242424]"
                  />
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-[#EAEAEA]"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className={checked ? 'font-medium' : 'text-[#777777]'}>{c.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Material Filter */}
      {facets?.materials && (
        <div className="border-t border-[#EAEAEA] pt-6">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-[#242424]">
            Material
          </h3>
          <div className="mt-3 space-y-2">
            {facets.materials.map((mat) => {
              const checked = selectedMaterials.includes(mat);
              return (
                <label
                  key={mat}
                  className="flex cursor-pointer items-center gap-2.5 text-sm text-[#242424]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleItem(selectedMaterials, mat, setSelectedMaterials)}
                    className="h-3.5 w-3.5 accent-[#242424]"
                  />
                  <span className={checked ? 'font-medium' : 'text-[#777777]'}>{mat}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Filter */}
      <div className="border-t border-[#EAEAEA] pt-6">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-[#242424]">
          Abaya Length (Size)
        </h3>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {['50', '52', '54', '56', '58', '60'].map((size) => {
            const active = selectedSizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleItem(selectedSizes, size, setSelectedSizes)}
                className={`border py-2 text-xs font-medium tabular-nums transition-colors ${
                  active
                    ? 'border-[#242424] bg-[#242424] text-white'
                    : 'border-[#EAEAEA] bg-white text-[#242424] hover:border-[#242424]'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="border-t border-[#EAEAEA] pt-6">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-[#242424]">
          Availability
        </h3>
        <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-[#242424]">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => {
              setInStockOnly(e.target.checked);
              setPage(1);
            }}
            className="h-3.5 w-3.5 accent-[#242424]"
          />
          <span className="text-[#777777]">In Stock Only</span>
        </label>
      </div>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <div className="border-t border-[#EAEAEA] pt-6">
          <button
            type="button"
            onClick={clearAllFilters}
            className="w-full border border-[#242424] py-2.5 text-xs font-medium tracking-widest uppercase text-[#242424] transition-colors hover:bg-[#242424] hover:text-white"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white">
      {/* Collection Header */}
      <div className="border-b border-[#EAEAEA] bg-[#FFFFFF] py-12">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#A88C70]">
            Qasida Collection
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl text-[#242424]">
            {searchTerm
              ? `Search: “${searchTerm}”`
              : CATEGORY_TITLES[selectedCategory] || 'Abaya Collection'}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#777777]">
            Discover thoughtfully tailored abayas, open bishts, and breathable silk burqa
            ensembles crafted in limited seasonal batches.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8">
        {/* Toolbar: Filter toggle (mobile), Product count, Sort */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#EAEAEA] pb-5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 border border-[#EAEAEA] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#242424] lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>
            <p className="text-sm text-[#777777] tabular-nums">
              {loading
                ? 'Loading pieces...'
                : `Showing ${data?.products.length ?? 0} of ${data?.total ?? 0} pieces`}
            </p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="hidden sm:inline-block text-xs font-medium underline underline-offset-4 text-[#A88C70] hover:text-[#242424]"
              >
                Clear All Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sort-select" className="text-xs uppercase tracking-wider text-[#777777]">
              Sort by
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as typeof sort);
                setPage(1);
              }}
              className="border border-[#EAEAEA] bg-white px-3 py-2 text-xs font-medium text-[#242424] focus:border-[#A88C70] focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Popularity</option>
            </select>
          </div>
        </div>

        {/* Main 2-Column Layout: Left Sidebar + Right Product Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            {filterSidebarContent}
          </aside>

          <main className="lg:col-span-9">
            {error ? (
              <div className="border border-[#EAEAEA] bg-[#FFFFFF] p-10 text-center">
                <p className="font-serif text-2xl text-[#242424]">Unable to load collection</p>
                <p className="mt-2 text-sm text-[#777777]">{error}</p>
                <button
                  type="button"
                  onClick={loadProducts}
                  className="mt-5 bg-[#242424] px-6 py-2.5 text-xs font-medium tracking-widest uppercase text-white"
                >
                  Retry
                </button>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : !data || data.products.length === 0 ? (
              <div className="border border-[#EAEAEA] bg-[#FFFFFF] p-12 text-center">
                <p className="font-serif text-2xl text-[#242424]">
                  No abayas match your current filters
                </p>
                <p className="mt-2 text-sm text-[#777777]">
                  Try clearing one or more filters to explore our full 24-piece collection.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-6 bg-[#242424] px-7 py-3 text-xs font-medium tracking-widest uppercase text-white hover:bg-[#A88C70]"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                  {data.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <nav
                    aria-label="Collection pagination"
                    className="mt-12 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 border-t border-[#EAEAEA] pt-8"
                  >
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="border border-[#EAEAEA] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#242424] disabled:opacity-40 hover:border-[#242424]"
                    >
                      Previous
                    </button>

                    {Array.from({ length: data.totalPages }).map((_, idx) => {
                      const p = idx + 1;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPage(p)}
                          className={`h-9 w-9 border text-xs font-medium tabular-nums transition-colors ${
                            page === p
                              ? 'border-[#242424] bg-[#242424] text-white'
                              : 'border-[#EAEAEA] text-[#242424] hover:border-[#242424]'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      disabled={page >= data.totalPages}
                      onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                      className="border border-[#EAEAEA] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#242424] disabled:opacity-40 hover:border-[#242424]"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/45"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative z-10 flex h-full w-80 max-w-[88vw] flex-col bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4 mb-6">
              <span className="font-serif text-xl text-[#242424]">Refine Collection</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="flex h-9 w-9 items-center justify-center text-[#242424]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterSidebarContent}
          </div>
        </div>
      )}
    </div>
  );
}
