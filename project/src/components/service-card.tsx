import { Clock, Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ServiceWithDetails } from '@/types';
import { formatPrice, formatDuration, formatPriceFrom } from '@/lib/catalogue';
import { useBooking } from '@/context/booking-context';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: ServiceWithDetails;
  onSelect: () => void;
}

export function ServiceCard({ service, onSelect }: ServiceCardProps) {
  const { selection } = useBooking();
  const isSelected = selection.service?.id === service.id;
  const hasVariants = service.variants.length > 1;
  const primaryVariant = service.variants[0];
  const isBundle = primaryVariant?.is_bundle;
  const priceDisplay = hasVariants ? formatPriceFrom(service.variants) : formatPrice(primaryVariant?.price ?? 0);
  const durationDisplay = hasVariants ? 'Multiple options' : formatDuration(primaryVariant?.duration_minutes ?? 0);

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}
      className={cn('group relative flex flex-col rounded-2xl border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-glow hover:border-rose/30', isSelected && 'border-rose/40 shadow-glow ring-1 ring-rose/20')}>
      {isBundle && <span className="absolute -top-2 left-4 rounded-full bg-gold px-3 py-0.5 text-xs font-medium text-white shadow-soft">Bundle</span>}

      <div className="flex-1">
        <h3 className="font-serif text-lg font-semibold leading-tight text-plum">{service.name}</h3>
        {service.description && <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-3">{service.description}</p>}
        <div className="mt-3 flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-4 w-4 text-rose" aria-hidden="true" /><span>{durationDisplay}</span></div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div><p className="text-xs text-muted-foreground">Price</p><p className="font-serif text-xl font-semibold text-primary">{priceDisplay}</p></div>
        <button onClick={onSelect} className={cn('inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all', isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary hover:bg-rose hover:text-white')}
          aria-label={hasVariants ? `Choose option for ${service.name}` : `Select ${service.name}`}>
          {isSelected ? (<><Check className="h-4 w-4" aria-hidden="true" />Selected</>) : hasVariants ? (<>Choose<ArrowRight className="h-4 w-4" aria-hidden="true" /></>) : (<>Select<ArrowRight className="h-4 w-4" aria-hidden="true" /></>)}
        </button>
      </div>
    </motion.div>
  );
}
