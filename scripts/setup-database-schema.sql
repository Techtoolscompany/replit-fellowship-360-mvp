-- ============================================================================
-- Fellowship 360 - Database Schema Setup
-- ============================================================================
-- Run this script FIRST in your Supabase SQL Editor to create all tables
-- Then run create-dummy-data.sql to populate with realistic data
-- ============================================================================

-- ============================================================================
-- STEP 1: Create Churches Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS churches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address JSONB,
  website TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  settings JSONB DEFAULT '{}'::jsonb,
  grace_phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- STEP 2: Create Users Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('STAFF', 'ADMIN', 'AGENCY')),
  church_id UUID REFERENCES churches(id),
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- STEP 3: Create Contacts Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address JSONB,
  status TEXT NOT NULL CHECK (status IN ('LEAD', 'ACTIVE', 'INACTIVE')),
  tags JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  church_id UUID NOT NULL REFERENCES churches(id),
  assigned_to_user_id UUID REFERENCES users(id),
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- STEP 4: Create Activities Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('VOICE', 'SMS', 'EMAIL', 'VISIT', 'CALENDAR', 'WORKFLOW', 'MANUAL')),
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
  description TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  contact_id UUID REFERENCES contacts(id),
  church_id UUID NOT NULL REFERENCES churches(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- STEP 5: Create Indexes for Performance
-- ============================================================================

-- Churches indexes
CREATE INDEX IF NOT EXISTS idx_churches_is_active ON churches(is_active);
CREATE INDEX IF NOT EXISTS idx_churches_created_at ON churches(created_at);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_church_id ON users(church_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Contacts indexes
CREATE INDEX IF NOT EXISTS idx_contacts_church_id ON contacts(church_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned_to_user_id ON contacts(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_last_contacted_at ON contacts(last_contacted_at);

-- Activities indexes
CREATE INDEX IF NOT EXISTS idx_activities_church_id ON activities(church_id);
CREATE INDEX IF NOT EXISTS idx_activities_contact_id ON activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);

-- ============================================================================
-- STEP 6: Create Updated_at Triggers
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_churches_updated_at BEFORE UPDATE ON churches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check that all tables were created
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('churches', 'users', 'contacts', 'activities')
ORDER BY tablename;

-- ============================================================================
-- NOTES
-- ============================================================================
--
-- This script creates:
-- 1. All required tables with proper constraints
-- 2. Foreign key relationships
-- 3. Performance indexes
-- 4. Updated_at triggers
--
-- Next steps:
-- 1. Run the RLS policies script (supabase/rls-policies.sql)
-- 2. Run the dummy data script (scripts/create-dummy-data.sql)
-- 3. Create users in Supabase Auth
-- 4. Test the application
--
-- ============================================================================
