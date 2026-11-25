import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Lock, Package, Truck } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { useStore } from '../context/StoreContext';
import { submitOrder } from '../lib/api';
import { formatPrice } from '../lib/currency';
import { Link } from '../lib/router';
import type { Order, OrderCustomer, PaymentMethod } from '../types';

export function CheckoutPage() {
  const {
    cart,
    subtotalBdt,
    shippingBdt,
    totalBdt,
    currency,
    clearCart,
    recordOrder,
    showToast,
  } = useStore();

  const [customer, setCustomer] = useState<OrderCustomer>({
    fullName: '',
    phone: '',
    email: '',
    country: 'Bangladesh',
    city: '',
    area: '',
    address: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [errors, setErrors] = useState<Partial<Record<keyof OrderCustomer, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const validate = (): boolean => {
    const next: Partial<Record<keyof OrderCustomer, string>> = {};
    if (customer.fullName.trim().length < 3) next.fullName = 'Please enter your full name.';
    if (customer.phone.trim().length < 7) next.phone = 'Please enter a valid contact phone number.';
    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (!customer.country.trim()) next.country = 'Country is required.';
    if (!customer.city.trim()) next.city = 'City is required.';
    if (!customer.area.trim()) next.area = 'Area or district is required.';
    if (customer.address.trim().length < 6) next.address = 'Please enter your full delivery address.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) {
      showToast('Please complete the highlighted delivery details.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const order = await submitOrder({
        customer,
        items: cart.map((item) => ({
          productId: item.productId,
          color: item.selectedColor.name,
          size: item.selectedSize,
          quantity: item.quantity,
        })),
        paymentMethod,
        currency,
      });

      recordOrder(order);
      clearCart();
      setConfirmedOrder(order);
      showToast(`Order ${order.orderId} confirmed!`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Unable to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  // Order Success View
  if (confirmedOrder) {
    return (
      <div className="bg-[#FFFFFF] py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          <div className="border border-[#EAEAEA] bg-white p-8 sm:p-12">
            <div className="flex flex-col items-center text-center border-b border-[#EAEAEA] pb-8">
              <CheckCircle2 className="h-12 w-12 text-[#A88C70] stroke-[1.5]" />
              <p className="mt-4 text-[11px] font-semibold tracking-[0.22em] uppercase text-[#A88C70]">
                Order Confirmed
              </p>
              <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-[#242424]">
                Thank You, {confirmedOrder.customer.fullName}
              </h1>
              <p className="mt-2 text-sm text-[#777777]">
                Order <span className="font-semibold text-[#242424] tabular-nums">{confirmedOrder.orderId}</span> has been
                received by our Atelier at Dhaka House Building, Uttara, Dhaka, Bangladesh and is preparing for dispatch.
              </p>
            </div>

            {/* Delivery & Payment Summary */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 text-sm border-b border-[#EAEAEA] pb-8">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#777777]">
                  Delivery Destination
                </h2>
                <p className="mt-2 font-medium text-[#242424]">{confirmedOrder.customer.fullName}</p>
                <p className="text-[#777777]">{confirmedOrder.customer.phone}</p>
                {confirmedOrder.customer.email && (
                  <p className="text-[#777777]">{confirmedOrder.customer.email}</p>
                )}
                <p className="mt-1 text-[#777777]">
                  {confirmedOrder.customer.address}, {confirmedOrder.customer.area},{' '}
                  {confirmedOrder.customer.city}, {confirmedOrder.customer.country}
                </p>
                {confirmedOrder.customer.notes && (
                  <p className="mt-2 text-xs text-[#A88C70]">
                    Note: {confirmedOrder.customer.notes}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#777777]">
                  Order Details
                </h2>
                <dl className="mt-2 space-y-1.5">
                  <div className="flex justify-between">
                    <dt className="text-[#777777]">Order Reference</dt>
                    <dd className="font-semibold text-[#242424] tabular-nums">
                      {confirmedOrder.orderId}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#777777]">Status</dt>
                    <dd className="text-[#242424]">{confirmedOrder.status}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#777777]">Payment Method</dt>
                    <dd className="text-[#242424]">
                      {confirmedOrder.paymentMethod === 'cod'
                        ? 'Cash on Delivery'
                        : 'Manual Bank Transfer (Demo)'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Line Items */}
            <div className="mt-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#777777]">
                Pieces Ordered
              </h2>
              <ul className="mt-4 divide-y divide-[#EAEAEA]">
                {confirmedOrder.items.map((item, idx) => (
                  <li key={`${item.productId}-${idx}`} className="flex items-center gap-4 py-4">
                    <div className="h-20 w-16 shrink-0 overflow-hidden border border-[#EAEAEA] bg-[#FFFFFF]">
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-base text-[#242424]">{item.name}</p>
                      <p className="text-xs text-[#777777]">
                        {item.sku} · Color: {item.color} · Size: {item.size} · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#242424] tabular-nums">
                      {formatPrice(item.lineTotal, currency)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-2 border-t border-[#EAEAEA] pt-5 text-sm">
                <div className="flex justify-between text-[#777777]">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-[#242424]">
                    {formatPrice(confirmedOrder.subtotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-[#777777]">
                  <span>Delivery Charge</span>
                  <span className="tabular-nums text-[#242424]">
                    {confirmedOrder.shippingFee === 0
                      ? 'Complimentary'
                      : formatPrice(confirmedOrder.shippingFee, currency)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#EAEAEA] pt-3 text-base font-semibold text-[#242424]">
                  <span>Grand Total</span>
                  <span className="tabular-nums">
                    {formatPrice(confirmedOrder.total, currency)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4 pt-4">
              <Link
                to="/collections"
                className="bg-[#242424] px-7 py-3.5 text-xs font-medium tracking-widest uppercase text-white hover:bg-[#A88C70]"
              >
                Continue Shopping
              </Link>
              <Link
                to="/account"
                className="border border-[#242424] px-7 py-3.5 text-xs font-medium tracking-widest uppercase text-[#242424] hover:bg-[#EDE6DC]"
              >
                View Order History
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <Package className="mx-auto h-10 w-10 text-[#A88C70] stroke-[1.25]" />
        <h1 className="mt-4 font-serif text-3xl text-[#242424]">Your bag is empty</h1>
        <p className="mt-2 text-sm text-[#777777]">
          Select an abaya from our collections before proceeding to checkout.
        </p>
        <Link
          to="/collections"
          className="mt-6 inline-flex items-center gap-2 bg-[#242424] px-7 py-3.5 text-xs font-medium tracking-widest uppercase text-white"
        >
          <span>Explore Collections</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  const updateField = (field: keyof OrderCustomer, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="bg-white">
      <div className="border-b border-[#EAEAEA] bg-[#FFFFFF] py-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#A88C70]">
            Private Client Checkout
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-[#242424]">
            Delivery &amp; Order Confirmation
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          {/* Left: Customer & Payment Form */}
          <div className="lg:col-span-7 space-y-10">
            {apiError && (
              <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                {apiError}
              </div>
            )}

            <section>
              <h2 className="font-serif text-2xl text-[#242424] border-b border-[#EAEAEA] pb-3">
                01. Client Delivery Details
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#242424]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="e.g., Tasnim Rahman"
                    className="mt-2 w-full border border-[#EAEAEA] px-4 py-3 text-sm text-[#242424] focus:border-[#A88C70] focus:outline-none"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-700">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#242424]">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="mt-2 w-full border border-[#EAEAEA] px-4 py-3 text-sm text-[#242424] focus:border-[#A88C70] focus:outline-none"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-700">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#242424]">
                    Email Address <span className="text-[#777777] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="client@example.com"
                    className="mt-2 w-full border border-[#EAEAEA] px-4 py-3 text-sm text-[#242424] focus:border-[#A88C70] focus:outline-none"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#242424]">
                    Country *
                  </label>
                  <select
                    value={customer.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    className="mt-2 w-full border border-[#EAEAEA] bg-white px-4 py-3 text-sm text-[#242424] focus:border-[#A88C70] focus:outline-none"
                  >
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Other International">Other International</option>
                  </select>
                  {errors.country && <p className="mt-1 text-xs text-red-700">{errors.country}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#242424]">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="e.g., Dhaka / Chattogram / Sylhet"
                    className="mt-2 w-full border border-[#EAEAEA] px-4 py-3 text-sm text-[#242424] focus:border-[#A88C70] focus:outline-none"
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-700">{errors.city}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#242424]">
                    Area / District *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.area}
                    onChange={(e) => updateField('area', e.target.value)}
                    placeholder="e.g., Uttara / Gulshan / Banani"
                    className="mt-2 w-full border border-[#EAEAEA] px-4 py-3 text-sm text-[#242424] focus:border-[#A88C70] focus:outline-none"
                  />
                  {errors.area && <p className="mt-1 text-xs text-red-700">{errors.area}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#242424]">
                    Full Delivery Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Villa / Building number, street name, landmark"
                    className="mt-2 w-full border border-[#EAEAEA] px-4 py-3 text-sm text-[#242424] focus:border-[#A88C70] focus:outline-none"
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-700">{errors.address}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#242424]">
                    Additional Order Notes{' '}
                    <span className="text-[#777777] font-normal">(Tailoring or delivery preferences)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={customer.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Optional sleeve adjustment note or preferred courier time window..."
                    className="mt-2 w-full border border-[#EAEAEA] px-4 py-3 text-sm text-[#242424] focus:border-[#A88C70] focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="font-serif text-2xl text-[#242424] border-b border-[#EAEAEA] pb-3">
                02. Payment Preference
              </h2>

              <div className="mt-5 space-y-3">
                <label
                  className={`flex cursor-pointer items-start gap-4 border p-5 transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-[#242424] bg-[#FFFFFF]'
                      : 'border-[#EAEAEA] bg-white hover:border-[#A88C70]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-[#242424]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#242424]">
                        Cash on Delivery (COD)
                      </span>
                      <Truck className="h-4 w-4 text-[#A88C70]" />
                    </div>
                    <p className="mt-1 text-xs text-[#777777]">
                      Pay directly to our courier upon inspecting your parcel at your doorstep.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-4 border p-5 transition-colors ${
                    paymentMethod === 'manual_transfer'
                      ? 'border-[#242424] bg-[#FFFFFF]'
                      : 'border-[#EAEAEA] bg-white hover:border-[#A88C70]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'manual_transfer'}
                    onChange={() => setPaymentMethod('manual_transfer')}
                    className="mt-1 accent-[#242424]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#242424]">
                        Manual Transfer (Demo Option)
                      </span>
                      <Lock className="h-4 w-4 text-[#A88C70]" />
                    </div>
                    <p className="mt-1 text-xs text-[#777777]">
                      Simulates an instant atelier invoice confirmation without entering card or
                      bank credentials.
                    </p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <aside className="lg:col-span-5 border border-[#EAEAEA] bg-[#FFFFFF] p-6 sm:p-8 lg:sticky lg:top-28">
            <h2 className="font-serif text-2xl text-[#242424]">Order Summary</h2>

            <ul className="mt-6 divide-y divide-[#EAEAEA] max-h-96 overflow-y-auto pr-1">
              {cart.map((item) => (
                <li key={item.cartItemId} className="flex gap-4 py-4">
                  <div className="h-20 w-16 shrink-0 overflow-hidden border border-[#EAEAEA] bg-white">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-base text-[#242424] line-clamp-1">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#777777]">
                      {item.sku} · {item.selectedColor.name} · Size {item.selectedSize}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs tabular-nums">
                      <span className="text-[#777777]">
                        Qty {item.quantity} × {formatPrice(item.price, currency)}
                      </span>
                      <span className="font-semibold text-[#242424]">
                        {formatPrice(item.price * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2.5 border-t border-[#EAEAEA] pt-5 text-sm">
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
              <div className="flex justify-between border-t border-[#EAEAEA] pt-3 text-base font-semibold text-[#242424]">
                <span>Grand Total</span>
                <span className="tabular-nums">{formatPrice(totalBdt, currency)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 bg-[#242424] px-6 py-4 text-xs font-medium tracking-widest uppercase text-white transition-colors hover:bg-[#A88C70] disabled:opacity-60"
            >
              <span>{submitting ? 'Confirming Order...' : 'Complete Order'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </aside>
        </div>
      </form>
    </div>
  );
}
