import React from 'react';
import { Package } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../lib/currency';
import { Link } from '../lib/router';

export function AccountPage() {
  const { orderHistory, wishlist, cartCount, currency } = useStore();

  return (
    <div className="bg-white">
      <div className="border-b border-[#EAEAEA] bg-[#FFFFFF] py-10">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#A88C70]">
            Client Portal
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-[#242424]">
            Account &amp; Order History
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-12">
          <div className="border border-[#EAEAEA] bg-[#FFFFFF] p-6">
            <p className="text-xs uppercase tracking-widest text-[#777777]">Orders Placed</p>
            <p className="mt-2 font-serif text-3xl text-[#242424] tabular-nums">
              {orderHistory.length}
            </p>
          </div>
          <div className="border border-[#EAEAEA] bg-[#FFFFFF] p-6">
            <p className="text-xs uppercase tracking-widest text-[#777777]">Saved Wishlist</p>
            <p className="mt-2 font-serif text-3xl text-[#242424] tabular-nums">
              {wishlist.length}
            </p>
          </div>
          <div className="border border-[#EAEAEA] bg-[#FFFFFF] p-6">
            <p className="text-xs uppercase tracking-widest text-[#777777]">Current Bag</p>
            <p className="mt-2 font-serif text-3xl text-[#242424] tabular-nums">
              {cartCount} {cartCount === 1 ? 'Piece' : 'Pieces'}
            </p>
          </div>
        </div>

        <h2 className="font-serif text-2xl text-[#242424] border-b border-[#EAEAEA] pb-3">
          Recent Orders
        </h2>

        {orderHistory.length === 0 ? (
          <div className="mt-6 border border-[#EAEAEA] bg-[#FFFFFF] p-12 text-center">
            <Package className="mx-auto h-9 w-9 text-[#A88C70] stroke-[1.25]" />
            <p className="mt-3 font-serif text-2xl text-[#242424]">No orders recorded yet</p>
            <p className="mt-1.5 text-sm text-[#777777]">
              Completed orders appear here with full itemized receipts and delivery status.
            </p>
            <Link
              to="/collections"
              className="mt-6 inline-block bg-[#242424] px-7 py-3 text-xs font-medium tracking-widest uppercase text-white hover:bg-[#A88C70]"
            >
              Shop Collections
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {orderHistory.map((order) => (
              <div key={order.orderId} className="border border-[#EAEAEA] bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAEAEA] pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#A88C70] tabular-nums">
                      {order.orderId}
                    </p>
                    <p className="mt-1 text-xs text-[#777777]">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      · {order.customer.city}, {order.customer.country}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-[#777777]">
                      {order.status} · {order.paymentMethod === 'cod' ? 'COD' : 'Manual Transfer'}
                    </p>
                    <p className="mt-1 text-base font-semibold text-[#242424] tabular-nums">
                      {formatPrice(order.total, currency)}
                    </p>
                  </div>
                </div>

                <ul className="mt-4 divide-y divide-[#EAEAEA]">
                  {order.items.map((item, idx) => (
                    <li key={`${item.productId}-${idx}`} className="flex items-center gap-4 py-3">
                      <div className="h-16 w-12 shrink-0 overflow-hidden border border-[#EAEAEA] bg-[#FFFFFF]">
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.productId}`}
                          className="font-serif text-base text-[#242424] hover:text-[#A88C70]"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-[#777777]">
                          {item.color} · Size {item.size} · Qty {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-[#242424] tabular-nums">
                        {formatPrice(item.lineTotal, currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
