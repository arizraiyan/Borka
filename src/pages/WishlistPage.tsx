import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { fetchProducts } from '../lib/api';
import { Link } from '../lib/router';
import type { Product } from '../types';

export function WishlistPage() {
  const { wishlist } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchProducts({ limit: 48 })
      .then((res) => {
        if (!active) return;
        setProducts(res.products.filter((p) => wishlist.includes(p.id)));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [wishlist]);

  return (
    <div className="bg-white">
      <div className="border-b border-[#EAEAEA] bg-[#FFFFFF] py-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#A88C70]">
            Curated Favourites
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-[#242424]">
            Saved Wishlist ({wishlist.length})
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="border border-[#EAEAEA] bg-[#FFFFFF] px-6 py-16 text-center">
            <Heart className="mx-auto h-10 w-10 text-[#A88C70] stroke-[1.25]" />
            <h2 className="mt-4 font-serif text-3xl text-[#242424]">
              No saved pieces yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#777777]">
              Tap the heart icon on any abaya or burqa ensemble to keep it in your private wishlist.
            </p>
            <Link
              to="/collections"
              className="mt-7 inline-block bg-[#242424] px-8 py-3.5 text-xs font-medium tracking-widest uppercase text-white hover:bg-[#A88C70]"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
