/*
# Jenelle Luxurious Booking Platform Schema

1. Purpose
   Creates the database-ready schema for the Jenelle Luxurious booking platform.
   This is a single-tenant (no-auth) app — customers book without creating accounts.
   The anon-key frontend can read the catalogue and create/look up bookings.

2. New Tables
   - `service_categories`: Top-level treatment groups (Massage, Wood Therapy, etc.)
   - `services`: Individual treatments within a category
   - `service_variants`: Duration/price variants for a service (e.g. Back Massage 30/45/90 min)
   - `service_addons`: Optional add-ons attachable to services (e.g. Extra Hot Stone)
   - `customers`: Customer details captured at booking time
   - `bookings`: A confirmed booking with reference, date, time, and links
   - `blocked_dates`: Dates the salon is closed or unavailable

3. Security
   - RLS enabled on every table.
   - Catalogue tables (categories, services, variants, addons) are publicly readable.
   - Bookings + customers are readable/writable by anon so customers can book and look up their own booking by reference + email/phone.
   - Blocked dates are publicly readable.
*/

-- Service Categories
CREATE TABLE IF NOT EXISTS service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_categories" ON service_categories;
CREATE POLICY "anon_read_categories" ON service_categories
  FOR SELECT TO anon, authenticated USING (true);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_services" ON services;
CREATE POLICY "anon_read_services" ON services
  FOR SELECT TO anon, authenticated USING (true);

-- Service Variants (duration/price options for a service)
CREATE TABLE IF NOT EXISTS service_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  label text NOT NULL,
  duration_minutes int NOT NULL,
  price int NOT NULL,
  is_bundle boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_variants" ON service_variants;
CREATE POLICY "anon_read_variants" ON service_variants
  FOR SELECT TO anon, authenticated USING (true);

-- Service Add-ons
CREATE TABLE IF NOT EXISTS service_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  category_id uuid REFERENCES service_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  duration_minutes int NOT NULL DEFAULT 0,
  price int NOT NULL DEFAULT 0,
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_addons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_addons" ON service_addons;
CREATE POLICY "anon_read_addons" ON service_addons
  FOR SELECT TO anon, authenticated USING (true);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_customers" ON customers;
CREATE POLICY "anon_insert_customers" ON customers
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_read_customers" ON customers;
CREATE POLICY "anon_read_customers" ON customers
  FOR SELECT TO anon, authenticated USING (true);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  category_id uuid REFERENCES service_categories(id) ON DELETE SET NULL,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES service_variants(id) ON DELETE SET NULL,
  service_name text NOT NULL,
  variant_label text,
  duration_minutes int NOT NULL DEFAULT 0,
  price int NOT NULL DEFAULT 0,
  addons_summary text,
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  customer_first_name text NOT NULL,
  customer_last_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_notes text,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_read_bookings" ON bookings;
CREATE POLICY "anon_read_bookings" ON bookings
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_bookings" ON bookings;
CREATE POLICY "anon_update_bookings" ON bookings
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Blocked dates (salon closures)
CREATE TABLE IF NOT EXISTS blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_date date NOT NULL UNIQUE,
  reason text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_blocked_dates" ON blocked_dates;
CREATE POLICY "anon_read_blocked_dates" ON blocked_dates
  FOR SELECT TO anon, authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_variants_service ON service_variants(service_id);
CREATE INDEX IF NOT EXISTS idx_addons_service ON service_addons(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(reference);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email);