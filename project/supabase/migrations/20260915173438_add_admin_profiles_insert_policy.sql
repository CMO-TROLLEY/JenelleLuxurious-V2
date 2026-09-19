/*
# Add INSERT policy on admin_profiles

1. Purpose
   The signUp flow in the frontend inserts a row into admin_profiles right after
   creating a new auth user. However, admin_profiles only had a SELECT policy
   (read_own_admin_profile) — no INSERT policy existed. This meant every insert
   silently failed due to RLS, the admin profile was never created, checkAdmin()
   found no row, isAdmin stayed false, and the ProtectedRoute bounced the user
   back to the login page. This migration adds the missing INSERT policy.

2. Security changes
   - Adds "insert_own_admin_profile" INSERT policy on admin_profiles.
   - Scoped TO authenticated (only a signed-in user can create their own profile).
   - WITH CHECK (auth.uid() = user_id) ensures a user can only insert a row
     for themselves, not for anyone else.
   - The existing SELECT policy (read_own_admin_profile) is unchanged.
*/

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert_own_admin_profile" ON admin_profiles;
CREATE POLICY "insert_own_admin_profile" ON admin_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);