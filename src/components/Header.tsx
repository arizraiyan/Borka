import React, { useState } from 'react';
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Link, useRouter } from '../lib/router';
import type { CurrencyCode, LanguageCode } from '../types';

const COLLECTION_LINKS = [
  { label: 'All Abayas', to: '/collections' },
  { label: 'Black Abayas', to: '/collections/black-abayas' },
  { label: 'Open Abayas', to: '/collections/open-abayas' },
  { label: 'Embroidered Abayas', to: '/collections/embroidered-abayas' },
  { label: 'Luxury Collection', to: '/collections/luxury-collection' },
  { label: 'Plain Abayas', to: '/collections/plain-abayas' },
  { label: 'Stone Abayas', to: '/collections/stone-abayas' },
  { label: 'New Arrivals', to: '/collections/new-arrivals' },
];

export function Header() {
  const {
    cartCount,
    wishlist,
    currency,
    language,
    setCurrency,
    setLanguage,
    openCart,
    openSearch,
  } = useStore();
  const { pathname } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsHover, setCollectionsHover] = useState(false);

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-40 w-full bg-white">
      {/* 1. Top Announcement Bar (compact <=36px) */}
      <div className="bg-[#242424] text-white text-[11px] tracking-wider">
        <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
          <p className="hidden md:block text-[#EDE6DC] whitespace-nowrap truncate">
            {language === 'ar'
              ? 'شحن مجاني للطلبات فوق ৳650 · Dhaka House Building, Uttara, Dhaka, Bangladesh'
              : 'Complimentary Express Shipping Over ৳650 · Dhaka House Building, Uttara, Dhaka, Bangladesh'}
          </p>
          <p className="md:hidden min-w-0 flex-1 text-[#EDE6DC] truncate">
            Free Shipping Over ৳650 · Uttara, Dhaka
          </p>

          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <label className="flex items-center gap-1.5 text-white/90">
              <span className="sr-only">Currency</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                aria-label="Select currency"
                className="bg-transparent text-[11px] font-medium uppercase tracking-wider text-white focus:outline-none cursor-pointer"
              >
                <option value="BDT" className="text-[#242424]">BDT (৳)</option>
              </select>
            </label>

            <span className="h-3 w-px bg-white/20" aria-hidden="true" />

            <div className="flex items-center gap-1.5">
              {(['en', 'ar'] as LanguageCode[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`uppercase text-[11px] transition-colors whitespace-nowrap ${
                    language === lang
                      ? 'font-semibold text-[#A88C70]'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="border-b border-[#EAEAEA] bg-white">
        <div className="mx-auto flex h-14 sm:h-16 max-w-[1440px] items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile Menu + Brand Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-10 w-10 items-center justify-center text-[#242424] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              to="/"
              className="font-serif text-xl sm:text-2xl font-semibold tracking-[0.18em] sm:tracking-[0.22em] uppercase text-[#242424] whitespace-nowrap shrink-0"
            >
              QASIDA
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-4 xl:gap-7 text-xs xl:text-[13px] font-medium tracking-wide text-[#242424]"
          >
            <Link
              to="/"
              className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#A88C70] ${
                isActive('/') && pathname === '/' ? 'text-[#A88C70]' : ''
              }`}
            >
              Home
            </Link>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCollectionsHover(true)}
              onMouseLeave={() => setCollectionsHover(false)}
            >
              <Link
                to="/collections"
                className={`flex items-center gap-1 whitespace-nowrap shrink-0 py-5 transition-colors hover:text-[#A88C70] ${
                  isActive('/collections') ? 'text-[#A88C70]' : ''
                }`}
              >
                <span>Abayas</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Link>

              {collectionsHover && (
                <div className="absolute left-0 top-full w-60 border border-[#EAEAEA] bg-white py-2 shadow-sm">
                  {COLLECTION_LINKS.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setCollectionsHover(false)}
                      className="block px-5 py-2 text-[13px] text-[#242424] transition-colors hover:bg-[#FFFFFF] hover:text-[#A88C70]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/collections/open-abayas"
              className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#A88C70] ${
                pathname === '/collections/open-abayas' ? 'text-[#A88C70]' : ''
              }`}
            >
              Open Abayas
            </Link>

            <Link
              to="/collections/embroidered-abayas"
              className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#A88C70] ${
                pathname === '/collections/embroidered-abayas' ? 'text-[#A88C70]' : ''
              }`}
            >
              Embroidered
            </Link>

            <Link
              to="/collections/luxury-collection"
              className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#A88C70] ${
                pathname === '/collections/luxury-collection' ? 'text-[#A88C70]' : ''
              }`}
            >
              Luxury Collection
            </Link>

            <Link
              to="/collections/new-arrivals"
              className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#A88C70] ${
                pathname === '/collections/new-arrivals' ? 'text-[#A88C70]' : ''
              }`}
            >
              New Arrivals
            </Link>

            <Link
              to="/blog"
              className={`whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#A88C70] ${
                isActive('/blog') ? 'text-[#A88C70]' : ''
              }`}
            >
              Journal
            </Link>
          </nav>

          {/* Right: Utility Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search abayas"
              className="flex h-10 w-10 items-center justify-center text-[#242424] transition-colors hover:text-[#A88C70]"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            <Link
              to="/account"
              ariaLabel="Client account and orders"
              className="hidden sm:flex h-10 w-10 items-center justify-center text-[#242424] transition-colors hover:text-[#A88C70]"
            >
              <User className="h-[18px] w-[18px]" />
            </Link>

            <Link
              to="/wishlist"
              ariaLabel="Wishlist"
              className="relative flex h-10 w-10 items-center justify-center text-[#242424] transition-colors hover:text-[#A88C70]"
            >
              <Heart className="h-[18px] w-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute right-1 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A88C70] px-1 text-[10px] font-semibold text-white tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label="Open shopping bag"
              className="relative flex h-10 items-center gap-2 px-2 text-[#242424] transition-colors hover:text-[#A88C70]"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              <span className="text-xs font-medium tabular-nums">
                ({cartCount})
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 flex h-full w-80 max-w-[85vw] flex-col bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
              <span className="font-serif text-xl font-semibold tracking-[0.2em] uppercase">
                QASIDA
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-10 w-10 items-center justify-center text-[#242424]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm font-medium text-[#242424] border-b border-[#EAEAEA]/60"
              >
                Home
              </Link>
              {COLLECTION_LINKS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm text-[#242424] border-b border-[#EAEAEA]/60"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/blog"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm text-[#242424] border-b border-[#EAEAEA]/60"
              >
                Editorial Journal
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm text-[#242424] border-b border-[#EAEAEA]/60"
              >
                Our Atelier
              </Link>
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm text-[#242424] border-b border-[#EAEAEA]/60"
              >
                Account & Orders
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm text-[#242424] border-b border-[#EAEAEA]/60"
              >
                Wishlist ({wishlist.length})
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm font-medium text-[#A88C70]"
              >
                Shopping Bag ({cartCount})
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
