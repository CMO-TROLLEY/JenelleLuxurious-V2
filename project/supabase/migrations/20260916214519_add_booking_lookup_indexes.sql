/*
# Add indexes for booking lookups by phone and last name

1. Purpose
   The "Manage Booking" page and admin Bookings page now support searching by
   phone number alone and by customer last name. Previously only customer_email
   had an index (idx_bookings_email). Without indexes on customer_phone and
   customer_last_name, these searches would degrade to full table scans as the
   bookings table grows.

2. New Indexes
   - idx_bookings_phone: btree index on bookings(customer_phone) for fast phone-based lookups.
   - idx_bookings_last_name: btree index on bookings(customer_last_name) for admin name searches.

3. Security
   No RLS or policy changes — these are read-only index additions. Existing
   policies on bookings remain unchanged.

4. Notes
   - Uses IF NOT EXISTS so the migration is safe to re-run.
   - No data is modified or deleted.
*/

CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(customer_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_last_name ON bookings(customer_last_name);
