import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar as CalendarIcon, Clock, User, Mail, Phone, Tag, CheckCircle2, AlertCircle, CalendarPlus, RotateCcw, XCircle, AlertTriangle } from 'lucide-react';
import { useSEO } from '@/hooks/use-seo';
import { lookupBooking, rescheduleBooking, cancelBooking, canCancelBooking, getAvailableSlots, formatPrice, formatDuration } from '@/lib/catalogue';
import type { Booking, TimeSlot } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

export function ManageBookingPage() {
  useSEO({ title: 'Manage Your Booking | Jenelle Luxurious', description: 'Look up and manage your Jenelle Luxurious appointment using your booking reference.', canonical: 'https://jenelleluxurious.co.sz/book/manage', noindex: true });

  const [reference, setReference] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reschedule state
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>();
  const [rescheduleSlots, setRescheduleSlots] = useState<TimeSlot[]>([]);
  const [rescheduleTime, setRescheduleTime] = useState<string | null>(null);
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  // Cancel state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim() && !emailOrPhone.trim()) { setError('Please enter your booking reference or your email or phone number.'); return; }
    setLoading(true); setError(null); setBooking(null); setSearched(false);
    const result = await lookupBooking(reference.trim() || undefined, emailOrPhone.trim() || undefined);
    setSearched(true);
    if (result) { setBooking(result); } else { setError('No booking found. Please check your reference and contact details.'); }
    setLoading(false);
  };

  const formatDateDisplay = (dateStr: string): string => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  function formatDateForDB(date: Date): string {
    const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, '0'); const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    if (date.getDay() === 0) return true;
    return false;
  };

  const handleRescheduleDateSelect = (date: Date | undefined) => {
    setRescheduleDate(date);
    setRescheduleTime(null);
    if (date && booking) {
      getAvailableSlots(date, booking.service_id ?? '', booking.duration_minutes).then((result) => {
        setRescheduleSlots(result.slots);
      });
    }
  };

  const handleConfirmReschedule = async () => {
    if (!booking || !rescheduleDate || !rescheduleTime) return;
    setRescheduling(true); setRescheduleError(null);
    const newDate = formatDateForDB(rescheduleDate);
    const success = await rescheduleBooking(booking.id, newDate, rescheduleTime);
    if (success) {
      setBooking({ ...booking, booking_date: newDate, booking_time: rescheduleTime, status: 'rescheduled' });
      setShowReschedule(false); setRescheduleDate(undefined); setRescheduleTime(null); setRescheduleSlots([]);
    } else {
      setRescheduleError('Could not reschedule. Please try again.');
    }
    setRescheduling(false);
  };

  const handleConfirmCancel = async () => {
    if (!booking) return;
    setCancelling(true);
    const success = await cancelBooking(booking.id);
    if (success) { setBooking({ ...booking, status: 'cancelled' }); setShowCancelConfirm(false); }
    setCancelling(false);
  };

  const canCancel = booking ? canCancelBooking(booking.booking_date, booking.booking_time) : false;
  const isCancelled = booking?.status === 'cancelled';

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary"><Search className="h-7 w-7 text-rose" aria-hidden="true" /></div>
        <h1 className="font-serif text-3xl font-semibold text-plum sm:text-4xl">Manage Your Booking</h1>
        <p className="mt-2 text-muted-foreground">Enter your booking reference or your email/phone number to find your appointment.</p>
      </div>

      <form onSubmit={handleSearch} className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
        <div className="space-y-4">
          <div className="space-y-2"><Label htmlFor="reference">Booking Reference</Label><Input id="reference" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. JLAB3K7X" className="uppercase" autoComplete="off" /><p className="text-xs text-muted-foreground">Enter either your reference or your contact details below.</p></div>
          <div className="space-y-2"><Label htmlFor="emailOrPhone">Email or Phone Number</Label><Input id="emailOrPhone" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} placeholder="The email or phone you used when booking" /></div>
          {error && <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />{error}</div>}
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary py-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            {loading ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />Searching...</> : <><Search className="h-4 w-4" />Find My Booking</>}
          </Button>
        </div>
      </form>

      <AnimatePresence mode="wait">
        {booking && (
          <motion.div key="booking-result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }} className="mt-6 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card">
            <div className="flex items-center gap-3 border-b border-border/60 bg-secondary/30 px-6 py-4">
              <CheckCircle2 className="h-5 w-5 text-rose" aria-hidden="true" />
              <div><h2 className="font-serif text-lg font-semibold text-plum">Booking Found</h2><p className="text-xs text-muted-foreground">Reference: {booking.reference}</p></div>
              <span className={cn('ml-auto rounded-full px-3 py-1 text-xs font-medium capitalize', booking.status === 'confirmed' && 'bg-primary text-primary-foreground', booking.status === 'rescheduled' && 'bg-gold text-white', booking.status === 'cancelled' && 'bg-destructive text-destructive-foreground')}>{booking.status}</span>
            </div>

            <div className="divide-y divide-border/60">
              <DetailRow icon={Tag} label="Treatment" value={booking.service_name} />
              {booking.variant_label && <DetailRow icon={Clock} label="Variant" value={booking.variant_label} />}
              <DetailRow icon={Clock} label="Duration" value={formatDuration(booking.duration_minutes)} />
              <DetailRow icon={CalendarIcon} label="Date" value={formatDateDisplay(booking.booking_date)} />
              <DetailRow icon={Clock} label="Time" value={booking.booking_time} />
              <DetailRow icon={User} label="Customer" value={`${booking.customer_first_name} ${booking.customer_last_name}`} />
              <DetailRow icon={Mail} label="Email" value={booking.customer_email} />
              <DetailRow icon={Phone} label="Phone" value={booking.customer_phone} />
              {booking.addons_summary && <DetailRow icon={Tag} label="Add-ons" value={booking.addons_summary} />}
              {booking.customer_notes && <DetailRow icon={Tag} label="Notes" value={booking.customer_notes} />}
            </div>

            <div className="flex items-center justify-between border-t-2 border-border/60 bg-secondary/30 px-6 py-5"><span className="font-serif text-lg font-semibold text-plum">Total</span><span className="font-serif text-2xl font-semibold text-primary">{formatPrice(booking.price)}</span></div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-3">
              <button onClick={() => { const dateStr = booking.booking_date.replace(/-/g, ''); const [h, m] = booking.booking_time.split(':').map(Number); const startTime = `${dateStr}T${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}00`; const endH = h + Math.ceil(booking.duration_minutes / 60); const endTime = `${dateStr}T${String(endH).padStart(2, '0')}${String(m).padStart(2, '0')}00`; const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Jenelle Luxurious//Booking//EN', 'BEGIN:VEVENT', `UID:${booking.reference}@jenelleluxurious.co.sz`, `DTSTAMP:${startTime}`, `DTSTART:${startTime}`, `DTEND:${endTime}`, `SUMMARY:Jenelle Luxurious — ${booking.service_name}`, 'LOCATION:Jenelle Luxurious, Eswatini', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n'); const blob = new Blob([ics], { type: 'text/calendar' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'jenelle-luxurious-appointment.ics'; a.click(); URL.revokeObjectURL(url); }} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"><CalendarPlus className="h-4 w-4" />Add to Calendar</button>

              {!isCancelled && <button onClick={() => setShowReschedule(true)} className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium text-plum transition-all hover:bg-secondary"><RotateCcw className="h-4 w-4" />Reschedule</button>}

              {!isCancelled && <button onClick={() => setShowCancelConfirm(true)} disabled={!canCancel} className="inline-flex items-center justify-center gap-2 rounded-full border border-destructive/30 px-5 py-3 text-sm font-medium text-destructive transition-all hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-40"><XCircle className="h-4 w-4" />Cancel</button>}
            </div>

            {!canCancel && !isCancelled && <div className="border-t border-border/60 bg-muted/20 px-6 py-3"><p className="text-center text-xs text-muted-foreground">Cancellation is only allowed up to 4 hours before your appointment time.</p></div>}
            {isCancelled && <div className="border-t border-border/60 bg-destructive/5 px-6 py-3"><p className="text-center text-xs text-destructive">This booking has been cancelled.</p></div>}
          </motion.div>
        )}

        {searched && !booking && !error && (
          <motion.div key="no-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 rounded-2xl border border-border/60 bg-card p-8 text-center shadow-card"><AlertCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground" aria-hidden="true" /><p className="text-sm text-muted-foreground">No booking found with those details. Please check your reference and contact information.</p></motion.div>
        )}
      </AnimatePresence>

      {/* Reschedule Modal */}
      <AnimatePresence>
        {showReschedule && booking && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-plum/40 backdrop-blur-sm" onClick={() => setShowReschedule(false)} />
            <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-card p-6 shadow-card sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl" role="dialog" aria-modal="true" aria-labelledby="reschedule-title">
              <h2 id="reschedule-title" className="mb-4 font-serif text-xl font-semibold text-plum">Reschedule Appointment</h2>
              <p className="mb-4 text-sm text-muted-foreground">Select a new date and time for your {booking.service_name} appointment.</p>

              <div className="rounded-2xl border border-border/60 p-4"><Calendar mode="single" selected={rescheduleDate} onSelect={(d) => handleRescheduleDateSelect(d)} disabled={isDateDisabled} fromDate={new Date()} toDate={new Date(new Date().setMonth(new Date().getMonth() + 3))} className="mx-auto" /></div>

              {rescheduleDate && (
                <div className="mt-4">
                  <h3 className="mb-3 text-sm font-semibold text-plum">Available Times — {rescheduleDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</h3>
                  {rescheduleSlots.filter((s) => s.available).length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">No times available on this date.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {rescheduleSlots.map((slot) => (
                        <button key={slot.time} onClick={() => slot.available && setRescheduleTime(slot.time)} disabled={!slot.available}
                          className={cn('rounded-xl border py-2.5 text-sm font-medium transition-all', rescheduleTime === slot.time ? 'border-primary bg-primary text-primary-foreground' : slot.available ? 'border-border text-plum hover:border-rose/30 hover:bg-secondary/40' : 'border-border bg-muted/30 text-muted-foreground/50 cursor-not-allowed')}>{slot.time}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {rescheduleError && <div className="mt-4 flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0" />{rescheduleError}</div>}

              <div className="mt-6 flex gap-3">
                <button onClick={() => setShowReschedule(false)} className="flex-1 rounded-full border border-border py-3 text-sm font-medium text-plum transition-colors hover:bg-secondary">Cancel</button>
                <button onClick={handleConfirmReschedule} disabled={!rescheduleDate || !rescheduleTime || rescheduling} className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-soft disabled:opacity-50">{rescheduling ? 'Rescheduling...' : 'Confirm'}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirm && booking && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-plum/40 backdrop-blur-sm" onClick={() => setShowCancelConfirm(false)} />
            <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-card p-6 shadow-card sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl" role="dialog" aria-modal="true" aria-labelledby="cancel-title">
              <div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10"><AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" /></div><h2 id="cancel-title" className="font-serif text-xl font-semibold text-plum">Cancel Appointment?</h2></div>
              <p className="text-sm text-muted-foreground">Are you sure you want to cancel your {booking.service_name} appointment on {formatDateDisplay(booking.booking_date)} at {booking.booking_time}? This action cannot be undone.</p>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setShowCancelConfirm(false)} className="flex-1 rounded-full border border-border py-3 text-sm font-medium text-plum transition-colors hover:bg-secondary">Keep Appointment</button>
                <button onClick={handleConfirmCancel} disabled={cancelling} className="flex-1 rounded-full bg-destructive py-3 text-sm font-medium text-destructive-foreground transition-all hover:bg-destructive/90 disabled:opacity-50">{cancelling ? 'Cancelling...' : 'Yes, Cancel'}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 px-6 py-4"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"><Icon className="h-4 w-4 text-rose" aria-hidden="true" /></div><span className="text-sm text-muted-foreground">{label}</span></div><span className="text-right text-sm font-medium text-plum">{value}</span></div>;
}
