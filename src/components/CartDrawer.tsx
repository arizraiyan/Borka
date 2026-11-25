import React from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, FREE_SHIPPING_THRESHOLD_BDT } from '../lib/currency';
import { Link, useRouter } from '../lib/router';
import { SafeImage } from './SafeImage';

export function CartDrawer() {
  const {
    cart,
    cartCount,
    subtotalBdt,
    shippingBdt,
    totalBdt,
    currency,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateCartQuantity,
    updateCartItemVariant,
  } = useStore();
  const { navigate } = useRouter();

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_BDT - subtotalBdt);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Bag">
      <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={closeCart} />

      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white border-l border-[#EAEAEA]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAEAEA] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-4 w-4 text-[#242424]" />
            <h2 className="font-serif text-xl tracking-wide text-[#242424]">
              Shopping Bag ({cartCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close shopping bag"
            className="flex h-9 w-9 items-center justify-center text-[#777777] hover:text-[#242424]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Shipping threshold progress */}
        {cart.length > 0 && (
          <div className="border-b border-[#EAEAEA] bg-[#FFFFFF] px-6 py-3 text-xs text-[#242424]">
            {remainingForFreeShipping === 0 ? (
              <p>Complimentary Express Shipping unlocked for your order.</p>
            ) : (
              <p>
                Add{' '}
                <span className="font-semibold tabular-nums">
                  {formatPrice(remainingForFreeShipping, currency)}
                </span>{' '}
                more for complimentary express shipping.
              </p>
            )}
          </div>
        )}

        {/* Line Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="h-10 w-10 text-[#A88C70] stroke-[1.25]" />
              <p className="mt-4 font-serif text-2xl text-[#242424]">
                Your bag is currently empty
              </p>
              <p className="mt-2 max-w-xs text-sm text-[#777777]">
                Explore our seasonal abayas, embroidered bishts, and breathable silk sets.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  navigate('/collections');
                }}
                className="mt-6 bg-[#242424] px-6 py-3 text-xs font-medium tracking-widest uppercase text-white transition-colors hover:bg-[#A88C70]"
              >
                Explore Collections
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#EAEAEA]">
              {cart.map((item) => (
                <li key={item.cartItemId} className="flex gap-4 py-5">
                  <Link
                    to={`/product/${item.productId}`}
                    onClick={closeCart}
                    className="h-28 w-20 shrink-0 overflow-hidden bg-[#FFFFFF] border border-[#EAEAEA]"
                  >
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-top"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.productId}`}
                          onClick={closeCart}
                          className="font-serif text-base leading-snug text-[#242424] hover:text-[#A88C70] line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cartItemId)}
                          aria-label={`Remove ${item.name}`}
                          className="text-[#777777] hover:text-[#242424] p-1 shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#777777]">
                        <select
                          value={item.selectedColor.name}
                          onChange={(e) => {
                            const found = item.availableColors.find(
                              (c) => c.name === e.target.value
                            );
                            if (found) updateCartItemVariant(item.cartItemId, { color: found });
                          }}
                          aria-label="Change color"
                          className="border border-[#EAEAEA] bg-white px-2 py-1 text-[11px] text-[#242424] focus:outline-none"
                        >
                          {item.availableColors.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>

                        <select
                          value={item.selectedSize}
                          onChange={(e) =>
                            updateCartItemVariant(item.cartItemId, { size: e.target.value })
                          }
                          aria-label="Change size"
                          className="border border-[#EAEAEA] bg-white px-2 py-1 text-[11px] text-[#242424] focus:outline-none"
                        >
                          {item.availableSizes.map((s) => (
                            <option key={s} value={s}>
                              Size {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-[#EAEAEA]">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center text-[#242424] hover:bg-[#FFFFFF]"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center text-[#242424] hover:bg-[#FFFFFF]"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#242424] tabular-nums">
                        {formatPrice(item.price * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Totals */}
        {cart.length > 0 && (
          <div className="border-t border-[#EAEAEA] bg-[#FFFFFF] px-6 py-5 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#777777]">
                <span>Subtotal</span>
                <span className="tabular-nums text-[#242424]">
                  {formatPrice(subtotalBdt, currency)}
                </span>
              </div>
              <div className="flex justify-between text-[#777777]">
                <span>Express Delivery</span>
                <span className="tabular-nums text-[#242424]">
                  {shippingBdt === 0 ? 'Complimentary' : formatPrice(shippingBdt, currency)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#EAEAEA] pt-2 text-base font-semibold text-[#242424]">
                <span>Estimated Total</span>
                <span className="tabular-nums">{formatPrice(totalBdt, currency)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  navigate('/cart');
                }}
                className="border border-[#242424] bg-white px-4 py-3 text-xs font-medium tracking-widest uppercase text-[#242424] transition-colors hover:bg-[#EDE6DC]"
              >
                View Bag
              </button>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  navigate('/checkout');
                }}
                className="bg-[#242424] px-4 py-3 text-xs font-medium tracking-widest uppercase text-white transition-colors hover:bg-[#A88C70]"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
