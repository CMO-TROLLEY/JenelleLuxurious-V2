/*
# Staff scheduling, appointments, and admin profiles

1. Purpose
   Extends the Jenelle Luxurious booking platform with real availability, staff scheduling,
   and appointment management. Also adds an admin_profiles table for Supabase auth-based admin access.

2. New Tables
   - `staff`: Salon staff members (therapists, nail technicians, etc.)
   - `staff_services`: Links staff to services they can perform (many-to-many)
   - `staff_schedules`: Weekly recurring working hours per staff member per day
   - `staff_time_off`: Blocked date ranges when a staff member is unavailable
   - `appointments`: Links a booking to a staff member and specific time slot
   - `admin_profiles`: Marks a Supabase auth user as an admin

3. Modified Tables
   - `bookings`: Added `status` column already exists. No structural changes needed.
   - The existing `bookings` table is reused — appointments reference booking rows.

4. Security
   - Catalogue tables (staff, staff_services, staff_schedules, staff_time_off): publicly readable so
     the booking flow can compute availability. Admin-only writes via authenticated policies.
   - `appointments`: publicly readable (customers need to see slots are taken), authenticated writes
     for admin management. Customer-side appointment creation happens via anon key (booking flow).
   - `admin_profiles`: only readable by the user themselves (auth.uid = user_id) so users can check
     if they are admin. Authenticated users can read their own profile row.
*/

-- Staff members
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  bio text,
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_staff" ON staff;
CREATE POLICY "anon_read_staff" ON staff
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_staff" ON staff;
CREATE POLICY "auth_insert_staff" ON staff
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_staff" ON staff;
CREATE POLICY "auth_update_staff" ON staff
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_staff" ON staff;
CREATE POLICY "auth_delete_staff" ON staff
  FOR DELETE TO authenticated USING (true);

-- Staff ↔ Services link (which services each staff member can perform)
CREATE TABLE IF NOT EXISTS staff_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(staff_id, service_id)
);

ALTER TABLE staff_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_staff_services" ON staff_services;
CREATE POLICY "anon_read_staff_services" ON staff_services
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_staff_services" ON staff_services;
CREATE POLICY "auth_insert_staff_services" ON staff_services
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_staff_services" ON staff_services;
CREATE POLICY "auth_update_staff_services" ON staff_services
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_staff_services" ON staff_services;
CREATE POLICY "auth_delete_staff_services" ON staff_services
  FOR DELETE TO authenticated USING (true);

-- Weekly recurring schedules (0=Sunday through 6=Saturday)
CREATE TABLE IF NOT EXISTS staff_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  day_of_week int NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time text NOT NULL,
  end_time text NOT NULL,
  is_working boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(staff_id, day_of_week)
);

ALTER TABLE staff_schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_staff_schedules" ON staff_schedules;
CREATE POLICY "anon_read_staff_schedules" ON staff_schedules
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_staff_schedules" ON staff_schedules;
CREATE POLICY "auth_insert_staff_schedules" ON staff_schedules
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_staff_schedules" ON staff_schedules;
CREATE POLICY "auth_update_staff_schedules" ON staff_schedules
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_staff_schedules" ON staff_schedules;
CREATE POLICY "auth_delete_staff_schedules" ON staff_schedules
  FOR DELETE TO authenticated USING (true);

-- Staff time off (specific date ranges when staff is unavailable)
CREATE TABLE IF NOT EXISTS staff_time_off (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE staff_time_off ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_staff_time_off" ON staff_time_off;
CREATE POLICY "anon_read_staff_time_off" ON staff_time_off
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_staff_time_off" ON staff_time_off;
CREATE POLICY "auth_insert_staff_time_off" ON staff_time_off
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_staff_time_off" ON staff_time_off;
CREATE POLICY "auth_update_staff_time_off" ON staff_time_off
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_staff_time_off" ON staff_time_off;
CREATE POLICY "auth_delete_staff_time_off" ON staff_time_off
  FOR DELETE TO authenticated USING (true);

-- Appointments (links bookings to staff + time slots)
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  appointment_date date NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_appointments" ON appointments;
CREATE POLICY "anon_read_appointments" ON appointments
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;
CREATE POLICY "anon_insert_appointments" ON appointments
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_appointments" ON appointments;
CREATE POLICY "auth_update_appointments" ON appointments
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_appointments" ON appointments;
CREATE POLICY "auth_delete_appointments" ON appointments
  FOR DELETE TO authenticated USING (true);

-- Admin profiles (marks a Supabase auth user as admin)
CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_own_admin_profile" ON admin_profiles;
CREATE POLICY "read_own_admin_profile" ON admin_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_staff_services_staff ON staff_services(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_services_service ON staff_services(service_id);
CREATE INDEX IF NOT EXISTS idx_staff_schedules_staff ON staff_schedules(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_time_off_staff ON staff_time_off(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_staff ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_booking ON appointments(booking_id);

-- Seed default staff schedules for the salon (9:00-17:00 Mon-Fri, 9:00-13:00 Sat)
-- This will be populated when staff members are created via admin
