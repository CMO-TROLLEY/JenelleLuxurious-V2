import { supabase } from '@/lib/supabase';
import type {
  CatalogueData,
  CategoryWithServices,
  ServiceWithDetails,
  ServiceCategory,
  Service,
  ServiceVariant,
  ServiceAddOn,
  Booking,
  BlockedDate,
  Staff,
  StaffSchedule,
  StaffTimeOff,
  StaffService,
  Appointment,
  TimeSlot,
  AvailabilityResult,
} from '@/types';

// ─── Catalogue ──────────────────────────────────────────────────────────────

export async function fetchCatalogue(): Promise<CatalogueData | null> {
  const [categoriesRes, servicesRes, variantsRes, addonsRes] = await Promise.all([
    supabase.from('service_categories').select('*').eq('is_active', true).order('display_order'),
    supabase.from('services').select('*').eq('is_active', true).order('display_order'),
    supabase.from('service_variants').select('*').eq('is_active', true).order('display_order'),
    supabase.from('service_addons').select('*').eq('is_active', true).order('display_order'),
  ]);

  if (categoriesRes.error || servicesRes.error || variantsRes.error || addonsRes.error) {
    console.error('Error fetching catalogue:', {
      categories: categoriesRes.error,
      services: servicesRes.error,
      variants: variantsRes.error,
      addons: addonsRes.error,
    });
    return null;
  }

  return {
    categories: categoriesRes.data as ServiceCategory[],
    services: servicesRes.data as Service[],
    variants: variantsRes.data as ServiceVariant[],
    addons: addonsRes.data as ServiceAddOn[],
  };
}

export function buildCategoryWithServices(
  category: ServiceCategory,
  catalogue: CatalogueData,
): CategoryWithServices {
  const services = catalogue.services
    .filter((s) => s.category_id === category.id)
    .map((service) => {
      const variants = catalogue.variants.filter((v) => v.service_id === service.id);
      const addons = catalogue.addons.filter(
        (a) => a.service_id === service.id || a.category_id === category.id,
      );
      return { ...service, variants, addons } as ServiceWithDetails;
    });

  return { ...category, services };
}

export function buildAllCategories(catalogue: CatalogueData): CategoryWithServices[] {
  return catalogue.categories.map((cat) => buildCategoryWithServices(cat, catalogue));
}

export function findCategoryBySlug(catalogue: CatalogueData, slug: string): CategoryWithServices | null {
  const cat = catalogue.categories.find((c) => c.slug === slug);
  if (!cat) return null;
  return buildCategoryWithServices(cat, catalogue);
}

export function findServiceBySlug(
  catalogue: CatalogueData,
  slug: string,
): ServiceWithDetails | null {
  const service = catalogue.services.find((s) => s.slug === slug);
  if (!service) return null;

  const category = catalogue.categories.find((c) => c.id === service.category_id);
  if (!category) return null;

  const variants = catalogue.variants.filter((v) => v.service_id === service.id);
  const addons = catalogue.addons.filter(
    (a) => a.service_id === service.id || a.category_id === category.id,
  );

  return { ...service, category, variants, addons };
}

// ─── Formatting helpers ─────────────────────────────────────────────────────

export function formatPrice(price: number): string {
  return `E${price.toLocaleString('en-ZA')}`;
}

export function formatDuration(minutes: number): string {
  if (minutes === 0) return 'Bundle';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${hours} hr ${remaining} min`;
}

export function formatPriceFrom(variants: ServiceVariant[]): string {
  if (variants.length === 0) return '';
  const minPrice = Math.min(...variants.map((v) => v.price));
  const maxPrice = Math.max(...variants.map((v) => v.price));
  if (minPrice === maxPrice) return formatPrice(minPrice);
  return `From ${formatPrice(minPrice)}`;
}

// ─── Bookings ───────────────────────────────────────────────────────────────

export async function createBooking(data: {
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
}): Promise<{ reference: string; id: string } | null> {
  const reference = generateBookingReference();

  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .insert({
      first_name: data.customer_first_name,
      last_name: data.customer_last_name,
      email: data.customer_email,
      phone: data.customer_phone,
      notes: data.customer_notes,
    })
    .select('id')
    .single();

  let customerId: string | null = null;
  if (!customerError && customerData) {
    customerId = customerData.id;
  }

  const { data: bookingData, error: bookingError } = await supabase.from('bookings').insert({
    reference,
    customer_id: customerId,
    category_id: data.category_id,
    service_id: data.service_id,
    variant_id: data.variant_id,
    service_name: data.service_name,
    variant_label: data.variant_label,
    duration_minutes: data.duration_minutes,
    price: data.price,
    addons_summary: data.addons_summary,
    booking_date: data.booking_date,
    booking_time: data.booking_time,
    customer_first_name: data.customer_first_name,
    customer_last_name: data.customer_last_name,
    customer_email: data.customer_email,
    customer_phone: data.customer_phone,
    customer_notes: data.customer_notes,
    status: 'confirmed',
  }).select('id').single();

  if (bookingError) {
    console.error('Error creating booking:', bookingError);
    return null;
  }

  return { reference, id: bookingData.id };
}

export async function lookupBooking(
  reference?: string,
  emailOrPhone?: string,
): Promise<Booking | null> {
  const ref = reference?.trim();
  const contact = emailOrPhone?.trim();

  if (!ref && !contact) return null;

  let query = supabase.from('bookings').select('*');

  if (ref && contact) {
    query = query
      .eq('reference', ref.toUpperCase())
      .or(`customer_email.eq.${contact},customer_phone.eq.${contact}`);
  } else if (ref) {
    query = query.eq('reference', ref.toUpperCase());
  } else {
    query = query.or(`customer_email.eq.${contact},customer_phone.eq.${contact}`);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error('Error looking up booking:', error);
    return null;
  }

  return data as Booking | null;
}

export async function rescheduleBooking(
  bookingId: string,
  newDate: string,
  newTime: string,
): Promise<boolean> {
  const { error: bookingError } = await supabase
    .from('bookings')
    .update({ booking_date: newDate, booking_time: newTime, status: 'rescheduled' })
    .eq('id', bookingId);

  if (bookingError) {
    console.error('Error rescheduling booking:', bookingError);
    return false;
  }

  // Update the appointment if one exists
  await supabase
    .from('appointments')
    .update({ appointment_date: newDate, start_time: newTime })
    .eq('booking_id', bookingId);

  return true;
}

export async function cancelBooking(bookingId: string): Promise<boolean> {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);

  if (error) {
    console.error('Error cancelling booking:', error);
    return false;
  }

  await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('booking_id', bookingId);

  return true;
}

export function canCancelBooking(bookingDate: string, bookingTime: string): boolean {
  const now = new Date();
  const bookingDateTime = new Date(`${bookingDate}T${bookingTime}:00`);
  const diffMs = bookingDateTime.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours >= 4;
}

// ─── Availability ───────────────────────────────────────────────────────────

export async function fetchBlockedDates(): Promise<BlockedDate[]> {
  const { data, error } = await supabase
    .from('blocked_dates')
    .select('*')
    .gte('blocked_date', new Date().toISOString().split('T')[0]);

  if (error) {
    console.error('Error fetching blocked dates:', error);
    return [];
  }

  return (data as BlockedDate[]) || [];
}

export async function fetchAllStaff(): Promise<Staff[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) {
    console.error('Error fetching staff:', error);
    return [];
  }

  return (data as Staff[]) || [];
}

export async function fetchStaffSchedules(): Promise<StaffSchedule[]> {
  const { data, error } = await supabase
    .from('staff_schedules')
    .select('*')
    .eq('is_working', true);

  if (error) {
    console.error('Error fetching staff schedules:', error);
    return [];
  }

  return (data as StaffSchedule[]) || [];
}

export async function fetchStaffTimeOff(): Promise<StaffTimeOff[]> {
  const { data, error } = await supabase
    .from('staff_time_off')
    .select('*')
    .gte('end_date', new Date().toISOString().split('T')[0]);

  if (error) {
    console.error('Error fetching staff time off:', error);
    return [];
  }

  return (data as StaffTimeOff[]) || [];
}

export async function fetchStaffServices(): Promise<StaffService[]> {
  const { data, error } = await supabase
    .from('staff_services')
    .select('*');

  if (error) {
    console.error('Error fetching staff services:', error);
    return [];
  }

  return (data as StaffService[]) || [];
}

export async function fetchAppointmentsForDate(date: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('appointment_date', date)
    .neq('status', 'cancelled');

  if (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }

  return (data as Appointment[]) || [];
}

/**
 * Compute available time slots for a given date and service duration.
 * Uses real staff schedules, time off, existing appointments, and blocked dates.
 * Auto-assigns the first available staff member.
 */
export async function getAvailableSlots(
  date: Date,
  serviceId: string,
  durationMinutes: number,
): Promise<AvailabilityResult> {
  const dateStr = formatDateForDB(date);
  const dayOfWeek = date.getDay();

  // Check blocked dates
  const blockedDates = await fetchBlockedDates();
  if (blockedDates.some((b) => b.blocked_date === dateStr)) {
    return { slots: [], staffId: null };
  }

  // Fetch all availability data
  const [allStaff, allSchedules, allTimeOff, allStaffServices, existingAppointments] = await Promise.all([
    fetchAllStaff(),
    fetchStaffSchedules(),
    fetchStaffTimeOff(),
    fetchStaffServices(),
    fetchAppointmentsForDate(dateStr),
  ]);

  // If no staff configured yet, fall back to default salon hours
  if (allStaff.length === 0 || allSchedules.length === 0) {
    return getFallbackSlots(date, durationMinutes);
  }

  // Find staff who can perform this service
  const eligibleStaffIds = new Set(
    allStaffServices
      .filter((ss) => ss.service_id === serviceId)
      .map((ss) => ss.staff_id),
  );

  // If no staff are explicitly assigned to this service, allow all active staff
  const staffToCheck = eligibleStaffIds.size > 0
    ? allStaff.filter((s) => eligibleStaffIds.has(s.id))
    : allStaff;

  if (staffToCheck.length === 0) {
    return { slots: [], staffId: null };
  }

  // Check which staff are working on this day and not on time off
  const availableStaff = staffToCheck.filter((staff) => {
    const onTimeOff = allTimeOff.some(
      (t) => t.staff_id === staff.id &&
      dateStr >= t.start_date && dateStr <= t.end_date,
    );
    if (onTimeOff) return false;

    const schedule = allSchedules.find(
      (s) => s.staff_id === staff.id && s.day_of_week === dayOfWeek,
    );
    return schedule !== undefined;
  });

  if (availableStaff.length === 0) {
    return { slots: [], staffId: null };
  }

  // Generate slots from the earliest start time to the latest end time
  const allWorkingSchedules = availableStaff
    .map((staff) => allSchedules.find((s) => s.staff_id === staff.id && s.day_of_week === dayOfWeek))
    .filter((s): s is StaffSchedule => s !== undefined);

  const earliestStart = allWorkingSchedules.reduce((earliest, s) => s.start_time < earliest ? s.start_time : earliest, '23:59');
  const latestEnd = allWorkingSchedules.reduce((latest, s) => s.end_time > latest ? s.end_time : latest, '00:00');

  const slots: TimeSlot[] = [];
  const slotInterval = 30;
  const [startH, startM] = earliestStart.split(':').map(Number);
  const [endH, endM] = latestEnd.split(':').map(Number);
  const startTotalMin = startH * 60 + startM;
  const endTotalMin = endH * 60 + endM;

  for (let t = startTotalMin; t + durationMinutes <= endTotalMin; t += slotInterval) {
    const slotTime = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
    const slotEndMin = t + durationMinutes;

    // Check if any staff member is available for this slot
    let isAvailable = false;
    for (const staff of availableStaff) {
      const schedule = allSchedules.find(
        (s) => s.staff_id === staff.id && s.day_of_week === dayOfWeek,
      );
      if (!schedule) continue;

      const [sStartH, sStartM] = schedule.start_time.split(':').map(Number);
      const [sEndH, sEndM] = schedule.end_time.split(':').map(Number);
      const scheduleStart = sStartH * 60 + sStartM;
      const scheduleEnd = sEndH * 60 + sEndM;

      // Slot must fit within this staff member's schedule
      if (t < scheduleStart || slotEndMin > scheduleEnd) continue;

      // Check for conflicts with existing appointments
      const staffAppointments = existingAppointments.filter((a) => a.staff_id === staff.id);
      const hasConflict = staffAppointments.some((a) => {
        const [aStartH, aStartM] = a.start_time.split(':').map(Number);
        const [aEndH, aEndM] = a.end_time.split(':').map(Number);
        const aStart = aStartH * 60 + aStartM;
        const aEnd = aEndH * 60 + aEndM;
        return t < aEnd && slotEndMin > aStart;
      });

      if (!hasConflict) {
        isAvailable = true;
        break;
      }
    }

    slots.push({ time: slotTime, available: isAvailable });
  }

  return { slots, staffId: availableStaff[0]?.id ?? null };
}

/**
 * Fallback when no staff are configured — uses salon default hours.
 */
function getFallbackSlots(date: Date, durationMinutes: number): AvailabilityResult {
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0) return { slots: [], staffId: null };

  const salonHours: { start: number; end: number } =
    dayOfWeek === 6
      ? { start: 9 * 60, end: 13 * 60 }
      : { start: 9 * 60, end: 17 * 60 };

  const slots: TimeSlot[] = [];
  const slotInterval = 30;
  const now = new Date();
  const isToday = formatDateForDB(date) === formatDateForDB(now);
  const currentMin = now.getHours() * 60 + now.getMinutes();

  for (let t = salonHours.start; t + durationMinutes <= salonHours.end; t += slotInterval) {
    if (isToday && t <= currentMin + 60) {
      slots.push({ time: formatMinToTime(t), available: false });
      continue;
    }
    // Simulate some unavailable slots using a deterministic pattern
    const seed = date.getDate() + date.getMonth() * 31 + t;
    const isAvailable = (seed % 5) !== 0;
    slots.push({ time: formatMinToTime(t), available: isAvailable });
  }

  return { slots, staffId: null };
}

export async function createAppointment(
  bookingId: string,
  staffId: string | null,
  date: string,
  startTime: string,
  durationMinutes: number,
): Promise<void> {
  const startMin = parseTimeToMin(startTime);
  const endMin = startMin + durationMinutes;
  const endTime = formatMinToTime(endMin);

  await supabase.from('appointments').insert({
    booking_id: bookingId,
    staff_id: staffId,
    appointment_date: date,
    start_time: startTime,
    end_time: endTime,
    status: 'confirmed',
  });
}

// ─── Admin data access ──────────────────────────────────────────────────────

export async function fetchAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all bookings:', error);
    return [];
  }

  return (data as Booking[]) || [];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateBookingReference(): string {
  const prefix = 'JL';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}${suffix}`;
}

function formatDateForDB(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseTimeToMin(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function formatMinToTime(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
}
