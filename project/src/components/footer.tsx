import { Sparkles, MapPin, Phone, Clock, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-rose">
                <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-serif text-lg font-semibold text-plum">Jenelle Luxurious</span>
            </div>
            <p className="text-sm text-muted-foreground">A premium beauty salon, day spa and wellness centre in Eswatini. Book your moment of luxury.</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-plum">Book</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/book/services" className="hover:text-primary transition-colors">All Services</Link></li>
              <li><Link to="/book/massage-therapy" className="hover:text-primary transition-colors">Massage Therapy</Link></li>
              <li><Link to="/book/skin-care" className="hover:text-primary transition-colors">Skin Care</Link></li>
              <li><Link to="/book/lashes-makeup" className="hover:text-primary transition-colors">Lashes & Makeup</Link></li>
              <li><Link to="/book/manage" className="hover:text-primary transition-colors">Manage Booking</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-plum">Visit Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-rose" aria-hidden="true" /><span>Corner Plaza, Tea Road, EZulwini M200, Eswatini</span></li>
              <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-rose" aria-hidden="true" /><a href="tel:+26876774779" className="hover:text-primary transition-colors">+268 7677 4779</a></li>
              <li className="flex items-start gap-2"><Instagram className="h-4 w-4 mt-0.5 shrink-0 text-rose" aria-hidden="true" /><a href="https://www.instagram.com/jenelle_beautysalon?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@jenelle_beautysalon</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-plum">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/legal/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link to="/legal/terms-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/legal/booking-cancellation-policy" className="hover:text-primary transition-colors">Booking & Cancellation Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-plum">Opening Hours</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex justify-between"><span>Monday</span><span>08:00–18:00</span></li>
              <li className="flex justify-between"><span>Tuesday</span><span>08:00–18:00</span></li>
              <li className="flex justify-between"><span>Wednesday</span><span>08:00–18:00</span></li>
              <li className="flex justify-between"><span>Thursday</span><span>08:00–18:00</span></li>
              <li className="flex justify-between"><span>Friday</span><span>08:00–18:00</span></li>
              <li className="flex justify-between"><span>Saturday</span><span>09:00–17:00</span></li>
              <li className="flex justify-between"><span>Sunday</span><span>08:00–17:00</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 flex flex-col items-center gap-4">
          <a href="https://www.instagram.com/jenelle_beautysalon?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
            <Instagram className="h-4 w-4" aria-hidden="true" /> @jenelle_beautysalon
          </a>
          <p className="text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Jenelle Luxurious. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
