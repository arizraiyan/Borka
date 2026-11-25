/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { CartDrawer } from './components/CartDrawer';
import { FloatingUtilities } from './components/FloatingUtilities';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { StoreProvider } from './context/StoreContext';
import { RouterProvider, useRouter } from './lib/router';
import { AccountPage } from './pages/AccountPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { AboutPage, BlogPage, NotFoundPage } from './pages/EditorialPages';
import { HomePage } from './pages/HomePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { WishlistPage } from './pages/WishlistPage';

function AppRoutes() {
  const { pathname } = useRouter();
  const cleanPath = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';

  if (cleanPath === '/') {
    return <HomePage />;
  }

  if (cleanPath === '/collections') {
    return <CollectionsPage categorySlug="all" />;
  }

  if (cleanPath.startsWith('/collections/')) {
    const slug = cleanPath.replace('/collections/', '');
    return <CollectionsPage categorySlug={slug} />;
  }

  if (cleanPath.startsWith('/product/')) {
    const productId = cleanPath.replace('/product/', '');
    return <ProductDetailsPage productId={productId} />;
  }

  if (cleanPath === '/cart') {
    return <CartPage />;
  }

  if (cleanPath === '/checkout') {
    return <CheckoutPage />;
  }

  if (cleanPath === '/wishlist') {
    return <WishlistPage />;
  }

  if (cleanPath === '/account' || cleanPath === '/orders') {
    return <AccountPage />;
  }

  if (cleanPath === '/blog') {
    return <BlogPage />;
  }

  if (cleanPath === '/about') {
    return <AboutPage />;
  }

  return <NotFoundPage />;
}

export default function App() {
  return (
    <StoreProvider>
      <RouterProvider>
        <div className="flex min-h-screen w-full flex-col bg-white text-[#242424]">
          <Header />
          <main className="flex-1 min-w-0 w-full">
            <AppRoutes />
          </main>
          <Footer />
          <CartDrawer />
          <SearchModal />
          <QuickViewModal />
          <FloatingUtilities />
        </div>
      </RouterProvider>
    </StoreProvider>
  );
}
