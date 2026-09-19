import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin');

  const isActive = (path: string) => {
    if (path === '/book') return location.pathname === '/book';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/book" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div
            role="button"
            tabIndex={0}
            aria-label="Open admin dashboard"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              window.location.assign('/admin/login');
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                window.location.assign('/admin/login');
              }
            }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full gradient-rose transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-xl font-semibold text-plum tracking-tight">Jenelle Luxurious</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Beauty · Spa · Wellness</span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          <NavItem to="/book/services" label="Services" active={isActive('/book/services') || /^\/book\/[a-z-]+$/.test(location.pathname)} />
          <NavItem to="/book/manage" label="Manage Booking" active={isActive('/book/manage')} />
          {isAdminArea && <NavItem to="/admin" label="Dashboard" active={isActive('/admin')} />}
        </div>

        <Link to="/book/services" className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-soft sm:hidden">
          Book Now
        </Link>
      </nav>
    </header>
  );
}

function NavItem({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link to={to} className={cn('rounded-full px-4 py-2 text-sm font-medium transition-colors', active ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-primary hover:bg-secondary/60')}>
      {label}
    </Link>
  );
}
