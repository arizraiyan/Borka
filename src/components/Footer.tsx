import React from 'react';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from '../lib/router';

export function Footer() {
  return (
    <footer className="w-full border-t border-[#EAEAEA] bg-[#FFFFFF] text-[#242424]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-12 lg:gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-12 lg:col-span-4 lg:pr-6 min-w-0">
            <Link
              to="/"
              className="inline-block font-serif text-xl sm:text-2xl font-semibold tracking-[0.2em] sm:tracking-[0.22em] uppercase text-[#242424]"
            >
              QASIDA
            </Link>
            <p className="mt-3.5 max-w-md text-sm leading-relaxed text-[#777777]">
              Based at Dhaka House Building, Uttara, Dhaka, Bangladesh, QASIDA crafts architectural
              abayas, hand-embroidered bishts, and breathable silk burqas cut from Grade-A Korean
              Nida, Medina Silk, and Japanese Crepe.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[#242424]">
              <a
                href="#instagram"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                aria-label="Instagram"
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#EAEAEA] bg-white transition-colors hover:border-[#A88C70] hover:text-[#A88C70]"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <Link
                to="/about"
                className="text-xs font-medium tracking-widest uppercase underline underline-offset-4 hover:text-[#A88C70]"
              >
                Atelier Heritage
              </Link>
            </div>
          </div>

          {/* Collections */}
          <div className="col-span-1 md:col-span-4 lg:col-span-2 min-w-0">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#242424]">
              Collections
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#777777]">
              <li>
                <Link
                  to="/collections/black-abayas"
                  className="inline-block py-0.5 hover:text-[#242424] transition-colors"
                >
                  Black Abayas
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/open-abayas"
                  className="inline-block py-0.5 hover:text-[#242424] transition-colors"
                >
                  Open Abayas
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/embroidered-abayas"
                  className="inline-block py-0.5 hover:text-[#242424] transition-colors"
                >
                  Embroidered Abayas
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/luxury-abayas"
                  className="inline-block py-0.5 hover:text-[#242424] transition-colors"
                >
                  Luxury Abayas
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/plain-abayas"
                  className="inline-block py-0.5 hover:text-[#242424] transition-colors"
                >
                  Plain Abayas
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/stone-abayas"
                  className="inline-block py-0.5 hover:text-[#242424] transition-colors"
                >
                  Stone Abayas
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3 min-w-0">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#242424]">
              Customer Care
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#777777]">
              <li>
                <Link
                  to="/account"
                  className="inline-block py-0.5 hover:text-[#242424] transition-colors"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="inline-block py-0.5 hover:text-[#242424] transition-colors"
                >
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className="inline-block py-0.5 hover:text-[#242424] transition-colors"
                >
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="inline-block py-0.5 hover:text-[#242424] transition-colors"
                >
                  Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="inline-block py-0.5 hover:text-[#242424] transition-colors"
                >
                  Fabric &amp; Care Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-span-2 md:col-span-4 lg:col-span-3 min-w-0">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#242424]">
              Concierge &amp; Ateliers
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[#777777]">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#A88C70]" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Dhaka+House+Building%2C+Uttara%2C+Dhaka%2C+Bangladesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 break-words hover:text-[#242424] transition-colors"
                >
                  Dhaka House Building, Uttara, Dhaka, Bangladesh
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#A88C70]" />
                <span className="min-w-0 tabular-nums">+971 4 512 8840</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#A88C70]" />
                <span className="min-w-0 break-all sm:break-words">
                  concierge@qasida-atelier.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-between gap-2.5 border-t border-[#EAEAEA] pt-6 sm:pt-8 text-center text-xs text-[#777777] sm:flex-row sm:text-left">
          <p className="leading-relaxed">
            © {new Date().getFullYear()} QASIDA Modest Couture. All rights reserved.
          </p>
          <p className="shrink-0">Dhaka House Building, Uttara, Dhaka, Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
