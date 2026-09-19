import { Plus, Check, Clock } from 'lucide-react';
import type { ServiceAddOn } from '@/types';
import { formatPrice, formatDuration } from '@/lib/catalogue';
import { useBooking } from '@/context/booking-context';
import { cn } from '@/lib/utils';

interface AddOnPickerProps {
  addons: ServiceAddOn[];
}

export function AddOnPicker({ addons }: AddOnPickerProps) {
  const { selection, toggleAddOn } = useBooking();
  if (addons.length === 0) return null;

  const isAddonSelected = (id: string) => selection.addons.some((a) => a.id === id);

  return (
    <div className="rounded-2xl border border-border/60 bg-secondary/20 p-5">
      <h3 className="font-serif text-base font-semibold text-plum">Enhance Your Treatment</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">Optional add-ons for this service</p>
      <div className="mt-3 space-y-2">
        {addons.map((addon) => {
          const selected = isAddonSelected(addon.id);
          return (
            <button key={addon.id} onClick={() => toggleAddOn({ id: addon.id, name: addon.name, price: addon.price, duration_minutes: addon.duration_minutes })}
              className={cn('flex w-full items-center justify-between rounded-xl border p-3 transition-all', selected ? 'border-rose/30 bg-card shadow-soft' : 'border-border bg-card hover:border-rose/20')}>
              <div className="flex items-center gap-3">
                <div className={cn('flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors', selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-transparent')}>
                  {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-plum">{addon.name}</p>
                  {addon.duration_minutes > 0 && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3 text-rose" aria-hidden="true" />{formatDuration(addon.duration_minutes)}</div>}
                </div>
              </div>
              <span className="text-sm font-medium text-primary">{formatPrice(addon.price)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
