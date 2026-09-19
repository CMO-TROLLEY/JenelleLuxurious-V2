import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSEO } from '@/hooks/use-seo';
import { fetchCatalogue, buildAllCategories } from '@/lib/catalogue';
import type { CategoryWithServices, ServiceWithDetails } from '@/types';
import { CategorySelector } from '@/components/category-selector';
import { ServiceCard } from '@/components/service-card';
import { VariantPicker } from '@/components/variant-picker';
import { AddOnPicker } from '@/components/addon-picker';
import { BookingSummary } from '@/components/booking-summary';
import { useBooking } from '@/context/booking-context';

export function ServicesPage() {
  useSEO({
    title: 'All Treatments | Jenelle Luxurious Booking',
    description: 'Browse all massage therapy, wood therapy, skin care, hand & foot care, gel nails, lashes, makeup and nail art treatments at Jenelle Luxurious. Book your appointment today.',
    canonical: 'https://jenelleluxurious.co.sz/book/services',
  });

  const navigate = useNavigate();
  const { selection, setCategory, setService, setVariant } = useBooking();
  const [categories, setCategories] = useState<CategoryWithServices[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [variantPickerService, setVariantPickerService] = useState<ServiceWithDetails | null>(null);

  useEffect(() => {
    fetchCatalogue().then((data) => {
      if (data) { const cats = buildAllCategories(data); setCategories(cats); if (cats.length > 0) setActiveSlug(cats[0].slug); }
      setLoading(false);
    });
  }, []);

  const activeCategory = categories.find((c) => c.slug === activeSlug) ?? null;

  const handleCategorySelect = (slug: string) => {
    setActiveSlug(slug);
    const cat = categories.find((c) => c.slug === slug);
    if (cat) setCategory(cat);
  };

  const handleServiceSelect = (service: ServiceWithDetails) => {
    if (service.variants.length > 1) { setVariantPickerService(service); }
    else { setCategory(service.category); setService(service); setVariant(service.variants[0] ?? null); }
  };

  const canContinue = selection.service !== null && selection.variant !== null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6"><h1 className="font-serif text-3xl font-semibold text-plum sm:text-4xl">Choose Your Treatment</h1><p className="mt-1 text-muted-foreground">Select from our range of premium beauty and wellness services.</p></div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-20 animate-pulse rounded-2xl bg-secondary" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-secondary" />)}</div>
        </div>
      ) : (
        <>
          <CategorySelector categories={categories} activeSlug={activeSlug} onSelect={handleCategorySelect} useLinks={false} />
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
            <div>
              {activeCategory && (
                <>
                  <div className="mb-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
                    <h2 className="font-serif text-xl font-semibold text-plum">{activeCategory.name}</h2>
                    {activeCategory.description && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{activeCategory.description}</p>}
                  </div>
                  {selection.service && selection.variant && (
                    <div className="mb-4"><AddOnPicker addons={categories.flatMap((c) => c.services).find((s) => s.id === selection.service?.id)?.addons ?? []} /></div>
                  )}
                  <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {activeCategory.services.map((service) => <ServiceCard key={service.id} service={service} onSelect={() => handleServiceSelect(service)} />)}
                  </motion.div>
                </>
              )}
            </div>
            <div className="hidden lg:block"><BookingSummary showContinue continueLabel="Continue to Date & Time" continueTo="/book/appointment" continueDisabled={!canContinue} /></div>
          </div>
        </>
      )}

      <BookingSummary showContinue continueLabel="Continue" continueTo="/book/appointment" continueDisabled={!canContinue} variant="sticky" />
      {variantPickerService && <VariantPicker service={variantPickerService} open={true} onClose={() => setVariantPickerService(null)} onSelect={() => navigate('/book/appointment')} />}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
