import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create client only if configured, otherwise use dummy values
export const supabase = createClient(
  supabaseUrl || 'https://dummy.supabase.co', 
  supabaseAnonKey || 'dummy-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Database types
export type Database = {
  public: {
    Tables: {
      churches: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          address: any | null
          website: string | null
          timezone: string | null
          settings: any | null
          grace_phone: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          address?: any | null
          website?: string | null
          timezone?: string | null
          settings?: any | null
          grace_phone?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          address?: any | null
          website?: string | null
          timezone?: string | null
          settings?: any | null
          grace_phone?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: 'STAFF' | 'ADMIN' | 'AGENCY'
          church_id: string | null
          phone: string | null
          is_active: boolean | null
          last_login_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          role?: 'STAFF' | 'ADMIN' | 'AGENCY'
          church_id?: string | null
          phone?: string | null
          is_active?: boolean | null
          last_login_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: 'STAFF' | 'ADMIN' | 'AGENCY'
          church_id?: string | null
          phone?: string | null
          is_active?: boolean | null
          last_login_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      contacts: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          address: any | null
          status: 'LEAD' | 'ACTIVE' | 'INACTIVE'
          tags: any | null
          notes: string | null
          church_id: string
          assigned_to_user_id: string | null
          last_contacted_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          address?: any | null
          status?: 'LEAD' | 'ACTIVE' | 'INACTIVE'
          tags?: any | null
          notes?: string | null
          church_id: string
          assigned_to_user_id?: string | null
          last_contacted_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          address?: any | null
          status?: 'LEAD' | 'ACTIVE' | 'INACTIVE'
          tags?: any | null
          notes?: string | null
          church_id?: string
          assigned_to_user_id?: string | null
          last_contacted_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'STAFF' | 'ADMIN' | 'AGENCY'
      contact_status: 'LEAD' | 'ACTIVE' | 'INACTIVE'
      activity_type: 'VOICE' | 'SMS' | 'EMAIL' | 'VISIT' | 'CALENDAR' | 'WORKFLOW' | 'MANUAL'
      activity_status: 'PENDING' | 'COMPLETED' | 'FAILED'
      event_type: 'SERVICE' | 'MEETING' | 'OUTREACH' | 'SOCIAL' | 'CHILDREN' | 'OTHER'
    }
  }
}