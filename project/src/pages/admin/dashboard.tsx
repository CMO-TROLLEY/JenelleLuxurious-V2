import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, TrendingUp, Users, Scissors } from 'lucide-react';
import { useSEO } from '@/hooks/use-seo';
import { AdminLayout } from '@/components/admin-layout';
import { fetchAllBookings, fetchAllStaff, fetchCatalogue, formatPrice } from '@/lib/catalogue';
import type { Booking, Staff } from '@/types';
import type { CatalogueData } from '@/types';

export function AdminDashboard() {
  useSEO({ title: 'Dashboard | Jenelle Luxurious Admin', description: 'Admin dashboard overview.', noindex: true });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [catalogue, setCatalogue] = useState<CatalogueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAllBookings(), fetchAllStaff(), fetchCatalogue()]).then(([b, s, c]) => {
      setBookings(b); setStaff(s); setCatalogue(c); setLoading(false);
    });
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter((b) => b.booking_date === today && b.status !== 'cancelled');
  const upcomingBookings = bookings.filter((b) => b.booking_date >= today && b.status !== 'cancelled').sort((a, b) => a.booking_date.localeCompare(b.booking_date));
  const totalRevenue = bookings.filter((b) => b.status !== 'cancelled').reduce((sum, b) => sum + b.price, 0);

  const stats = [
    { label: "Today's Appointments", value: todayBookings.length, icon: CalendarDays, color: 'text-rose' },
    { label: 'Upcoming Bookings', value: upcomingBookings.length, icon: Clock, color: 'text-gold' },
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-primary' },
    { label: 'Active Staff', value: staff.length, icon: Users, color: 'text-rose' },
  ];

  if (loading) {
    return <AdminLayout><div className="flex h-64 items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="mb-6"><h1 className="font-serif text-2xl font-semibold text-plum">Dashboard</h1><p className="text-sm text-muted-foreground">Overview of your salon operations.</p></div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-secondary"><stat.icon className={stat.color} aria-hidden="true" /></div>
            <p className="font-serif text-2xl font-semibold text-plum">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <h2 className="mb-4 font-serif text-lg font-semibold text-plum">Upcoming Appointments</h2>
          {upcomingBookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No upcoming appointments.</p>
          ) : (
            <div className="space-y-2">
              {upcomingBookings.slice(0, 8).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between rounded-xl bg-secondary/30 px-4 py-3">
                  <div><p className="text-sm font-medium text-plum">{booking.service_name}</p><p className="text-xs text-muted-foreground">{booking.customer_first_name} {booking.customer_last_name}</p></div>
                  <div className="text-right"><p className="text-xs font-medium text-plum">{new Date(booking.booking_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p><p className="text-xs text-muted-foreground">{booking.booking_time}</p></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <h2 className="mb-4 font-serif text-lg font-semibold text-plum">Quick Stats</h2>
          <div className="space-y-3">
            <StatRow label="Total Services" value={catalogue?.services.length ?? 0} icon={Scissors} />
            <StatRow label="Total Categories" value={catalogue?.categories.length ?? 0} icon={Scissors} />
            <StatRow label="Total Bookings" value={bookings.length} icon={CalendarDays} />
            <StatRow label="Cancelled" value={bookings.filter((b) => b.status === 'cancelled').length} icon={CalendarDays} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatRow({ label, value, icon: Icon }: { label: string; value: number | string; icon: React.ComponentType<{ className?: string }> }) {
  return <div className="flex items-center justify-between rounded-xl bg-secondary/30 px-4 py-3"><div className="flex items-center gap-2"><Icon className="h-4 w-4 text-rose" aria-hidden="true" /><span className="text-sm text-muted-foreground">{label}</span></div><span className="text-sm font-semibold text-plum">{value}</span></div>;
}
