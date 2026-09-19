export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

export interface ServiceVariant {
  id: string;
  service_id: string;
  label: string;
  duration_minutes: number;
  price: number;
  is_bundle: boolean;
  display_order: number;
  is_active: boolean;
}

export interface ServiceAddOn {
  id: string;
  service_id: string | null;
  category_id: string | null;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  display_order: number;
  is_active: boolean;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  reference: string;
  customer_id: string | null;
  category_id: string | null;
  service_id: string | null;
  variant_id: string | null;
  service_name: string;
  variant_label: string | null;
  duration_minutes: number;
  price: number;
  addons_summary: string | null;
  booking_date: string;
  booking_time: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  customer_notes: string | null;
  status: string;
  created_at: string;
}

export interface BlockedDate {
  id: string;
  blocked_date: string;
  reason: string | null;
}

export interface Staff {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface StaffService {
  id: string;
  staff_id: string;
  service_id: string;
}

export interface StaffSchedule {
  id: string;
  staff_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_working: boolean;
}

export interface StaffTimeOff {
  id: string;
  staff_id: string;
  start_date: string;
  end_date: string;
  reason: string | null;
}

export interface Appointment {
  id: string;
  booking_id: string;
  staff_id: string | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
}

export interface CatalogueData {
  categories: ServiceCategory[];
  services: Service[];
  variants: ServiceVariant[];
  addons: ServiceAddOn[];
}

export interface ServiceWithDetails extends Service {
  category: ServiceCategory;
  variants: ServiceVariant[];
  addons: ServiceAddOn[];
}

export interface CategoryWithServices extends ServiceCategory {
  services: ServiceWithDetails[];
}

export interface SelectedAddOn {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

export interface BookingSelection {
  category: ServiceCategory | null;
  service: Service | null;
  variant: ServiceVariant | null;
  addons: SelectedAddOn[];
  date: string | null;
  time: string | null;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    notes: string;
  };
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailabilityResult {
  slots: TimeSlot[];
  staffId: string | null;
}
