import { Clock, Tag, Plus, X, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBooking } from '@/context/booking-context';
import { formatPrice, formatDuration } from '@/lib/catalogue';
import { cn } from '@/lib/utils';

interface BookingSummaryProps {
  showContinue?: boolean;
  continueLabel?: string;
  continueTo?: string;
  onContinue?: () => void;
  continueDisabled?: boolean;
  variant?: 'panel' | 'sticky';
}

export function BookingSummary({
  showContinue = false, continueLabel = 'Continue', continueTo, onContinue, continueDisabled = false, variant = 'panel',
}: BookingSummaryProps) {
  const { selection, totalPrice, totalDuration, addonsPrice, removeAddOn } = useBooking();
  const hasService = selection.service && selection.variant;
  const hasDate = selection.date && selection.time;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  if (variant === 'sticky') {
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="min-w-0 flex-1">
            {hasService ? (
              <>
                <p className="truncate text-sm font-medium text-plum">{selection.service?.name}</p>
                <p className="text-xs text-muted-foreground">{selection.variant?.label} · {formatPrice(totalPrice)}</p>
              </>
            ) : <p className="text-sm text-muted-foreground">No service selected</p>}
          </div>
          {showContinue && <ContinueButton label={continueLabel} to={continueTo} onClick={onContinue} disabled={continueDisabled} />}
        </div>
      </div>
    );
  }

  return (
    <aside className="lg:sticky lg:top-20">
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <h2 className="font-serif text-lg font-semibold text-plum">Booking Summary</h2>
        <div className="mt-4 space-y-4">
          {hasService ? (
            <div className="space-y-3 rounded-xl bg-secondary/40 p-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Treatment</p>
                <p className="font-medium text-plum">{selection.service?.name}</p>
              </div>
              <div className="flex items-center gap-2 text-sm"><Tag className="h-4 w-4 text-rose" aria-hidden="true" /><span className="text-muted-foreground">{selection.variant?.label}</span></div>
              <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-rose" aria-hidden="true" /><span className="text-muted-foreground">{formatDuration(totalDuration)}</span></div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-4 text-center"><p className="text-sm text-muted-foreground">Select a treatment to begin your booking.</p></div>
          )}

          {selection.addons.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Add-ons</p>
              {selection.addons.map((addon) => (
                <div key={addon.id} className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2">
                  <div className="flex items-center gap-2"><Plus className="h-3.5 w-3.5 text-rose" aria-hidden="true" /><span className="text-sm text-plum">{addon.name}</span></div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{formatPrice(addon.price)}</span>
                    <button onClick={() => removeAddOn(addon.id)} className="text-muted-foreground hover:text-destructive" aria-label={`Remove ${addon.name}`}><X className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasDate && (
            <div className="space-y-1 rounded-xl bg-secondary/40 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Appointment</p>
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-rose" aria-hidden="true" /><span className="text-sm font-medium text-plum">{selection.date && formatDate(selection.date)}</span></div>
              <p className="pl-6 text-sm text-muted-foreground">{selection.time}</p>
            </div>
          )}

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Add-ons total</span><span className="text-sm text-muted-foreground">{formatPrice(addonsPrice)}</span></div>
            <div className="mt-2 flex items-center justify-between"><span className="font-serif text-lg font-semibold text-plum">Total</span><span className="font-serif text-lg font-semibold text-primary">{formatPrice(totalPrice)}</span></div>
          </div>
        </div>

        {showContinue && <div className="mt-5"><ContinueButton label={continueLabel} to={continueTo} onClick={onContinue} disabled={continueDisabled} fullWidth /></div>}
      </div>
    </aside>
  );
}

function ContinueButton({ label, to, onClick, disabled, fullWidth }: { label: string; to?: string; onClick?: () => void; disabled?: boolean; fullWidth?: boolean }) {
  const baseClasses = cn('inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-soft disabled:cursor-not-allowed disabled:opacity-50', fullWidth && 'w-full');

  if (to) {
    return <Link to={to} className={cn(baseClasses, disabled && 'pointer-events-none opacity-50')} onClick={onClick}>{label}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>;
  }
  return <button onClick={onClick} disabled={disabled} className={baseClasses}>{label}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>;
}
