-- ============================================================================
-- Fellowship 360 - Row Level Security (RLS) Policies
-- ============================================================================
-- Run this script in your Supabase SQL Editor to set up security policies
-- This ensures users can only access data they're authorized to see
-- ============================================================================

-- ============================================================================
-- STEP 1: Enable RLS on all tables
-- ============================================================================

ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: Churches Policies
-- ============================================================================

-- Users can view their own church (or all churches if AGENCY role)
CREATE POLICY "Users can view their church"
  ON churches FOR SELECT
  USING (
    id = public.current_user_church_id()
    OR 
    public.current_user_role() = 'AGENCY'
  );

-- Only AGENCY users can create churches
CREATE POLICY "Agency can create churches"
  ON churches FOR INSERT
  WITH CHECK (
    public.current_user_role() = 'AGENCY'
  );

-- ADMIN users can update their church, AGENCY users can update any church
CREATE POLICY "Admin can update their church"
  ON churches FOR UPDATE
  USING (
    id = public.current_user_church_id()
    AND public.current_user_role() IN ('ADMIN', 'AGENCY')
    OR
    public.current_user_role() = 'AGENCY'
  );

-- ============================================================================
-- STEP 3: Users Policies
-- ============================================================================

-- Users can view other users in their church
CREATE POLICY "Users can view their church members"
  ON users FOR SELECT
  USING (
    id = auth.uid()
    or church_id = public.current_user_church_id()
    or public.current_user_role() = 'AGENCY'
  );

-- Only ADMIN and AGENCY can create users
CREATE POLICY "Admin and Agency can create users"
  ON users FOR INSERT
  WITH CHECK (
    public.current_user_role() IN ('ADMIN', 'AGENCY')
  );

-- ADMIN can update users in their church, users can update themselves
CREATE POLICY "Users can update profiles"
  ON users FOR UPDATE
  USING (
    id = auth.uid() -- Users can update their own profile
    OR
    (
      church_id = public.current_user_church_id()
      AND public.current_user_role() IN ('ADMIN', 'AGENCY')
    )
    OR
    public.current_user_role() = 'AGENCY'
  );

-- ============================================================================
-- STEP 4: Contacts Policies
-- ============================================================================

-- Users can view contacts in their church
CREATE POLICY "Users can view their church contacts"
  ON contacts FOR SELECT
  USING (
    church_id = public.current_user_church_id()
    OR 
    public.current_user_role() = 'AGENCY'
  );

-- Users can create contacts in their church
CREATE POLICY "Users can create contacts in their church"
  ON contacts FOR INSERT
  WITH CHECK (
    church_id = public.current_user_church_id()
  );

-- Users can update contacts in their church
CREATE POLICY "Users can update their church contacts"
  ON contacts FOR UPDATE
  USING (
    church_id = public.current_user_church_id()
    OR
    public.current_user_role() = 'AGENCY'
  );

-- ADMIN users can delete contacts in their church
CREATE POLICY "Admin can delete contacts"
  ON contacts FOR DELETE
  USING (
    church_id = public.current_user_church_id()
    AND public.current_user_role() IN ('ADMIN', 'AGENCY')
    OR
    public.current_user_role() = 'AGENCY'
  );

-- ============================================================================
-- STEP 5: Activities Policies
-- ============================================================================

-- Users can view activities for their church
CREATE POLICY "Users can view their church activities"
  ON activities FOR SELECT
  USING (
    church_id = public.current_user_church_id()
    OR 
    public.current_user_role() = 'AGENCY'
  );

-- Users can create activities in their church
-- Note: Twilio webhooks use service role key, bypassing RLS
CREATE POLICY "Users can create activities in their church"
  ON activities FOR INSERT
  WITH CHECK (
    church_id = public.current_user_church_id()
    OR
    -- Allow service role (for Twilio webhooks)
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Users can update activities in their church
CREATE POLICY "Users can update their church activities"
  ON activities FOR UPDATE
  USING (
    church_id = public.current_user_church_id()
    OR
    public.current_user_role() = 'AGENCY'
  );

-- ============================================================================
-- STEP 6: Helper Functions (Required to Prevent RLS Infinite Recursion)
-- ============================================================================

-- Helper functions that read the current user's church_id and role
-- with SECURITY DEFINER to avoid infinite recursion in RLS policies
create or replace function public.current_user_church_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select church_id from public.users where id = auth.uid();
$$;

create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid();
$$;

-- Set proper permissions on the helper functions
revoke all on function public.current_user_church_id from public;
revoke all on function public.current_user_role from public;
grant execute on function public.current_user_church_id to authenticated;
grant execute on function public.current_user_role to authenticated;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify policies are working:

-- 1. Check which tables have RLS enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;

-- 2. List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- 3. Count policies per table
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- 1. Service Role Bypass: The Supabase service role key bypasses RLS entirely.
--    This is used for:
--    - Server-side API routes that need elevated access
--    - Twilio webhooks that create activities
--
-- 2. Anon Key: The anon key respects RLS policies. This is what your client
--    app uses.
--
-- 3. Testing: After applying these policies, test with different user roles:
--    - Log in as STAFF user → should only see their church data
--    - Log in as ADMIN user → should see/manage their church
--    - Log in as AGENCY user → should see all churches
--
-- 4. Migration: If you have existing data, these policies won't affect it.
--    But you'll need to ensure all records have proper church_id values.
--
-- ============================================================================