import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Calendar, Clock, MapPin, Star } from 'lucide-react';
import { useSEO } from '@/hooks/use-seo';
import { fetchCatalogue, buildAllCategories } from '@/lib/catalogue';
import type { CategoryWithServices } from '@/types';

export function BookLandingPage() {
  useSEO({
    title: 'Jenelle Luxurious | Premium Beauty, Spa & Wellness Booking in Eswatini',
    description: 'Book premium massage therapy, wood therapy, skin care, nails, lashes and makeup treatments at Jenelle Luxurious — a luxury beauty salon, day spa and wellness centre in Eswatini.',
    canonical: 'https://jenelleluxurious.co.sz/book', ogImage: '/Hero_Section.jpeg',
  });

  const [categories, setCategories] = useState<CategoryWithServices[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCatalogue().then((data) => { if (data) setCategories(buildAllCategories(data)); setLoading(false); }); }, []);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/files_8858346-2026-09-19T09-42-14-617Z-20260519_121834.jpg.webp" alt="Jenelle Luxurious premium beauty salon and spa interior" className="h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-plum/60 via-plum/40 to-plum/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-rose-light"><Sparkles className="h-5 w-5" aria-hidden="true" /><span className="text-sm font-medium uppercase tracking-[0.2em]">Beauty · Spa · Wellness</span></div>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl text-balance">Your moment of luxury awaits</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/85">Book premium treatments at Jenelle Luxurious, Eswatini's destination for massage therapy, skin care, nails, lashes and makeup.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/book/services" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-plum transition-all hover:bg-cream hover:shadow-lg">Book an Appointment<ArrowRight className="h-4 w-4" /></Link>
              <Link to="/book/manage" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10">Manage Booking</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 sm:grid-cols-4 lg:px-8">
          {[
            { icon: Star, label: 'Premium Treatments', sub: 'Korean skincare & expert techniques' },
            { icon: Calendar, label: 'Easy Booking', sub: 'Select, schedule, confirm' },
            { icon: Clock, label: 'Flexible Hours', sub: 'Mon–Sun, 08:00–18:00' },
            { icon: MapPin, label: 'Ezulwini, Eswatini', sub: 'Corner Plaza, Tea Road' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary"><item.icon className="h-5 w-5 text-rose" aria-hidden="true" /></div>
              <p className="text-sm font-semibold text-plum">{item.label}</p><p className="text-xs text-muted-foreground">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="font-serif text-3xl font-semibold text-plum sm:text-4xl">Explore Our Treatments</h2>
          <p className="mt-2 text-muted-foreground">From massage therapy to nail art, find your perfect treatment.</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-secondary" />)}</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div key={category.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                <Link to={`/book/${category.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl shadow-card transition-all duration-300 hover:shadow-glow">
                  {category.image_url && <img src={category.image_url} alt={`${category.name} at Jenelle Luxurious`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-plum/80 via-plum/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-serif text-lg font-semibold text-white leading-tight">{category.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-white/80 transition-colors group-hover:text-rose-light">View treatments<ArrowRight className="h-3 w-3" /></p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link to="/book/services" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-soft">View All Services<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  );
}
