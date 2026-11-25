import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { fetchJournalPosts } from '../lib/api';
import { Link } from '../lib/router';
import type { JournalPost } from '../types';

export function BlogPage() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJournalPosts()
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white">
      <div className="border-b border-[#EAEAEA] bg-[#FFFFFF] py-12">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#A88C70]">
            Editorial Journal
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl text-[#242424]">
            Craftsmanship, Fabrics &amp; Modest Style
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-8 space-y-16">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-80 bg-[#FFFFFF] animate-pulse border border-[#EAEAEA]" />
            ))
          : posts.map((post) => (
              <article
                key={post.id}
                className="grid grid-cols-1 gap-8 border-b border-[#EAEAEA] pb-14 md:grid-cols-12 items-start"
              >
                <div className="md:col-span-5 aspect-[4/3] overflow-hidden border border-[#EAEAEA] bg-[#FFFFFF]">
                  <SafeImage
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="md:col-span-7">
                  <div className="flex items-center gap-2 text-xs text-[#777777]">
                    <span className="text-[#A88C70] font-medium">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="mt-2 font-serif text-3xl text-[#242424]">{post.title}</h2>
                  <p className="mt-2 text-xs text-[#777777]">By {post.author}</p>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#777777]">
                    {post.content.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="bg-white">
      <div className="border-b border-[#EAEAEA] bg-[#FFFFFF] py-12">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#A88C70]">
            The House of Qasida
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl text-[#242424]">
            Uttara, Dhaka, Bangladesh Modest Couture Atelier
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          <div className="aspect-[4/3] overflow-hidden border border-[#EAEAEA] bg-[#FFFFFF]">
            <SafeImage
              src="/src/assets/images/story_atelier_craft_1795597019687.jpg"
              alt="QASIDA tailoring atelier at Dhaka House Building, Uttara, Dhaka, Bangladesh"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-5">
            <h2 className="font-serif text-3xl text-[#242424]">
              Quiet Architectural Poise in Every Stitch
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#777777]">
              QASIDA was established with a singular purpose: to craft enduring abayas, open
              bishts, and breathable burqa sets that honor timeless modest heritage while answering
              the needs of contemporary travel and daily elegance.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-[#777777]">
              From our atelier at Dhaka House Building, Uttara, Dhaka, Bangladesh, our master
              pattern cutters source Grade-A Korean Nida, anti-crease Japanese crepe, and pure
              mulberry silk organza. Each garment undergoes individual inspection before being
              wrapped in archival tissue.
            </p>
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#EAEAEA]">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#242424]">
                  Atelier &amp; Dispatch
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#777777]">
                  Dispatched from{' '}
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Dhaka+House+Building%2C+Uttara%2C+Dhaka%2C+Bangladesh"
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-[#EAEAEA] underline-offset-4 hover:text-[#242424]"
                  >
                    Dhaka House Building, Uttara, Dhaka, Bangladesh
                  </a>
                  . Complimentary express shipping on orders over ৳650 across Bangladesh and
                  international destinations via DHL Express.
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#242424]">
                  14-Day Exchanges
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#777777]">
                  Unworn pieces with original tags may be exchanged for another abaya length or
                  returned within 14 days of arrival.
                </p>
              </div>
            </div>
            <div className="pt-4">
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 bg-[#242424] px-7 py-3.5 text-xs font-medium tracking-widest uppercase text-white hover:bg-[#A88C70]"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="bg-white py-24">
      <div className="mx-auto max-w-xl px-4 text-center">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#A88C70]">
          404 · Page Not Found
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-[#242424]">
          This Atelier Room Could Not Be Found
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#777777]">
          The page you requested may have moved or been archived. Return to our seasonal abaya
          collections to continue browsing.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="bg-[#242424] px-7 py-3.5 text-xs font-medium tracking-widest uppercase text-white hover:bg-[#A88C70]"
          >
            Return Home
          </Link>
          <Link
            to="/collections"
            className="border border-[#242424] px-7 py-3.5 text-xs font-medium tracking-widest uppercase text-[#242424] hover:bg-[#EDE6DC]"
          >
            All Abayas
          </Link>
        </div>
      </div>
    </div>
  );
}
