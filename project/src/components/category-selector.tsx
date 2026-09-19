import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CategoryWithServices } from '@/types';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  categories: CategoryWithServices[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
  useLinks?: boolean;
}

export function CategorySelector({ categories, activeSlug, onSelect, useLinks = true }: CategorySelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-card shadow-soft hover:shadow-card lg:flex" aria-label="Scroll categories left">
        <ChevronLeft className="h-4 w-4 text-plum" />
      </button>

      <div ref={scrollRef} className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth px-1 py-1 lg:px-8" role="tablist" aria-label="Treatment categories">
        {categories.map((category) => {
          const isActive = activeSlug === category.slug;
          const inner = (
            <>
              {isActive && useLinks && <motion.div layoutId="activeCategoryHighlight" className="absolute inset-0 rounded-2xl bg-primary" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div className={cn('h-12 w-12 overflow-hidden rounded-xl', isActive ? 'ring-2 ring-white/30' : 'ring-1 ring-border/40')}>
                  {category.image_url && <img src={category.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />}
                </div>
                <span className="text-center text-xs font-medium leading-tight sm:text-sm">{category.name}</span>
              </div>
            </>
          );

          const className = cn(
            'relative flex shrink-0 flex-col items-center gap-2 rounded-2xl px-4 py-3 transition-all duration-300 min-w-[100px] sm:min-w-[120px]',
            isActive ? 'bg-primary text-primary-foreground shadow-soft' : 'bg-card text-plum hover:bg-secondary border border-border/60',
          );

          if (useLinks) {
            return (
              <Link key={category.id} to={`/book/${category.slug}`} onClick={() => onSelect(category.slug)} role="tab" aria-selected={isActive} className={className}>
                {inner}
              </Link>
            );
          }

          return (
            <button key={category.id} onClick={() => onSelect(category.slug)} role="tab" aria-selected={isActive} className={className}>
              {inner}
            </button>
          );
        })}
      </div>

      <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-card shadow-soft hover:shadow-card lg:flex" aria-label="Scroll categories right">
        <ChevronRight className="h-4 w-4 text-plum" />
      </button>
    </div>
  );
}
