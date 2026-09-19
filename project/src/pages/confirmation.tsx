import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Clock, User, Mail, Phone, Tag, CalendarPlus, Home, Search } from 'lucide-react';
import { useSEO } from '@/hooks/use-seo';
import { useBooking } from '@/context/booking-context';
import { createBooking, createAppointment, formatPrice, formatDuration } from '@/lib/catalogue';

export function ConfirmationPage() {
  useSEO({ title: 'Booking Confirmed | Jenelle Luxurious', description: 'Your appointment at Jenelle Luxurious is confirmed.', canonical: 'https://jenelleluxurious.co.sz/book/confirmation', noindex: true });

  const navigate = useNavigate();
  const { selection, reset, totalPrice, totalDuration } = useBooking();
  const [reference, setReference] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (!selection.service || !selection.variant || !selection.date || !selection.time) { navigate('/book/services'); return; }
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    const addonsSummary = selection.addons.length > 0 ? selection.addons.map((a) => `${a.name} (${formatPrice(a.price)})`).join(', ') : null;

    createBooking({
      category_id: selection.category?.id ?? null, service_id: selection.service?.id ?? null, variant_id: selection.variant?.id ?? null,
      service_name: selection.service.name, variant_label: selection.variant.label, duration_minutes: totalDuration, price: totalPrice,
      addons_summary: addonsSummary, booking_date: selection.date, booking_time: selection.time,
      customer_first_name: selection.customer.first_name, customer_last_name: selection.customer.last_name,
      customer_email: selection.customer.email, customer_phone: selection.customer.phone, customer_notes: selection.customer.notes || null,
    }).then((result) => {
      if (result) {
        setReference(result.reference);
        createAppointment(result.id, null, selection.date!, selection.time!, totalDuration);
      } else {
        setError('We could not save your booking. Please try again.');
      }
      setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatDateDisplay = (dateStr: string): string => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleAddToCalendar = () => {
    if (!selection.date || !selection.time) return;
    const dateStr = selection.date.replace(/-/g, '');
    const [hours, minutes] = selection.time.split(':').map(Number);
    const startTime = `${dateStr}T${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}00`;
    const endHours = hours + Math.ceil(totalDuration / 60);
    const endTime = `${dateStr}T${String(endHours).padStart(2, '0')}${String(minutes).padStart(2, '0')}00`;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Jenelle Luxurious//Booking//EN', 'BEGIN:VEVENT', `UID:${reference}@jenelleluxurious.co.sz`, `DTSTAMP:${startTime}`, `DTSTART:${startTime}`, `DTEND:${endTime}`, `SUMMARY:Jenelle Luxurious — ${selection.service?.name}`, `DESCRIPTION:${selection.service?.name} (${selection.variant?.label})`, 'LOCATION:Jenelle Luxurious, Eswatini', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'jenelle-luxurious-appointment.ics'; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center px-4"><div className="text-center"><div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-primary" /><p className="mt-4 text-sm text-muted-foreground">Confirming your booking...</p></div></div>;

  if (error) return <div className="mx-auto max-w-2xl px-4 py-16 text-center"><h1 className="font-serif text-2xl font-semibold text-plum">Something went wrong</h1><p className="mt-2 text-muted-foreground">{error}</p><Link to="/book/services" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Try Again</Link></div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }} className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary"><CheckCircle2 className="h-12 w-12 text-rose" aria-hidden="true" /></motion.div>
        <h1 className="font-serif text-3xl font-semibold text-plum sm:text-4xl">Your appointment is confirmed</h1>
        <p className="mt-2 text-muted-foreground">We look forward to welcoming you to Jenelle Luxurious.</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3"><span className="text-xs uppercase tracking-wide text-muted-foreground">Booking Reference</span><span className="font-serif text-lg font-semibold text-primary">{reference}</span></div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-8 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card">
        <div className="border-b border-border/60 bg-secondary/30 px-6 py-4"><h2 className="font-serif text-lg font-semibold text-plum">Appointment Details</h2></div>
        <div className="divide-y divide-border/60">
          <DetailRow icon={Tag} label="Treatment" value={selection.service?.name ?? ''} />
          <DetailRow icon={Clock} label="Duration" value={selection.variant ? formatDuration(totalDuration) : ''} />
          <DetailRow icon={Calendar} label="Date" value={selection.date ? formatDateDisplay(selection.date) : ''} />
          <DetailRow icon={Clock} label="Time" value={selection.time ?? ''} />
          {selection.variant && <DetailRow icon={Tag} label="Variant" value={selection.variant.label} />}
          <DetailRow icon={User} label="Customer" value={`${selection.customer.first_name} ${selection.customer.last_name}`} />
          <DetailRow icon={Mail} label="Email" value={selection.customer.email} />
          <DetailRow icon={Phone} label="Phone" value={selection.customer.phone} />
          {selection.addons.length > 0 && <DetailRow icon={Tag} label="Add-ons" value={selection.addons.map((a) => a.name).join(', ')} />}
          {selection.customer.notes && <DetailRow icon={Tag} label="Notes" value={selection.customer.notes} />}
        </div>
        <div className="flex items-center justify-between border-t-2 border-border/60 bg-secondary/30 px-6 py-5"><span className="font-serif text-lg font-semibold text-plum">Total</span><span className="font-serif text-2xl font-semibold text-primary">{formatPrice(totalPrice)}</span></div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button onClick={handleAddToCalendar} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-soft"><CalendarPlus className="h-4 w-4" aria-hidden="true" />Add to Calendar</button>
        <Link to="/book/manage" onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium text-plum transition-all hover:bg-secondary"><Search className="h-4 w-4" aria-hidden="true" />Manage Booking</Link>
        <Link to="/book" onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium text-plum transition-all hover:bg-secondary"><Home className="h-4 w-4" aria-hidden="true" />Return Home</Link>
      </motion.div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 px-6 py-4"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"><Icon className="h-4 w-4 text-rose" aria-hidden="true" /></div><span className="text-sm text-muted-foreground">{label}</span></div><span className="text-right text-sm font-medium text-plum">{value}</span></div>;
}
