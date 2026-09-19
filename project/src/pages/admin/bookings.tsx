import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CalendarDays } from 'lucide-react';
import { useSEO } from '@/hooks/use-seo';
import { AdminLayout } from '@/components/admin-layout';
import { fetchAllBookings, formatPrice, formatDuration } from '@/lib/catalogue';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Booking } from '@/types';
import { cn } from '@/lib/utils';

export function AdminBookings() {
  useSEO({ title: 'Bookings Manager | Jenelle Luxurious Admin', noindex: true });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchAllBookings().then((b) => { setBookings(b); setLoading(false); }); }, []);

  const filtered = bookings.filter((b) => {
    const matchesSearch = !search || b.reference.toLowerCase().includes(search.toLowerCase()) || `${b.customer_first_name} ${b.customer_last_name}`.toLowerCase().includes(search.toLowerCase()) || b.customer_email.toLowerCase().includes(search.toLowerCase()) || b.customer_phone.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <AdminLayout>
      <div className="mb-6"><h1 className="font-serif text-2xl font-semibold text-plum">Bookings Manager</h1><p className="text-sm text-muted-foreground">View and manage all customer bookings.</p></div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by reference, name, email, or phone..." className="pl-10" /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="confirmed">Confirmed</SelectItem><SelectItem value="rescheduled">Rescheduled</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select>
      </div>

      {loading ? <div className="flex h-64 items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-primary" /></div> : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card lg:block">
            <Table>
              <TableHeader><TableRow><TableHead>Reference</TableHead><TableHead>Customer</TableHead><TableHead>Service</TableHead><TableHead>Date</TableHead><TableHead>Time</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium text-plum">{booking.reference}</TableCell>
                    <TableCell><div><p className="text-sm text-plum">{booking.customer_first_name} {booking.customer_last_name}</p><p className="text-xs text-muted-foreground">{booking.customer_email}</p></div></TableCell>
                    <TableCell><div><p className="text-sm text-plum">{booking.service_name}</p>{booking.variant_label && <p className="text-xs text-muted-foreground">{booking.variant_label}</p>}</div></TableCell>
                    <TableCell>{formatDateDisplay(booking.booking_date)}</TableCell>
                    <TableCell>{booking.booking_time}</TableCell>
                    <TableCell className="font-medium">{formatPrice(booking.price)}</TableCell>
                    <TableCell><Badge className={cn(booking.status === 'confirmed' && 'bg-primary text-primary-foreground', booking.status === 'rescheduled' && 'bg-gold text-white', booking.status === 'cancelled' && 'bg-destructive text-destructive-foreground')}>{booking.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {filtered.map((booking) => (
              <motion.div key={booking.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-plum">{booking.reference}</span>
                  <Badge className={cn(booking.status === 'confirmed' && 'bg-primary text-primary-foreground', booking.status === 'rescheduled' && 'bg-gold text-white', booking.status === 'cancelled' && 'bg-destructive text-destructive-foreground')}>{booking.status}</Badge>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-plum">{booking.service_name}</p>
                  <p className="text-muted-foreground">{booking.customer_first_name} {booking.customer_last_name}</p>
                  <p className="text-muted-foreground"><CalendarDays className="inline h-3 w-3 mr-1" />{formatDateDisplay(booking.booking_date)} at {booking.booking_time}</p>
                  <p className="font-medium text-primary">{formatPrice(booking.price)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">No bookings found.</p>}
        </>
      )}
    </AdminLayout>
  );
}
