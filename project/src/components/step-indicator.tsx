import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

const STEPS = [
  { label: 'Services', path: '/book/services' },
  { label: 'Date & Time', path: '/book/appointment' },
  { label: 'Your Details', path: '/book/details' },
  { label: 'Confirmation', path: '/book/confirmation' },
];

export function StepIndicator() {
  const location = useLocation();

  const getCurrentStep = () => {
    if (location.pathname.startsWith('/book/confirmation')) return 3;
    if (location.pathname.startsWith('/book/details')) return 2;
    if (location.pathname.startsWith('/book/appointment')) return 1;
    return 0;
  };

  const currentStep = getCurrentStep();

  if (location.pathname === '/' || location.pathname === '/book' || location.pathname === '/book/manage' || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav aria-label="Booking steps" className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <ol className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <li key={step.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300', isComplete && 'border-primary bg-primary text-primary-foreground', isCurrent && 'border-primary bg-secondary text-primary shadow-glow', !isComplete && !isCurrent && 'border-border bg-card text-muted-foreground')}>
                  {isComplete ? <Check className="h-4 w-4" aria-hidden="true" /> : <span className="text-sm font-medium">{index + 1}</span>}
                </div>
                <span className={cn('hidden text-xs font-medium sm:block', isCurrent ? 'text-primary' : 'text-muted-foreground')}>{step.label}</span>
              </div>
              {index < STEPS.length - 1 && <div className={cn('mx-2 h-0.5 flex-1 rounded-full transition-colors duration-300', index < currentStep ? 'bg-primary' : 'bg-border')} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
