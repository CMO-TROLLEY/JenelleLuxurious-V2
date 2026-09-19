import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MessageSquare, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSEO } from '@/hooks/use-seo';
import { useBooking } from '@/context/booking-context';
import { BookingSummary } from '@/components/booking-summary';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const schema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Please enter a valid phone number'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function DetailsPage() {
  useSEO({ title: 'Your Details | Jenelle Luxurious Booking', description: 'Enter your contact details to complete your booking at Jenelle Luxurious.', canonical: 'https://jenelleluxurious.co.sz/book/details', noindex: true });

  const navigate = useNavigate();
  const { selection, setCustomer, totalPrice, totalDuration } = useBooking();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: selection.customer });

  useEffect(() => {
    if (!selection.service || !selection.variant) navigate('/book/services');
    if (!selection.date || !selection.time) navigate('/book/appointment');
  }, [selection.service, selection.variant, selection.date, selection.time, navigate]);

  const formatDateDisplay = (dateStr: string): string => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const onSubmit = (data: FormData) => {
    setCustomer({ first_name: data.first_name, last_name: data.last_name, email: data.email, phone: data.phone, notes: data.notes ?? '' });
    navigate('/book/confirmation');
  };

  if (!selection.service || !selection.variant || !selection.date || !selection.time) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/book/appointment" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"><ArrowLeft className="h-4 w-4" />Back to Date & Time</Link>
      <div className="mb-6"><h1 className="font-serif text-3xl font-semibold text-plum sm:text-4xl">Your Details</h1><p className="mt-1 text-muted-foreground">Please enter your contact information to confirm your booking.</p></div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
              <div className="mb-5 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary"><User className="h-5 w-5 text-rose" aria-hidden="true" /></div><h2 className="font-serif text-lg font-semibold text-plum">Contact Information</h2></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="first_name">First Name <span className="text-rose">*</span></Label><Input id="first_name" {...register('first_name')} placeholder="Jane" aria-invalid={!!errors.first_name} className={errors.first_name ? 'border-destructive' : ''} />{errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}</div>
                <div className="space-y-2"><Label htmlFor="last_name">Last Name <span className="text-rose">*</span></Label><Input id="last_name" {...register('last_name')} placeholder="Dlamini" aria-invalid={!!errors.last_name} className={errors.last_name ? 'border-destructive' : ''} />{errors.last_name && <p className="text-xs text-destructive">{errors.last_name.message}</p>}</div>
                <div className="space-y-2"><Label htmlFor="email">Email <span className="text-rose">*</span></Label><div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input id="email" type="email" {...register('email')} placeholder="jane@email.com" aria-invalid={!!errors.email} className={`pl-10 ${errors.email ? 'border-destructive' : ''}`} /></div>{errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}</div>
                <div className="space-y-2"><Label htmlFor="phone">Phone Number <span className="text-rose">*</span></Label><div className="relative"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input id="phone" type="tel" {...register('phone')} placeholder="+268 0000 0000" aria-invalid={!!errors.phone} className={`pl-10 ${errors.phone ? 'border-destructive' : ''}`} /></div>{errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
              <div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary"><MessageSquare className="h-5 w-5 text-rose" aria-hidden="true" /></div><div><h2 className="font-serif text-lg font-semibold text-plum">Additional Notes</h2><p className="text-xs text-muted-foreground">Optional — any special requests or preferences</p></div></div>
              <Textarea id="notes" {...register('notes')} placeholder="Tell us about any allergies, preferences, or special requests..." rows={4} className="resize-none" />
            </div>

            <div className="rounded-2xl bg-secondary/40 p-5 lg:hidden">
              <h3 className="mb-3 text-sm font-semibold text-plum">Your Appointment</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Treatment</span><span className="font-medium text-plum">{selection.service.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Variant</span><span className="font-medium text-plum">{selection.variant.label}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium text-plum">{totalDuration} min</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium text-plum">{selection.date && formatDateDisplay(selection.date)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium text-plum">{selection.time}</span></div>
                <div className="border-t border-border pt-2 flex justify-between"><span className="font-semibold text-plum">Total</span><span className="font-serif text-lg font-semibold text-primary">E{totalPrice.toLocaleString('en-ZA')}</span></div>
              </div>
            </div>

            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-soft lg:w-auto"><Check className="h-4 w-4" aria-hidden="true" />Confirm Booking</button>

            <p className="text-xs text-muted-foreground">
              By confirming your booking, you agree to our{' '}
              <Link to="/legal/terms-conditions" className="text-primary underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">Terms & Conditions</Link>{' '}
              and{' '}
              <Link to="/legal/booking-cancellation-policy" className="text-primary underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">Booking & Cancellation Policy</Link>.
              See our{' '}
              <Link to="/legal/privacy-policy" className="text-primary underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>{' '}
              for how we handle your information.
            </p>
          </form>
        </div>
        <div className="hidden lg:block"><BookingSummary /></div>
      </div>
      <div className="h-20 lg:hidden" />
    </div>
  );
}
