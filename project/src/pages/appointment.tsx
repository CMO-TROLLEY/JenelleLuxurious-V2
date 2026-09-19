import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ArrowLeft, Check } from 'lucide-react';
import { useSEO } from '@/hooks/use-seo';
import { useBooking } from '@/context/booking-context';
import { getAvailableSlots, formatPrice, formatDuration } from '@/lib/catalogue';
import { Calendar } from '@/components/ui/calendar';
import { BookingSummary } from '@/components/booking-summary';
import { cn } from '@/lib/utils';
import type { TimeSlot } from '@/types';

export function AppointmentPage() {
  useSEO({
    title: 'Select Date & Time | Jenelle Luxurious Booking',
    description: 'Choose your preferred date and time for your Jenelle Luxurious appointment.',
    canonical: 'https://jenelleluxurious.co.sz/book/appointment', noindex: true,
  });

  const navigate = useNavigate();
  const { selection, setDate, setTime, totalPrice, totalDuration } = useBooking();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selection.date ? new Date(selection.date + 'T00:00:00') : undefined);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!selection.service || !selection.variant) navigate('/book/services');
  }, [selection, navigate]);

  useEffect(() => {
    if (selectedDate && selection.service) {
      setLoadingSlots(true);
      const duration = selection.variant?.duration_minutes ?? 60;
      getAvailableSlots(selectedDate, selection.service.id, duration).then((result) => {
        setSlots(result.slots);
        setLoadingSlots(false);
      }).catch(() => {
        setSlots([]);
        setLoadingSlots(false);
      });
    } else {
      setSlots([]);
    }
  }, [selectedDate, selection.service, selection.variant]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setDate(formatDateForDB(date));
    }
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    if (date.getDay() === 0) return true;
    return false;
  };

  function formatDateForDB(date: Date): string {
    const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, '0'); const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  const formatDateDisplay = (dateStr: string): string => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const availableSlots = slots.filter((s) => s.available);
  const canContinue = selection.date !== null && selection.time !== null;

  if (!selection.service || !selection.variant) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/book/services" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"><ArrowLeft className="h-4 w-4" />Back to Services</Link>
      <div className="mb-6"><h1 className="font-serif text-3xl font-semibold text-plum sm:text-4xl">Select Date & Time</h1><p className="mt-1 text-muted-foreground">Choose your preferred appointment slot.</p></div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-5 flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary"><CalendarIcon className="h-6 w-6 text-rose" aria-hidden="true" /></div>
            <div className="min-w-0 flex-1"><p className="truncate font-medium text-plum">{selection.service.name}</p><p className="text-sm text-muted-foreground">{selection.variant.label} · {formatDuration(totalDuration)} · {formatPrice(totalPrice)}</p></div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <h2 className="mb-4 font-serif text-lg font-semibold text-plum">Pick a Date</h2>
            <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} disabled={isDateDisabled} fromDate={new Date()} toDate={new Date(new Date().setMonth(new Date().getMonth() + 3))} className="mx-auto" initialFocus />
            <p className="mt-3 text-center text-xs text-muted-foreground">Closed on Sundays. Time slots are based on real staff availability.</p>
          </div>

          {selectedDate && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-5 rounded-2xl border border-border/60 bg-card p-5 shadow-card">
              <div className="mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-rose" aria-hidden="true" /><h2 className="font-serif text-lg font-semibold text-plum">Available Times — {selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</h2></div>
              {loadingSlots ? (
                <div className="flex justify-center py-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-primary" /></div>
              ) : availableSlots.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No times available on this date. Please select another date.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                  {slots.map((slot) => (
                    <button key={slot.time} onClick={() => slot.available && setTime(slot.time)} disabled={!slot.available}
                      className={cn('rounded-xl border py-3 text-sm font-medium transition-all', selection.time === slot.time ? 'border-primary bg-primary text-primary-foreground shadow-soft' : slot.available ? 'border-border bg-card text-plum hover:border-rose/30 hover:bg-secondary/40' : 'border-border bg-muted/30 text-muted-foreground/50 cursor-not-allowed')}
                      aria-pressed={selection.time === slot.time}>
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {selection.date && selection.time && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 flex items-center gap-3 rounded-2xl bg-secondary/40 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-4 w-4" aria-hidden="true" /></div>
              <p className="text-sm font-medium text-plum">{formatDateDisplay(selection.date)} at {selection.time}</p>
            </motion.div>
          )}
        </div>

        <div className="hidden lg:block"><BookingSummary showContinue continueLabel="Continue to Details" continueTo="/book/details" continueDisabled={!canContinue} /></div>
      </div>

      <BookingSummary showContinue continueLabel="Continue" continueTo="/book/details" continueDisabled={!canContinue} variant="sticky" />
      <div className="h-20 lg:hidden" />
    </div>
  );
}
