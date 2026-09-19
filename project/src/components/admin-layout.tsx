import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Scissors, CalendarDays, Users, Sparkles, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/services', label: 'Services', icon: Scissors },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
  { to: '/admin/staff', label: 'Staff & Schedule', icon: Users },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border/60 bg-card lg:flex lg:flex-col">
        <div className="flex items-center gap-2 border-b border-border/60 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-rose">
            <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="font-serif text-sm font-semibold text-plum">Jenelle Luxurious</p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', isActive(item.to) ? 'bg-primary text-primary-foreground' : 'text-plum hover:bg-secondary')}>
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border/60 p-3">
          <Link to="/book" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-plum">
            <ArrowLeft className="h-4 w-4" />
            Back to Site
          </Link>
          <div className="mt-2 px-3 py-2 text-xs text-muted-foreground">
            <p className="truncate">{user?.email}</p>
          </div>
          <button onClick={signOut} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border/60 bg-card/85 backdrop-blur-md lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose" />
              <span className="font-serif text-sm font-semibold text-plum">Admin</span>
            </div>
            <button onClick={signOut} className="text-sm text-muted-foreground"><LogOut className="h-4 w-4" /></button>
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-border/60 bg-card px-4 py-2 lg:hidden no-scrollbar">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className={cn('flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors', isActive(item.to) ? 'bg-primary text-primary-foreground' : 'text-plum hover:bg-secondary')}>
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
