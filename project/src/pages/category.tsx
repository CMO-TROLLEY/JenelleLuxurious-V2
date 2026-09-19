import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useSEO } from '@/hooks/use-seo';
import { fetchCatalogue, findCategoryBySlug } from '@/lib/catalogue';
import type { CategoryWithServices, ServiceWithDetails } from '@/types';
import { ServiceCard } from '@/components/service-card';
import { VariantPicker } from '@/components/variant-picker';
import { AddOnPicker } from '@/components/addon-picker';
import { BookingSummary } from '@/components/booking-summary';
import { useBooking } from '@/context/booking-context';

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [category, setCategory] = useState<CategoryWithServices | null>(null);
  const [loading, setLoading] = useState(true);
  const [variantPickerService, setVariantPickerService] = useState<ServiceWithDetails | null>(null);
  const { selection, setCategory: setBookingCategory, setService, setVariant } = useBooking();
  const navigate = useNavigate();

  useSEO({
    title: category ? `${category.name} | Jenelle Luxurious Booking` : 'Treatments | Jenelle Luxurious Booking',
    description: category?.description ?? undefined,
    canonical: category ? `https://jenelleluxurious.co.sz/book/${category.slug}` : 'https://jenelleluxurious.co.sz/book/services',
    ogImage: category?.image_url ?? undefined,
  });

  useEffect(() => {
    if (!categorySlug) return;
    setLoading(true);
    fetchCatalogue().then((data) => {
      if (data) { const cat = findCategoryBySlug(data, categorySlug); setCategory(cat); if (cat) setBookingCategory(cat); }
      setLoading(false);
    });
  }, [categorySlug]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleServiceSelect = (service: ServiceWithDetails) => {
    if (service.variants.length > 1) { setVariantPickerService(service); }
    else { setBookingCategory(service.category); setService(service); setVariant(service.variants[0] ?? null); }
  };

  const canContinue = selection.service !== null && selection.variant !== null;

  if (!loading && !category) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-semibold text-plum">Category not found</h1>
        <p className="mt-2 text-muted-foreground">The treatment category you're looking for doesn't exist.</p>
        <Link to="/book/services" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"><ArrowLeft className="h-4 w-4" />View All Services</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/book/services" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"><ArrowLeft className="h-4 w-4" />All Services</Link>

      {loading ? (
        <div className="space-y-4">
          <div className="h-48 animate-pulse rounded-2xl bg-secondary" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-secondary" />)}</div>
        </div>
      ) : category ? (
        <>
          <div className="mb-6 overflow-hidden rounded-3xl shadow-card">
            <div className="relative h-48 sm:h-56">
              {category.image_url && <img src={category.image_url} alt={`${category.name} at Jenelle Luxurious`} className="h-full w-full object-cover" loading="eager" />}
              <div className="absolute inset-0 bg-gradient-to-t from-plum/80 to-plum/20" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">{category.name}</h1>
                {category.description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/85 line-clamp-3">{category.description}</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
            <div>
              {selection.service && selection.variant && <div className="mb-4"><AddOnPicker addons={category.services.find((s) => s.id === selection.service?.id)?.addons ?? []} /></div>}
              <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {category.services.map((service) => <ServiceCard key={service.id} service={service} onSelect={() => handleServiceSelect(service)} />)}
              </motion.div>
            </div>
            <div className="hidden lg:block"><BookingSummary showContinue continueLabel="Continue to Date & Time" continueTo="/book/appointment" continueDisabled={!canContinue} /></div>
          </div>
        </>
      ) : null}

      <BookingSummary showContinue continueLabel="Continue" continueTo="/book/appointment" continueDisabled={!canContinue} variant="sticky" />
      {variantPickerService && <VariantPicker service={variantPickerService} open={true} onClose={() => setVariantPickerService(null)} onSelect={() => navigate('/book/appointment')} />}
      <div className="h-20 lg:hidden" />

      {category && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Service', name: category.name, description: category.description ?? undefined,
          provider: { '@type': 'BeautySalon', name: 'Jenelle Luxurious', address: { '@type': 'PostalAddress', addressCountry: 'SZ' } },
          hasOfferCatalog: { '@type': 'OfferCatalog', name: category.name, itemListElement: category.services.map((service) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: service.name, description: service.description ?? undefined }, price: service.variants[0]?.price, priceCurrency: 'SZL' })) },
        }) }} />
      )}
    </div>
  );
}
