import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { SafeImage } from '../components/SafeImage';
import { useStore } from '../context/StoreContext';
import {
  fetchCategories,
  fetchJournalPosts,
  fetchProducts,
  fetchReviews,
  subscribeNewsletter,
} from '../lib/api';
import { Link } from '../lib/router';
import type { Category, JournalPost, Product, Review } from '../types';

const HERO_SLIDES = [
  {
    id: 'desert-edit',
    eyebrow: 'Autumn Couture · Uttara, Dhaka, Bangladesh',
    title: 'Architectural Black Nida & Hand-Guided Silk',
    subtitle:
      'Fluid modest silhouettes tailored in Grade-A Korean Nida and Japanese matte crepe, crafted for quiet presence.',
    ctaLabel: 'Shop the Collection',
    ctaTo: '/collections',
    image: '/src/assets/images/hero_campaign_desert_abaya_1795597016312.jpg',
  },
  {
    id: 'embroidered-edit',
    eyebrow: 'Limited Atelier Edition',
    title: 'Champagne Organza & Heritage Zari Work',
    subtitle:
      'Luminous three-piece occasion abayas hand-embellished with antique bronze and pearl botanical threadwork.',
    ctaLabel: 'Explore Luxury Abayas',
    ctaTo: '/collections/luxury-collection',
    image: '/src/assets/images/hero_campaign_embroidered_1795597017742.jpg',
  },
];

export function HomePage() {
  const { showToast } = useStore();
  const [slideIndex, setSlideIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [journalPosts, setJournalPosts] = useState<JournalPost[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      fetchCategories(),
      fetchProducts({ limit: 8, sort: 'newest' }),
      fetchJournalPosts(),
      fetchReviews(),
    ])
      .then(([cats, prods, posts, revs]) => {
        if (!active) return;
        setCategories(cats);
        setLatestProducts(prods.products);
        setJournalPosts(posts);
        setReviews(revs.slice(0, 3));
      })
      .catch(() => {
        if (!active) return;
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = HERO_SLIDES[slideIndex];

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitting(true);
    try {
      const res = await subscribeNewsletter(newsletterEmail.trim());
      setNewsletterMessage(res.message);
      setNewsletterEmail('');
      showToast('Welcome to the Qasida Private List.');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Subscription failed.', 'error');
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  return (
    <div>
      {/* 1. Hero Banner Slider */}
      <section className="relative h-[500px] sm:h-[600px] lg:h-[680px] w-full overflow-hidden bg-[#EDE6DC]">
        <SafeImage
          src={currentSlide.image}
          alt={currentSlide.title}
          className="h-full w-full object-cover object-center transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

        <div className="absolute inset-0 mx-auto flex max-w-[1440px] flex-col justify-end px-4 pb-10 sm:px-8 sm:pb-16 lg:pb-20">
          <div className="max-w-2xl text-white">
            <p className="text-[11px] sm:text-xs font-medium tracking-[0.2em] sm:tracking-[0.22em] uppercase text-[#EDE6DC]">
              {currentSlide.eyebrow}
            </p>
            <h1 className="mt-2.5 sm:mt-3 font-serif text-3xl leading-[1.12] sm:text-5xl lg:text-6xl font-normal">
              {currentSlide.title}
            </h1>
            <p className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-white/90">
              {currentSlide.subtitle}
            </p>
            <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                to={currentSlide.ctaTo}
                className="inline-flex items-center gap-2 bg-white px-5 py-3 sm:px-7 sm:py-3.5 text-xs font-medium tracking-widest uppercase text-[#242424] transition-colors hover:bg-[#EDE6DC]"
              >
                <span>{currentSlide.ctaLabel}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/collections/new-arrivals"
                className="inline-flex items-center border border-white/60 px-5 py-3 sm:px-7 sm:py-3.5 text-xs font-medium tracking-widest uppercase text-white transition-colors hover:bg-white hover:text-[#242424]"
              >
                New Arrivals
              </Link>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {HERO_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSlideIndex(idx)}
                  aria-label={`View slide ${idx + 1}`}
                  className={`h-0.5 transition-all ${
                    idx === slideIndex ? 'w-10 bg-white' : 'w-5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                }
                aria-label="Previous slide"
                className="flex h-10 w-10 items-center justify-center border border-white/40 bg-black/25 text-white transition-colors hover:bg-white hover:text-[#242424]"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
                aria-label="Next slide"
                className="flex h-10 w-10 items-center justify-center border border-white/40 bg-black/25 text-white transition-colors hover:bg-white hover:text-[#242424]"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop By Category (6 Luxury Abaya Categories) */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#A88C70]">
              Curated Silhouettes
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#242424]">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/collections"
            className="text-xs font-medium tracking-widest uppercase text-[#242424] underline underline-offset-4 hover:text-[#A88C70]"
          >
            View All Collections
          </Link>
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/collections/${cat.slug}`}
              className="group flex flex-col"
            >
              <div className="aspect-[3/4] w-full overflow-hidden border border-[#EAEAEA] bg-[#FFFFFF]">
                <SafeImage
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-2.5 sm:mt-3 font-serif text-base sm:text-lg text-[#242424] group-hover:text-[#A88C70] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-[#777777] tabular-nums">
                {cat.count ?? 4} Designs
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Latest Abayas (4-column desktop grid) */}
      <section className="border-t border-[#EAEAEA] bg-[#FFFFFF]/60 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#A88C70]">
                Seasonal Arrivals
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#242424]">
                Latest Abayas &amp; Burqa Sets
              </h2>
            </div>
            <Link
              to="/collections/new-arrivals"
              className="text-xs font-medium tracking-widest uppercase text-[#242424] underline underline-offset-4 hover:text-[#A88C70]"
            >
              Explore All 24 Pieces
            </Link>
          </div>

          <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : latestProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* 4. Promotional Campaign Banner */}
      <section className="relative w-full overflow-hidden bg-[#242424]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[440px]">
            <SafeImage
              src="/src/assets/images/promo_ramadan_evening_1795597018171.jpg"
              alt="Evening bisht abayas walking along limestone colonnade"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="lg:col-span-5 flex flex-col justify-center bg-[#242424] px-6 py-12 text-white sm:px-12 lg:py-16">
            <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[#A88C70]">
              Evening Colonnade Edit
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl leading-tight">
              Two-Tone Silk Bishts &amp; Majlis Eveningwear
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#EDE6DC]/85">
              Enjoy 15% seasonal privilege on selected Korean Nida, Zari-embroidered, and
              smoked-crystal abayas—crafted with matching chiffon shaylas and luxury gift boxing.
            </p>
            <div className="mt-8">
              <Link
                to="/collections/luxury-collection"
                className="inline-flex items-center gap-2 border border-[#EDE6DC] px-7 py-3.5 text-xs font-medium tracking-widest uppercase text-white transition-colors hover:bg-[#EDE6DC] hover:text-[#242424]"
              >
                <span>Shop Evening Couture</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Collection (2-column large editorial presentation) */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link
            to="/collections/black-abayas"
            className="group relative aspect-[4/5] overflow-hidden border border-[#EAEAEA] bg-[#FFFFFF]"
          >
            <SafeImage
              src="/src/assets/images/product_midnight_burqa_1795597021864.jpg"
              alt="Signature Black Abaya and Burqa Collection"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 text-white">
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#EDE6DC]">
                Signature Heritage
              </p>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl">
                Midnight Nida &amp; Burqa Ensembles
              </h3>
              <span className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase underline underline-offset-4">
                Discover Collection <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>

          <Link
            to="/collections/embroidered-abayas"
            className="group relative aspect-[4/5] overflow-hidden border border-[#EAEAEA] bg-[#FFFFFF]"
          >
            <SafeImage
              src="/src/assets/images/cat_embroidered_abayas_1795597019414.jpg"
              alt="Hand-Embroidered Botanical Zari Abayas"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 text-white">
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#EDE6DC]">
                Artisanal Needlecraft
              </p>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl">
                Hand-Guided Zari &amp; Stone Couture
              </h3>
              <span className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase underline underline-offset-4">
                Explore Embroidered <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. Brand Story Section */}
      <section className="border-y border-[#EAEAEA] bg-[#FFFFFF]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-2 items-stretch">
          <div className="flex flex-col justify-center px-4 py-12 sm:px-10 md:px-12 lg:px-16 lg:py-14">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#A88C70]">
              Our Atelier Philosophy
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-[#242424]">
              Tailored for Dignified Ease Across Generations
            </h2>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#777777]">
              Every QASIDA abaya begins in our studio at Dhaka House Building, Uttara, Dhaka,
              Bangladesh—where master cutters balance breathable Japanese crepe, Grade-A Korean
              Nida, and hand-guided zari embroidery. Our garments are finished with French internal
              seams, concealed pockets, and weighted hems that move gracefully in warm breezes.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-6 border-t border-[#EAEAEA] pt-6">
              <div>
                <p className="font-serif text-xl sm:text-2xl text-[#242424] tabular-nums">14 hrs</p>
                <p className="mt-1 text-[11px] sm:text-xs text-[#777777]">Hand embroidery per piece</p>
              </div>
              <div>
                <p className="font-serif text-xl sm:text-2xl text-[#242424] tabular-nums">100%</p>
                <p className="mt-1 text-[11px] sm:text-xs text-[#777777]">Breathable Grade-A weaves</p>
              </div>
              <div>
                <p className="font-serif text-xl sm:text-2xl text-[#242424] tabular-nums">48 hrs</p>
                <p className="mt-1 text-[11px] sm:text-xs text-[#777777]">Bangladesh Express Dispatch</p>
              </div>
            </div>
            <div className="mt-8">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[#242424] px-7 py-3.5 text-xs font-medium tracking-widest uppercase text-white transition-colors hover:bg-[#A88C70]"
              >
                <span>Discover More</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="aspect-[4/3] lg:aspect-auto lg:min-h-[520px] overflow-hidden">
            <SafeImage
              src="/src/assets/images/story_atelier_craft_1795597019687.jpg"
              alt="QASIDA Atelier Tailoring Table at Dhaka House Building, Uttara, Dhaka, Bangladesh"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 7. Latest Blog Posts */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#A88C70]">
              The Journal
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#242424]">
              Notes on Craft &amp; Modest Style
            </h2>
          </div>
          <Link
            to="/blog"
            className="text-xs font-medium tracking-widest uppercase text-[#242424] underline underline-offset-4 hover:text-[#A88C70]"
          >
            Read All Articles
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {journalPosts.map((post) => (
            <article key={post.id} className="group flex flex-col">
              <Link
                to="/blog"
                className="aspect-[4/3] w-full overflow-hidden border border-[#EAEAEA] bg-[#FFFFFF]"
              >
                <SafeImage
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="mt-4 flex items-center gap-2 text-xs text-[#777777]">
                <span>{post.category}</span>
                <span aria-hidden="true">·</span>
                <span>{post.date}</span>
                <span aria-hidden="true">·</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="mt-2 font-serif text-2xl leading-snug text-[#242424]">
                <Link to="/blog" className="hover:text-[#A88C70] transition-colors">
                  {post.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#777777]">
                {post.excerpt}
              </p>
              <Link
                to="/blog"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-[#242424] hover:text-[#A88C70]"
              >
                <span>Read More</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 8. Customer Reviews */}
      <section className="border-t border-[#EAEAEA] bg-[#FFFFFF] py-16 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#A88C70]">
              Client Reflections
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#242424]">
              Trusted Across Bangladesh &amp; Beyond
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="flex flex-col justify-between border border-[#EAEAEA] bg-white p-7"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#A88C70]" aria-label={`${rev.rating} out of 5 stars`}>
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <h3 className="mt-4 font-serif text-xl text-[#242424]">{rev.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#777777]">
                    “{rev.comment}”
                  </p>
                </div>
                <div className="mt-6 border-t border-[#EAEAEA] pt-4 text-xs text-[#777777]">
                  <span className="font-semibold text-[#242424]">{rev.author}</span>
                  <span className="mx-2" aria-hidden="true">·</span>
                  <span>{rev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Newsletter Subscription */}
      <section className="bg-[#EDE6DC] py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-8">
          <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-[#A88C70]">
            The Private List
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#242424]">
            Early Access to Seasonal Couture
          </h2>
          <p className="mt-3 text-sm text-[#777777]">
            Receive private invitations to limited Ramadan &amp; Eid abaya drops, atelier trunk
            shows, and textile care notes.
          </p>

          <form
            onSubmit={handleNewsletter}
            className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-stretch"
          >
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              aria-label="Email address for newsletter"
              className="flex-1 border border-[#EAEAEA] bg-white px-4 py-3.5 text-sm text-[#242424] placeholder-[#777777] focus:border-[#A88C70] focus:outline-none"
            />
            <button
              type="submit"
              disabled={newsletterSubmitting}
              className="bg-[#242424] px-8 py-3.5 text-xs font-medium tracking-widest uppercase text-white transition-colors hover:bg-[#A88C70] disabled:opacity-60 whitespace-nowrap"
            >
              {newsletterSubmitting ? 'Joining...' : 'Subscribe'}
            </button>
          </form>

          {newsletterMessage && (
            <p className="mt-4 text-xs font-medium text-[#242424]">
              {newsletterMessage}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
