import React, { useEffect, useState } from 'react';
import { ArrowUp, Check, Info, MessageCircle, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function FloatingUtilities() {
  const { toasts, dismissToast, showToast } = useStore();
  const [showTop, setShowTop] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [conciergeMessage, setConciergeMessage] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 420);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Toast Notifications */}
      <div
        aria-live="polite"
        className="fixed bottom-18 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6 max-w-[calc(100vw-2rem)] sm:max-w-sm"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 border border-[#EAEAEA] bg-[#242424] px-4 py-3 text-xs text-white shadow-sm animate-fade-up"
          >
            {toast.type === 'info' ? (
              <Info className="h-4 w-4 shrink-0 text-[#EDE6DC]" />
            ) : (
              <Check className="h-4 w-4 shrink-0 text-[#A88C70]" />
            )}
            <span className="flex-1 leading-snug">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-white/70 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Concierge Inquiry Popover (WhatsApp Styling Inquiry) */}
      {conciergeOpen && (
        <div className="fixed bottom-16 right-4 z-50 w-[calc(100vw-2rem)] sm:w-80 border border-[#EAEAEA] bg-white p-5 shadow-sm sm:bottom-20 sm:right-6 animate-fade-up">
          <div className="flex items-start justify-between border-b border-[#EAEAEA] pb-3">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#A88C70]">
                WhatsApp Atelier Concierge
              </p>
              <p className="mt-0.5 font-serif text-lg text-[#242424]">
                Bespoke Sizing &amp; Styling
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConciergeOpen(false)}
              aria-label="Close concierge"
              className="text-[#777777] hover:text-[#242424]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#777777]">
            Need help selecting your abaya length or custom sleeve tailoring? Send a note to our
            Uttara, Dhaka stylists (+971 4 512 8840).
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!conciergeMessage.trim()) return;
              setConciergeMessage('');
              setConciergeOpen(false);
              showToast('Your concierge request has been logged. A stylist will reply shortly.');
            }}
            className="mt-3 space-y-2.5"
          >
            <textarea
              rows={3}
              value={conciergeMessage}
              onChange={(e) => setConciergeMessage(e.target.value)}
              placeholder="Ask about size 54 length, Korean Nida weight, or gift wrapping..."
              className="w-full border border-[#EAEAEA] p-2.5 text-xs text-[#242424] focus:border-[#A88C70] focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-[#242424] py-2.5 text-[11px] font-medium tracking-widest uppercase text-white transition-colors hover:bg-[#A88C70]"
            >
              Send Styling Note
            </button>
          </form>
        </div>
      )}

      {/* Subtle Floating Action Buttons (Back to Top + WhatsApp Concierge) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 sm:bottom-6 sm:right-6">
        {showTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="flex h-10 w-10 items-center justify-center border border-[#EAEAEA] bg-white text-[#242424] transition-colors hover:border-[#242424]"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setConciergeOpen((v) => !v)}
          aria-label="WhatsApp stylist concierge"
          className="flex h-10 items-center gap-2 border border-[#242424] bg-[#242424] px-3.5 text-xs font-medium text-white transition-colors hover:bg-[#A88C70] hover:border-[#A88C70]"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline tracking-wider uppercase text-[11px]">Concierge</span>
        </button>
      </div>
    </>
  );
}
