import { createContext, useContext, useState, type ReactNode } from 'react';
import type {
  BookingSelection,
  ServiceCategory,
  Service,
  ServiceVariant,
  SelectedAddOn,
} from '@/types';

const emptyCustomer = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  notes: '',
};

const emptySelection: BookingSelection = {
  category: null,
  service: null,
  variant: null,
  addons: [],
  date: null,
  time: null,
  customer: { ...emptyCustomer },
};

interface BookingContextValue {
  selection: BookingSelection;
  setCategory: (category: ServiceCategory | null) => void;
  setService: (service: Service | null) => void;
  setVariant: (variant: ServiceVariant | null) => void;
  toggleAddOn: (addon: SelectedAddOn) => void;
  removeAddOn: (id: string) => void;
  clearAddOns: () => void;
  setDate: (date: string | null) => void;
  setTime: (time: string | null) => void;
  setCustomer: (customer: BookingSelection['customer']) => void;
  reset: () => void;
  totalPrice: number;
  totalDuration: number;
  addonsPrice: number;
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<BookingSelection>(emptySelection);

  const setCategory = (category: ServiceCategory | null) => {
    setSelection((prev) => ({ ...prev, category, service: null, variant: null, addons: [] }));
  };

  const setService = (service: Service | null) => {
    setSelection((prev) => ({ ...prev, service, variant: null, addons: [] }));
  };

  const setVariant = (variant: ServiceVariant | null) => {
    setSelection((prev) => ({ ...prev, variant }));
  };

  const toggleAddOn = (addon: SelectedAddOn) => {
    setSelection((prev) => {
      const exists = prev.addons.find((a) => a.id === addon.id);
      if (exists) return { ...prev, addons: prev.addons.filter((a) => a.id !== addon.id) };
      return { ...prev, addons: [...prev.addons, addon] };
    });
  };

  const removeAddOn = (id: string) => {
    setSelection((prev) => ({ ...prev, addons: prev.addons.filter((a) => a.id !== id) }));
  };

  const clearAddOns = () => setSelection((prev) => ({ ...prev, addons: [] }));

  const setDate = (date: string | null) => setSelection((prev) => ({ ...prev, date, time: null }));

  const setTime = (time: string | null) => setSelection((prev) => ({ ...prev, time }));

  const setCustomer = (customer: BookingSelection['customer']) => {
    setSelection((prev) => ({ ...prev, customer }));
  };

  const reset = () => setSelection({ ...emptySelection, customer: { ...emptyCustomer } });

  const addonsPrice = selection.addons.reduce((sum, a) => sum + a.price, 0);
  const basePrice = selection.variant?.price ?? 0;
  const totalPrice = basePrice + addonsPrice;
  const addonsDuration = selection.addons.reduce((sum, a) => sum + a.duration_minutes, 0);
  const baseDuration = selection.variant?.duration_minutes ?? 0;
  const totalDuration = baseDuration + addonsDuration;

  return (
    <BookingContext.Provider
      value={{
        selection, setCategory, setService, setVariant, toggleAddOn, removeAddOn, clearAddOns,
        setDate, setTime, setCustomer, reset, totalPrice, totalDuration, addonsPrice,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
