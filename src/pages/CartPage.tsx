import React from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { useStore } from '../context/StoreContext';
import { formatPrice, FREE_SHIPPING_THRESHOLD_BDT } from '../lib/currency';
import { Link, useRouter } from '../lib/router';

export function CartPage() {
  const {
    cart,
    subtotalBdt,
    shippingBdt,
    totalBdt,
    currency,
    removeFromCart,
    updateCartQuantity,
    updateCartItemVariant,
  } = useStore();
  const { navigate } = useRouter();

  return (
    <div className="bg-white">
      <div className="border-b border-[#EAEAEA] bg-[#FFFFFF] py-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#A88C70]">
            Atelier Bag
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-[#242424]">
            Shopping Bag
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8">
        {cart.length === 0 ? (
          <div className="border border-[#EAEAEA] bg-[#FFFFFF] px-6 py-16 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-[#A88C70] stroke-[1.25]" />
            <h2 className="mt-4 font-serif text-3xl text-[#242424]">
              Your shopping bag is empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#777777]">
              Explore our signature black Nida abayas, open silk bishts, and hand-embroidered
              pieces.
            </p>
            <Link
              to="/collections"
              className="mt-7 inline-flex items-center gap-2 bg-[#242424] px-8 py-3.5 text-xs font-medium tracking-widest uppercase text-white transition-colors hover:bg-[#A88C70]"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
            {/* Cart Items Table */}
            <div className="lg:col-span-8">
              <div className="hidden sm:grid grid-cols-12 border-b border-[#EAEAEA] pb-3 text-[11px] font-semibold uppercase tracking-widest text-[#777777]">
                <span className="col-span-6">Piece</span>
                <span className="col-span-2 text-center">Quantity</span>
                <span className="col-span-2 text-right">Unit Price</span>
                <span className="col-span-2 text-right">Total</span>
              </div>

              <ul className="divide-y divide-[#EAEAEA]">
                {cart.map((item) => (
                  <li
                    key={item.cartItemId}
                    className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-12 sm:items-center"
                  >
                    <div className="sm:col-span-6 flex gap-4">
                      <Link
                        to={`/product/${item.productId}`}
                        className="h-28 w-20 shrink-0 overflow-hidden border border-[#EAEAEA] bg-[#FFFFFF]"
                      >
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-top"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] uppercase tracking-wider text-[#777777]">
                          {item.sku}
                        </p>
                        <Link
                          to={`/product/${item.productId}`}
                          className="mt-1 block font-serif text-lg text-[#242424] hover:text-[#A88C70]"
                        >
                          {item.name}
                        </Link>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <select
                            value={item.selectedColor.name}
                            onChange={(e) => {
                              const color = item.availableColors.find(
                                (c) => c.name === e.target.value
                              );
                              if (color) updateCartItemVariant(item.cartItemId, { color });
                            }}
                            aria-label="Select color"
                            className="border border-[#EAEAEA] bg-white px-2.5 py-1 text-xs text-[#242424] focus:border-[#A88C70] focus:outline-none"
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
                            aria-label="Select size"
                            className="border border-[#EAEAEA] bg-white px-2.5 py-1 text-xs text-[#242424] focus:border-[#A88C70] focus:outline-none"
                          >
                            {item.availableSizes.map((s) => (
                              <option key={s} value={s}>
                                Size {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#777777] hover:text-[#242424]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2 flex sm:justify-center">
                      <div className="inline-flex items-center border border-[#EAEAEA]">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="flex h-9 w-9 items-center justify-center hover:bg-[#FFFFFF]"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-9 text-center text-xs font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="flex h-9 w-9 items-center justify-center hover:bg-[#FFFFFF]"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2 flex justify-between sm:justify-end text-sm text-[#777777] tabular-nums">
                      <span className="sm:hidden">Unit Price:</span>
                      <span>{formatPrice(item.price, currency)}</span>
                    </div>

                    <div className="sm:col-span-2 flex justify-between sm:justify-end text-sm font-semibold text-[#242424] tabular-nums">
                      <span className="sm:hidden">Total:</span>
                      <span>{formatPrice(item.price * item.quantity, currency)}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-[#EAEAEA] pt-6">
                <Link
                  to="/collections"
                  className="text-xs font-medium tracking-widest uppercase text-[#242424] underline underline-offset-4 hover:text-[#A88C70]"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary Card */}
            <aside className="lg:col-span-4 border border-[#EAEAEA] bg-[#FFFFFF] p-6 sm:p-8">
              <h2 className="font-serif text-2xl text-[#242424]">Order Summary</h2>
              <div className="mt-6 space-y-3 border-b border-[#EAEAEA] pb-5 text-sm">
                <div className="flex justify-between text-[#777777]">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-[#242424]">
                    {formatPrice(subtotalBdt, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-[#777777]">
                  <span>Delivery Charge</span>
                  <span className="tabular-nums text-[#242424]">
                    {shippingBdt === 0 ? 'Complimentary' : formatPrice(shippingBdt, currency)}
                  </span>
                </div>
                {subtotalBdt < FREE_SHIPPING_THRESHOLD_BDT && (
                  <p className="text-xs text-[#A88C70]">
                    Add{' '}
                    <span className="font-semibold tabular-nums">
                      {formatPrice(FREE_SHIPPING_THRESHOLD_BDT - subtotalBdt, currency)}
                    </span>{' '}
                    more for complimentary express shipping.
                  </p>
                )}
              </div>

              <div className="mt-5 flex justify-between text-base font-semibold text-[#242424]">
                <span>Total Amount</span>
                <span className="tabular-nums">{formatPrice(totalBdt, currency)}</span>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="mt-6 flex w-full items-center justify-center gap-2 bg-[#242424] px-6 py-4 text-xs font-medium tracking-widest uppercase text-white transition-colors hover:bg-[#A88C70]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-center text-[11px] text-[#777777]">
                Includes complimentary gift box &amp; protective garment bag.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
