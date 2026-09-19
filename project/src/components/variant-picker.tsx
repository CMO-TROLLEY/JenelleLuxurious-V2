import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Check } from 'lucide-react';
import type { ServiceWithDetails, ServiceVariant } from '@/types';
import { formatPrice, formatDuration } from '@/lib/catalogue';
import { useBooking } from '@/context/booking-context';
import { cn } from '@/lib/utils';

interface VariantPickerProps {
  service: ServiceWithDetails;
  open: boolean;
  onClose: () => void;
  onSelect: () => void;
}

export function VariantPicker({ service, open, onClose, onSelect }: VariantPickerProps) {
  const { selection, setService, setVariant } = useBooking();

  const handleVariantSelect = (variant: ServiceVariant) => {
    setService(service);
    setVariant(variant);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-plum/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-card p-6 shadow-card sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl"
            role="dialog" aria-modal="true" aria-labelledby="variant-picker-title">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 id="variant-picker-title" className="font-serif text-xl font-semibold text-plum">{service.name}</h2>
                {service.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{service.description}</p>}
              </div>
              <button onClick={onClose} className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-plum" aria-label="Close options"><X className="h-5 w-5" /></button>
            </div>

            <div className="max-h-[50vh] space-y-2 overflow-y-auto sm:max-h-[60vh]">
              {service.variants.map((variant) => {
                const isSelected = selection.service?.id === service.id && selection.variant?.id === variant.id;
                return (
                  <button key={variant.id} onClick={() => handleVariantSelect(variant)}
                    className={cn('flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all', isSelected ? 'border-rose/40 bg-secondary shadow-glow' : 'border-border bg-card hover:border-rose/20 hover:bg-secondary/40')}>
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors', isSelected ? 'border-primary bg-primary' : 'border-border')}>
                        {isSelected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                      </div>
                      <div>
                        <p className="font-medium text-plum">{variant.label}</p>
                        {variant.duration_minutes > 0 && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3 text-rose" aria-hidden="true" />{formatDuration(variant.duration_minutes)}</div>}
                      </div>
                    </div>
                    <span className="font-serif text-lg font-semibold text-primary">{formatPrice(variant.price)}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex gap-3">
              <button onClick={onClose} className="flex-1 rounded-full border border-border py-3 text-sm font-medium text-plum transition-colors hover:bg-secondary">Cancel</button>
              <button onClick={() => { onSelect(); onClose(); }} disabled={!selection.variant || selection.service?.id !== service.id}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-soft disabled:opacity-50">Continue</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
